import apiService from '../../../shared/services/apiService';

export const dashboardService = {
  getDashboardWallets: async () => {
    return apiService.get('/dashboard/wallets');
  }

  // Bạn có thể thêm các hàm gọi API thật khác cho các phần còn lại của dashboard ở đây
  // Ví dụ:
  // getRecentTransactions: async () => {
  //   return apiService.get('/dashboard/recent-transactions');
  // },
  // getSpendingByCategory: async () => {
  //   return apiService.get('/dashboard/spending-by-category');
  // }
};