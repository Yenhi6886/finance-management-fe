import { apiService } from '../../../shared/services/apiService'

class ReportService {
  // Get transactions within date range
  async getTransactionReport(params) {
    const { startDate, endDate, walletId, type } = params
    const queryParams = new URLSearchParams({
      startDate,
      endDate,
      ...(walletId && { walletId }),
      ...(type && { type })
    })
    
    return await apiService.get(`/reports/transactions?${queryParams}`)
  }

  // Get today's transactions
  async getTodayTransactions(walletId = null) {
    const params = walletId ? `?walletId=${walletId}` : ''
    return await apiService.get(`/reports/transactions/today${params}`)
  }

  // Get budget report for specific month
  async getBudgetReport(month) {
    return await apiService.get(`/reports/budgets/${month}`)
  }

  // Get dashboard summary statistics
  async getDashboardSummary(period = 'month') {
    return await apiService.get(`/reports/dashboard/summary?period=${period}`)
  }

  // Export transactions to file
  async exportTransactions(exportData) {
    return await apiService.post('/reports/export', exportData)
  }

  // Schedule email reports
  async scheduleEmailReport(emailSettings) {
    return await apiService.post('/reports/email/schedule', emailSettings)
  }

  // Get email settings
  async getEmailSettings() {
    return await apiService.get('/reports/email/settings')
  }

  // Update email settings
  async updateEmailSettings(settings) {
    return await apiService.put('/reports/email/settings', settings)
  }

  // Send report email immediately
  async sendEmailNow(emailData) {
    return await apiService.post('/reports/email/send-now', emailData)
  }

  // Get wallet-specific report
  async getWalletReport(walletId, startDate, endDate) {
    const queryParams = new URLSearchParams({
      startDate,
      endDate
    })
    
    return await apiService.get(`/wallets/${walletId}/reports?${queryParams}`)
  }
}

export const reportService = new ReportService()
