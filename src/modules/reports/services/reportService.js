import apiClient from "../../../shared/services/apiService"; // Sử dụng apiClient từ file của bạn

const getTransactionStatistics = (params) => {
  const queryParams = new URLSearchParams();

  // Loại bỏ các param null hoặc undefined
  if (params.page !== undefined) queryParams.append('page', params.page);
  if (params.size) queryParams.append('size', params.size);
  if (params.walletId) queryParams.append('walletId', params.walletId);
  if (params.startDate) queryParams.append('startDate', params.startDate);
  if (params.endDate) queryParams.append('endDate', params.endDate);

  // Nếu không có param nào, không thêm dấu ?
  const queryString = queryParams.toString();
  const endpointPath = queryString ? `?${queryString}` : '';

  if (params.walletId) {
    if (params.startDate) { // Lọc theo ví và khoảng thời gian
      return apiClient.get(`/api/transactions/statistics/wallet${endpointPath}`);
    } else { // Lọc theo ví hôm nay
      return apiClient.get(`/api/transactions/statistics/wallet/today${endpointPath}`);
    }
  } else {
    if (params.startDate) { // Lọc tất cả theo khoảng thời gian
      return apiClient.get(`/api/transactions/statistics${endpointPath}`);
    } else { // Lọc tất cả hôm nay
      return apiClient.get(`/api/transactions/statistics/today${endpointPath}`);
    }
  }
};

const getBudgetStatistics = (params) => {
  const queryParams = new URLSearchParams({
    year: params.year,
    month: params.month,
    page: params.page || 0,
    size: params.size || 10,
  });

  return apiClient.get(`/api/budgets/statistics?${queryParams.toString()}`);
};

const reportService = {
  getTransactionStatistics,
  getBudgetStatistics,
};

export default reportService;