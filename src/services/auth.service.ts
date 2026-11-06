import { apiClient } from "@/lib/apiClient";
import {
  ApiResponse,
  AuthResponseData,
  LoginPayload,
  User,
} from "@/types/auth.types";

export const authService = {
  async login(payload: LoginPayload): Promise<AuthResponseData> {
    const response = await apiClient.post<ApiResponse<AuthResponseData>>(
      "/auth/login",
      payload
    );
    if (!response.data.data) {
      throw new Error(response.data.message || "Login failed");
    }
    return response.data.data;
  },

  async getProfile(): Promise<User> {
    const response = await apiClient.get<ApiResponse<User>>("/auth/me");
    if (!response.data.data) {
      throw new Error(response.data.message || "Failed to fetch profile");
    }
    return response.data.data;
  },

  async logout(): Promise<void> {
    await apiClient.post<ApiResponse>("/auth/logout");
  },

  async verifySupervisorPin(pin: string, actionType?: string): Promise<any> {
    const response = await apiClient.post<ApiResponse>("/auth/verify-pin", {
      pin,
      actionType,
    });
    return response.data.data;
  },
};
