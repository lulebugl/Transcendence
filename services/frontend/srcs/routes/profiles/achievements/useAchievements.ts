import { useQuery } from "@/hooks/useQuery";
import { ACHIEVEMENT_ICONS } from "./achievements-config";
import { playersApi } from "@/api/players";
import { useMemo } from "react";
import { Shield } from "lucide-react";

export function useAllAchievements() {
  const {
    data: allAchievements,
    isLoading,
    error,
  } = useQuery(() => playersApi.getAchievements());
  return { allAchievements: allAchievements ?? [], isLoading, error };
}

export function usePlayerAchievements(playerId: number) {
  const {
    allAchievements,
    isLoading: isLoadingDefinitions,
    error: definitionsError,
  } = useAllAchievements();

  const {
    data: unlockedIds = [],
    isLoading: isLoadingUnlocks,
    error: unlockError,
  } = useQuery(() => playersApi.getPlayerAchievements(playerId));

  const unlocked = useMemo(
    () => (unlockedIds && unlockedIds.length !== 0 ? unlockedIds : []),
    [unlockedIds]
  );

  const achievements = useMemo(() => {
    if (isLoadingDefinitions || allAchievements.length === 0) {
      return [];
    }

    return allAchievements.map((meta) => ({
      ...meta,
      icon: ACHIEVEMENT_ICONS[meta.id] ?? Shield,
      unlocked: unlocked.includes(meta.id),
    }));
  }, [allAchievements, unlocked, isLoadingDefinitions]);

  return {
    achievements,
    isLoading: isLoadingDefinitions || isLoadingUnlocks,
    error: definitionsError ?? unlockError ?? null,
  };
}
