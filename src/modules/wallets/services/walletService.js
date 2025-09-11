// import apiService from '../../shared/services/apiService'

export const walletService = {
  // Lấy danh sách tất cả ví
  getWallets: async () => {
    // Mock data - thay thế bằng API call thực tế
    return {
      data: [
        {
          id: '1',
          name: 'Ví Tiền Mặt',
          icon: '💵',
          currency: 'VND',
          balance: 2500000,
          initialAmount: 5000000,
          description: 'Ví tiền mặt chính',
          status: 'active',
          isShared: false,
          permissions: ['full', 'transfer', 'add_money', 'share'],
          createdAt: '2024-01-15T08:00:00Z',
          updatedAt: '2024-09-07T12:30:00Z'
        },
        {
          id: '2',
          name: 'Tài Khoản Ngân Hàng',
          icon: '🏦',
          currency: 'VND',
          balance: 15750000,
          initialAmount: 10000000,
          description: 'Tài khoản Vietcombank',
          status: 'active',
          isShared: true,
          permissions: ['full', 'transfer', 'add_money', 'share'],
          sharedWith: ['user2@example.com'],
          createdAt: '2024-01-20T09:15:00Z',
          updatedAt: '2024-09-07T10:45:00Z'
        },
        {
          id: '3',
          name: 'Ví Đầu Tư',
          icon: '📈',
          currency: 'USD',
          balance: 1250.50,
          initialAmount: 1000,
          description: 'Ví đầu tư cổ phiếu và crypto',
          status: 'active',
          isShared: false,
          permissions: ['full', 'transfer', 'add_money', 'share'],
          createdAt: '2024-02-01T14:20:00Z',
          updatedAt: '2024-09-06T16:20:00Z'
        },
        {
          id: '4',
          name: 'Ví Tiết Kiệm',
          icon: '🐷',
          currency: 'VND',
          balance: 8500000,
          initialAmount: 5000000,
          description: 'Quỹ dự phòng khẩn cấp',
          status: 'archived',
          isShared: false,
          permissions: ['full'],
          createdAt: '2024-01-10T11:00:00Z',
          updatedAt: '2024-08-15T09:30:00Z'
        },
        {
          id: '5',
          name: 'Ví Gia Đình',
          icon: '👨‍👩‍👧‍👦',
          currency: 'VND',
          balance: 3200000,
          initialAmount: 2000000,
          description: 'Ví chung của gia đình',
          status: 'active',
          isShared: true,
          permissions: ['view'],
          sharedBy: 'husband@example.com',
          createdAt: '2024-03-05T13:45:00Z',
          updatedAt: '2024-09-05T18:10:00Z'
        }
      ]
    }
  },

  // Lấy thông tin chi tiết một ví
  getWalletById: async (id) => {
    const wallets = await walletService.getWallets()
    const wallet = wallets.data.find(w => w.id === id)
    
    if (!wallet) {
      throw new Error('Wallet not found')
    }

    // Mock thêm thông tin chi tiết
    return {
      data: {
        ...wallet,
        transactions: [
          {
            id: 1,
            type: 'income',
            amount: 500000,
            description: 'Lương tháng 9',
            date: '2024-09-01T08:00:00Z',
            category: 'salary'
          },
          {
            id: 2,
            type: 'expense',
            amount: -150000,
            description: 'Mua sắm siêu thị',
            date: '2024-09-02T14:30:00Z',
            category: 'groceries'
          },
          {
            id: 3,
            type: 'transfer',
            amount: -200000,
            description: 'Chuyển tiền cho mẹ',
            date: '2024-09-03T10:15:00Z',
            category: 'family',
            toWallet: 'Ví Gia Đình'
          },
          {
            id: 4,
            type: 'income',
            amount: 300000,
            description: 'Bán đồ cũ',
            date: '2024-09-04T16:45:00Z',
            category: 'other'
          },
          {
            id: 5,
            type: 'expense',
            amount: -85000,
            description: 'Tiền điện tháng 8',
            date: '2024-09-05T09:20:00Z',
            category: 'utilities'
          }
        ],
        monthlyStats: {
          totalIncome: 800000,
          totalExpense: 435000,
          netIncome: 365000,
          transactionCount: 25
        }
      }
    }
  },

  // Tạo ví mới
  createWallet: async (walletData) => {
    // Mock API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            id: Date.now(),
            ...walletData,
            balance: walletData.initialAmount || 0,
            status: 'active',
            isShared: false,
            permissions: ['full', 'transfer', 'add_money', 'share'],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        })
      }, 1000)
    })
  },

  // Cập nhật thông tin ví
  updateWallet: async (id, walletData) => {
    // Mock API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            id,
            ...walletData,
            updatedAt: new Date().toISOString()
          }
        })
      }, 800)
    })
  },

  // Xóa ví
  deleteWallet: async (id) => {
    // Mock API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            success: true,
            message: 'Ví đã được xóa thành công'
          }
        })
      }, 500)
    })
  },

  // Lưu trữ ví
  archiveWallet: async (id) => {
    // Mock API call
    return {
      data: {
        success: true,
        message: 'Ví đã được lưu trữ'
      }
    }
  },

  // Hủy lưu trữ ví
  unarchiveWallet: async (id) => {
    // Mock API call
    return {
      data: {
        success: true,
        message: 'Ví đã được khôi phục'
      }
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
    // Mock API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            success: true,
            shareId: 'SHARE' + Date.now(),
            shareLink: `${window.location.origin}/shared-wallet/SHARE${Date.now()}`,
            message: 'Chia sẻ ví thành công'
          }
        })
      }, 1000)
    })
  },

  // Lấy danh sách ví đã chia sẻ
  getSharedWallets: async () => {
    // Mock data
    return {
      data: [
        {
          id: 'SHARE1',
          wallet: {
            id: '1',
            name: 'Ví Tiền Mặt',
            icon: '💵',
            balance: 2500000,
            currency: 'VND'
          },
          shareType: 'view',
          recipients: ['user1@example.com', 'user2@example.com'],
          createdAt: '2024-09-01T10:00:00Z',
          expiryDate: '2024-12-01T10:00:00Z',
          shareLink: 'https://app.com/shared-wallet/SHARE1'
        },
        {
          id: 'SHARE2',
          wallet: {
            id: '2',
            name: 'Tài Khoản Ngân Hàng',
            icon: '🏦',
            balance: 15750000,
            currency: 'VND'
          },
          shareType: 'edit',
          recipients: ['family@example.com'],
          createdAt: '2024-08-15T14:30:00Z',
          expiryDate: null,
          shareLink: 'https://app.com/shared-wallet/SHARE2'
        }
      ]
    }
  },

  // Thu hồi quyền truy cập ví
  revokeWalletAccess: async (shareId) => {
    // Mock API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            success: true,
            message: 'Đã thu hồi quyền truy cập'
          }
        })
      }, 500)
    })
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
  },

  // Nạp tiền vào ví
  depositMoney: async (walletId, depositData) => {
    // Validate input
    if (!walletId) {
      return {
        success: false,
        message: "Wallet ID không hợp lệ",
        status: 400
      }
    }

    // Validate amount
    if (!depositData.amount || depositData.amount <= 0) {
      return {
        success: false,
        message: "Số tiền phải lớn hơn 0",
        status: 400
      }
    }

    if (depositData.amount < 1000) {
      return {
        success: false,
        message: "Số tiền tối thiểu là 1,000 ₫",
        status: 400
      }
    }

    if (depositData.amount > 100000000) {
      return {
        success: false,
        message: "Số tiền tối đa là 100,000,000 ₫",
        status: 400
      }
    }

    // Mock API call - thay thế bằng API call thực tế
    // const response = await apiService.post(`/api/wallet/${walletId}/deposit`, depositData)
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock response based on wallet data
      const wallets = {
        '1': { name: 'Ví Tiền Mặt', balance: 2500000 },
        '2': { name: 'Tài Khoản Ngân Hàng', balance: 15750000 },
        '3': { name: 'Ví Đầu Tư', balance: 1250.50 }
      }

      const wallet = wallets[walletId]

      if (!wallet) {
        return {
          success: false,
          message: "Ví không tồn tại",
          status: 404
        }
      }

      const newBalance = wallet.balance + depositData.amount

      // Update wallet balance in mock data (for demo purposes)
      wallets[walletId].balance = newBalance

      return {
        success: true,
        message: "Nạp tiền thành công!",
        data: {
          newBalance: newBalance,
          note: depositData.notes || "",
          message: "Nạp tiền thành công!",
          transactionId: `TXN${Date.now()}`,
          timestamp: new Date().toISOString(),
          amount: depositData.amount
        },
        status: 200
      }
    } catch (error) {
      return {
        success: false,
        message: "Có lỗi xảy ra khi nạp tiền",
        status: 500
      }
    }
  }
}
