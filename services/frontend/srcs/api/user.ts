import { api, getErrorMessage } from "./api";
import { User } from "@/types";

export const userApi = {
  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await api("/api/users/update", {
      method: "PATCH",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(await getErrorMessage(response));
    }

    return response.json();
  },
  changePassword: async (data: {
    current: string;
    new: string;
  }): Promise<void> => {
    const response = await api("/api/users/change-password", {
      method: "PATCH",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(await getErrorMessage(response));
    }

    return response.json();
  },
  deleteAccount: async (): Promise<void> => {
	const response = await api("/api/users/delete", {
		method: "DELETE",
	})

    if (!response.ok) {
      throw new Error(await getErrorMessage(response));
    }
  }
};
