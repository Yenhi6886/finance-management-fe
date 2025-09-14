import apiClient from '../../shared/services/apiService';

export const transactionService = {
  deposit: async (depositData) => {
    console.log('Mocking deposit API call with data:', depositData);
    // Mock successful response
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            success: true,
            message: 'Nạp tiền thành công (Mock)! ',
            data: {
              transactionId: 'mock-deposit-' + Date.now(),
              walletId: depositData.walletId,
              amount: depositData.amount,
              type: 'DEPOSIT',
              date: new Date().toISOString(),
            },
          },
        });
      }, 1000);
    });
  },
  // Mock API call to get wallets for the select dropdown
  getWallets: async () => {
    console.log('Mocking getWallets API call');
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            success: true,
            message: 'Lấy danh sách ví thành công (Mock)!',
            data: [
              { id: 1, name: 'Ví chính', balance: 1000000, currency: 'VND' },
              { id: 2, name: 'Ví tiết kiệm', balance: 5000000, currency: 'VND' },
              { id: 3, name: 'Ví du lịch', balance: 200000, currency: 'USD' },
            ],
          },
        });
      }, 500);
    });
  },
  // Add other transaction related API calls here for future stories
};
