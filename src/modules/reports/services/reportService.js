import apiService from '../../../shared/services/apiService.js';

const reportService = {
  getTodayTransactions: (page = 0, size = 10) => {
    return apiService.get('/transactions/statistics/today', {
      params: { page, size }
    });
  },

  getTodayTransactionsByWallet: (walletId, page = 0, size = 10) => {
    return apiService.get('/transactions/statistics/wallet/today', {
      params: { walletId, page, size }
    });
  },

  getTransactionsByTime: (startDate, endDate, page = 0, size = 10, minAmount = null, maxAmount = null) => {
    const params = { startDate, endDate, page, size };
    if (minAmount !== null && minAmount !== '' && !isNaN(parseFloat(minAmount))) {
      params.minAmount = parseFloat(minAmount);
    }
    if (maxAmount !== null && maxAmount !== '' && !isNaN(parseFloat(maxAmount))) {
      params.maxAmount = parseFloat(maxAmount);
    }
    return apiService.get('/transactions/statistics', { params });
  },

  getTransactionsByWalletIdandByTime: (walletId, startDate, endDate, page = 0, size = 10, minAmount = null, maxAmount = null) => {
    const params = { walletId, startDate, endDate, page, size };
    if (minAmount !== null && minAmount !== '' && !isNaN(parseFloat(minAmount))) {
      params.minAmount = parseFloat(minAmount);
    }
    if (maxAmount !== null && maxAmount !== '' && !isNaN(parseFloat(maxAmount))) {
      params.maxAmount = parseFloat(maxAmount);
    }
    return apiService.get('/transactions/statistics/wallet', { params });
  },

  getBudgetStatistics: (year, month, page = 0, size = 10) => {
    return apiService.get('/budgets/statistics', {
      params: { year, month, page, size }
    });
  }
};

export default reportService;