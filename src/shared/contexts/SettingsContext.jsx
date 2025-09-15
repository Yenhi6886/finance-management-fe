import React, { createContext, useState, useEffect, useCallback, useContext } from 'react'
import { settingsService } from '../../modules/settings/services/settingsService'
import { toast } from 'sonner'

export const SettingsContext = createContext()

export const SettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState(null)
    const [loading, setLoading] = useState(true)

    const fetchSettings = useCallback(async () => {
        try {
            const response = await settingsService.getSettings()
            setSettings(response.data.data)
        } catch (error) {
            console.error('Failed to load user settings:', error)
            toast.error('Không thể tải cài đặt người dùng.')
        } finally {
            setLoading(false)
        }
    }, [])

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