import apiClient from "@/shared/services/apiService"

export const settingsService = {
    getUsdExchangeRate: async () => {
        return apiClient.get('/exchange-rates/USD');
    },

    updateUsdExchangeRate: async (updateData) => {
        return apiClient.put('/exchange-rates', updateData)
    }
}