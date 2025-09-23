import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover.jsx';
import { Button } from './ui/button.jsx';
import { BellIcon, CheckCheck } from 'lucide-react';
import { useNotification } from '../shared/contexts/NotificationContext.jsx';
import { useLanguage } from '../shared/contexts/LanguageContext.jsx';
import { cn } from '../lib/utils.js';
import { formatDistanceToNow } from 'date-fns';
import { vi, enUS } from 'date-fns/locale';

export const NotificationPanel = ({ children }) => {
    const { notifications, unreadCount, fetchNotifications, markAllAsRead } = useNotification();
    const { t, currentLanguage } = useLanguage();
    
    const dateLocale = currentLanguage === 'vi' ? vi : enUS;

    const handleOpenChange = (isOpen) => {
        if (isOpen) {
            fetchNotifications();
            if (unreadCount > 0) {
                markAllAsRead();
            }
        }
    };

    return (
        <Popover onOpenChange={handleOpenChange}>
            <PopoverTrigger asChild>
                {children}
            </PopoverTrigger>
            <PopoverContent className="w-80" side="right" align="end" sideOffset={12}>
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <h4 className="font-medium leading-none">{t('notifications.title')}</h4>
                        <p className="text-sm text-muted-foreground">
                            {t('notifications.subtitle')}
                        </p>
                    </div>
                    <div className="grid gap-2 max-h-96 overflow-y-auto">
                        {notifications.length > 0 ? (
                            notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className="mb-2 grid grid-cols-[25px_1fr] items-start pb-2 last:mb-0 last:pb-0"
                                >
                                    <span className={cn("flex h-2 w-2 translate-y-1 rounded-full bg-sky-500 transition-opacity", notification.isRead && "opacity-0")} />
                                    <div className="grid gap-1">
                                        <p className="text-sm leading-none">
                                            {notification.message}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true, locale: dateLocale })}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                <CheckCheck className="mx-auto h-8 w-8 mb-2" />
                                <p className="text-sm">{t('notifications.noNotifications')}</p>
                            </div>
                        )}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
};