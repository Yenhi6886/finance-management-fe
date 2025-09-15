import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card'
import { LineChart, BarChart, DoughnutChart, AreaChart } from '../../../components/charts/ChartComponents'
import { LoadingScreen } from '../../../components/Loading.jsx'
import { dashboardService } from '../services/dashboardService.js'
import {
  TrendingUpIcon,
  DollarSignIcon,
  CreditCardIcon,
  PiggyBankIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  TargetIcon,
  ActivityIcon,
  WalletIcon,
  BarChart3Icon,
  PieChartIcon,
  SettingsIcon,
} from 'lucide-react'

const emptyChartData = {
  labels: [],
  datasets: [{ data: [] }]
};

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [spendingByCategory, setSpendingByCategory] = useState([]);
  const [incomeVsExpenses, setIncomeVsExpenses] = useState(emptyChartData);
  const [savingsOverTime, setSavingsOverTime] = useState(emptyChartData);
  const [portfolioDistribution, setPortfolioDistribution] = useState(emptyChartData);
  const [weeklySpending, setWeeklySpending] = useState(emptyChartData);
  const [topCategories, setTopCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch all dashboard data from the mocked service
        const [
          statsResponse,
          transactionsResponse,
          spendingResponse,
          incomeExpensesResponse,
          savingsResponse,
          portfolioResponse,
          weeklyResponse,
          topCategoriesResponse
        ] = await Promise.all([
          dashboardService.getStats(),
          dashboardService.getRecentTransactions(5),
          dashboardService.getSpendingByCategory(),
          dashboardService.getIncomeVsExpenses(),
          dashboardService.getSavingsOverTime(),
          dashboardService.getPortfolioDistribution(),
          dashboardService.getWeeklySpending(),
          dashboardService.getTopCategories()
        ]);

        setDashboardData(statsResponse.data.data);
        setRecentTransactions(transactionsResponse.data.data);
        setSpendingByCategory(spendingResponse.data.data);
        setIncomeVsExpenses(incomeExpensesResponse.data.data);
        setSavingsOverTime(savingsResponse.data.data);
        setPortfolioDistribution(portfolioResponse.data.data);
        setWeeklySpending(weeklyResponse.data.data);
        setTopCategories(topCategoriesResponse.data.data);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatCurrency = (amount) => {
    if (typeof amount !== 'number') return amount;
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  }

  const formatCurrencyShort = (amount) => {
    if (typeof amount !== 'number') return '0 ₫';
    if (amount >= 1000000000) {
      return `${(amount / 1000000000).toFixed(1)}B ₫`
    } else if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M ₫`
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(0)}K ₫`
    }
    return `${amount} ₫`
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  if (loading) {
    return <LoadingScreen message="Đang tải dữ liệu dashboard..." />
  }

  const stats = [
    {
      title: 'Tổng Số Dư',
      value: formatCurrency(dashboardData?.totalBalance || 0),
      change: '+8.2%',
      icon: DollarSignIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/50',
      changeColor: 'text-green-600'
    },
    {
      title: 'Thu Nhập Tháng',
      value: formatCurrency(dashboardData?.monthlyIncome || 0),
      change: '+12.5%',
      icon: TrendingUpIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/50',
      changeColor: 'text-green-600'
    },
    {
      title: 'Chi Tiêu Tháng',
      value: formatCurrency(dashboardData?.monthlyExpense || 0),
      change: '-5.3%',
      icon: CreditCardIcon,
      color: 'text-red-600',
      bgColor: 'bg-red-100 dark:bg-red-900/50',
      changeColor: 'text-red-600'
    },
    {
      title: 'Số Tài Khoản',
      value: dashboardData?.totalAccounts || 0,
      change: '+1',
      icon: PiggyBankIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/50',
      changeColor: 'text-green-600'
    },
    {
      title: 'Mục Tiêu Tiết Kiệm',
      value: `${dashboardData?.savingsGoalProgress || 0}%`,
      change: '+15%',
      icon: TargetIcon,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100 dark:bg-indigo-900/50',
      changeColor: 'text-green-600'
    },
    {
      title: 'Lợi Nhuận Đầu Tư',
      value: `${dashboardData?.investmentReturn || 0}%`,
      change: '+2.1%',
      icon: TrendingUpIcon,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100 dark:bg-emerald-900/50',
      changeColor: 'text-green-600'
    },
    {
      title: 'Tăng Trưởng Tháng',
      value: `${dashboardData?.monthlyGrowth || 0}%`,
      change: '+3.2%',
      icon: ActivityIcon,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-100 dark:bg-cyan-900/50',
      changeColor: 'text-green-600'
    },
    {
      title: 'Giao Dịch Chờ',
      value: dashboardData?.pendingTransactions || 0,
      change: '-2',
      icon: WalletIcon,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900/50',
      changeColor: 'text-red-600'
    },
  ];

  // Chart data configurations
  const incomeExpenseChartData = {
    labels: incomeVsExpenses.labels,
    datasets: [
      {
        label: 'Thu Nhập',
        data: incomeVsExpenses.income,
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4
      },
      {
        label: 'Chi Tiêu',
        data: incomeVsExpenses.expenses,
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4
      }
    ]
  };

  const savingsChartData = {
    labels: savingsOverTime.labels,
    datasets: [
      {
        label: 'Tiết Kiệm Tích Lũy',
        data: savingsOverTime.data,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4
      }
    ]
  };

  const portfolioChartData = {
    labels: portfolioDistribution.map(item => item.label),
    datasets: [
      {
        data: portfolioDistribution.map(item => item.value),
        backgroundColor: portfolioDistribution.map(item => item.color),
        borderWidth: 0,
        hoverBorderWidth: 3,
        hoverBorderColor: '#ffffff'
      }
    ]
  };

  const weeklySpendingChartData = {
    labels: weeklySpending.labels,
    datasets: [
      {
        label: 'Chi Tiêu Hàng Ngày',
        data: weeklySpending.data,
        backgroundColor: 'rgba(34, 197, 94, 0.7)',
        borderWidth: 0,
        borderRadius: 4,
        borderSkipped: false,
      }
    ]
  };

  return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Tổng quan tài chính của bạn - Cập nhật {new Date().toLocaleDateString('vi-VN')}
            </p>
          </div>
          <div className="mt-3 sm:mt-0 flex space-x-2">
            <button className="h-10 px-4 text-sm font-medium bg-primary-600 hover:bg-primary-700 text-white rounded-lg flex items-center shadow-sm transition-colors">
              <TrendingUpIcon className="w-4 h-4 mr-2" />
              Xuất Báo Cáo
            </button>
            <button className="h-10 px-4 text-sm font-medium bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg flex items-center transition-colors">
              <SettingsIcon className="w-4 h-4 mr-2" />
              Cài Đặt
            </button>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
                <Card key={index} className="relative overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className={`p-2 rounded-lg ${stat.bgColor} mx-auto mb-3 w-fit group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className={`w-5 h-5 ${stat.color}`} />
                      </div>
                      <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                        {stat.title}
                      </p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                        {stat.value}
                      </p>
                      <div className="flex items-center justify-center space-x-1">
                        {stat.change.startsWith('+') ? (
                            <ArrowUpIcon className="w-3 h-3 text-green-600" />
                        ) : (
                            <ArrowDownIcon className="w-3 h-3 text-red-600" />
                        )}
                        <span className={`text-xs font-medium ${stat.changeColor}`}>
                          {stat.change}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Income vs Expenses Chart */}
          <Card className="col-span-1 lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3Icon className="w-5 h-5 text-blue-600" />
                  <span>Thu Nhập vs Chi Tiêu</span>
                </CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Xu hướng tài chính 9 tháng gần nhất
                </p>
              </div>
              <div className="flex space-x-2">
                <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 text-xs rounded-full">Thu nhập TB: {formatCurrencyShort(32600000)}</span>
                <span className="px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 text-xs rounded-full">Chi tiêu TB: {formatCurrencyShort(24800000)}</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <AreaChart data={incomeExpenseChartData} />
              </div>
            </CardContent>
          </Card>

          {/* Savings Growth */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2">
                <TrendingUpIcon className="w-5 h-5 text-green-600" />
                <span>Tăng Trưởng Tiết Kiệm</span>
              </CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Tích lũy theo thời gian
              </p>
            </CardHeader>
            <CardContent>
              <div className="h-48">
                <LineChart data={savingsChartData} />
              </div>
            </CardContent>
          </Card>

          {/* Portfolio Distribution */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2">
                <PieChartIcon className="w-5 h-5 text-purple-600" />
                <span>Phân Bổ Tài Sản</span>
              </CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Cơ cấu đầu tư hiện tại
              </p>
            </CardHeader>
            <CardContent>
              <div className="h-48 flex items-center justify-center">
                <DoughnutChart data={portfolioChartData} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Spending & Top Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weekly Spending Pattern */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2">
                <ActivityIcon className="w-5 h-5 text-orange-600" />
                <span>Chi Tiêu Theo Tuần</span>
              </CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Thói quen chi tiêu hàng ngày
              </p>
            </CardHeader>
            <CardContent>
              <div className="h-48">
                <BarChart data={weeklySpendingChartData} />
              </div>
            </CardContent>
          </Card>

          {/* Top Spending Categories */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle>Danh Mục Chi Tiêu Hàng Đầu</CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Các khoản chi lớn nhất tháng này
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topCategories.map((category, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 ${ index === 0 ? 'bg-amber-400' : index === 1 ? 'bg-slate-400' : 'bg-amber-700'} rounded-lg flex items-center justify-center text-white font-bold text-sm`}>
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">{category.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{formatCurrency(category.amount)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`flex items-center space-x-1 ${
                            category.trend === 'up' ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {category.trend === 'up' ? (
                              <ArrowUpIcon className="w-3 h-3" />
                          ) : (
                              <ArrowDownIcon className="w-3 h-3" />
                          )}
                          <span className="text-sm font-medium">{category.change}</span>
                        </div>
                      </div>
                    </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Quick Actions */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle>Hành Động Nhanh</CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Các thao tác thường dùng
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="p-4 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl hover:border-green-400 hover:bg-green-50 dark:hover:border-green-600 dark:hover:bg-green-900/50 transition-all duration-300 group">
                <div className="flex flex-col items-center space-y-2">
                  <div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-full group-hover:scale-110 transition-transform">
                    <TrendingUpIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-gray-900 dark:text-white">Thêm Thu Nhập</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Ghi nhận khoản thu mới</p>
                  </div>
                </div>
              </button>

              <button className="p-4 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl hover:border-red-400 hover:bg-red-50 dark:hover:border-red-600 dark:hover:bg-red-900/50 transition-all duration-300 group">
                <div className="flex flex-col items-center space-y-2">
                  <div className="p-3 bg-red-100 dark:bg-red-900/50 rounded-full group-hover:scale-110 transition-transform">
                    <CreditCardIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-gray-900 dark:text-white">Thêm Chi Tiêu</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Ghi nhận khoản chi mới</p>
                  </div>
                </div>
              </button>

              <button className="p-4 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-400 hover:bg-blue-50 dark:hover:border-blue-600 dark:hover:bg-blue-900/50 transition-all duration-300 group">
                <div className="flex flex-col items-center space-y-2">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-full group-hover:scale-110 transition-transform">
                    <TargetIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-gray-900 dark:text-white">Lập Mục Tiêu</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Đặt mục tiêu tiết kiệm</p>
                  </div>
                </div>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions & Spending Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Transactions */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div>
                <CardTitle>Giao Dịch Gần Đây</CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  5 giao dịch mới nhất
                </p>
              </div>
              <button className="text-primary-600 hover:text-primary-800 text-sm font-medium">
                Xem tất cả
              </button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full ${
                            transaction.type === 'income'
                                ? 'bg-green-100 dark:bg-green-900/50'
                                : 'bg-red-100 dark:bg-red-900/50'
                        }`}>
                          {transaction.type === 'income' ? (
                              <ArrowUpIcon className="w-4 h-4 text-green-600 dark:text-green-400" />
                          ) : (
                              <ArrowDownIcon className="w-4 h-4 text-red-600 dark:text-red-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white text-sm">{transaction.description}</p>
                          <div className="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-400">
                            <span>{transaction.category}</span>
                            <span>•</span>
                            <span>{transaction.account}</span>
                            <span>•</span>
                            <span>{formatDate(transaction.date)}</span>
                          </div>
                        </div>
                      </div>
                      <p className={`font-bold text-sm ${
                          transaction.type === 'income'
                              ? 'text-green-600 dark:text-green-400'
                              : 'text-red-600 dark:text-red-400'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </p>
                    </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Spending by Category */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle>Chi Tiêu Theo Danh Mục</CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Phân tích chi tiêu tháng này
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {spendingByCategory.map((category, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: category.color }}
                          ></div>
                          <span className="font-medium text-gray-900 dark:text-white">{category.category}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900 dark:text-white text-sm">
                            {formatCurrency(category.amount)}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {category.percentage}%
                          </p>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                            className="h-2 rounded-full transition-all duration-500 ease-out"
                            style={{
                              width: `${category.percentage}%`,
                              backgroundColor: category.color
                            }}
                        ></div>
                      </div>
                    </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
  );
};

export default Dashboard;