import { ethers } from "ethers";
import contractABI from "./ABI.json";

const RPC_URL = process.env.RPC_URL?.trim();
const PRIVATE_KEY = process.env.PRIVATE_KEY_WALLET?.trim();
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS?.trim();

if (!RPC_URL) {
  throw new Error("Missing RPC_URL env var");
}
if (!PRIVATE_KEY) {
  throw new Error("Missing PRIVATE_KEY_WALLET env var");
}
if (!CONTRACT_ADDRESS) {
  throw new Error("Missing CONTRACT_ADDRESS env var");
}

const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, wallet);

type MatchOnChain = {
  id: bigint;
  playerId1: bigint;
  playerId2: bigint;
  score1: number;
  score2: number;
  expGained1: bigint;
  expGained2: bigint;
  timestamp: bigint;
};

export type Match = {
  id: number;
  playerId1: number;
  playerId2: number;
  score1: number;
  score2: number;
  expGained1: number;
  expGained2: number;
  timestamp: number;
  winner: number | null;
};

export type RecordMatchInput = {
  playerId1: number;
  playerId2: number;
  score1: number;
  score2: number;
  expGained1: number;
  expGained2: number;
};

export class BlockchainError extends Error {
  status: number;
  code?: string;
  reason?: string;

  constructor(
    message: string,
    status = 502,
    code?: string,
    reason?: string,
    cause?: unknown
  ) {
    super(message);
    this.status = status;
    this.code = code;
    this.reason = reason;
    if (cause) {
      (this as any).cause = cause;
    }
  }
}

const computeWinner = (
  p1: number,
  p2: number,
  s1: number,
  s2: number
): number | null => {
  if (s1 === s2) return null;
  return s1 > s2 ? p1 : p2;
};

const normalizeMatch = (m: MatchOnChain): Match => {
  const playerId1 = Number(m.playerId1);
  const playerId2 = Number(m.playerId2);
  const score1 = Number(m.score1);
  const score2 = Number(m.score2);

  return {
    id: Number(m.id),
    playerId1,
    playerId2,
    score1,
    score2,
    expGained1: Number(m.expGained1),
    expGained2: Number(m.expGained2),
    timestamp: Number(m.timestamp),
    winner: computeWinner(playerId1, playerId2, score1, score2),
  };
};

const iface = new ethers.Interface(contractABI as ethers.InterfaceAbi);

const mapEthersError = (err: any): BlockchainError => {
  const code = err?.code as string | undefined;
  const reason = err?.reason as string | undefined;

  if (code === "CALL_EXCEPTION" && reason === "Unknown match") {
    return new BlockchainError("Match not found", 400, code, reason, err);
  }

  if (code === "CALL_EXCEPTION") {
    return new BlockchainError(
      "Blockchain call reverted",
      502,
      code,
      reason,
      err
    );
  }

  if (code === "NETWORK_ERROR") {
    return new BlockchainError(
      "Blockchain network error",
      502,
      code,
      reason,
      err
    );
  }

  return new BlockchainError(
    "Blockchain operation failed",
    502,
    code,
    reason,
    err
  );
};

const handleCall = async <T>(fn: () => Promise<T>): Promise<T> => {
  try {
    return await fn();
  } catch (err) {
    throw mapEthersError(err);
  }
};

const extractMatchId = (
  receipt: ethers.ContractTransactionReceipt | null
): number | null => {
  if (!receipt) return null;
  for (const log of receipt.logs) {
    try {
      const parsed = iface.parseLog(log);
      if (parsed?.name === "MatchRecorded") {
        return Number(parsed.args[0]);
      }
    } catch {
      // Ignore unrelated logs
    }
  }
  return null;
};

type RecordMatchOptions = {
  waitConfirmations?: number;
  overrides?: ethers.TransactionRequest;
};

export const recordMatch = async (
  input: RecordMatchInput,
  options: RecordMatchOptions = {}
): Promise<{ txHash: string; matchId: number | null }> => {
  const waitConfirmations = options.waitConfirmations ?? 1;
  return handleCall(async () => {
    const tx = await contract.recordMatch(
      input.playerId1,
      input.playerId2,
      input.score1,
      input.score2,
      input.expGained1,
      input.expGained2,
      options.overrides ?? {}
    );

    if (waitConfirmations === 0) {
      return { txHash: tx.hash, matchId: null };
    }

    const receipt = await tx.wait(waitConfirmations);
    return { txHash: tx.hash, matchId: extractMatchId(receipt) };
  });
};

export const getMatch = async (matchId: number): Promise<Match> => {
  return handleCall(async () => {
    const m = (await contract.getMatch(matchId)) as MatchOnChain;
    return normalizeMatch(m);
  });
};

export const getMatches = async (
  offset: number,
  count: number
): Promise<Match[]> => {
  return handleCall(async () => {
    const ms = (await contract.getMatches(offset, count)) as MatchOnChain[];
    return ms.map(normalizeMatch);
  });
};

export const getPlayerMatches = async (
  playerId: number,
  offset: number,
  count: number
): Promise<Match[]> => {
  return handleCall(async () => {
    const ms = (await contract.getPlayerMatches(
      playerId,
      offset,
      count
    )) as MatchOnChain[];
    return ms.map(normalizeMatch);
  });
};

export const getPlayerMatchCount = async (
  playerId: number
): Promise<number> => {
  return handleCall(async () => {
    const count = await contract.getPlayerMatchCount(playerId);
    return Number(count);
  });
};

export const readContractState = async () => {
  const [owner, paused, maxMatchesPerPlayer, maxTotalMatches] =
    await Promise.all([
      contract.owner(),
      contract.paused(),
      contract.maxMatchesPerPlayer(),
      contract.maxTotalMatches(),
    ]);
  return {
    owner,
    paused: Boolean(paused),
    maxMatchesPerPlayer: Number(maxMatchesPerPlayer),
    maxTotalMatches: Number(maxTotalMatches),
  };
};

export { provider, wallet, contract };
