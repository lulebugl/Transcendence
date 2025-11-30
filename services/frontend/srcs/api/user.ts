import { apiRequest } from "./api";
import { User } from "@/types";

interface SetupOtpResponse {
  secret: string;
  otpauth_url: string;
  qr_image: string;
}

export const userApi = {
  updateProfile: async (data: Partial<User>): Promise<User> => {
    return apiRequest<User>("/api/users/update", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },
  changePassword: async (data: {
    current: string;
    new: string;
  }): Promise<void> => {
    return apiRequest<void>("/api/users/change-password", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },
  deleteAccount: async (): Promise<void> => {
    return apiRequest<void>("/api/users/delete", {
      method: "DELETE",
    });
  },
  setupOtp: async (): Promise<SetupOtpResponse> => {
    return apiRequest<SetupOtpResponse>("/api/users/2fa/setup", {
      method: "POST",
    });
  },
  confirmOtp: async (data: { secret: string; code: string }): Promise<void> => {
    return apiRequest<void>("/api/users/2fa/confirm", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  disableOtp: async (data: { password: string }): Promise<void> => {
    return apiRequest<void>("/api/users/2fa/disable", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};
