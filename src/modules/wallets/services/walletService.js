import apiService from '../../../shared/services/apiService'

export const walletService = {
  // Lấy danh sách tất cả ví
  getWallets: async () => {
    return apiService.get('/wallets')
  },

  // Tạo ví mới
  createWallet: async (walletData) => {
    return apiService.post('/wallets', walletData)
  },

  // Lấy thông tin chi tiết một ví
  getWalletById: async (id) => {
    // This needs to be implemented with a real API call later
    // Example: return apiService.get(`/wallets/${id}`)
    throw new Error('getWalletById not implemented')
  },

  // Cập nhật thông tin ví
  updateWallet: async (id, walletData) => {
    // This needs to be implemented with a real API call later
    // Example: return apiService.put(`/wallets/${id}`, walletData)
    throw new Error('updateWallet not implemented')
  },

  // Xóa ví
  deleteWallet: async (id) => {
    // This needs to be implemented with a real API call later
    // Example: return apiService.delete(`/wallets/${id}`)
    throw new Error('deleteWallet not implemented')
  },
}