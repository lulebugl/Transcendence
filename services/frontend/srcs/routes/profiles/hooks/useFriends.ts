import { useQuery } from "@/hooks/useQuery";
import { Friends, friendsApi, PendingFriendship } from "@/api/friends";
import { useMutation, type UseMutationOptions } from "@/hooks/useMutation";
import { useCallback, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth.ts";

export function useFriendsList() {
  return useQuery(() => friendsApi.getFriends());
}

export function usePendingFriends() {
  return useQuery(friendsApi.getPendingFriends);
}

export function useAddFriend(options?: UseMutationOptions<void>) {
  return useMutation(friendsApi.addFriend, options);
}

export function useAcceptFriend(options?: UseMutationOptions<void>) {
  return useMutation(friendsApi.acceptFriend, options);
}

export function useRemoveFriend(options?: UseMutationOptions<void>) {
  return useMutation(friendsApi.removeFriend, options);
}

const determineStatus = (
  friends: Friends[],
  pendings: PendingFriendship[],
  playerId: number,
  currentUserId: number
) => {
  if (friends?.some((f) => f.id === playerId)) {
    return "friend";
  }

  const pending = pendings?.find(
    (p) =>
      (p.requesterId === currentUserId && p.receiverId === playerId) ||
      (p.requesterId === playerId && p.receiverId === currentUserId)
  );

  if (!pending) return "none";

  return pending.requesterId === currentUserId
    ? "invitation-sent"
    : "invitation-received";
};

/**
 * Determines the friendship status with a specific user.
 */
export function useFriendshipStatus(playerId: number) {
  const { user } = useAuth();
  const {
    data: friends,
    isLoading: friendsLoading,
    refetch: refetchFriends,
  } = useFriendsList();
  const {
    data: pending,
    isLoading: pendingLoading,
    refetch: refetchPending,
  } = usePendingFriends();

  const status = useMemo(
    () => determineStatus(friends, pending, playerId, user?.id),
    [friends, pending, playerId, user?.id]
  );

  const refetch = useCallback(() => {
    refetchFriends();
    refetchPending();
  }, [refetchFriends, refetchPending]);

  return {
    status,
    isLoading: friendsLoading || pendingLoading,
    isFriend: status === "friend",
    isPending: status.startsWith("invitation"),
    refetch,
  };
}
