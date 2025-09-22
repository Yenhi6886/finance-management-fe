import reportService from '../services/reportService.js';

// Mock apiService
jest.mock('../../../shared/services/apiService.js', () => ({
  get: jest.fn()
}));

describe('Report Service - Amount Filtering', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getTransactionsByTime', () => {
    test('should include minAmount and maxAmount in params when provided', () => {
      const mockApiService = require('../../../shared/services/apiService.js');
      mockApiService.get.mockResolvedValue({ data: { success: true } });

      const startDate = '2023-01-01T00:00:00';
      const endDate = '2023-01-31T23:59:59';
      const page = 0;
      const size = 10;
      const minAmount = 50000;
      const maxAmount = 500000;

      reportService.getTransactionsByTime(startDate, endDate, page, size, minAmount, maxAmount);

      expect(mockApiService.get).toHaveBeenCalledWith('/transactions/statistics', {
        params: {
          startDate,
          endDate,
          page,
          size,
          minAmount: 50000,
          maxAmount: 500000
        }
      });
    });

    test('should not include minAmount and maxAmount when null or empty', () => {
      const mockApiService = require('../../../shared/services/apiService.js');
      mockApiService.get.mockResolvedValue({ data: { success: true } });

      const startDate = '2023-01-01T00:00:00';
      const endDate = '2023-01-31T23:59:59';
      const page = 0;
      const size = 10;

      reportService.getTransactionsByTime(startDate, endDate, page, size, null, null);

      expect(mockApiService.get).toHaveBeenCalledWith('/transactions/statistics', {
        params: {
          startDate,
          endDate,
          page,
          size
        }
      });
    });

    test('should handle string values and convert to numbers', () => {
      const mockApiService = require('../../../shared/services/apiService.js');
      mockApiService.get.mockResolvedValue({ data: { success: true } });

      const startDate = '2023-01-01T00:00:00';
      const endDate = '2023-01-31T23:59:59';
      const page = 0;
      const size = 10;
      const minAmount = '100000';
      const maxAmount = '1000000';

      reportService.getTransactionsByTime(startDate, endDate, page, size, minAmount, maxAmount);

      expect(mockApiService.get).toHaveBeenCalledWith('/transactions/statistics', {
        params: {
          startDate,
          endDate,
          page,
          size,
          minAmount: 100000,
          maxAmount: 1000000
        }
      });
    });
  });

  describe('getTransactionsByWalletIdandByTime', () => {
    test('should include walletId and amount filters in params', () => {
      const mockApiService = require('../../../shared/services/apiService.js');
      mockApiService.get.mockResolvedValue({ data: { success: true } });

      const walletId = 1;
      const startDate = '2023-01-01T00:00:00';
      const endDate = '2023-01-31T23:59:59';
      const page = 0;
      const size = 10;
      const minAmount = 50000;
      const maxAmount = 500000;

      reportService.getTransactionsByWalletIdandByTime(walletId, startDate, endDate, page, size, minAmount, maxAmount);

      expect(mockApiService.get).toHaveBeenCalledWith('/transactions/statistics/wallet', {
        params: {
          walletId,
          startDate,
          endDate,
          page,
          size,
          minAmount: 50000,
          maxAmount: 500000
        }
      });
    });
  });
});
