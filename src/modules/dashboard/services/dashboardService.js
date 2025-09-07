import apiClient from '../../../shared/services/apiService.js'

const mockDashboardData = {
  stats: {
    totalBalance: 125000000,
    monthlyIncome: 35000000,
    monthlyExpense: 22000000,
    totalAccounts: 4,
    savingsGoalProgress: 68,
    investmentReturn: 12.5,
    monthlyGrowth: 8.2,
    pendingTransactions: 3
  },
  recentTransactions: [
    {
      id: 1,
      description: 'Lương tháng 9',
      amount: 25000000,
      type: 'income',
      category: 'Lương',
      date: '2024-09-01T08:00:00Z',
      account: 'VCB - *1234'
    },
    {
      id: 2,
      description: 'Mua sắm Coopmart',
      amount: 850000,
      type: 'expense',
      category: 'Mua sắm',
      date: '2024-09-06T14:30:00Z',
      account: 'VCB - *1234'
    },
    {
      id: 3,
      description: 'Tiền điện tháng 8',
      amount: 1200000,
      type: 'expense',
      category: 'Hóa đơn',
      date: '2024-09-05T10:15:00Z',
      account: 'VCB - *1234'
    },
    {
      id: 4,
      description: 'Freelance project',
      amount: 8000000,
      type: 'income',
      category: 'Freelance',
      date: '2024-09-04T16:45:00Z',
      account: 'Techcombank - *5678'
    },
    {
      id: 5,
      description: 'Ăn trưa',
      amount: 150000,
      type: 'expense',
      category: 'Ăn uống',
      date: '2024-09-06T12:00:00Z',
      account: 'VCB - *1234'
    }
  ],
  spendingByCategory: [
    { category: 'Ăn uống', amount: 4500000, percentage: 32, color: '#22c55e' },
    { category: 'Mua sắm', amount: 3200000, percentage: 23, color: '#f97316' },
    { category: 'Hóa đơn', amount: 2800000, percentage: 20, color: '#eab308' },
    { category: 'Giải trí', amount: 1800000, percentage: 13, color: '#06b6d4' },
    { category: 'Khác', amount: 1700000, percentage: 12, color: '#8b5cf6' }
  ],
  incomeVsExpenses: {
    labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9'],
    income: [28000000, 32000000, 29000000, 35000000, 31000000, 33000000, 36000000, 34000000, 35000000],
    expenses: [22000000, 25000000, 24000000, 28000000, 26000000, 24000000, 27000000, 25000000, 22000000]
  },
  savingsOverTime: {
    labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9'],
    data: [15000000, 22000000, 27000000, 34000000, 39000000, 48000000, 57000000, 66000000, 79000000]
  },
  portfolioDistribution: [
    { label: 'Tiết kiệm', value: 45, color: '#22c55e' },
    { label: 'Đầu tư', value: 30, color: '#f97316' },
    { label: 'Tiền mặt', value: 20, color: '#eab308' },
    { label: 'Crypto', value: 5, color: '#06b6d4' }
  ],
  weeklySpending: {
    labels: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
    data: [450000, 320000, 280000, 380000, 420000, 650000, 890000]
  },
  topCategories: [
    { name: 'Ăn uống', amount: 4500000, change: '+12%', trend: 'up' },
    { name: 'Mua sắm', amount: 3200000, change: '-5%', trend: 'down' },
    { name: 'Hóa đơn', amount: 2800000, change: '+2%', trend: 'up' },
    { name: 'Giải trí', amount: 1800000, change: '+18%', trend: 'up' }
  ]
}

export const dashboardService = {
  getStats: async () => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return {
      data: {
        data: mockDashboardData.stats
      }
    }
  },

  getRecentTransactions: async (limit = 10) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    return {
      data: {
        data: mockDashboardData.recentTransactions.slice(0, limit)
      }
    }
  },

  getFinancialSummary: async (period = 'month') => {
    await new Promise(resolve => setTimeout(resolve, 400))
    return {
      data: {
        data: mockDashboardData.incomeVsExpenses
      }
    }
  },

  getSpendingByCategory: async (period = 'month') => {
    await new Promise(resolve => setTimeout(resolve, 300))
    return {
      data: {
        data: mockDashboardData.spendingByCategory
      }
    }
  },

  getIncomeVsExpenses: async (period = 'year') => {
    await new Promise(resolve => setTimeout(resolve, 400))
    return {
      data: {
        data: mockDashboardData.incomeVsExpenses
      }
    }
  },

  getSavingsOverTime: async () => {
    await new Promise(resolve => setTimeout(resolve, 400))
    return {
      data: {
        data: mockDashboardData.savingsOverTime
      }
    }
  },

  getPortfolioDistribution: async () => {
    await new Promise(resolve => setTimeout(resolve, 300))
    return {
      data: {
        data: mockDashboardData.portfolioDistribution
      }
    }
  },

  getWeeklySpending: async () => {
    await new Promise(resolve => setTimeout(resolve, 350))
    return {
      data: {
        data: mockDashboardData.weeklySpending
      }
    }
  },

  getTopCategories: async () => {
    await new Promise(resolve => setTimeout(resolve, 300))
    return {
      data: {
        data: mockDashboardData.topCategories
      }
    }
  }
}