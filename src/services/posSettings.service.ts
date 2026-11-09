import { apiClient } from "@/lib/apiClient";
import { ApiResponse } from "@/types/auth.types";

export interface PosSettingsData {
  id?: string;
  displayProducts: number;
  posPinCode?: string;
  defaultCategory: string;
  defaultBiller: string;
  defaultCustomer: string;
  displayTime: string;
  onScreenKeyboard: string;
  productButtonColor: string;
  tooltips: string;
  rounding: string;
  itemOrder: string;
  afterSalePage: string;
  displayCustomerDetailsOnReceipt: string;
  systemDefaultBiller?: string;
  updatedAt?: string;
}

export const posSettingsService = {
  async getPosSettings(): Promise<PosSettingsData> {
    const response = await apiClient.get<ApiResponse<PosSettingsData>>(
      "/settings/pos-settings"
    );
    if (!response.data.data) {
      throw new Error(response.data.message || "Failed to fetch POS settings");
    }
    return response.data.data;
  },

  async updatePosSettings(
    payload: Partial<PosSettingsData>
  ): Promise<PosSettingsData> {
    const response = await apiClient.patch<ApiResponse<PosSettingsData>>(
      "/settings/pos-settings",
      payload
    );
    if (!response.data.data) {
      throw new Error(response.data.message || "Failed to update POS settings");
    }
    return response.data.data;
  },
};
