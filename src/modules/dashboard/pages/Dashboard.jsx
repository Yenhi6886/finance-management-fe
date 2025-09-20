import React, { useState, useEffect, useContext, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card'
import { AreaChart, BarChart } from '../../../components/charts/ChartComponents'
import { LoadingScreen } from '../../../components/Loading.jsx'
import { dashboardService } from '../services/dashboardService.js'
import { WalletContext } from '../../../shared/contexts/WalletContext'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select"
import { IconComponent } from '../../../shared/config/icons.js'
import {
  TrendingUpIcon,
  DollarSignIcon,
  CreditCardIcon,
  PiggyBankIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ActivityIcon,
  WalletIcon,
  BarChart3Icon,
  FolderPlusIcon,
  ListIcon,
  AlertCircle,
  AppWindow,
} from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "../../../components/ui/alert"

const Dashboard = () => {
  const navigate = useNavigate();
  const { wallets, loading: walletLoading } = useContext(WalletContext);

  const [selectedWalletId, setSelectedWalletId] = useState('all');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const abortController = useRef(null);

  useEffect(() => {
    if (walletLoading) {
      return;
    }

    if (abortController.current) {
      abortController.current.abort();
    }

    abortController.current = new AbortController();
    const controller = abortController.current;

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        const walletIdForApi = selectedWalletId === 'all' ? null : parseInt(selectedWalletId, 10);

        const response = await dashboardService.getDashboardSummary(walletIdForApi, controller.signal);

        if (!controller.signal.aborted) {
          setDashboardData(response.data.data);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          if (err.name !== 'CanceledError' && err.name !== 'AbortError') {
            setError("Không thể tải dữ liệu dashboard. Vui lòng thử lại sau.");
            console.error('Error fetching dashboard data:', err);
          }
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchDashboardData();

    return () => {
      if (controller) {
        controller.abort();
      }
    };
  }, [selectedWalletId, walletLoading]);

  const formatCurrencyShort = (amount) => {
    if (typeof amount !== 'number') return '0 ₫';
    if (amount >= 1000000000) return `${(amount / 1000000000).toFixed(1)}B ₫`;
    if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M ₫`;
    if (amount >= 1000) return `${(amount / 1000).toFixed(0)}K ₫`;
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    }).format(date);
  };

  const formatDateShort = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit', month: '2-digit'
    }).format(date);
  };

  if (loading || walletLoading) return <LoadingScreen message="Đang tải dữ liệu dashboard..." />;

  if (error) {
    return (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Lỗi</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
    );
  }

  const handleAddWallet = () => navigate('/wallets/add');
  const handleAddCategory = () => navigate('/transactions?tab=categories&action=add');
  const handleViewWalletList = () => navigate('/wallets');

  const summary = dashboardData?.summary || {};
  const recentTransactions = dashboardData?.recentTransactions || [];
  const spendingByCategory = dashboardData?.spendingByCategory || [];
  const topSpendingCategories = dashboardData?.topSpendingCategories || [];
  const totalSpending = spendingByCategory.reduce((sum, item) => sum + item.totalAmount, 0);

  const stats = [
    { title: 'Tổng Số Dư', value: formatCurrencyShort(summary.totalBalanceVND), icon: DollarSignIcon, color: 'text-blue-600', bgColor: 'bg-blue-100 dark:bg-blue-900/50' },
    { title: 'Thu Nhập Tháng', value: formatCurrencyShort(summary.monthlyIncome), icon: TrendingUpIcon, color: 'text-green-600', bgColor: 'bg-green-100 dark:bg-green-900/50' },
    { title: 'Chi Tiêu Tháng', value: formatCurrencyShort(summary.monthlyExpense), icon: CreditCardIcon, color: 'text-red-600', bgColor: 'bg-red-100 dark:bg-red-900/50' },
    { title: 'Tổng số ví', value: summary.totalWallets, icon: PiggyBankIcon, color: 'text-purple-600', bgColor: 'bg-purple-100 dark:bg-purple-900/50' },
    { title: 'Tăng Trưởng Tháng', value: `${(summary.monthlyGrowth || 0).toFixed(2)}%`, icon: ActivityIcon, color: 'text-cyan-600', bgColor: 'bg-cyan-100 dark:bg-cyan-900/50' },
    { title: 'Tổng Giao Dịch Tháng', value: summary.totalTransactions, icon: WalletIcon, color: 'text-orange-600', bgColor: 'bg-orange-100 dark:bg-orange-900/50' },
  ];

  const incomeExpenseChartData = {
    labels: dashboardData?.incomeExpenseTrend.map(d => d.month) || [],
    datasets: [
      { label: 'Thu Nhập', data: dashboardData?.incomeExpenseTrend.map(d => d.income) || [], borderColor: 'rgb(34, 197, 94)', backgroundColor: 'rgba(34, 197, 94, 0.1)', borderWidth: 3, fill: true, tension: 0.4 },
      { label: 'Chi Tiêu', data: dashboardData?.incomeExpenseTrend.map(d => d.expense) || [], borderColor: 'rgb(239, 68, 68)', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderWidth: 3, fill: true, tension: 0.4 }
    ]
  };

  const weeklySpendingChartData = {
    labels: dashboardData?.weeklySpending.map(d => d.label) || [],
    datasets: [{ label: 'Chi Tiêu Hàng Ngày', data: dashboardData?.weeklySpending.map(d => d.value) || [], backgroundColor: 'rgba(34, 197, 94, 0.7)', borderWidth: 0, borderRadius: 4, borderSkipped: false }]
  };

  return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Tổng quan tài chính của bạn - Cập nhật {new Date().toLocaleDateString('vi-VN')}</p>
          </div>
          <div className="mt-3 sm:mt-0">
            <Select value={selectedWalletId} onValueChange={setSelectedWalletId}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Chọn ví để xem" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  Tất cả các ví
                </SelectItem>
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

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const isPositive = stat.title === 'Tăng Trưởng Tháng' && (summary.monthlyGrowth || 0) >= 0;
            const isNegative = stat.title === 'Tăng Trưởng Tháng' && (summary.monthlyGrowth || 0) < 0;
            return (
                <Card key={index} className="relative overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group min-w-0">
                  <CardContent className="p-3 md:p-4">
                    <div className="text-center space-y-2">
                      <div className={`p-2 rounded-lg ${stat.bgColor} mx-auto w-fit group-hover:scale-110 transition-transform duration-300`}><Icon className={`w-4 h-4 md:w-5 md:h-5 ${stat.color}`} /></div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400 leading-tight overflow-hidden min-h-[2.4em]" style={{ display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', lineHeight: '1.2' }}>{stat.title}</p>
                      <p className="text-base md:text-xl font-bold text-gray-900 dark:text-white leading-tight break-words min-h-[1.2em]">{stat.value}</p>
                    <div className="flex items-center justify-center space-x-1 min-h-[1em]">
                        {isPositive && <ArrowUpIcon className="w-3 h-3 text-green-600 flex-shrink-0" />}
                        {isNegative && <ArrowDownIcon className="w-3 h-3 text-red-600 flex-shrink-0" />}
                      </div>
                    </div>
                  </CardContent>
                </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div>
                <CardTitle className="flex items-center space-x-2"><BarChart3Icon className="w-5 h-5 text-blue-600" /><span>Thu Nhập vs Chi Tiêu</span></CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Xu hướng tài chính 9 tháng gần nhất</p>
              </div>
            </CardHeader>
            <CardContent><div className="h-64"><AreaChart data={incomeExpenseChartData} /></div></CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-4"><CardTitle className="flex items-center space-x-2"><ActivityIcon className="w-5 h-5 text-orange-600" /><span>Chi Tiêu Theo Tuần</span></CardTitle><p className="text-sm text-gray-600 dark:text-gray-400">Thói quen chi tiêu hàng ngày</p></CardHeader>
            <CardContent><div className="h-48"><BarChart data={weeklySpendingChartData} /></div></CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-4"><CardTitle>Danh Mục Chi Tiêu Hàng Đầu</CardTitle><p className="text-sm text-gray-600 dark:text-gray-400">Các khoản chi lớn nhất tháng này</p></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topSpendingCategories.length > 0 ? topSpendingCategories.map((category, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 ${ index === 0 ? 'bg-amber-400' : index === 1 ? 'bg-slate-400' : 'bg-amber-700'} rounded-lg flex items-center justify-center text-white font-bold text-sm`}>{index + 1}</div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">{category.categoryName}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{formatCurrencyShort(category.totalAmount)}</p>
                        </div>
                      </div>
                    </div>
                )) : (<p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">Không có chi tiêu nào.</p>)}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-4"><CardTitle>Hành Động Nhanh</CardTitle><p className="text-sm text-gray-600 dark:text-gray-400">Các thao tác thường dùng</p></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button onClick={handleAddWallet} className="p-4 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-400 hover:bg-blue-50 dark:hover:border-blue-600 dark:hover:bg-blue-900/50 transition-all duration-300 group">
                <div className="flex flex-col items-center space-y-2"><div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-full group-hover:scale-110 transition-transform"><WalletIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" /></div><div className="text-center"><p className="font-semibold text-gray-900 dark:text-white">Thêm Ví</p><p className="text-sm text-gray-600 dark:text-gray-400">Tạo ví mới để quản lý</p></div></div>
              </button>
              <button onClick={handleAddCategory} className="p-4 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl hover:border-purple-400 hover:bg-purple-50 dark:hover:border-purple-600 dark:hover:bg-purple-900/50 transition-all duration-300 group">
                <div className="flex flex-col items-center space-y-2"><div className="p-3 bg-purple-100 dark:bg-purple-900/50 rounded-full group-hover:scale-110 transition-transform"><FolderPlusIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" /></div><div className="text-center"><p className="font-semibold text-gray-900 dark:text-white">Thêm Danh Mục Thu Chi</p><p className="text-sm text-gray-600 dark:text-gray-400">Thêm, sửa, xóa danh mục</p></div></div>
              </button>
              <button onClick={handleViewWalletList} className="p-4 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl hover:border-green-400 hover:bg-green-50 dark:hover:border-green-600 dark:hover:bg-green-900/50 transition-all duration-300 group">
                <div className="flex flex-col items-center space-y-2"><div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-full group-hover:scale-110 transition-transform"><ListIcon className="w-6 h-6 text-green-600 dark:text-green-400" /></div><div className="text-center"><p className="font-semibold text-gray-900 dark:text-white">Xem Danh Sách Ví</p><p className="text-sm text-gray-600 dark:text-gray-400">Quản lý tất cả ví</p></div></div>
              </button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div><CardTitle>Giao Dịch Gần Đây</CardTitle><p className="text-sm text-gray-600 dark:text-gray-400 mt-1">5 giao dịch mới nhất</p></div>
              <button className="text-primary hover:text-primary/80 text-sm font-medium">Xem tất cả</button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentTransactions.length > 0 ? recentTransactions.map((t) => (
                    <div key={t.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                      <div className="flex items-center space-x-3 overflow-hidden">
                        <div className={`p-2 rounded-full flex-shrink-0 ${t.type === 'INCOME' ? 'bg-green-100 dark:bg-green-900/50' : 'bg-red-100 dark:bg-red-900/50'}`}>{t.type === 'INCOME' ? <ArrowUpIcon className="w-4 h-4 text-green-600 dark:text-green-400" /> : <ArrowDownIcon className="w-4 h-4 text-red-600 dark:text-red-400" />}</div>
                        <div className="overflow-hidden">
                          <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{t.description}</p>
                          <div className="hidden sm:flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-400">
                            <span>{t.category}</span><span>•</span><span>{t.walletName}</span><span>•</span><span>{formatDate(t.date)}</span>
                          </div>
                          <div className="flex sm:hidden items-center space-x-2 text-xs text-gray-600 dark:text-gray-400">
                            <span>{t.category}</span><span>•</span><span>{formatDateShort(t.date)}</span>
                          </div>
                        </div>
                      </div>
                      <p className={`font-bold text-sm flex-shrink-0 ml-2 ${t.type === 'INCOME' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>{t.type === 'INCOME' ? '+' : '-'}{formatCurrencyShort(t.amount)}</p>
                    </div>
                )) : (<p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">Không có giao dịch nào gần đây.</p>)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-4"><CardTitle>Chi Tiêu Theo Danh Mục</CardTitle><p className="text-sm text-gray-600 dark:text-gray-400">Phân tích chi tiêu tháng này</p></CardHeader>
            <CardContent>
              <div className="space-y-4">
                {spendingByCategory.length > 0 ? spendingByCategory.map((category, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3"><div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }}></div><span className="font-medium text-gray-900 dark:text-white">{category.categoryName}</span></div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900 dark:text-white text-sm">{formatCurrencyShort(category.totalAmount)}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">{totalSpending > 0 ? ((category.totalAmount / totalSpending) * 100).toFixed(1) : 0}%</p>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2"><div className="h-2 rounded-full transition-all duration-500 ease-out" style={{ width: `${totalSpending > 0 ? (category.totalAmount / totalSpending) * 100 : 0}%`, backgroundColor: category.color }}></div></div>
                    </div>
                )) : (<p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">Không có chi tiêu nào trong tháng này.</p>)}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
  );
};

export default Dashboard;