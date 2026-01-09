import { useQuery } from "@/hooks/useQuery";
import { matchHistoryApi } from "@/api/matchHistory";
import { type Match } from "@/api/matchHistory";
import { useMemo } from "react";
import { formatRelativeTime } from "@/lib/utils";
import { Rank } from "@/types";
import { useInfiniteQuery } from "./useInfiniteQuery";

export type MatchResult = {
  id: number;
  opponentName: string;
  opponentAvatar: string;
  myScore: number;
  opponentScore: number;
  xpGained: number;
  relativeTime: string;
  opponentRank: Rank;
  result: "WIN" | "LOSS";
};

const ANONYMOUS_AVATAR = "https://api.dicebear.com/9.x/avataaars/svg?seed=Anonymous";

/**
 * Transforms a raw Match into a MatchResult from the perspective of the given player
 */
export const transformMatch = (match: Match, playerId: number): MatchResult => {
  const isPlayer1 = match.playerId1 === playerId;

  return {
    id: match.id,
    opponentName: isPlayer1
      ? match.player2Name ?? "Anonymous"
      : match.player1Name ?? "Anonymous",
    opponentAvatar: isPlayer1
      ? match.player2Avatar ?? ANONYMOUS_AVATAR
      : match.player1Avatar ?? ANONYMOUS_AVATAR,
    myScore: isPlayer1 ? match.score1 : match.score2,
    opponentScore: isPlayer1 ? match.score2 : match.score1,
    xpGained: isPlayer1 ? match.expGained1 : match.expGained2,
    relativeTime: formatRelativeTime(match.timestamp),
    result: match.winner === playerId ? "WIN" : "LOSS",
    // TODO: replace with actual rank once the new routes handle the usernames
    opponentRank: isPlayer1 ? match.player2Rank : match.player1Rank,
  };
};

/**
 * Hook for fetching a fixed number of matches
 */
export const useMatchHistory = (
  playerId: number,
  count?: number,
  offset?: number
) => {
  const {
    data: matchHistory,
    isLoading,
    error,
  } = useQuery(() =>
    playerId
      ? matchHistoryApi.getPlayerMatchHistory(playerId, count ?? 10, offset ?? 0)
      : (Promise.resolve([]) as Promise<Match[]>)
  );

  const matchHistoryData = useMemo(() => {
    if (!matchHistory || !playerId || !matchHistory.length) {
      return [];
    }
    return matchHistory.map((match) => {
      return transformMatch(match, playerId);
    });
  }, [matchHistory, playerId]);

  const noDataError =
    !isLoading && matchHistoryData.length === 0
      ? new Error("No match history found")
      : null;

  return {
    matchHistory: matchHistoryData,
    isLoading,
    error: error || noDataError,
  };
};

/**
 * Hook for infinite scroll match history
 */
export const useInfiniteMatchHistory = (
	playerId: number,
	pageSize: number = 50
  ) => {
	const result = useInfiniteQuery(
	  (offset) =>
		playerId
		  ? matchHistoryApi.getPlayerMatchHistory(playerId, pageSize, offset)
		  : Promise.resolve([]),
	  pageSize
	);
  
	const matches = useMemo(
	  () => result.data.map((match) => transformMatch(match, playerId)),
	  [result.data, playerId]
	);
  
	return {
	  ...result,
	  matches,
	};
  };
