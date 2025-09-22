import React, { createContext, useState, useEffect, useCallback, useContext } from 'react'
import { settingsService } from '../../modules/settings/services/settingsService.js'
import { toast } from 'sonner'
import { useAuth } from '../../modules/auth/contexts/AuthContext.jsx'

export const SettingsContext = createContext()

export const SettingsProvider = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const [settings, setSettings] = useState(null)
    const [loading, setLoading] = useState(true)

    const fetchSettings = useCallback(async () => {
        if (!isAuthenticated) {
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const response = await settingsService.getSettings()
            setSettings(response.data.data)
        } catch (error) {
            console.error('Failed to load user settings:', error)
            // Không cần toast lỗi ở đây nữa vì nó không phải là lỗi người dùng cần biết
        } finally {
            setLoading(false)
        }
    }, [isAuthenticated])

    useEffect(() => {
        fetchSettings()
    }, [fetchSettings])

    const updateSettings = useCallback(async (newSettingsData) => {
        try {
            const response = await settingsService.updateSettings(newSettingsData)
            setSettings(response.data.data)
            toast.success("Cập nhật cài đặt thành công!")
            return response.data.data
        } catch (error) {
            toast.error("Lỗi khi cập nhật cài đặt.")
            fetchSettings()
            throw error
        }
    }, [fetchSettings])

    const value = {
        settings,
        loading,
        updateSettings,
        refreshSettings: fetchSettings
    }

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    )
}

export const useSettings = () => {
    const context = useContext(SettingsContext)
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider')
    }
    return context
}