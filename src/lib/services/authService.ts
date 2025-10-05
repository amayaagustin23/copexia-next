import { BaseService } from './baseService';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
}

/**
 * Authentication service for user management
 */
export class AuthService extends BaseService {
  /**
   * Login user
   */
  async login(loginData: LoginData): Promise<any> {
    return this.post(this.routes.AUTH.LOGIN, loginData);
  }

  /**
   * Register new user
   */
  async register(registerData: RegisterData): Promise<any> {
    return this.post(this.routes.AUTH.REGISTER, registerData);
  }

  /**
   * Logout user
   */
  async logout(): Promise<any> {
    return this.post(this.routes.AUTH.LOGOUT, {}, { withCredentials: true });
  }

  /**
   * Refresh authentication token
   */
  async refresh(): Promise<any> {
    return this.post(this.routes.AUTH.REFRESH, {}, { withCredentials: true });
  }

  /**
   * Request password reset
   */
  async forgotPassword(data: ForgotPasswordData): Promise<any> {
    return this.post(this.routes.AUTH.FORGOT_PASSWORD, data);
  }

  /**
   * Reset password with token
   */
  async resetPassword(data: ResetPasswordData): Promise<any> {
    return this.post(this.routes.AUTH.RESET_PASSWORD, data);
  }

  /**
   * Verify email address
   */
  async verifyEmail(token: string): Promise<any> {
    return this.post(this.routes.AUTH.VERIFY_EMAIL, { token });
  }
}

// Export singleton instance
export const authService = new AuthService();
