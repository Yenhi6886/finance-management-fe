import apiService from '../../../shared/services/apiService'

export const walletService = {
  getWallets: async () => {
    return apiService.get('/wallets')
  },

  createWallet: async (walletData) => {
    return apiService.post('/wallets', walletData)
  },

  getWalletById: async (id) => {
    return apiService.get(`/wallets/${id}`)
  },

  updateWallet: async (id, walletData) => {
    return apiService.put(`/wallets/${id}`, walletData)
  },

  deleteWallet: async (id) => {
    return apiService.delete(`/wallets/${id}`)
  },

  // API chuyển tiền
  transferMoney: async (transferData) => {
    return apiService.post('/wallets/transfer', transferData)
  },

  // API lấy lịch sử giao dịch
  getTransactions: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return apiService.get(`/transactions${queryString ? `?${queryString}` : ''}`)
  },

  // API thêm tiền vào ví
  addMoney: async (walletId, data) => {
    return apiService.post(`/wallets/${walletId}/add-money`, data)
  },

  // API chia sẻ ví
  shareWallet: async (shareData) => {
    return apiService.post('/wallets/share', shareData)
  },

  // API lấy thông tin chia sẻ ví
  getSharedWallets: async () => {
    return apiService.get('/wallets/shared')
  }
}