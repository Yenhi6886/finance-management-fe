import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card.jsx';
import { useDateFormat } from '../shared/hooks/useDateFormat.js';
import { useSettings } from '../shared/contexts/SettingsContext.jsx';
import { useLanguage } from '../shared/contexts/LanguageContext.jsx';

const DateFormatDemo = () => {
    const { formatDate, formatDateTime, getCurrentDateFormat } = useDateFormat();
    const { settings } = useSettings();
    const { t } = useLanguage();

    const testDates = [
        '2023-03-27T10:30:00Z',
        '2024-12-25T15:45:30Z',
        '2023-01-01T00:00:00Z',
        '2023-12-31T23:59:59Z'
    ];

    const currentFormat = getCurrentDateFormat();
    const formatLabels = {
        'DD_MM_YYYY': t('settings.format.dayMonthYear') + ' (DD/MM/YYYY)',
        'MM_DD_YYYY': t('settings.format.monthDayYear') + ' (MM/DD/YYYY)',
        'YYYY_MM_DD': t('settings.format.yearMonthDay') + ' (YYYY/MM/DD)'
    };

    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle className="text-green-600 dark:text-green-400">
                    {t('dateFormatDemo.currentFormat')}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                    {t('dateFormatDemo.currentFormat')}: <strong>{formatLabels[currentFormat] || currentFormat}</strong>
                </p>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <h3 className="text-lg font-semibold mb-3">{t('dateFormatDemo.formatDate')}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {testDates.map((date, index) => (
                            <div key={index} className="p-3 border rounded-lg bg-muted/30">
                                <div className="text-sm text-muted-foreground mb-1">
                                    {t('dateFormatDemo.input', { date })}
                                </div>
                                <div className="font-mono text-sm">
                                    {t('dateFormatDemo.output', { result: formatDate(date) })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-3">{t('dateFormatDemo.formatDateTime')}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {testDates.map((date, index) => (
                            <div key={index} className="p-3 border rounded-lg bg-muted/30">
                                <div className="text-sm text-muted-foreground mb-1">
                                    {t('dateFormatDemo.input', { date })}
                                </div>
                                <div className="font-mono text-sm">
                                    {t('dateFormatDemo.output', { result: formatDateTime(date) })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                        {t('dateFormatDemo.note')}
                    </h4>
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                        {t('dateFormatDemo.note')}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};

export default DateFormatDemo;
