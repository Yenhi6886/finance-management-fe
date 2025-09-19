import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card';
import { LoadingSpinner as Loading } from '../../../components/Loading';
import { Alert, AlertDescription, AlertTitle } from '../../../components/ui/alert';
import { Terminal } from "lucide-react"
import currencyService from '../services/currencyService';

const CurrencyPage = () => {
    const [rates, setRates] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);

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
        <div className="p-4 md:p-8 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Tỉ Giá Tham Khảo</CardTitle>
                    <CardDescription>
                        Tỉ giá các đồng tiền phổ biến so với Việt Nam Đồng (VND).
                        {lastUpdated && (
                            <span className="block text-xs text-muted-foreground mt-1">
                                Cập nhật lần cuối lúc: {lastUpdated.toLocaleString('vi-VN')}
                            </span>
                        )}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {renderContent()}
                </CardContent>
            </Card>
        </div>
    );
};

export default CurrencyPage;