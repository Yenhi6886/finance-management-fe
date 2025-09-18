import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs'
import { Badge } from '../../../components/ui/badge'
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

const Reports = () => {
    const { settings } = useSettings()
    const { wallets } = useWallet()
    
    // States for filters
    const [dateRange, setDateRange] = useState({
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0]
    })
    const [selectedWallet, setSelectedWallet] = useState('all')
    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)) // YYYY-MM
    const [selectedTodayWallet, setSelectedTodayWallet] = useState('all')
    
    // States for data
    const [loading, setLoading] = useState(false)
    const [transactions, setTransactions] = useState([])
    const [todayTransactions, setTodayTransactions] = useState([])
    const [monthlyBudgets, setMonthlyBudgets] = useState([])
    
    useEffect(() => {
        // TODO: Load real data from API
        setTransactions([])
        setTodayTransactions([])
        setMonthlyBudgets([])
    }, [])
    
    const handleEmailReport = (frequency) => {
        // TODO: Implement email report functionality
        console.log(`Setting up ${frequency} email report...`)
    }
    
    const getTotalAmount = (transactions) => {
        return transactions.reduce((sum, t) => sum + (t.type === 'INCOME' ? t.amount : -t.amount), 0)
    }
    
    const getIncomeTotal = (transactions) => {
        return transactions.filter(t => t.type === 'INCOME').reduce((sum, t) => sum + t.amount, 0)
    }
    
    const getExpenseTotal = (transactions) => {
        return transactions.filter(t => t.type === 'EXPENSE').reduce((sum, t) => sum + t.amount, 0)
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-green-600">Báo Cáo Tài Chính</h1>
                <p className="text-muted-foreground mt-1">
                    Tổng quan và phân tích chi tiết về tình hình tài chính của bạn.
                </p>
            </div>

            {/* Quick Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Tổng Thu</p>
                                <p className="text-2xl font-bold text-green-600">
                                    {formatCurrency(getIncomeTotal(transactions), 'VND', settings)}
                                </p>
                            </div>
                            <TrendingUp className="w-8 h-8 text-green-600" />
                        </div>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Tổng Chi</p>
                                <p className="text-2xl font-bold text-red-600">
                                    {formatCurrency(getExpenseTotal(transactions), 'VND', settings)}
                                </p>
                            </div>
                            <TrendingDown className="w-8 h-8 text-red-600" />
                        </div>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Số Dư</p>
                                <p className="text-2xl font-bold text-blue-600">
                                    {formatCurrency(getTotalAmount(transactions), 'VND', settings)}
                                </p>
                            </div>
                            <Wallet className="w-8 h-8 text-blue-600" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Tabs */}
            <Tabs defaultValue="period-report" className="space-y-6">
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
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="w-5 h-5" />
                                    Thống Kê Theo Khoảng Thời Gian
                                </CardTitle>
                                <div className="flex gap-2">
                                    <ExportDialog 
                                        data={transactions} 
                                        title="Báo Cáo Theo Khoảng Thời Gian"
                                        type="period"
                                    />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Date Range Filter */}
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
                                    <Select value={selectedWallet} onValueChange={setSelectedWallet}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn ví" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Tất cả ví</SelectItem>
                                            {wallets.map(wallet => (
                                                <SelectItem key={wallet.id} value={wallet.id}>
                                                    {wallet.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            
                            <Button onClick={() => setLoading(!loading)}>
                                <Filter className="w-4 h-4 mr-2" />
                                Lọc Dữ Liệu
                            </Button>

                            {/* Transactions Table */}
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
                                                    <td className="p-3">{formatDate(transaction.date, settings)}</td>
                                                    <td className="p-3">
                                                        <span className={transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}>
                                                            {transaction.type === 'INCOME' ? '+' : '-'}
                                                            {formatCurrency(transaction.amount, transaction.currency, settings)}
                                                        </span>
                                                    </td>
                                                    <td className="p-3">{transaction.description}</td>
                                                    <td className="p-3">{transaction.walletName}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="p-6 text-center text-muted-foreground">
                                                    Không có dữ liệu giao dịch trong khoảng thời gian này
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
                                    <div>
                                        <Label>Chọn ví</Label>
                                        <Select value={selectedTodayWallet} onValueChange={setSelectedTodayWallet}>
                                            <SelectTrigger className="w-48">
                                                <SelectValue placeholder="Chọn ví" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">Tất cả ví</SelectItem>
                                                {wallets.map(wallet => (
                                                    <SelectItem key={wallet.id} value={wallet.id}>
                                                        {wallet.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <Badge variant="secondary">
                                        Tổng: {formatCurrency(getTotalAmount(todayTransactions), 'VND', settings)}
                                    </Badge>
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
                                        {todayTransactions.length > 0 ? (
                                            todayTransactions.map((transaction, index) => (
                                                <tr key={transaction.id} className="border-b">
                                                    <td className="p-3">{index + 1}</td>
                                                    <td className="p-3">
                                                        <span className={transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}>
                                                            {transaction.type === 'INCOME' ? '+' : '-'}
                                                            {formatCurrency(transaction.amount, transaction.currency, settings)}
                                                        </span>
                                                    </td>
                                                    <td className="p-3">{transaction.description}</td>
                                                    <td className="p-3">{transaction.walletName}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="p-6 text-center text-muted-foreground">
                                                    Không có giao dịch nào trong ngày hôm nay
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
                                <div>
                                    <Label>Chọn tháng</Label>
                                    <Input 
                                        type="month" 
                                        value={selectedMonth}
                                        onChange={(e) => setSelectedMonth(e.target.value)}
                                        className="mt-1"
                                    />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {monthlyBudgets.length > 0 ? (
                                monthlyBudgets.map(budget => (
                                    <Card key={budget.id} className="p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="font-semibold">{budget.category}</h4>
                                            <Badge variant={budget.usedAmount > budget.budgetAmount ? "destructive" : "secondary"}>
                                                {Math.round((budget.usedAmount / budget.budgetAmount) * 100)}%
                                            </Badge>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span>Đã sử dụng: {formatCurrency(budget.usedAmount, budget.currency, settings)}</span>
                                                <span>Ngân sách: {formatCurrency(budget.budgetAmount, budget.currency, settings)}</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div 
                                                    className={`h-2 rounded-full ${
                                                        budget.usedAmount > budget.budgetAmount ? 'bg-red-600' : 'bg-green-600'
                                                    }`}
                                                    style={{ width: `${Math.min((budget.usedAmount / budget.budgetAmount) * 100, 100)}%` }}
                                                ></div>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                Còn lại: {formatCurrency(budget.budgetAmount - budget.usedAmount, budget.currency, settings)}
                                            </p>
                                        </div>
                                    </Card>
                                ))
                            ) : (
                                <div className="p-6 text-center text-muted-foreground">
                                    Chưa có dữ liệu ngân sách cho tháng này
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Tab 5: Email Settings */}
                <TabsContent value="email-settings" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Mail className="w-5 h-5" />
                                Cài Đặt Báo Cáo Email Tự Động
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-lg font-semibold">Cài Đặt Báo Cáo Email Tự Động</h3>
                                    <p className="text-sm text-muted-foreground">Nhận báo cáo định kỳ qua email</p>
                                </div>
                                <EmailSettingsDialog />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Card className="p-4">
                                    <h4 className="font-semibold mb-2">Báo Cáo Hàng Ngày</h4>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        Nhận báo cáo tổng quan thu chi mỗi ngày
                                    </p>
                                    <Button variant="outline" onClick={() => handleEmailReport('daily')}>
                                        Kích Hoạt
                                    </Button>
                                </Card>
                                
                                <Card className="p-4">
                                    <h4 className="font-semibold mb-2">Báo Cáo Hàng Tuần</h4>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        Nhận báo cáo tổng hợp mỗi tuần
                                    </p>
                                    <Button variant="outline" onClick={() => handleEmailReport('weekly')}>
                                        Kích Hoạt
                                    </Button>
                                </Card>
                                
                                <Card className="p-4">
                                    <h4 className="font-semibold mb-2">Báo Cáo Hàng Tháng</h4>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        Nhận báo cáo chi tiết mỗi tháng
                                    </p>
                                    <Button variant="outline" onClick={() => handleEmailReport('monthly')}>
                                        Kích Hoạt
                                    </Button>
                                </Card>
                            </div>
                            
                            <Card className="p-4">
                                <h4 className="font-semibold mb-4">Nội Dung Báo Cáo Email</h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <span>Tổng số tiền ban đầu trong kỳ</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                        <span>Tổng số tiền còn lại hiện tại</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                        <span>Danh sách chi tiết các giao dịch đã thực hiện</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                        <span>Phân tích xu hướng chi tiêu</span>
                                    </div>
                                </div>
                            </Card>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default Reports