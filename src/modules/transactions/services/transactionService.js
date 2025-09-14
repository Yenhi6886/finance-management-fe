import apiClient from '../../../shared/services/apiService';

export const transactionService = {
  deposit: async (depositData) => {
    console.log('Calling real deposit API with data:', depositData);
    return apiClient.post('/transactions/deposit', depositData);
  },
  getWallets: async () => {
    console.log('Calling real getWallets API');
    return apiClient.get('/wallets');
  },
  addExpense: async (expenseData) => {
    console.log('Calling real addExpense API with data:', expenseData);
    return apiClient.post('/transactions/expense', expenseData);
  },
  getCategories: async () => {
    console.log('Calling real getCategories API');
    // Assuming a BE endpoint for categories, e.g., /categories/expense
    return apiClient.get('/categories');
  },
  // Add other transaction related API calls here for future stories
};
