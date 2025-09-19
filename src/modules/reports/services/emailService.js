import apiService from '../../../shared/services/apiService';

const emailService = {
  getSettings() {
    return apiService.get('/reports/email/settings');
  },

  saveSettings(payload) {
    // payload 应匹配 ReportEmailSetting: targetEmail, dailyEnabled, weeklyEnabled, monthlyEnabled, sendHour, sendMinute, weeklyDayOfWeek, monthlyDayOfMonth
    return apiService.post('/reports/email/settings', payload);
  },

  sendNow(reportRequest) {
    return apiService.post('/reports/email/send-now', reportRequest, { responseType: 'json' });
  }
};

export default emailService;
