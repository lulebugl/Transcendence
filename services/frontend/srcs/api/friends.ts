import { apiRequest } from "./api";
import { Friends } from "./types";

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
		return apiRequest<Friends[]>("/api/friends/pending", {
			method: "GET",
		});
	},
};
