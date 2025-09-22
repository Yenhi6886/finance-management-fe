import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card.jsx';
import { Button } from '../../../components/ui/button.jsx';
import { Input } from '../../../components/ui/input.jsx';
import { Label } from '../../../components/ui/label.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select.jsx';
import { Tabs, TabsContent } from '../../../components/ui/tabs.jsx';
import { Badge } from '../../../components/ui/badge.jsx';
import { FMDatePicker } from '../../../components/ui/fm-date-picker.jsx';
import { format } from 'date-fns';
import {
    Calendar,
    Filter,
    ChevronLeft,
    ChevronRight,
    PieChart,
    ArrowUpCircle,
    ArrowDownCircle,
} from 'lucide-react';
import { useSettings } from '../../../shared/contexts/SettingsContext.jsx';
import { useWallet } from '../../../shared/hooks/useWallet.js';
import { useAuth } from '../../auth/contexts/AuthContext.jsx';
import { formatCurrency } from '../../../shared/utils/formattingUtils.js';
import { useDateFormat } from '../../../shared/hooks/useDateFormat.js';
import { ExportDialog, EmailSettingsDialog } from '../components/ExportComponents.jsx';
import reportService from '../services/reportService.js';
import { LoadingSpinner as Loading } from '../../../components/Loading.jsx';
import emailService from '../services/emailService.js';
import { toast } from 'sonner';
import { cn } from '../../../lib/utils.js';
import { IconComponent } from '../../../shared/config/icons.js';

const PAGE_SIZE = 10;

// Helper function to format transaction description
const formatTransactionDescription = (transaction) => {
    // Check if it's a deposit transaction (INCOME type and description contains "Nạp tiền")
    if (transaction.type === 'INCOME' && transaction.description && transaction.description.includes('Nạp tiền')) {
        return `Nạp tiền vào ví ${transaction.walletName}`;
    }
    return transaction.description || (transaction.type === 'INCOME' ? 'Khoản thu' : 'Khoản chi');
};

const PaginationControls = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-end space-x-2 py-4">
            <span className="text-sm text-muted-foreground">
                Trang {currentPage + 1} / {totalPages}
            </span>
            <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 0}
            >
                <ChevronLeft className="h-4 w-4" />
                Trước
            </Button>
            <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages - 1}
            >
                Sau
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
    );
};

const SlidingTabsReports = ({ activeTab, onTabChange }) => {
    const tabOptions = [
        { value: 'period-report', label: 'Giao Dịch' },
        { value: 'today-report', label: 'Hôm Nay' },
        { value: 'budget-report', label: 'Ngân Sách' },
        { value: 'email-settings', label: 'Báo Cáo Email' }
    ];

    const getTranslateX = () => {
        const tabIndex = tabOptions.findIndex(tab => tab.value === activeTab);
        if (tabIndex === -1) return '0%';
        return `${tabIndex * 100}%`;
    };

    return (
        <div className="relative w-full p-1 flex items-center bg-muted rounded-lg">
            <div
                className="absolute top-1 left-1 h-[calc(100%-8px)] w-[calc(25%-4px)] bg-green-600 rounded-md transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(${getTranslateX()})` }}
            />
            {tabOptions.map((tab) => (
                <button
                    key={tab.value}
                    onClick={() => onTabChange(tab.value)}
                    className={cn(
                        'relative z-10 w-1/4 py-1.5 text-xs sm:text-sm font-semibold rounded-md transition-colors duration-300',
                        activeTab === tab.value ? 'text-white' : 'text-muted-foreground'
                    )}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
};

const TransactionMobileCard = ({ transaction, settings }) => {
    const isIncome = transaction.type === 'INCOME';
    const { formatDate } = useDateFormat();
    
    return (
        <div className="p-4 bg-card border rounded-lg flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 overflow-hidden">
                {isIncome ? (
                    <ArrowUpCircle className="w-8 h-8 text-green-500 flex-shrink-0" />
                ) : (
                    <ArrowDownCircle className="w-8 h-8 text-red-500 flex-shrink-0" />
                )}
                <div className="overflow-hidden">
                    <p className="font-semibold truncate">
                        {formatTransactionDescription(transaction)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        {transaction.walletName} • {formatDate(transaction.date)}
                    </p>
                </div>
            </div>
            <p className={cn(
                "text-base font-bold text-right flex-shrink-0",
                isIncome ? 'text-green-600' : 'text-red-600'
            )}>
                {isIncome ? '+' : '-'}{formatCurrency(transaction.amount, 'VND', settings)}
            </p>
        </div>
    );
};

const Reports = () => {
    const { settings } = useSettings();
    const { wallets } = useWallet();
    const { user } = useAuth();
    const { formatDate } = useDateFormat();
    const [activeTab, setActiveTab] = useState('today-report');

    const [emailSettings, setEmailSettings] = useState(null);
    const [isEmailLoading, setIsEmailLoading] = useState(false);

    const [dateRange, setDateRange] = useState({
        startDate: format(new Date(), 'yyyy-MM-dd'),
        endDate: format(new Date(), 'yyyy-MM-dd')
    });
    const [amountRange, setAmountRange] = useState({ minAmount: '', maxAmount: '' });
    const [selectedPeriodWallet, setSelectedPeriodWallet] = useState('all');
    const [selectedTodayWallet, setSelectedTodayWallet] = useState('all');
    const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));

    const [isPeriodLoading, setIsPeriodLoading] = useState(false);
    const [periodData, setPeriodData] = useState(null);
    const [periodPage, setPeriodPage] = useState(0);

    const [isTodayLoading, setIsTodayLoading] = useState(false);
    const [todayData, setTodayData] = useState(null);
    const [todayPage, setTodayPage] = useState(0);

    const [isBudgetLoading, setIsBudgetLoading] = useState(false);
    const [budgetData, setBudgetData] = useState(null);
    const [budgetPage, setBudgetPage] = useState(0);

    const loadEmailSettings = async () => {
        setIsEmailLoading(true);
        try {
            const res = await emailService.getSettings();
            setEmailSettings(res?.data || null);
        } catch (e) {
            console.warn('Không thể tải cài đặt email', e);
        } finally {
            setIsEmailLoading(false);
        }
    };

    const buildReportRequest = () => {
        const start = `${dateRange.startDate}T00:00:00`;
        const end = `${dateRange.endDate}T23:59:59`;
        const walletIds = selectedPeriodWallet === 'all' ? undefined : [Number(selectedPeriodWallet)];
        return { startDate: start, endDate: end, walletIds };
    };

    const fetchTodayData = async (page = 0) => {
        setIsTodayLoading(true);
        try {
            const response = selectedTodayWallet === "all"
                ? await reportService.getTodayTransactions(page, PAGE_SIZE)
                : await reportService.getTodayTransactionsByWallet(selectedTodayWallet, page, PAGE_SIZE);

            if (response.data.success) {
                setTodayData(response.data.data);
                setTodayPage(page);
            }
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu hôm nay:", error);
        } finally {
            setIsTodayLoading(false);
        }
    };

    const fetchPeriodData = async (page = 0) => {
        setIsPeriodLoading(true);
        try {
            const startDate = `${dateRange.startDate}T00:00:00`;
            const endDate = `${dateRange.endDate}T23:59:59`;
            const minAmount = amountRange.minAmount && amountRange.minAmount.trim() !== '' ? amountRange.minAmount : null;
            const maxAmount = amountRange.maxAmount && amountRange.maxAmount.trim() !== '' ? amountRange.maxAmount : null;
            
            console.log('Fetching with filters:', { startDate, endDate, minAmount, maxAmount, selectedPeriodWallet });
            
            const response = selectedPeriodWallet === 'all'
                ? await reportService.getTransactionsByTime(startDate, endDate, page, PAGE_SIZE, minAmount, maxAmount)
                : await reportService.getTransactionsByWalletIdandByTime(selectedPeriodWallet, startDate, endDate, page, PAGE_SIZE, minAmount, maxAmount);

            if (response.data.success) {
                setPeriodData(response.data.data);
                setPeriodPage(page);
            }
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu theo khoảng thời gian:", error);
        } finally {
            setIsPeriodLoading(false);
        }
    };

    const fetchBudgetData = async (page = 0) => {
        setIsBudgetLoading(true);
        try {
            const [year, month] = selectedMonth.split('-');
            const monthNumber = parseInt(month, 10);
            const response = await reportService.getBudgetStatistics(year, monthNumber, page, PAGE_SIZE);
            if (response.data.success) {
                setBudgetData(response.data.data);
                setBudgetPage(page);
            }
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu ngân sách:", error);
        } finally {
            setIsBudgetLoading(false);
        }
    };

    const handleFilterPeriod = () => {
        setPeriodPage(0);
        fetchPeriodData(0);
    };

    const handleClearFilters = () => {
        setAmountRange({ minAmount: '', maxAmount: '' });
        setDateRange({
            startDate: format(new Date(), 'yyyy-MM-dd'),
            endDate: format(new Date(), 'yyyy-MM-dd')
        });
        setSelectedPeriodWallet('all');
        setPeriodPage(0);
        fetchPeriodData(0);
    };

    const handleFilterBudget = () => {
        setBudgetPage(0);
        fetchBudgetData(0);
    };

    useEffect(() => {
        fetchTodayData(0);
        fetchBudgetData(0);
        loadEmailSettings();
    }, []);

    useEffect(() => {
        setTodayPage(0);
        fetchTodayData(0);
    }, [selectedTodayWallet]);

    const transactions = periodData?.transactions?.content || [];
    const periodTotalPages = periodData?.transactions?.totalPages || 1;
    const todayTransactions = todayData?.transactions?.content || [];
    const todayTotalPages = todayData?.transactions?.totalPages || 1;
    const totalAmountPeriod = periodData?.totalAmount || 0;
    const totalAmountToday = todayData?.totalAmount || 0;
    const budgetTransactions = budgetData?.transactions?.content || [];
    const budgetTotalPages = budgetData?.transactions?.totalPages || 1;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-green-600">
                    Báo Cáo & Thống Kê
                </h1>
                <p className="text-muted-foreground mt-1">
                    Phân tích chi tiêu và theo dõi tình hình tài chính của bạn
                </p>
            </div>

            <SlidingTabsReports activeTab={activeTab} onTabChange={setActiveTab} />

            <Tabs defaultValue="today-report" value={activeTab} className="space-y-6">
                <TabsContent value="period-report" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Filter className="w-5 h-5" />
                                Lọc Giao Dịch
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <Label>Từ ngày</Label>
                                    <FMDatePicker
                                        value={dateRange.startDate ? new Date(dateRange.startDate) : null}
                                        onChange={(selectedDate) => {
                                            if (selectedDate) {
                                                setDateRange(prev => ({ ...prev, startDate: format(selectedDate, 'yyyy-MM-dd') }));
                                            }
                                        }}
                                        placeholder="Chọn từ ngày"
                                    />
                                </div>
                                <div>
                                    <Label>Đến ngày</Label>
                                    <FMDatePicker
                                        value={dateRange.endDate ? new Date(dateRange.endDate) : null}
                                        onChange={(selectedDate) => {
                                            if (selectedDate) {
                                                setDateRange(prev => ({ ...prev, endDate: format(selectedDate, 'yyyy-MM-dd') }));
                                            }
                                        }}
                                        placeholder="Chọn đến ngày"
                                    />
                                </div>
                                <div>
                                    <Label>Ví</Label>
                                    <Select value={selectedPeriodWallet} onValueChange={setSelectedPeriodWallet}>
                                        <SelectTrigger><SelectValue placeholder="Chọn ví" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Tất cả ví</SelectItem>
                                            {wallets.map(wallet => (
                                                <SelectItem key={wallet.id} value={wallet.id.toString()}>
                                                    <div className="flex items-center gap-2">
                                                        <IconComponent name={wallet.icon} className="h-4 w-4" />
                                                        <span>{wallet.name}</span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <Label>Từ số tiền</Label>
                                    <Input
                                        type="number"
                                        placeholder="0"
                                        value={amountRange.minAmount}
                                        onChange={(e) => setAmountRange(prev => ({ ...prev, minAmount: e.target.value }))}
                                    />
                                </div>
                                <div>
                                    <Label>Đến số tiền</Label>
                                    <Input
                                        type="number"
                                        placeholder="Không giới hạn"
                                        value={amountRange.maxAmount}
                                        onChange={(e) => setAmountRange(prev => ({ ...prev, maxAmount: e.target.value }))}
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button size="sm" onClick={handleFilterPeriod} disabled={isPeriodLoading}>
                                    {isPeriodLoading ? <Loading /> : <><Filter className="w-4 h-4 mr-2" /> Lọc Dữ Liệu</>}
                                </Button>
                                <Button size="sm" variant="outline" onClick={handleClearFilters}>
                                    Xóa Bộ Lọc
                                </Button>
                                <ExportDialog title="Báo Cáo Giao Dịch" buildReportRequest={buildReportRequest} />
                            </div>
                            {periodData && (
                                <div className="flex items-center gap-2">
                                    <Badge variant="secondary">Tổng: {formatCurrency(totalAmountPeriod, 'VND', settings)}</Badge>
                                    {(amountRange.minAmount || amountRange.maxAmount) && (
                                        <Badge variant="outline" className="text-blue-600 border-blue-600">
                                            Đã lọc theo số tiền: {amountRange.minAmount ? `${formatCurrency(amountRange.minAmount, 'VND', settings)}` : '0'} - {amountRange.maxAmount ? formatCurrency(amountRange.maxAmount, 'VND', settings) : '∞'}
                                        </Badge>
                                    )}
                                </div>
                            )}

                            <div className="hidden lg:block border rounded-lg">
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
                                    {isPeriodLoading ? (
                                        <tr><td colSpan="5" className="p-6 text-center"><Loading /></td></tr>
                                    ) : transactions.length > 0 ? (
                                        transactions.map((transaction, index) => (
                                            <tr key={transaction.id} className="border-b">
                                                <td className="p-3">{(periodPage * PAGE_SIZE) + index + 1}</td>
                                                <td className="p-3">{formatDate(transaction.date)}</td>
                                                <td className={`p-3 font-medium ${transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                                                    {transaction.type === 'INCOME' ? '+' : '-'}{formatCurrency(transaction.amount, 'VND', settings)}
                                                </td>
                                                <td className="p-3">{formatTransactionDescription(transaction)}</td>
                                                <td className="p-3">{transaction.walletName}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan="5" className="p-6 text-center text-muted-foreground">Không có dữ liệu</td></tr>
                                    )}
                                    </tbody>
                                </table>
                            </div>
                            <div className="space-y-3 lg:hidden">
                                {isPeriodLoading ? (
                                    <div className="p-6 text-center"><Loading /></div>
                                ) : transactions.length > 0 ? (
                                    transactions.map((tx) => <TransactionMobileCard key={tx.id} transaction={tx} settings={settings} />)
                                ) : (
                                    <p className="p-6 text-center text-muted-foreground">Không có dữ liệu</p>
                                )}
                            </div>
                            <PaginationControls currentPage={periodPage} totalPages={periodTotalPages} onPageChange={fetchPeriodData} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="today-report" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="w-5 h-5" />
                                    Thống Kê Hôm Nay ({formatDate(new Date(), settings)})
                                </CardTitle>
                                <div className="flex w-full sm:w-auto items-center gap-4">
                                    <Select value={selectedTodayWallet} onValueChange={setSelectedTodayWallet}>
                                        <SelectTrigger className="flex-1 sm:w-48"><SelectValue placeholder="Chọn ví" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Tất cả ví</SelectItem>
                                            {wallets.map(wallet => (
                                                <SelectItem key={wallet.id} value={wallet.id.toString()}>
                                                    <div className="flex items-center gap-2">
                                                        <IconComponent name={wallet.icon} className="h-4 w-4" />
                                                        <span>{wallet.name}</span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {todayData && (
                                        <Badge variant="secondary" className="text-base font-semibold">
                                            Tổng: {formatCurrency(totalAmountToday, 'VND', settings)}
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="hidden lg:block border rounded-lg">
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
                                        <tr><td colSpan="4" className="p-6 text-center"><Loading /></td></tr>
                                    ) : todayTransactions.length > 0 ? (
                                        todayTransactions.map((transaction, index) => (
                                            <tr key={transaction.id} className="border-b">
                                                <td className="p-3">{(todayPage * PAGE_SIZE) + index + 1}</td>
                                                <td className={`p-3 font-medium ${transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                                                    {transaction.type === 'INCOME' ? '+' : '-'}{formatCurrency(transaction.amount, 'VND', settings)}
                                                </td>
                                                <td className="p-3">{formatTransactionDescription(transaction)}</td>
                                                <td className="p-3">{transaction.walletName}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan="4" className="p-6 text-center text-muted-foreground">Không có giao dịch nào hôm nay</td></tr>
                                    )}
                                    </tbody>
                                </table>
                            </div>
                            <div className="space-y-3 lg:hidden">
                                {isTodayLoading ? (
                                    <div className="p-6 text-center"><Loading /></div>
                                ) : todayTransactions.length > 0 ? (
                                    todayTransactions.map((tx) => <TransactionMobileCard key={tx.id} transaction={tx} settings={settings} />)
                                ) : (
                                    <p className="p-6 text-center text-muted-foreground">Không có giao dịch nào hôm nay</p>
                                )}
                            </div>
                            <PaginationControls currentPage={todayPage} totalPages={todayTotalPages} onPageChange={fetchTodayData} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="budget-report" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <PieChart className="w-5 h-5" />
                                Thống Kê Ngân Sách Tháng
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-2'>
                                <FMDatePicker
                                    value={selectedMonth ? new Date(selectedMonth + '-01') : null}
                                    onChange={(selectedDate) => {
                                        if (selectedDate) {
                                            setSelectedMonth(format(selectedDate, 'yyyy-MM'));
                                        }
                                    }}
                                    placeholder="Chọn tháng"
                                    showMonthYearPicker
                                    dateFormat="MM/yyyy"
                                    className="mt-1"
                                    theme="green"
                                />
                                <Button size="sm" onClick={handleFilterBudget} disabled={isBudgetLoading}>
                                    {isBudgetLoading ? <Loading /> : 'Xem'}
                                </Button>
                                <EmailSettingsDialog />
                            </div>

                            {isBudgetLoading ? (
                                <Loading />
                            ) : budgetData ? (
                                <>
                                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                        <Card>
                                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                                <CardTitle className="text-sm font-medium">Ngân sách</CardTitle>
                                            </CardHeader>
                                            <CardContent><div className="text-2xl font-bold">{formatCurrency(budgetData.totalBudget, 'VND', settings)}</div></CardContent>
                                        </Card>
                                        <Card>
                                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                                <CardTitle className="text-sm font-medium">Đã thu</CardTitle>
                                            </CardHeader>
                                            <CardContent><div className="text-2xl font-bold text-green-500">{formatCurrency(budgetData.totalIncome, 'VND', settings)}</div></CardContent>
                                        </Card>
                                        <Card>
                                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                                <CardTitle className="text-sm font-medium">Đã chi</CardTitle>
                                            </CardHeader>
                                            <CardContent><div className="text-2xl font-bold text-red-500">{formatCurrency(budgetData.totalExpense, 'VND', settings)}</div></CardContent>
                                        </Card>
                                        <Card>
                                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                                <CardTitle className="text-sm font-medium">Còn lại</CardTitle>
                                            </CardHeader>
                                            <CardContent><div className="text-2xl font-bold">{formatCurrency(budgetData.remainingAmount, 'VND', settings)}</div></CardContent>
                                        </Card>
                                    </div>

                                    <div className="hidden lg:block border rounded-lg">
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
                                            {isBudgetLoading ? (
                                                <tr><td colSpan="5" className="p-6 text-center"><Loading /></td></tr>
                                            ) : budgetTransactions.length > 0 ? (
                                                budgetTransactions.map((transaction, index) => (
                                                    <tr key={transaction.id} className="border-b">
                                                        <td className="p-3">{(budgetPage * PAGE_SIZE) + index + 1}</td>
                                                        <td className="p-3">{formatDate(transaction.date)}</td>
                                                        <td className={`p-3 font-medium ${transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                                                            {transaction.type === 'INCOME' ? '+' : '-'}{formatCurrency(transaction.amount, 'VND', settings)}
                                                        </td>
                                                        <td className="p-3">{formatTransactionDescription(transaction)}</td>
                                                        <td className="p-3">{transaction.walletName}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr><td colSpan="5" className="p-6 text-center text-muted-foreground">Không có dữ liệu</td></tr>
                                            )}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="space-y-3 lg:hidden">
                                        {isBudgetLoading ? (
                                            <div className="p-6 text-center"><Loading /></div>
                                        ) : budgetTransactions.length > 0 ? (
                                            budgetTransactions.map((tx) => <TransactionMobileCard key={tx.id} transaction={tx} settings={settings} />)
                                        ) : (
                                            <p className="p-6 text-center text-muted-foreground">Không có dữ liệu</p>
                                        )}
                                    </div>
                                    <PaginationControls currentPage={budgetPage} totalPages={budgetTotalPages} onPageChange={fetchBudgetData} />
                                </>
                            ) : (
                                <div className="p-6 text-center text-muted-foreground">Chưa có dữ liệu ngân sách cho tháng này</div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="email-settings">
                    <Card>
                        <CardHeader><CardTitle>Cài Đặt Báo Cáo Email</CardTitle></CardHeader>
                        <CardContent>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                                <div className="text-sm text-muted-foreground">
                                    {isEmailLoading ? 'Đang tải cài đặt...' : (emailSettings ? (
                                        <>
                                            <div>Email nhận: <span className="font-medium">{emailSettings.targetEmail || user?.email || 'Chưa cài đặt'}</span></div>
                                            <div>Giờ gửi: {emailSettings.sendHour ?? 8}h{String(emailSettings.sendMinute ?? 0).padStart(2, '0')}</div>
                                        </>
                                    ) : (
                                        <>
                                            <div>Email nhận: <span className="font-medium">{user?.email || 'Chưa cài đặt'}</span></div>
                                            <div>Giờ gửi: 8h00 (mặc định)</div>
                                        </>
                                    ))}
                                </div>
                                <EmailSettingsDialog />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Card>
                                    <CardHeader><CardTitle className="text-base">Báo Cáo Hàng Ngày</CardTitle></CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground mb-3">Nhận báo cáo tổng quan thu chi mỗi ngày</p>
                                        <Button
                                            variant={emailSettings?.dailyEnabled ? 'secondary' : 'default'}
                                            onClick={async () => {
                                                const next = { ...(emailSettings || {}), dailyEnabled: !(emailSettings?.dailyEnabled) };
                                                try {
                                                    await emailService.saveSettings(next);
                                                    setEmailSettings(next);
                                                    toast.success(next.dailyEnabled ? 'Đã kích hoạt báo cáo hàng ngày' : 'Đã tắt báo cáo hàng ngày');
                                                } catch (e) {
                                                    toast.error('Không thể lưu cài đặt');
                                                }
                                            }}
                                        >
                                            {emailSettings?.dailyEnabled ? 'Tắt' : 'Kích Hoạt'}
                                        </Button>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader><CardTitle className="text-base">Báo Cáo Hàng Tuần</CardTitle></CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground mb-3">Nhận báo cáo tổng hợp mỗi tuần</p>
                                        <Button
                                            variant={emailSettings?.weeklyEnabled ? 'secondary' : 'default'}
                                            onClick={async () => {
                                                const next = { ...(emailSettings || {}), weeklyEnabled: !(emailSettings?.weeklyEnabled) };
                                                try {
                                                    await emailService.saveSettings(next);
                                                    setEmailSettings(next);
                                                    toast.success(next.weeklyEnabled ? 'Đã kích hoạt báo cáo hàng tuần' : 'Đã tắt báo cáo hàng tuần');
                                                } catch (e) {
                                                    toast.error('Không thể lưu cài đặt');
                                                }
                                            }}
                                        >
                                            {emailSettings?.weeklyEnabled ? 'Tắt' : 'Kích Hoạt'}
                                        </Button>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader><CardTitle className="text-base">Báo Cáo Hàng Tháng</CardTitle></CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground mb-3">Nhận báo cáo chi tiết mỗi tháng</p>
                                        <Button
                                            variant={emailSettings?.monthlyEnabled ? 'secondary' : 'default'}
                                            onClick={async () => {
                                                const next = { ...(emailSettings || {}), monthlyEnabled: !(emailSettings?.monthlyEnabled) };
                                                try {
                                                    await emailService.saveSettings(next);
                                                    setEmailSettings(next);
                                                    toast.success(next.monthlyEnabled ? 'Đã kích hoạt báo cáo hàng tháng' : 'Đã tắt báo cáo hàng tháng');
                                                } catch (e) {
                                                    toast.error('Không thể lưu cài đặt');
                                                }
                                            }}
                                        >
                                            {emailSettings?.monthlyEnabled ? 'Tắt' : 'Kích Hoạt'}
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                            <div className="mt-6">
                                <Card>
                                    <CardHeader><CardTitle className="text-base">Nội Dung Báo Cáo Email</CardTitle></CardHeader>
                                    <CardContent>
                                        <ul className="text-sm list-disc pl-5 space-y-2 text-muted-foreground">
                                            <li>Tổng số tiền ban đầu trong kỳ</li>
                                            <li>Tổng số tiền còn lại hiện tại</li>
                                            <li>Danh sách chi tiết các giao dịch đã thực hiện</li>
                                            <li>Phân tích xu hướng chi tiêu</li>
                                        </ul>
                                    </CardContent>
                                </Card>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default Reports;