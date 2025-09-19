import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs'
import { Badge } from '../../../components/ui/badge'
import { format } from 'date-fns';
import {
    Calendar,
    Mail,
    TrendingUp,
    TrendingDown,
    Wallet,
    PieChart,
    Filter
} from 'lucide-react'
import { useSettings } from '../../../shared/contexts/SettingsContext'
import { useWallet } from '../../../shared/hooks/useWallet'
import { formatCurrency, formatDate } from '../../../shared/utils/formattingUtils'
import { ExportDialog, EmailSettingsDialog } from '../components/ExportComponents'
import reportService from '../services/reportService'
import { LoadingSpinner as Loading } from '../../../components/Loading'
const Reports = () => {
    const { settings } = useSettings();
    const { wallets } = useWallet();

    // States for filters
    const [dateRange, setDateRange] = useState({
        startDate: format(new Date(), 'yyyy-MM-dd'),
        endDate: format(new Date(), 'yyyy-MM-dd')
    });
    const [selectedPeriodWallet, setSelectedPeriodWallet] = useState('all');
    const [selectedTodayWallet, setSelectedTodayWallet] = useState('all');
    const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM')); // YYYY-MM

    // States for data & loading
    const [isPeriodLoading, setIsPeriodLoading] = useState(false);
    const [periodData, setPeriodData] = useState(null);

    const [isTodayLoading, setIsTodayLoading] = useState(false);
    const [todayData, setTodayData] = useState(null);

    const [isBudgetLoading, setIsBudgetLoading] = useState(false);
    const [budgetData, setBudgetData] = useState(null);

    const fetchTodayData = async () => {
        setIsTodayLoading(true);
        try {
            const params = {
                walletId: selectedTodayWallet !== 'all' ? selectedTodayWallet : null
            };
            const response = await reportService.getTransactionStatistics(params);
            if (response.data.success) {
                setTodayData(response.data.data);
            }
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu hôm nay:", error);
        } finally {
            setIsTodayLoading(false);
        }
    };

    const fetchPeriodData = async () => {
        setIsPeriodLoading(true);
        try {
            const params = {
                startDate: `${dateRange.startDate}T00:00:00`,
                endDate: `${dateRange.endDate}T23:59:59`,
                walletId: selectedPeriodWallet !== 'all' ? selectedPeriodWallet : null
            };
            const response = await reportService.getTransactionStatistics(params);
            if (response.data.success) {
                setPeriodData(response.data.data);
            }
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu theo khoảng thời gian:", error);
        } finally {
            setIsPeriodLoading(false);
        }
    };

    const fetchBudgetData = async () => {
        setIsBudgetLoading(true);
        try {
            const [year, month] = selectedMonth.split('-');
            const params = { year, month };
            const response = await reportService.getBudgetStatistics(params);
            if (response.data.success) {
                setBudgetData(response.data.data);
            }
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu ngân sách:", error);
        } finally {
            setIsBudgetLoading(false);
        }
    };

    useEffect(() => {
        fetchTodayData();
        fetchBudgetData();
    }, []);

    useEffect(() => {
        fetchTodayData();
    }, [selectedTodayWallet]);

    const transactions = periodData ? periodData.transactions.content : [];
    const todayTransactions = todayData ? todayData.transactions.content : [];
    const totalAmountPeriod = periodData ? periodData.totalAmount : 0;
    const totalAmountToday = todayData ? todayData.totalAmount : 0;

    return (
        <div className="p-4 md:p-8 space-y-8">
            <Tabs defaultValue="today-report" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="period-report">Theo Khoảng Thời Gian</TabsTrigger>
                    <TabsTrigger value="today-report">Hôm Nay</TabsTrigger>
                    <TabsTrigger value="budget-report">Ngân Sách</TabsTrigger>
                    <TabsTrigger value="email-settings">Báo Cáo Email</TabsTrigger>
                </TabsList>

                {/* Tab 1: Period Report */}
                <TabsContent value="period-report" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="w-5 h-5" />
                                Thống Kê Theo Khoảng Thời Gian
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <Label>Từ ngày</Label>
                                    <Input
                                        type="date"
                                        value={dateRange.startDate}
                                        onChange={(e) => setDateRange(prev => ({...prev, startDate: e.target.value}))}
                                    />
                                </div>
                                <div>
                                    <Label>Đến ngày</Label>
                                    <Input
                                        type="date"
                                        value={dateRange.endDate}
                                        onChange={(e) => setDateRange(prev => ({...prev, endDate: e.target.value}))}
                                    />
                                </div>
                                <div>
                                    <Label>Ví</Label>
                                    <Select value={selectedPeriodWallet} onValueChange={setSelectedPeriodWallet}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn ví" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Tất cả ví</SelectItem>
                                            {wallets.map(wallet => (
                                                <SelectItem key={wallet.id} value={wallet.id.toString()}>
                                                    {wallet.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <Button onClick={fetchPeriodData} disabled={isPeriodLoading}>
                                {isPeriodLoading ? <Loading/> : <><Filter className="w-4 h-4 mr-2" /> Lọc Dữ Liệu</>}
                            </Button>

                            {periodData && (
                                <Badge variant="secondary" className="ml-4">
                                    Tổng: {formatCurrency(totalAmountPeriod, 'VND', settings)}
                                </Badge>
                            )}

                            <div className="border rounded-lg">
                                <table className="w-full">
                                    <thead className="border-b bg-muted/50">
                                    <tr>
                                        <th className="p-3 text-left">STT</th>
                                        <th className="p-3 text-left">Ngày Thu Chi</th>
                                        <th className="p-3 text-left">Số Tiền</th>
                                        <th className="p-3 text-left">Ghi Chú</th>
                                        <th className="p-3 text-left">Ví</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {transactions.length > 0 ? (
                                        transactions.map((transaction, index) => (
                                            <tr key={transaction.id} className="border-b">
                                                <td className="p-3">{index + 1}</td>
                                                <td className="p-3">{format(new Date(transaction.date), 'dd/MM/yyyy')}</td>
                                                <td className={`p-3 font-medium ${transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                                                    {transaction.type === 'INCOME' ? '+' : '-'}
                                                    {formatCurrency(transaction.amount, 'VND', settings)}
                                                </td>
                                                <td className="p-3">{transaction.description}</td>
                                                <td className="p-3">{transaction.walletName}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="p-6 text-center text-muted-foreground">
                                                Không có dữ liệu
                                            </td>
                                        </tr>
                                    )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Tab 2: Today Report */}
                <TabsContent value="today-report" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="w-5 h-5" />
                                    Thống Kê Hôm Nay ({formatDate(new Date(), settings)})
                                </CardTitle>
                                <div className="flex items-center gap-4">
                                    <Select value={selectedTodayWallet} onValueChange={setSelectedTodayWallet}>
                                        <SelectTrigger className="w-48">
                                            <SelectValue placeholder="Chọn ví" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Tất cả ví</SelectItem>
                                            {wallets.map(wallet => (
                                                <SelectItem key={wallet.id} value={wallet.id.toString()}>
                                                    {wallet.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {todayData && (
                                        <Badge variant="secondary">
                                            Tổng: {formatCurrency(totalAmountToday, 'VND', settings)}
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="border rounded-lg">
                                <table className="w-full">
                                    <thead className="border-b bg-muted/50">
                                    <tr>
                                        <th className="p-3 text-left">STT</th>
                                        <th className="p-3 text-left">Số Tiền</th>
                                        <th className="p-3 text-left">Ghi Chú</th>
                                        <th className="p-3 text-left">Ví</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {isTodayLoading ? (
                                        <tr><td colSpan="4" className="p-6 text-center"><Loading/></td></tr>
                                    ) : todayTransactions.length > 0 ? (
                                        todayTransactions.map((transaction, index) => (
                                            <tr key={transaction.id} className="border-b">
                                                <td className="p-3">{index + 1}</td>
                                                <td className={`p-3 font-medium ${transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                                                    {transaction.type === 'INCOME' ? '+' : '-'}
                                                    {formatCurrency(transaction.amount, 'VND', settings)}
                                                </td>
                                                <td className="p-3">{transaction.description}</td>
                                                <td className="p-3">{transaction.walletName}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="p-6 text-center text-muted-foreground">
                                                Không có giao dịch nào hôm nay
                                            </td>
                                        </tr>
                                    )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Tab 3: Budget Report */}
                <TabsContent value="budget-report" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2">
                                    <PieChart className="w-5 h-5" />
                                    Thống Kê Ngân Sách Tháng
                                </CardTitle>
                                <div className='flex items-center gap-2'>
                                    <Input
                                        type="month"
                                        value={selectedMonth}
                                        onChange={(e) => setSelectedMonth(e.target.value)}
                                        className="mt-1"
                                    />
                                    <Button onClick={fetchBudgetData}>Xem</Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {isBudgetLoading ? <Loading/> : budgetData ? (
                                <>
                                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                        <Card>
                                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                                <CardTitle className="text-sm font-medium">Ngân sách</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="text-2xl font-bold">{formatCurrency(budgetData.totalBudget, 'VND', settings)}</div>
                                            </CardContent>
                                        </Card>
                                        <Card>
                                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                                <CardTitle className="text-sm font-medium">Đã thu</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="text-2xl font-bold text-green-500">{formatCurrency(budgetData.totalIncome, 'VND', settings)}</div>
                                            </CardContent>
                                        </Card>
                                        <Card>
                                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                                <CardTitle className="text-sm font-medium">Đã chi</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="text-2xl font-bold text-red-500">{formatCurrency(budgetData.totalExpense, 'VND', settings)}</div>
                                            </CardContent>
                                        </Card>
                                        <Card>
                                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                                <CardTitle className="text-sm font-medium">Còn lại</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="text-2xl font-bold">{formatCurrency(budgetData.remainingAmount, 'VND', settings)}</div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                    <h3 className="text-lg font-semibold mt-6 mb-2">Giao dịch trong tháng</h3>
                                    {/* Table for budget transactions can be added here if needed */}
                                </>
                            ) : (
                                <div className="p-6 text-center text-muted-foreground">
                                    Chưa có dữ liệu ngân sách cho tháng này
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Tab 4: Email Settings (Not implemented) */}
                <TabsContent value="email-settings">
                    {/* ... your email settings UI ... */}
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default Reports