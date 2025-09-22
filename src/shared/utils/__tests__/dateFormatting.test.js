import { formatDate, formatDateTime } from '../formattingUtils.js';

// Mock settings object
const mockSettings = {
    dateFormat: 'DD_MM_YYYY'
};

const mockSettingsYYYY = {
    dateFormat: 'YYYY_MM_DD'
};

const mockSettingsMMDD = {
    dateFormat: 'MM_DD_YYYY'
};

describe('Date Formatting Utils', () => {
    const testDate = '2023-03-27T10:30:00Z';
    const testDateString = '2023-03-27';

    describe('formatDate', () => {
        test('should format date as DD/MM/YYYY by default', () => {
            const result = formatDate(testDate, mockSettings);
            expect(result).toBe('27/03/2023');
        });

        test('should format date as YYYY/MM/DD when setting is YYYY_MM_DD', () => {
            const result = formatDate(testDate, mockSettingsYYYY);
            expect(result).toBe('2023/03/27');
        });

        test('should format date as MM/DD/YYYY when setting is MM_DD_YYYY', () => {
            const result = formatDate(testDate, mockSettingsMMDD);
            expect(result).toBe('03/27/2023');
        });

        test('should handle invalid date', () => {
            const result = formatDate('invalid-date', mockSettings);
            expect(result).toBe('invalid-date');
        });

        test('should handle empty string', () => {
            const result = formatDate('', mockSettings);
            expect(result).toBe('');
        });

        test('should handle null/undefined', () => {
            const result1 = formatDate(null, mockSettings);
            const result2 = formatDate(undefined, mockSettings);
            expect(result1).toBe('');
            expect(result2).toBe('');
        });
    });

    describe('formatDateTime', () => {
        test('should format date and time as DD/MM/YYYY HH:mm by default', () => {
            const result = formatDateTime(testDate, mockSettings);
            expect(result).toBe('27/03/2023 10:30');
        });

        test('should format date and time as YYYY/MM/DD HH:mm when setting is YYYY_MM_DD', () => {
            const result = formatDateTime(testDate, mockSettingsYYYY);
            expect(result).toBe('2023/03/27 10:30');
        });

        test('should format date and time as MM/DD/YYYY HH:mm when setting is MM_DD_YYYY', () => {
            const result = formatDateTime(testDate, mockSettingsMMDD);
            expect(result).toBe('03/27/2023 10:30');
        });

        test('should handle invalid date', () => {
            const result = formatDateTime('invalid-date', mockSettings);
            expect(result).toBe('invalid-date');
        });
    });
});
