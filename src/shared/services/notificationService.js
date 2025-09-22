import apiService from './apiService';

export const notificationService = {
    getNotifications: () => {
        return apiService.get('/notifications');
    },
    getUnreadCount: () => {
        return apiService.get('/notifications/unread-count');
    },
    markAllAsRead: () => {
        return apiService.post('/notifications/mark-as-read');
    },
};