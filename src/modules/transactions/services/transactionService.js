import apiClient from '../../shared/services/apiService';

export const transactionService = {
  deposit: async (depositData) => {
    console.log('Calling real deposit API with data:', depositData);
    return apiClient.post('/transactions/deposit', depositData);
  },
  getWallets: async () => {
    console.log('Calling real getWallets API');
    return apiClient.get('/wallets');
  },
  // Add other transaction related API calls here for future stories
};
