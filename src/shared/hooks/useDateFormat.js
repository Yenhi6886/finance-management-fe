import { useSettings } from '../contexts/SettingsContext.jsx';
import { formatDate, formatDateTime } from '../utils/formattingUtils.js';

/**
 * Hook để quản lý định dạng ngày toàn cục
 * Sử dụng settings từ SettingsContext để format ngày theo cài đặt người dùng
 */
export const useDateFormat = () => {
    const { settings } = useSettings();

    /**
     * Format ngày theo cài đặt hiện tại
     * @param {string|Date} dateString - Ngày cần format
     * @returns {string} - Ngày đã được format
     */
    const formatDateWithSettings = (dateString) => {
        return formatDate(dateString, settings);
    };

    /**
     * Format ngày và giờ theo cài đặt hiện tại
     * @param {string|Date} dateString - Ngày cần format
     * @returns {string} - Ngày và giờ đã được format
     */
    const formatDateTimeWithSettings = (dateString) => {
        return formatDateTime(dateString, settings);
    };

    /**
     * Lấy định dạng ngày hiện tại
     * @returns {string} - Định dạng ngày hiện tại
     */
    const getCurrentDateFormat = () => {
        return settings?.dateFormat || 'DD_MM_YYYY';
    };

    /**
     * Kiểm tra xem có phải định dạng YYYY/MM/DD không
     * @returns {boolean}
     */
    const isYearMonthDayFormat = () => {
        return getCurrentDateFormat() === 'YYYY_MM_DD';
    };

    /**
     * Kiểm tra xem có phải định dạng MM/DD/YYYY không
     * @returns {boolean}
     */
    const isMonthDayYearFormat = () => {
        return getCurrentDateFormat() === 'MM_DD_YYYY';
    };

    /**
     * Kiểm tra xem có phải định dạng DD/MM/YYYY không
     * @returns {boolean}
     */
    const isDayMonthYearFormat = () => {
        return getCurrentDateFormat() === 'DD_MM_YYYY';
    };

    return {
        formatDate: formatDateWithSettings,
        formatDateTime: formatDateTimeWithSettings,
        getCurrentDateFormat,
        isYearMonthDayFormat,
        isMonthDayYearFormat,
        isDayMonthYearFormat,
        settings
    };
};
