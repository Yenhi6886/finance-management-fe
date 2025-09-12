// Simulating an API service with hardcoded data.
const apiSimulator = (data) => {
  return new Promise(resolve => {
    // Simulate a short network delay
    setTimeout(() => {
      resolve({
        data: {
          data: data
        }
      });
    }, 500);
  });
};

export const dashboardService = {
  getStats: async () => {
    const stats = {
      totalBalance: 125730000,
      monthlyIncome: 35000000,
      monthlyExpense: 21500000,
      totalAccounts: 4,
      savingsGoalProgress: 68,
      investmentReturn: 4.7,
      monthlyGrowth: 1.5,
      pendingTransactions: 3,
    };
    return apiSimulator(stats);
  },

  getRecentTransactions: async (limit = 5) => {
    const transactions = [{
      id: 1,
      description: 'Lương tháng 9',
      category: 'Thu nhập',
      account: 'Vietcombank',
      date: '2025-09-05T10:00:00Z',
      type: 'income',
      amount: 35000000
    }, {
      id: 2,
      description: 'Tiền nhà & dịch vụ',
      category: 'Nhà cửa',
      account: 'Vietcombank',
      date: '2025-09-05T11:30:00Z',
      type: 'expense',
      amount: 8500000
    }, {
      id: 3,
      description: 'Ăn tối nhà hàng',
      category: 'Ăn uống',
      account: 'Thẻ tín dụng',
      date: '2025-09-08T19:45:00Z',
      type: 'expense',
      amount: 1200000
    }, {
      id: 4,
      description: 'Đầu tư chứng khoán FPT',
      category: 'Đầu tư',
      account: 'VNDirect',
      date: '2025-09-09T14:00:00Z',
      type: 'expense',
      amount: 10000000
    }, {
      id: 5,
      description: 'Thanh toán tiền điện',
      category: 'Hóa đơn',
      account: 'Momo',
      date: '2025-09-10T09:15:00Z',
      type: 'expense',
      amount: 850000
    }, ];
    return apiSimulator(transactions.slice(0, limit));
  },

  getSpendingByCategory: async () => {
    const spending = [{
      category: 'Ăn uống',
      amount: 6800000,
      percentage: 31.6,
      color: '#3b82f6'
    }, {
      category: 'Nhà cửa',
      amount: 8500000,
      percentage: 39.5,
      color: '#10b981'
    }, {
      category: 'Di chuyển',
      amount: 2100000,
      percentage: 9.8,
      color: '#f97316'
    }, {
      category: 'Giải trí',
      amount: 2500000,
      percentage: 11.6,
      color: '#a855f7'
    }, {
      category: 'Khác',
      amount: 1600000,
      percentage: 7.5,
      color: '#64748b'
    }, ];
    return apiSimulator(spending);
  },

  getIncomeVsExpenses: async () => {
    const data = {
      labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9'],
      income: [30, 32, 31, 35, 34, 36, 33, 37, 35].map(x => x * 1000000),
      expenses: [20, 22, 25, 23, 26, 24, 27, 25, 21.5].map(x => x * 1000000),
    };
    return apiSimulator(data);
  },

  getSavingsOverTime: async () => {
    const data = {
      labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9'],
      data: [10, 20, 26, 38, 46, 58, 64, 76, 90].map(x => x * 1000000),
    };
    return apiSimulator(data);
  },

  getPortfolioDistribution: async () => {
    const data = [{
      label: 'Cổ phiếu',
      value: 50,
      color: '#3b82f6'
    }, {
      label: 'Trái phiếu',
      value: 25,
      color: '#10b981'
    }, {
      label: 'Tiền mặt',
      value: 15,
      color: '#f97316'
    }, {
      label: 'Vàng',
      value: 10,
      color: '#a855f7'
    }, ];
    return apiSimulator(data);
  },

  getWeeklySpending: async () => {
    const data = {
      labels: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'],
      data: [500000, 750000, 600000, 800000, 1500000, 2500000, 1800000],
    };
    return apiSimulator(data);
  },

  getTopCategories: async () => {
    const data = [{
      name: 'Nhà cửa',
      amount: 8500000,
      trend: 'up',
      change: '+2.1%'
    }, {
      name: 'Ăn uống',
      amount: 6800000,
      trend: 'down',
      change: '-5.4%'
    }, {
      name: 'Giải trí',
      amount: 2500000,
      trend: 'up',
      change: '+10.2%'
    }, ];
    return apiSimulator(data);
  },
};