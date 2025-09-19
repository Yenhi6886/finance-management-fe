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
    Filter,
    ChevronLeft,
    ChevronRight,
    PieChart
} from 'lucide-react'
import { useSettings } from '../../../shared/contexts/SettingsContext'
import { useWallet } from '../../../shared/hooks/useWallet'
import { formatCurrency, formatDate } from '../../../shared/utils/formattingUtils'
import { ExportDialog, EmailSettingsDialog } from '../components/ExportComponents'
import reportService from '../services/reportService'
import { LoadingSpinner as Loading } from '../../../components/Loading'
import emailService from '../services/emailService'
import { toast } from 'sonner'

const PAGE_SIZE = 10;

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



const Reports = () => {
    const { settings } = useSettings();
    const { wallets } = useWallet();

    // Email settings summary state
    const [emailSettings, setEmailSettings] = useState(null);
    const [isEmailLoading, setIsEmailLoading] = useState(false);

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
        return {
            startDate: start,
            endDate: end,
            walletIds
        };
    };

    const fetchTodayData = async (page = 0) => {
        setIsTodayLoading(true);
        try {
            let response;
            if (selectedTodayWallet === "all") {
                response = await reportService.getTodayTransactions(page, PAGE_SIZE);
            } else {
                response = await reportService.getTodayTransactionsByWallet(selectedTodayWallet, page, PAGE_SIZE);
            }

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
            let response;

            if (selectedPeriodWallet === 'all') {
                response = await reportService.getTransactionsByTime(startDate, endDate, page, PAGE_SIZE);
            } else {
                response = await reportService.getTransactionsByWalletIdandByTime(selectedPeriodWallet, startDate, endDate, page, PAGE_SIZE);
            }


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
    }

    const handleFilterBudget = () => {
        setBudgetPage(0);
        fetchBudgetData(0);
    }

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
                            <div className="flex items-center gap-2">
                                <Button onClick={handleFilterPeriod} disabled={isPeriodLoading}>
                                    {isPeriodLoading ? <Loading /> : <><Filter className="w-4 h-4 mr-2" /> Lọc Dữ Liệu</>}
                                </Button>
                                <ExportDialog title="Báo Cáo Theo Khoảng Thời Gian" buildReportRequest={buildReportRequest} />
                            </div>

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
                                    {isPeriodLoading ? (
                                        <tr><td colSpan="5" className="p-6 text-center"><Loading /></td></tr>
                                    ) : transactions.length > 0 ? (
                                        transactions.map((transaction, index) => (
                                            <tr key={transaction.id} className="border-b">
                                                <td className="p-3">{(periodPage * PAGE_SIZE) + index + 1}</td>
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
                            <PaginationControls
                                currentPage={periodPage}
                                totalPages={periodTotalPages}
                                onPageChange={fetchPeriodData}
                            />
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
                                        <tr><td colSpan="4" className="p-6 text-center"><Loading /></td></tr>
                                    ) : todayTransactions.length > 0 ? (
                                        todayTransactions.map((transaction, index) => (
                                            <tr key={transaction.id} className="border-b">
                                                <td className="p-3">{(todayPage * PAGE_SIZE) + index + 1}</td>
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
                            <PaginationControls
                                currentPage={todayPage}
                                totalPages={todayTotalPages}
                                onPageChange={fetchTodayData}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Tab 3: Budget Report */}
                <TabsContent value="budget-report" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <PieChart className="w-5 h-5" />
                                Thống Kê Ngân Sách Tháng
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className='flex items-center gap-2'>
                                <Input
                                    type="month"
                                    value={selectedMonth}
                                    onChange={(e) => setSelectedMonth(e.target.value)}
                                    className="mt-1"
                                />
                                <Button onClick={handleFilterBudget} disabled={isBudgetLoading}>
                                    {isBudgetLoading ? <Loading /> : 'Xem'}
                                </Button>
                                <EmailSettingsDialog />
                            </div>

                            {isBudgetLoading ? <Loading /> : budgetData ? (

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
                                            {isBudgetLoading ? (
                                                <tr><td colSpan="5" className="p-6 text-center"><Loading /></td></tr>
                                            ) : budgetTransactions.length > 0 ? (
                                                budgetTransactions.map((transaction, index) => (
                                                    <tr key={transaction.id} className="border-b">
                                                        <td className="p-3">{(budgetPage * PAGE_SIZE) + index + 1}</td>
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
                                    <PaginationControls
                                        currentPage={budgetPage}
                                        totalPages={budgetTotalPages}
                                        onPageChange={fetchBudgetData}
                                    />

                                </>
                            ) : (
                                <div className="p-6 text-center text-muted-foreground">
                                    Chưa có dữ liệu ngân sách cho tháng này
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Tab 4: Email Settings */}
                <TabsContent value="email-settings">
                    <Card>
                        <CardHeader>
                            <CardTitle>Cài Đặt Báo Cáo Email</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between mb-4">
                                <div className="text-sm text-muted-foreground">
                                    {isEmailLoading ? 'Đang tải cài đặt...' : (
                                        emailSettings ? (
                                            <>
                                                <div>Email nhận: <span className="font-medium">{emailSettings.targetEmail || '(mặc định: email tài khoản)'}</span></div>
                                                <div>Giờ gửi: {emailSettings.sendHour ?? 8}h{String(emailSettings.sendMinute ?? 0).padStart(2,'0')}</div>
                                            </>
                                        ) : 'Chưa có cài đặt'
                                    )}
                                </div>
                                <EmailSettingsDialog />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">Báo Cáo Hàng Ngày</CardTitle>
                                    </CardHeader>
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
                                    <CardHeader>
                                        <CardTitle className="text-base">Báo Cáo Hàng Tuần</CardTitle>
                                    </CardHeader>
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
                                    <CardHeader>
                                        <CardTitle className="text-base">Báo Cáo Hàng Tháng</CardTitle>
                                    </CardHeader>
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
                                    <CardHeader>
                                        <CardTitle className="text-base">Nội Dung Báo Cáo Email</CardTitle>
                                    </CardHeader>
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

export default Reports