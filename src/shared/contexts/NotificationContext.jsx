import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import { notificationService } from '../services/notificationService';
import { useAuth } from '../../modules/auth/contexts/AuthContext';

const NotificationContext = createContext();

export const useNotification = () => {
    return useContext(NotificationContext);
};

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const { isAuthenticated } = useAuth();

    const fetchUnreadCount = useCallback(async () => {
        if (!isAuthenticated) return;
        try {
            const response = await notificationService.getUnreadCount();
            setUnreadCount(response.data.data.unreadCount || 0);
        } catch (error) {
            console.error('Failed to fetch unread notification count:', error);
        }
    }, [isAuthenticated]);

    const fetchNotifications = useCallback(async () => {
        if (!isAuthenticated) return;
        setLoading(true);
        try {
            const response = await notificationService.getNotifications();
            setNotifications(response.data.data || []);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated]);

    const markAllAsRead = useCallback(async () => {
        if (!isAuthenticated || unreadCount === 0) return;

        // Cập nhật UI ngay lập tức để người dùng thấy thay đổi
        setUnreadCount(0);
        setNotifications(prevNotifications =>
            prevNotifications.map(n => ({ ...n, isRead: true }))
        );

        // Gửi yêu cầu lên API trong nền
        try {
            await notificationService.markAllAsRead();
        } catch (error) {
            console.error('Failed to mark notifications as read:', error);
            // Nếu API thất bại, khôi phục lại trạng thái cũ
            fetchUnreadCount();
            fetchNotifications();
        }
    }, [isAuthenticated, unreadCount, fetchUnreadCount, fetchNotifications]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchUnreadCount();
            const interval = setInterval(fetchUnreadCount, 60000);
            return () => clearInterval(interval);
        }
    }, [isAuthenticated, fetchUnreadCount]);

    const value = {
        notifications,
        unreadCount,
        loading,
        fetchNotifications,
        markAllAsRead,
        refreshNotifications: fetchUnreadCount,
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};