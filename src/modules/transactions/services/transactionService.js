import apiService from '../../../shared/services/apiService';

export const transactionService = {
    createTransaction: (transactionData) => {
        return apiService.post('/transactions', transactionData);
    },
    getTransactions: (params) => {
        return apiService.get('/transactions', { params });
    },
    updateTransaction: (id, transactionData) => {
        return apiService.put(`/transactions/${id}`, transactionData);
    },
    deleteTransaction: (id) => {
        return apiService.delete(`/transactions/${id}`);
    }
};

