import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import { notificationService } from '../services/notificationService.js';
import { useAuth } from '../../modules/auth/contexts/AuthContext.jsx';

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

        // Update UI immediately so user sees the change
        setUnreadCount(0);
        setNotifications(prevNotifications =>
            prevNotifications.map(n => ({ ...n, isRead: true }))
        );

        // Send request to API in background
        try {
            await notificationService.markAllAsRead();
        } catch (error) {
            console.error('Failed to mark notifications as read:', error);
            // If API fails, restore the previous state
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