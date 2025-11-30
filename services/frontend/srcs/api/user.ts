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
    });

    if (!response.ok) {
      throw new Error(await getErrorMessage(response));
    }
  },
  setupOtp: async (): Promise<{ secret: string; otpauth_url: string; qr_image: string }> => {
    const response = await api("/api/users/2fa/setup", {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error(await getErrorMessage(response));
    }

    return response.json();
  },
  confirmOtp: async (data: { secret: string; code: string }): Promise<void> => {
    const response = await api("/api/users/2fa/confirm", {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(await getErrorMessage(response));
    }
  },
  disableOtp: async (data: { password: string }): Promise<void> => {
    const response = await api("/api/users/2fa/disable", {
      method: "POST",
	  body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(await getErrorMessage(response));
    }
  },
};
