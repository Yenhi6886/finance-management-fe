import apiService from '../../../shared/services/apiService'

export const settingsService = {
    getSettings: async () => {
        return apiService.get('/settings')
    },

    updateSettings: async (settingsData) => {
        return apiService.put('/settings', settingsData)
    }
}