import apiClient from '../../../shared/services/apiService.js'

export const authService = {
  login: async (credentials) => {
    const payload = {
      identifier: credentials.identifier,
      password: credentials.password
    };
    return apiClient.post('/auth/login', payload);
  },

  register: async (userData) => {
    return apiClient.post('/auth/register', userData)
  },

  logout: async () => {
    return apiClient.post('/auth/logout')
  },

  activateAccount: async (token) => {
    return apiClient.get(`/auth/activate?token=${token}`)
  },

  forgotPassword: async (email) => {
    return apiClient.post('/auth/forgot-password', { email });
  },

  validateResetToken: async (token) => {
    return apiClient.get(`/auth/validate-reset-token?token=${token}`);
  },

  resetPassword: async (token, newPassword) => {
    return apiClient.post('/auth/reset-password', { token, newPassword });
  },

  getCurrentUserProfile: async () => {
    return apiClient.get('/user/profile');
  },

  updateProfile: async (profileData) => {
    return apiClient.put('/user/profile', profileData)
  },

  uploadAvatar: async (file) => {
    const formData = new FormData();
    formData.append('avatar', file);

    return apiClient.post('/user/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  changePassword: async (passwordData) => {
    return apiClient.post('/user/change-password', passwordData)
  },

  deleteAccount: async () => {
    return apiClient.delete('/user/account')
  },
}