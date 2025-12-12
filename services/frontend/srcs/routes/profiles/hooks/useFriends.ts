import { useQuery } from "@/hooks/useQuery";
import { Friends, friendsApi, PendingFriendship } from "@/api/friends";
import { useMutation, type UseMutationOptions } from "@/hooks/useMutation";
import { useCallback, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth.ts";
import { getOnlineStatus } from "./useProfileData";

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

function categorizePendingRequests(
  pendingRequests: PendingFriendship[] | undefined,
  currentUserId: number
) {
  if (!pendingRequests || !currentUserId) {
    return { incoming: [], sent: [] };
  }

  const incoming = pendingRequests.filter(
    (req) => req.receiverId === currentUserId
  );
  const sent = pendingRequests.filter(
    (req) => req.requesterId === currentUserId
  );

  return { incoming, sent };
}

export function sortFriendsByOnlineStatus(friends: Friends[] | undefined) {
  if (!friends) return [];

  return [...friends].sort((a, b) => {
    const aOnline = getOnlineStatus(a.last_call) === "online";
    const bOnline = getOnlineStatus(b.last_call) === "online";
    if (aOnline && !bOnline) return -1;
    if (!aOnline && bOnline) return 1;
    return 0;
  });
}

function countOnlineFriends(friends: Friends[] | undefined): number {
  if (!friends) return 0;
  return friends.filter((f) => getOnlineStatus(f.last_call) === "online")
    .length;
}

/**
 * Hook that provides categorized and processed friends data.
 */
export function useFriendsData() {
  const { user } = useAuth();
  const {
    data: friends,
    isLoading: isFriendsLoading,
    refetch: refetchFriends,
  } = useFriendsList();
  const {
    data: pendingRequests,
    isLoading: isPendingLoading,
    refetch: refetchPending,
  } = usePendingFriends();

  const { incoming, sent } = useMemo(
    () => categorizePendingRequests(pendingRequests, user?.id),
    [pendingRequests, user?.id]
  );

  const sortedFriends = useMemo(
    () => sortFriendsByOnlineStatus(friends),
    [friends]
  );

  const refetchAll = useCallback(() => {
    refetchFriends();
    refetchPending();
  }, [refetchFriends, refetchPending]);

  return {
    friends: sortedFriends,
    incomingRequests: incoming,
    sentRequests: sent,
    totalPending: incoming.length + sent.length,
    onlineCount: countOnlineFriends(sortedFriends),
    isLoading: isFriendsLoading || isPendingLoading,
    refetchAll,
  };
}

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
