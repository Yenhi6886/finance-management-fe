import apiService from '../../../shared/services/apiService'

export const walletService = {
  getWallets: async () => {
    return apiService.get('/wallets')
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

  addMoney: async (walletId, data) => {
    return apiService.post(`/wallets/${walletId}/add-money`, data)
  },

  shareWallet: async (shareData) => {
    return apiService.post('/wallet-shares', shareData)
  },

  createShareLink: async (shareData) => {
    return apiService.post('/wallet-shares/create-link', shareData)
  },

  getShareLinkInfo: async (shareToken) => {
    return apiService.get(`/wallet-shares/link/${shareToken}`)
  },

  getSharedWallets: async () => {
    return apiService.get('/wallet-shares/shared-with-me')
  },

  getSharedWalletsByMe: async () => {
    return apiService.get('/wallet-shares/shared-by-me')
  },

  revokeWalletAccess: async (shareId) => {
    return apiService.delete(`/wallet-shares/${shareId}`)
  },

  updateSharePermission: async (shareId, permission) => {
    return apiService.patch(`/wallet-shares/${shareId}`, { permission })
  },

  getWalletShareInfo: async (walletId) => {
    return apiService.get(`/wallet-shares/wallet/${walletId}`)
  }
}