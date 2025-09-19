import apiService from '../../../shared/services/apiService';

const reportService = {
  getTodayTransactions: () => {
    return apiService.get('/transactions/statistics/today');
  },

  getTodayTransactionsByWallet: (walletId) => {
    return apiService.get('/transactions/statistics/wallet/today', {
      params: { walletId }
    });
  },

  getTransactionsByTime: (startDate, endDate) => {
    return apiService.get('/transactions/statistics', {
      params: { startDate, endDate }
    });
  },

  getTransactionsByWalletIdandByTime: (walletId, startDate, endDate) => {
    return apiService.get('/transactions/statistics/wallet', {
      params: { walletId, startDate, endDate }
    });
  },

  getBudgetStatistics: (year, month) => {
    return apiService.get('/budgets/statistics', {
      params: { year, month }
    });
  }
};

export default reportService;