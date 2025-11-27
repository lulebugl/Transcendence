import { ethers } from "ethers";
import contractABI from "./ABI.json";

const RPC_URL = "https://api.avax-test.network/ext/bc/C/rpc";
const PRIVATE_KEY = "ENTER PRIVATE KEY HERE";
const CONTRACT_ADDRESS = "0x7000a505eE05913ecB8C856E96D7e16FbB0ca0EA";

if (!PRIVATE_KEY) {
  throw new Error("Missing BLOCKCHAIN_PRIVATE_KEY env var");
}
if (!CONTRACT_ADDRESS) {
  throw new Error("Missing CONTRACT_ADDRESS env var");
}

const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, wallet);

export async function recordWinnerOnChain(
  tournamentId: number,
  winnerId: number
) {
  const tx = await contract.recordTournament(tournamentId, winnerId);
  const receipt = await tx.wait();

  const iface = contract.interface;
  let eventFound = false;

  for (const log of receipt.logs) {
    try {
      const parsed = iface.parseLog(log);
      if (parsed && parsed.name === "TournamentRecorded") {
        eventFound = true;
        break;
      }
    } catch {
      // log d'un autre contrat, on ignore
    }
  }

  return {
    txHash: receipt.hash,
    success: eventFound,
  };
}

export async function getResultFromChain(tournamentId: number) {
  console.log(
    `Fetching result for tournament ID: ${tournamentId} from blockchain`
  );
  const winnerId = await contract.getResult(tournamentId);

  console.log("Winner ID from blockchain:", winnerId.toString());

  return {
    tournamentId: tournamentId,
    winnerId: Number(winnerId),
  };
}

export async function getUserResultsFromChain(userId: number) {
  const tournaments = await contract.getUserResults(userId);
  return tournaments.map((t: any) => Number(t));
}
