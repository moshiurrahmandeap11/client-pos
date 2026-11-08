import { apiClient } from "@/lib/apiClient";
import { ApiResponse } from "@/types/auth.types";

export interface SystemSettingsData {
  id?: string;
  siteName: string;
  language: string;
  defaultCurrency: string;
  accountingMethod: string;
  defaultEmail: string;
  defaultCustomerGroup: string;
  defaultPriceGroup: string;
  maintenanceMode: string;
  theme: string;
  rtlSupport: string;
  loginCaptcha: string;
  numberDaysDisableEditing: number;
  rowsPerPage: number;
  dateFormat: string;
  timezone: string;
  calender: string;
  defaultWarehouse: string;
  defaultBiller: string;
  pdfLibrary: string;
  useCodeForSlug: string;
  updatedAt?: string;
}

export const settingsService = {
  async getSystemSettings(): Promise<SystemSettingsData> {
    const response = await apiClient.get<ApiResponse<SystemSettingsData>>(
      "/settings/system-settings"
    );
    if (!response.data.data) {
      throw new Error(response.data.message || "Failed to fetch system settings");
    }
    return response.data.data;
  },

  async updateSystemSettings(
    payload: Partial<SystemSettingsData>
  ): Promise<SystemSettingsData> {
    const response = await apiClient.patch<ApiResponse<SystemSettingsData>>(
      "/settings/system-settings",
      payload
    );
    if (!response.data.data) {
      throw new Error(response.data.message || "Failed to update system settings");
    }
    return response.data.data;
  },
};
