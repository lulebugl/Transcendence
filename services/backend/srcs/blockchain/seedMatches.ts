import dotenv from "dotenv";
import path from "node:path";
import type { RecordMatchInput } from "./blockchain";

// Load env before importing db/blockchain so they see RPC_URL/DB_FILE_NAME/etc.
const envCandidates = [
  path.resolve(process.cwd(), ".env"),
  path.resolve(__dirname, "../../.env"),
  path.resolve(__dirname, "../../../.env"),
  path.resolve(__dirname, "../../../infra/.env"),
  path.resolve(__dirname, "../../../../infra/.env"),
];
for (const envPath of envCandidates) {
  dotenv.config({ path: envPath, override: false });
}

// Import after env is loaded
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { db } = require("../db/client") as typeof import("../db/client");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { users } = require("../db/schema") as typeof import("../db/schema");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { recordMatch } =
  require("./blockchain") as typeof import("./blockchain");
const { provider, wallet } =
  require("./blockchain") as typeof import("./blockchain");

const MATCH_COUNT = Number(process.env.MATCH_SEED_COUNT ?? 5000);
const BATCH_SIZE = Number(process.env.MATCH_BATCH_SIZE ?? 30);
const WAIT_CONFIRMATIONS = Number(process.env.MATCH_WAIT_CONFIRMATIONS ?? 1);
const WAIT_TIMEOUT_MS = Number(process.env.MATCH_WAIT_TIMEOUT_MS ?? 120_000);
const RETRY_ATTEMPTS = Number(process.env.MATCH_RETRY_ATTEMPTS ?? 3);
const RETRY_DELAY_MS = Number(process.env.MATCH_RETRY_DELAY_MS ?? 2_000);
const MAX_SCORE = 11;
const MIN_SCORE = 0;
const MIN_XP = 10;
const MAX_XP = 100;

const randomInt = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const pickDistinctPlayers = (ids: number[]): [number, number] => {
  if (ids.length < 2) {
    throw new Error("At least two users are required to seed matches");
  }

  const firstIdx = randomInt(0, ids.length - 1);
  let secondIdx = randomInt(0, ids.length - 1);

  while (secondIdx === firstIdx) {
    secondIdx = randomInt(0, ids.length - 1);
  }

  return [ids[firstIdx], ids[secondIdx]];
};

const buildMatchInput = (userIds: number[]): RecordMatchInput => {
  const [playerId1, playerId2] = pickDistinctPlayers(userIds);

  let score1 = randomInt(MIN_SCORE, MAX_SCORE);
  let score2 = randomInt(MIN_SCORE, MAX_SCORE);

  // Avoid draws so a winner is always determined on-chain
  if (score1 === score2) {
    if (score1 === MAX_SCORE) {
      score2 -= 1;
    } else {
      score2 += 1;
    }
  }

  return {
    playerId1,
    playerId2,
    score1,
    score2,
    expGained1: randomInt(MIN_XP, MAX_XP),
    expGained2: randomInt(MIN_XP, MAX_XP),
  };
};

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const sendWithRetry = async <T>(
  fn: () => Promise<T>,
  label: string
): Promise<T> => {
  let attempt = 0;
  for (;;) {
    try {
      return await fn();
    } catch (err) {
      attempt += 1;
      if (attempt >= RETRY_ATTEMPTS) {
        throw err;
      }
      console.warn(
        `[retry] ${label} attempt ${attempt}/${RETRY_ATTEMPTS} failed: ${
          (err as Error)?.message ?? err
        }`
      );
      await delay(RETRY_DELAY_MS);
    }
  }
};

async function main() {
  const existingUsers = await db.select({ id: users.id }).from(users);
  const userIds = existingUsers.map((u) => u.id);

  if (userIds.length < 2) {
    throw new Error("Need at least two users in the database to seed matches");
  }

  console.log(
    `Recording ${MATCH_COUNT} matches on-chain using ${userIds.length} users... (batch size=${BATCH_SIZE}, wait=${WAIT_CONFIRMATIONS})`
  );

  let sentTotal = 0;
  let currentNonce = await wallet.getNonce();

  while (sentTotal < MATCH_COUNT) {
    const batchInputs: RecordMatchInput[] = [];
    const batchStart = sentTotal;
    while (batchInputs.length < BATCH_SIZE && sentTotal < MATCH_COUNT) {
      batchInputs.push(buildMatchInput(userIds));
      sentTotal += 1;
    }

    console.log(
      `→ Sending batch ${
        batchStart + 1
      }-${sentTotal} with nonce starting at ${currentNonce}`
    );

    const sent = await Promise.all(
      batchInputs.map((input, idx) =>
        sendWithRetry(
          () =>
            recordMatch(input, {
              waitConfirmations: 0,
              overrides: { nonce: currentNonce + idx },
            }),
          `nonce ${currentNonce + idx}`
        )
          .then((res) => ({
            status: "ok" as const,
            res,
            input,
            nonce: currentNonce + idx,
          }))
          .catch((err) => ({
            status: "fail" as const,
            err,
            input,
            nonce: currentNonce + idx,
          }))
      )
    );

    const successful = sent.filter((s) => s.status === "ok");
    const receipts = await Promise.allSettled(
      successful.map((s) =>
        provider.waitForTransaction(
          s.res.txHash,
          WAIT_CONFIRMATIONS,
          WAIT_TIMEOUT_MS
        )
      )
    );

    receipts.forEach((r, idx) => {
      const meta = successful[idx];
      if (r.status === "fulfilled") {
        console.log(
          `[ok] nonce=${meta.nonce} tx=${meta.res.txHash} ${meta.input.playerId1} vs ${meta.input.playerId2} => ${meta.input.score1}-${meta.input.score2}`
        );
      } else {
        console.error(
          `[fail] nonce=${meta.nonce} tx=${meta.res.txHash} reason=${
            r.reason?.message ?? r.reason
          }`
        );
      }
    });

    const failed = sent.filter((s) => s.status === "fail");
    failed.forEach((f) => {
      console.error(
        `[fail] nonce=${f.nonce} send-error=${
          (f.err as Error)?.message ?? f.err
        }`
      );
    });

    currentNonce += batchInputs.length;
  }

  console.log("✅ Done seeding matches on-chain");
}

main().catch((err) => {
  console.error("❌ Failed to seed blockchain matches");
  console.error(err);
  process.exit(1);
});
