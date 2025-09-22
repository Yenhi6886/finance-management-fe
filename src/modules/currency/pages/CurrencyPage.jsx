import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card.jsx';
import { LoadingSpinner as Loading } from '../../../components/Loading.jsx';
import { Alert, AlertDescription, AlertTitle } from '../../../components/ui/alert.jsx';
import { Terminal, DollarSign, ArrowRight } from "lucide-react"
import { Input } from '../../../components/ui/input.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select.jsx';
import currencyService from '../services/currencyService.js';

const CurrencyPage = () => {
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
                    setError('Không nhận được dữ liệu hợp lệ từ API.');
                }
            } catch (err) {
                setError('Không thể tải dữ liệu tỉ giá. Vui lòng kiểm tra lại API key và kết nối mạng.');
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
                    <AlertTitle>Lỗi</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            );
        }

        if (!rates || !rates.VND) {
            return <p className="text-center text-muted-foreground">Không có dữ liệu tỉ giá cho VND.</p>;
        }

        // Lấy tỉ giá VND so với USD làm mốc
        const usdToVndRate = rates.VND;

        return (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {popularCurrencies.map(currency => {
                    const usdToCurrentCurrencyRate = rates[currency];
                    if (!usdToCurrentCurrencyRate) return null;

                    // Công thức tính tỉ giá chéo: (Tỉ giá USD/VND) / (Tỉ giá USD/TIỀN_TỆ_KHÁC)
                    const convertedRate = usdToVndRate / usdToCurrentCurrencyRate;

                    return (
                        <Card key={currency} className="text-center">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg">{currency}</CardTitle>
                                <CardDescription>1 {currency} đổi sang VND</CardDescription>
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
                    <h1 className="text-3xl font-bold text-green-600 dark:text-green-400">Tỉ Giá Tham Khảo</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Tỉ giá các đồng tiền phổ biến so với Việt Nam Đồng (VND) - 
                        {lastUpdated ? ` Cập nhật ${lastUpdated.toLocaleString('vi-VN')}` : ' Đang cập nhật...'}
                    </p>
                </div>
            </div>

            {/* Currency Converter */}
            <Card>
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center space-x-2 text-green-600">
                        <ArrowRight className="w-5 h-5" />
                        <span>Chuyển Đổi Tiền Tệ</span>
                    </CardTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Đổi tiền Việt Nam sang các ngoại tệ</p>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Số tiền (VND)</label>
                            <Input
                                type="text"
                                placeholder="Nhập số tiền VND"
                                value={vndAmount}
                                onChange={handleVndAmountChange}
                                className="text-lg"
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Chuyển sang</label>
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
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Kết quả</label>
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
                        <span>Tỷ Giá Hôm Nay</span>
                    </CardTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Tỷ giá các đồng tiền phổ biến quy đổi sang VND</p>
                </CardHeader>
                <CardContent>
                    {renderContent()}
                </CardContent>
            </Card>
        </div>
    );
};

export default CurrencyPage;