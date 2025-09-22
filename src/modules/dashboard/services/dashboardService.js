import apiService from '../../../shared/services/apiService.js';

const getDashboardSummary = (walletId = null, signal = null) => {
  const params = {};
  if (walletId) {
    params.walletId = walletId;
  }
  
  const config = { params };
  if (signal) {
    config.signal = signal;
  }
  
  return apiService.get('/dashboard/summary', config);
};

export const dashboardService = {
  getDashboardSummary,
};