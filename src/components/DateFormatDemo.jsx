import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card.jsx';
import { useDateFormat } from '../shared/hooks/useDateFormat.js';
import { useSettings } from '../shared/contexts/SettingsContext.jsx';

const DateFormatDemo = () => {
    const { formatDate, formatDateTime, getCurrentDateFormat } = useDateFormat();
    const { settings } = useSettings();

    const testDates = [
        '2023-03-27T10:30:00Z',
        '2024-12-25T15:45:30Z',
        '2023-01-01T00:00:00Z',
        '2023-12-31T23:59:59Z'
    ];

    const currentFormat = getCurrentDateFormat();
    const formatLabels = {
        'DD_MM_YYYY': 'Ngày/Tháng/Năm (DD/MM/YYYY)',
        'MM_DD_YYYY': 'Tháng/Ngày/Năm (MM/DD/YYYY)',
        'YYYY_MM_DD': 'Năm/Tháng/Ngày (YYYY/MM/DD)'
    };

    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle className="text-green-600 dark:text-green-400">
                    Demo Định Dạng Ngày
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                    Định dạng hiện tại: <strong>{formatLabels[currentFormat] || currentFormat}</strong>
                </p>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <h3 className="text-lg font-semibold mb-3">Định dạng ngày (formatDate)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {testDates.map((date, index) => (
                            <div key={index} className="p-3 border rounded-lg bg-muted/30">
                                <div className="text-sm text-muted-foreground mb-1">
                                    Input: {date}
                                </div>
                                <div className="font-mono text-sm">
                                    Output: {formatDate(date)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-3">Định dạng ngày và giờ (formatDateTime)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {testDates.map((date, index) => (
                            <div key={index} className="p-3 border rounded-lg bg-muted/30">
                                <div className="text-sm text-muted-foreground mb-1">
                                    Input: {date}
                                </div>
                                <div className="font-mono text-sm">
                                    Output: {formatDateTime(date)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                        Hướng dẫn sử dụng
                    </h4>
                    <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                        <li>• Thay đổi định dạng ngày trong Settings → Định Dạng</li>
                        <li>• Tất cả ngày trong ứng dụng sẽ tự động cập nhật theo định dạng mới</li>
                        <li>• Định dạng sẽ được lưu và áp dụng cho toàn bộ ứng dụng</li>
                    </ul>
                </div>
            </CardContent>
        </Card>
    );
};

export default DateFormatDemo;
