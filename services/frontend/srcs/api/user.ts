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
};
