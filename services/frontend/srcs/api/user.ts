import { apiRequest } from "./api";
import { BaseUserType } from "@/types/users";
import { OtpSetupData } from "./types";

export const userApi = {
  updateProfile: async (data: Partial<BaseUserType>): Promise<BaseUserType> => {
    return apiRequest<BaseUserType>("/api/users/update", {
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
  setupOtp: async (): Promise<OtpSetupData> => {
    return apiRequest<OtpSetupData>("/api/users/2fa/setup", {
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
