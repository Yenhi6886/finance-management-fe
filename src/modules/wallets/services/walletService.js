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
}