import apiService from '../../../shared/services/apiService'

export const walletService = {
  getWallets: async () => {
    return apiService.get('/wallets')
  },

  getMyWallets: async () => {
    return apiService.get('/wallets/my-wallets')
  },

  getArchivedWallets: async () => {
    return apiService.get('/wallets/archived')
  },

  createWallet: async (walletData) => {
    return apiService.post('/wallets', walletData)
  },

  getWalletById: async (id) => {
    return apiService.get(`/wallets/${id}`)
  },

  getWalletDetails: async (id) => {
    return apiService.get(`/wallets/${id}/details`)
  },

  updateWallet: async (id, walletData) => {
    return apiService.put(`/wallets/${id}`, walletData)
  },

  deleteWallet: async (id) => {
    return apiService.delete(`/wallets/${id}`)
  },

  archiveWallet: async (id) => {
    return apiService.patch(`/wallets/${id}/archive`)
  },

  unarchiveWallet: async (id) => {
    return apiService.patch(`/wallets/${id}/unarchive`)
  },

  transferMoney: async (transferData) => {
    return apiService.post('/wallets/transfer', transferData)
  },

  getTransactions: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return apiService.get(`/transactions${queryString ? `?${queryString}` : ''}`)
  },

  getWalletTransactions: async (walletId, params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return apiService.get(`/wallets/${walletId}/transactions${queryString ? `?${queryString}` : ''}`)
  },

  getBalanceHistory: async (walletId, period = '30d') => {
    return apiService.get(`/wallets/${walletId}/balance-history?period=${period}`)
  },

  addMoney: async (walletId, data) => {
    return apiService.post(`/wallets/${walletId}/add-money`, data)
  },

  shareWalletByEmail: async (shareData) => {
    return apiService.post('/wallet-shares', shareData)
  },

  createShareLink: async (shareData) => {
    return apiService.post('/wallet-shares/create-link', shareData)
  },

  getWalletsSharedByMe: async () => {
    return apiService.get('/wallet-shares/shared-by-me')
  },

  getWalletsSharedWithMe: async () => {
    return apiService.get('/wallet-shares/shared-with-me')
  },

  revokeWalletShare: async (shareId) => {
    return apiService.delete(`/wallet-shares/${shareId}`)
  },

  updateSharePermission: async (walletId, userId, permission) => {
    return apiService.put(`/wallet-shares/${walletId}/users/${userId}/permission?permission=${permission}`)
  }
}