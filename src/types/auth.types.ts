export interface Role {
  id: string;
  name: string;
  displayName: string;
  description?: string | null;
  isSystem: boolean;
}

export interface Permission {
  id: string;
  code: string;
  displayName: string;
  module: string;
  description?: string | null;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  roleId: string;
  role: string;
  roleDisplayName?: string;
  permissions?: string[];
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
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
