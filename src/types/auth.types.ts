export type Role =
  | "CASHIER"
  | "SUPERVISOR"
  | "STORE_MGR"
  | "INVENTORY_OFFICER"
  | "ADMIN_OWNER";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: Role;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponseData {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errorSources?: Array<{
    path: string;
    message: string;
  }>;
}
