import { apiRequest } from "./api";
import { BaseUserType } from "@/types/users";
import { OtpSetupData } from "./types";

interface UploadAvatarResponse {
  success: boolean;
  avatarUrl: string;
}

interface GenerateApiKeyResponse {
  id: number;
  label: string;
  created_at: string;
  apiKey: string;
}

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
  uploadAvatar: async (data: FormData) => {
    return apiRequest<UploadAvatarResponse>("/api/users/avatar", {
      method: "POST",
      body: data,
    });
  },
  hasApiKey: async (): Promise<{ hasKey: boolean }> => {
    return apiRequest("/api/api-keys/has", {
      method: "GET",
    });
  },
  generateApiKey: async (): Promise<GenerateApiKeyResponse> => {
    return apiRequest<GenerateApiKeyResponse>("/api/api-keys", {
      method: "POST",
    });
  },
  regenerateApiKey: async (): Promise<GenerateApiKeyResponse> => {
    return apiRequest<GenerateApiKeyResponse>("/api/api-keys/regenerate", {
      method: "POST",
    });
  },
  revokeApiKey: async (): Promise<void> => {
    return apiRequest<void>("/api/api-keys/revoke", {
      method: "POST",
    });
  },
  // this is equivalent to revokeApiKey
  deleteApiKey: async (): Promise<void> => {
    return apiRequest<void>("/api/api-keys", {
      method: "DELETE",
    });
  },
  verifyPassword: async (password: string): Promise<boolean> => {
    return apiRequest<boolean>("/api/users/verify-password", {
      method: "POST",
      body: JSON.stringify({ password }),
    });
  },
};
