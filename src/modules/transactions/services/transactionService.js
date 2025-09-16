import apiService from '../../../shared/services/apiService';

export const transactionService = {
    createTransaction: (transactionData) => {
        return apiService.post('/transactions', transactionData);
    },
    getTransactions: (params) => {
        return apiService.get('/transactions', { params });
    }
};