import apiService from '../../../shared/services/apiService'

export const walletService = {
  getWallets: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return apiService.get(`/wallets?${queryString}`)
  },

  getMyWallets: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return apiService.get(`/wallets/my-wallets?${queryString}`)
  },

  getArchivedWallets: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return apiService.get(`/wallets/archived?${queryString}`)
  },
  
  getTotalBalance: async () => {
    return apiService.get('/wallets/total-balance')
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

  shareWalletByInvitation: async (shareData) => {
    return apiService.post('/wallet-shares/invite', shareData)
  },

  verifyInvitation: async (token) => {
    return apiService.get(`/wallet-shares/verify?token=${token}`)
  },

  acceptInvitation: async (token) => {
    return apiService.post(`/wallet-shares/accept?token=${token}`)
  },

  rejectInvitation: async (token) => {
    return apiService.post(`/wallet-shares/reject?token=${token}`)
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

  updateSharePermission: async (shareId, permission) => {
    return apiService.put(`/wallet-shares/${shareId}/permission?permission=${permission}`)
  }
}