import { apiRequest } from "./api";

export type Friends = {
  id: number;
  username: string;
  avatar_url: string;
  last_call: number;
};

export type PendingFriendship = {
  requesterId: number;
  receiverId: number;
  status: "pending";
};

export const friendsApi = {
  addFriend: async (id: number) => {
    return apiRequest<void>("/api/friends/request", {
      method: "POST",
      body: JSON.stringify({ id }),
    });
  },
  acceptFriend: async (id: number) => {
    return apiRequest<void>("/api/friends/accept", {
      method: "POST",
      body: JSON.stringify({ id }),
    });
  },
  // this will not work
  //  need to see how to work with params
  removeFriend: async (id: number) => {
    return apiRequest<void>(`/api/friends/${id}`, {
      method: "DELETE",
      // body: JSON.stringify({ id }),
    });
  },
  getFriends: async () => {
    return apiRequest<Friends[]>("/api/friends", {
      method: "GET",
    });
  },
  getPendingFriends: async () => {
    return apiRequest<PendingFriendship[]>("/api/friends/pending", {
      method: "GET",
    });
  },
};
