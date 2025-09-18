import apiService from '../../../shared/services/apiService';

export const categoryService = {
    createCategory: (categoryData) => {
        return apiService.post('/categories', categoryData);
    },
    getCategories: () => {
        return apiService.get('/categories');
    },
    updateCategory: (id, categoryData) => {
        return apiService.put(`/categories/${id}`, categoryData);
    },
    deleteCategory: (id) => {
        return apiService.delete(`/categories/${id}`);
    },
    getTransactionsByCategoryId: (id) => {
        return apiService.get(`/categories/${id}/transactions`);
    }
};
