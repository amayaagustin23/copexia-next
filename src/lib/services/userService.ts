import { BaseService } from './baseService';

export interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

/**
 * User service for profile management
 */
export class UserService extends BaseService {
  /**
   * Get user profile
   */
  async getProfile(): Promise<any> {
    return this.adminRequest('GET', this.routes.USER.PROFILE);
  }

  /**
   * Update user profile
   */
  async updateProfile(profileData: Partial<UserProfile>): Promise<any> {
    return this.adminRequest('PUT', this.routes.USER.UPDATE_PROFILE, profileData);
  }

  /**
   * Change user password
   */
  async changePassword(passwordData: ChangePasswordData): Promise<any> {
    return this.adminRequest('PUT', this.routes.USER.CHANGE_PASSWORD, passwordData);
  }

  /**
   * Upload user avatar
   */
  async uploadAvatar(file: File): Promise<any> {
    const formData = new FormData();
    formData.append('avatar', file);
    
    return this.adminRequest('POST', this.routes.USER.AVATAR, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
}

// Export singleton instance
export const userService = new UserService();
