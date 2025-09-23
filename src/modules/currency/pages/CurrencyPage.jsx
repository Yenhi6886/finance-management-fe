import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../../shared/contexts/LanguageContext.jsx';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card.jsx';
import { LoadingSpinner as Loading } from '../../../components/Loading.jsx';
import { Alert, AlertDescription, AlertTitle } from '../../../components/ui/alert.jsx';
import { Terminal, DollarSign, ArrowRight } from "lucide-react"
import { Input } from '../../../components/ui/input.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select.jsx';
import currencyService from '../services/currencyService.js';

const CurrencyPage = () => {
    const { t } = useLanguage();
    const [rates, setRates] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);
    
    // Currency converter states
    const [vndAmount, setVndAmount] = useState('');
    const [selectedCurrency, setSelectedCurrency] = useState('USD');
    const [convertedAmount, setConvertedAmount] = useState(0);

    const popularCurrencies = ['USD', 'EUR', 'JPY', 'GBP', 'AUD', 'CAD', 'CHF', 'CNY', 'HKD', 'SGD', 'KRW', 'THB'];

    useEffect(() => {
        const fetchRates = async () => {
            try {
                setLoading(true);
                setError(null);
                const result = await currencyService.getLatestRates();
                console.log(result);
                if (result && result.conversion_rates) {
                    setRates(result.conversion_rates);
                    setLastUpdated(new Date());
                } else {
                    setError(t('currency.errors.loadingError'));
                }
            } catch (err) {
                setError(t('currency.errors.loadingError'));
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchRates();
    }, []);

    // Convert VND to selected currency
    useEffect(() => {
        if (rates && vndAmount && selectedCurrency) {
            const amount = parseFloat(vndAmount.replace(/,/g, ''));
            if (!isNaN(amount) && rates.VND && rates[selectedCurrency]) {
                const usdToVndRate = rates.VND;
                const usdToTargetRate = rates[selectedCurrency];
                
                // Convert VND to target currency: (VND amount / VND rate) * target rate
                const result = (amount / usdToVndRate) * usdToTargetRate;
                setConvertedAmount(result);
            }
        } else {
            setConvertedAmount(0);
        }
    }, [vndAmount, selectedCurrency, rates]);

    const handleVndAmountChange = (e) => {
        const value = e.target.value;
        // Remove all non-digits
        const numericValue = value.replace(/[^0-9]/g, '');
        // Add thousand separators
        const formattedValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        setVndAmount(formattedValue);
    };

    const renderContent = () => {
        if (loading) {
            return (
                <div className="flex justify-center items-center h-64">
                    <Loading />
                </div>
            );
        }

        if (error) {
            return (
                <Alert variant="destructive">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>{t('currency.errors.loadingError')}</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            );
        }

        if (!rates || !rates.VND) {
            return <p className="text-center text-muted-foreground">{t('currency.errors.noDataForVND')}</p>;
        }

        // Get VND rate compared to USD as baseline
        const usdToVndRate = rates.VND;

        return (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {popularCurrencies.map(currency => {
                    const usdToCurrentCurrencyRate = rates[currency];
                    if (!usdToCurrentCurrencyRate) return null;

                    // Cross rate calculation formula: (USD/VND rate) / (USD/OTHER_CURRENCY rate)
                    const convertedRate = usdToVndRate / usdToCurrentCurrencyRate;

                    return (
                        <Card key={currency} className="text-center">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg">{currency}</CardTitle>
                                <CardDescription>{t('currency.rates.convertTo', { currency })}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                                    {convertedRate.toLocaleString('vi-VN', { maximumFractionDigits: 0 })}
                                </p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-green-600 dark:text-green-400">{t('currency.title')}</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        {t('currency.subtitle')} - 
                        {lastUpdated ? ` ${t('currency.lastUpdated', { time: lastUpdated.toLocaleString('vi-VN') })}` : ` ${t('currency.updating')}`}
                    </p>
                </div>
            </div>

            {/* Currency Converter */}
            <Card>
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center space-x-2 text-green-600">
                        <ArrowRight className="w-5 h-5" />
                        <span>{t('currency.converter.title')}</span>
                    </CardTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{t('currency.converter.subtitle')}</p>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('currency.converter.vndAmount')}</label>
                            <Input
                                type="text"
                                placeholder={t('currency.converter.vndAmountPlaceholder')}
                                value={vndAmount}
                                onChange={handleVndAmountChange}
                                className="text-lg"
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('currency.converter.convertTo')}</label>
                            <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                                <SelectTrigger className="text-lg">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {popularCurrencies.map(currency => (
                                        <SelectItem key={currency} value={currency}>
                                            {currency}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('currency.converter.result')}</label>
                            <div className="h-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-800 flex items-center">
                                <span className="text-lg font-semibold text-green-600 dark:text-green-400">
                                    {convertedAmount.toLocaleString('en-US', { 
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: selectedCurrency === 'JPY' || selectedCurrency === 'KRW' ? 0 : 2 
                                    })} {selectedCurrency}
                                </span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center space-x-2 text-green-600">
                        <DollarSign className="w-5 h-5" />
                        <span>{t('currency.rates.title')}</span>
                    </CardTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{t('currency.rates.subtitle')}</p>
                </CardHeader>
                <CardContent>
                    {renderContent()}
                </CardContent>
            </Card>
        </div>
    );
};

export default CurrencyPage;