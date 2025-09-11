import apiService from '../../shared/services/apiService'

export const walletService = {
  // Lấy danh sách tất cả ví
  getWallets: async () => {
    try {
      const response = await apiService.get('/api/wallets')
      return { data: response.data }
    } catch (error) {
      console.error('Error fetching wallets:', error)
      throw error
    }
  },

  // Lấy thông tin chi tiết một ví
  getWalletById: async (id) => {
    try {
      const response = await apiService.get(`/api/wallets/${id}`)
      return { data: response.data }
    } catch (error) {
      console.error('Error fetching wallet:', error)
      throw error
    }
  },

  // Tạo ví mới
  createWallet: async (walletData) => {
    try {
      const response = await apiService.post('/api/wallets', walletData)
      return { data: response.data }
    } catch (error) {
      console.error('Error creating wallet:', error)
      throw error
    }
  },

  // Cập nhật thông tin ví
  updateWallet: async (id, walletData) => {
    try {
      const response = await apiService.put(`/api/wallets/${id}`, walletData)
      return { data: response.data }
    } catch (error) {
      console.error('Error updating wallet:', error)
      throw error
    }
  },

  // Xóa ví
  deleteWallet: async (id) => {
    try {
      await apiService.delete(`/api/wallets/${id}`)
      return { data: { success: true, message: 'Ví đã được xóa thành công' } }
    } catch (error) {
      console.error('Error deleting wallet:', error)
      throw error
    }
  },

  // Lưu trữ ví
  archiveWallet: async (id) => {
    try {
      const response = await apiService.put(`/api/wallets/${id}/archive`)
      return { data: { success: true, message: 'Ví đã được lưu trữ' } }
    } catch (error) {
      console.error('Error archiving wallet:', error)
      throw error
    }
  },

  // Hủy lưu trữ ví
  unarchiveWallet: async (id) => {
    try {
      const response = await apiService.put(`/api/wallets/${id}/unarchive`)
      return { data: { success: true, message: 'Ví đã được khôi phục' } }
    } catch (error) {
      console.error('Error unarchiving wallet:', error)
      throw error
    }
  },

  // Chuyển tiền giữa các ví
  transferMoney: async (transferData) => {
    // Mock API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            success: true,
            transactionId: 'TXN' + Date.now(),
            message: 'Chuyển tiền thành công'
          }
        })
      }, 1500)
    })
  },

  // Nạp tiền vào ví
  addMoney: async (transactionData) => {
    // Mock API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            success: true,
            transactionId: 'ADD' + Date.now(),
            message: 'Nạp tiền thành công'
          }
        })
      }, 1500)
    })
  },

  // Chia sẻ ví
  shareWallet: async (shareData) => {
    try {
      const response = await apiService.post('/api/wallet-shares', shareData)
      return response.data
    } catch (error) {
      console.error('Error sharing wallet:', error)
      throw error
    }
  },

  // Lấy danh sách ví đã chia sẻ
  getSharedWallets: async () => {
    try {
      const response = await apiService.get('/api/wallet-shares/shared')
      return response.data
    } catch (error) {
      console.error('Error fetching shared wallets:', error)
      throw error
    }
  },

  // Thu hồi quyền truy cập ví
  revokeWalletAccess: async (shareId) => {
    try {
      const response = await apiService.delete(`/api/wallet-shares/${shareId}`)
      return response.data
    } catch (error) {
      console.error('Error revoking wallet access:', error)
      throw error
    }
  },

  // Lấy danh sách người được share của 1 ví
  getWalletShares: async (walletId) => {
    try {
      const response = await apiService.get(`/api/wallets/${walletId}/shares`)
      return { data: response.data }
    } catch (error) {
      console.error('Error fetching wallet shares:', error)
      throw error
    }
  },

  // Xoá 1 người dùng được share khỏi ví
  removeWalletShareUser: async (walletId, userId) => {
    try {
      await apiService.delete(`/api/wallets/${walletId}/share/${userId}`)
      return { data: { success: true } }
    } catch (error) {
      console.error('Error removing wallet share user:', error)
      throw error
    }
  },

  // Lấy lịch sử giao dịch
  getTransactions: async (filters = {}) => {
    // Mock data cho lịch sử giao dịch
    return {
      data: [
        {
          id: 'TXN1',
          wallet: { id: '1', name: 'Ví Tiền Mặt' },
          type: 'deposit',
          amount: 500000,
          method: 'bank',
          category: 'income',
          note: 'Lương tháng 9',
          createdAt: '2024-09-06T10:30:00Z'
        },
        {
          id: 'TXN2',
          wallet: { id: '2', name: 'Tài Khoản Ngân Hàng' },
          type: 'deposit',
          amount: 1000000,
          method: 'transfer',
          category: 'bonus',
          note: 'Thưởng dự án',
          createdAt: '2024-09-05T15:45:00Z'
        },
        {
          id: 'TXN3',
          wallet: { id: '1', name: 'Ví Tiền Mặt' },
          type: 'deposit',
          amount: 200000,
          method: 'cash',
          category: 'gift',
          note: 'Tiền mừng sinh nhật',
          createdAt: '2024-09-04T12:20:00Z'
        },
        {
          id: 'TXN4',
          wallet: { id: '3', name: 'Ví Đầu Tư' },
          type: 'deposit',
          amount: 2000000,
          method: 'bank',
          category: 'income',
          note: 'Chuyển từ tiết kiệm',
          createdAt: '2024-09-03T09:15:00Z'
        },
        {
          id: 'TXN5',
          wallet: { id: '2', name: 'Tài Khoản Ngân Hàng' },
          type: 'deposit',
          amount: 750000,
          method: 'card',
          category: 'refund',
          note: 'Hoàn tiền mua sắm',
          createdAt: '2024-09-02T16:30:00Z'
        }
      ].filter(transaction => {
        if (filters.type && transaction.type !== filters.type) return false
        if (filters.walletId && transaction.wallet.id !== filters.walletId) return false
        return true
      }).slice(0, filters.limit || 10)
    }
  },

  // Legacy methods for backward compatibility
  removeWalletAccess: async (walletId, email) => {
    return {
      data: {
        success: true,
        message: `Đã xóa quyền truy cập ví của ${email}`
      }
    }
  },

  getWalletSharedUsers: async (walletId) => {
    return {
      data: {
        success: true,
        data: [
          {
            id: 1,
            email: 'user2@example.com',
            permission: 'viewer',
            sharedAt: '2024-08-15T10:30:00Z'
          },
          {
            id: 2,
            email: 'user3@example.com',
            permission: 'owner',
            sharedAt: '2024-08-20T14:15:00Z'
          }
        ]
      }
    }
  }
}
