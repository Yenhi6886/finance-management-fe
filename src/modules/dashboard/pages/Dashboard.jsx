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

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null)
  const [recentTransactions, setRecentTransactions] = useState([])
  const [spendingByCategory, setSpendingByCategory] = useState([])
  const [incomeVsExpenses, setIncomeVsExpenses] = useState(null)
  const [savingsOverTime, setSavingsOverTime] = useState(null)
  const [portfolioDistribution, setPortfolioDistribution] = useState([])
  const [weeklySpending, setWeeklySpending] = useState(null)
  const [topCategories, setTopCategories] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Advanced Chart Data States
  const [setCashFlowData] = useState(null)
  const [setVolatilityChart] = useState(null)
  const [setCorrelationMatrix] = useState(null)
  const [setRiskReturnScatter] = useState(null)
  const [setMonteCarlo] = useState(null)
  const [setLiquidityAnalysis] = useState(null)
  const [setFinancialGoals] = useState([])
  const [setInvestmentPerformance] = useState(null)
  const [setBudgetAlerts] = useState([])
  const [setGeographicSpending] = useState([])
  const [setUpcomingBills] = useState([])
  const [setExpenseHeatmap] = useState(null)
  const [setFinancialHealth] = useState(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        
        await new Promise(resolve => setTimeout(resolve, 4537))
        // Fetch all dashboard data
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
        ])

        setDashboardData(statsResponse.data.data)
        setRecentTransactions(transactionsResponse.data.data)
        setSpendingByCategory(spendingResponse.data.data)
        setIncomeVsExpenses(incomeExpensesResponse.data.data)
        setSavingsOverTime(savingsResponse.data.data)
        setPortfolioDistribution(portfolioResponse.data.data)
        setWeeklySpending(weeklyResponse.data.data)
        setTopCategories(topCategoriesResponse.data.data)

        // Mock data for advanced features
        setFinancialGoals([
          { id: 1, name: 'Mua nhà', target: 2000000000, current: 450000000, deadline: '2024-12-31', category: 'Bất động sản' },
          { id: 2, name: 'Du lịch Nhật Bản', target: 50000000, current: 32000000, deadline: '2024-06-15', category: 'Du lịch' },
          { id: 3, name: 'Quỹ khẩn cấp', target: 100000000, current: 85000000, deadline: '2024-03-30', category: 'Tiết kiệm' }
        ])

        setInvestmentPerformance({
          labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6'],
          datasets: [
            {
              label: 'Cổ phiếu',
              data: [5.2, 3.8, 7.1, -2.3, 8.5, 12.1],
              borderColor: 'rgb(59, 130, 246)',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              tension: 0.4
            },
            {
              label: 'Quỹ đầu tư',
              data: [3.1, 4.2, 2.8, 5.5, 6.2, 4.8],
              borderColor: 'rgb(34, 197, 94)',
              backgroundColor: 'rgba(34, 197, 94, 0.1)',
              tension: 0.4
            },
            {
              label: 'Tiền gửi',
              data: [0.5, 0.5, 0.6, 0.6, 0.7, 0.7],
              borderColor: 'rgb(156, 163, 175)',
              backgroundColor: 'rgba(156, 163, 175, 0.1)',
              tension: 0.4
            }
          ]
        })

        setExpenseHeatmap({
          labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
          datasets: [{
            label: 'Chi tiêu theo giờ',
            data: [
              [0, 0, 20], [1, 0, 15], [2, 0, 5], [3, 0, 0], [4, 0, 0], [5, 0, 10],
              [6, 1, 25], [7, 1, 45], [8, 1, 65], [9, 1, 55], [10, 1, 40],
              [11, 2, 80], [12, 2, 120], [13, 2, 95], [14, 2, 70], [15, 2, 85],
              [16, 3, 110], [17, 3, 130], [18, 3, 150], [19, 3, 180], [20, 3, 140],
              [21, 4, 90], [22, 4, 60], [23, 4, 35]
            ]
          }]
        })

        setFinancialHealth({
          score: 78,
          factors: [
            { name: 'Tỷ lệ tiết kiệm', score: 85, status: 'good' },
            { name: 'Đa dạng hóa đầu tư', score: 72, status: 'fair' },
            { name: 'Quản lý nợ', score: 90, status: 'excellent' },
            { name: 'Quỹ khẩn cấp', score: 65, status: 'needs-improvement' }
          ]
        })

        setUpcomingBills([
          { name: 'Tiền điện', amount: 850000, dueDate: '2025-09-15', status: 'upcoming' },
          { name: 'Internet', amount: 300000, dueDate: '2025-09-20', status: 'upcoming' },
          { name: 'Bảo hiểm xe', amount: 2500000, dueDate: '2025-09-25', status: 'overdue' }
        ])

        setGeographicSpending([
          { location: 'Quận 1', amount: 15500000, percentage: 35 },
          { location: 'Quận 3', amount: 8200000, percentage: 18 },
          { location: 'Quận 7', amount: 7100000, percentage: 16 },
          { location: 'Thủ Đức', amount: 6800000, percentage: 15 },
          { location: 'Khác', amount: 7400000, percentage: 16 }
        ])

        setBudgetAlerts([
          { category: 'Ăn uống', spent: 8500000, budget: 10000000, status: 'warning' },
          { category: 'Mua sắm', spent: 12000000, budget: 8000000, status: 'over' },
          { category: 'Giải trí', spent: 3200000, budget: 5000000, status: 'safe' }
        ])

        // Advanced Financial Analytics Data
        setCashFlowData({
          labels: ['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024', 'Q1 2025', 'Q2 2025'],
          datasets: [
            {
              type: 'bar',
              label: 'Dòng tiền hoạt động',
              data: [150000000, 180000000, 220000000, 190000000, 250000000, 280000000],
              backgroundColor: 'rgba(34, 197, 94, 0.8)',
              borderColor: 'rgb(34, 197, 94)',
              borderWidth: 2,
              yAxisID: 'y'
            },
            {
              type: 'bar',
              label: 'Dòng tiền đầu tư',
              data: [-80000000, -120000000, -150000000, -90000000, -180000000, -200000000],
              backgroundColor: 'rgba(239, 68, 68, 0.8)',
              borderColor: 'rgb(239, 68, 68)',
              borderWidth: 2,
              yAxisID: 'y'
            },
            {
              type: 'line',
              label: 'Dòng tiền ròng tích lũy',
              data: [70000000, 130000000, 200000000, 300000000, 370000000, 450000000],
              borderColor: 'rgb(59, 130, 246)',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              borderWidth: 3,
              fill: true,
              tension: 0.4,
              yAxisID: 'y1'
            }
          ]
        })

        setVolatilityChart({
          labels: Array.from({length: 252}, (_, i) => `Ngày ${i + 1}`),
          datasets: [
            {
              label: 'Volatility Cổ phiếu VNM',
              data: Array.from({length: 252}, () => Math.random() * 0.5 + 0.1),
              borderColor: 'rgb(239, 68, 68)',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              borderWidth: 1,
              fill: true,
              tension: 0.1
            },
            {
              label: 'Volatility VN-Index',
              data: Array.from({length: 252}, () => Math.random() * 0.3 + 0.05),
              borderColor: 'rgb(34, 197, 94)',
              backgroundColor: 'rgba(34, 197, 94, 0.1)',
              borderWidth: 1,
              fill: true,
              tension: 0.1
            },
            {
              label: 'GARCH Model',
              data: Array.from({length: 252}, () => Math.random() * 0.4 + 0.08),
              borderColor: 'rgb(59, 130, 246)',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              borderWidth: 2,
              fill: false,
              tension: 0.3
            }
          ]
        })

        setCorrelationMatrix({
          labels: ['VNM', 'VIC', 'VHM', 'BID', 'CTG', 'VCB', 'GAS', 'MSN'],
          datasets: [{
            label: 'Correlation',
            data: [
              [0, 0, 1.0], [0, 1, 0.65], [0, 2, 0.23], [0, 3, 0.41], [0, 4, 0.38], [0, 5, 0.52], [0, 6, 0.19], [0, 7, 0.33],
              [1, 0, 0.65], [1, 1, 1.0], [1, 2, 0.78], [1, 3, 0.29], [1, 4, 0.31], [1, 5, 0.46], [1, 6, 0.15], [1, 7, 0.62],
              [2, 0, 0.23], [2, 1, 0.78], [2, 2, 1.0], [2, 3, 0.18], [2, 4, 0.22], [2, 5, 0.35], [2, 6, 0.09], [2, 7, 0.71],
              [3, 0, 0.41], [3, 1, 0.29], [3, 2, 0.18], [3, 3, 1.0], [3, 4, 0.89], [3, 5, 0.92], [3, 6, 0.12], [3, 7, 0.24],
              [4, 0, 0.38], [4, 1, 0.31], [4, 2, 0.22], [4, 3, 0.89], [4, 4, 1.0], [4, 5, 0.87], [4, 6, 0.14], [4, 7, 0.26],
              [5, 0, 0.52], [5, 1, 0.46], [5, 2, 0.35], [5, 3, 0.92], [5, 4, 0.87], [5, 5, 1.0], [5, 6, 0.18], [5, 7, 0.41],
              [6, 0, 0.19], [6, 1, 0.15], [6, 2, 0.09], [6, 3, 0.12], [6, 4, 0.14], [6, 5, 0.18], [6, 6, 1.0], [6, 7, 0.08],
              [7, 0, 0.33], [7, 1, 0.62], [7, 2, 0.71], [7, 3, 0.24], [7, 4, 0.26], [7, 5, 0.41], [7, 6, 0.08], [7, 7, 1.0]
            ],
            backgroundColor: function(context) {
              const value = context.parsed ? context.parsed.v : 0;
              const alpha = Math.abs(value);
              return value > 0 ? `rgba(34, 197, 94, ${alpha})` : `rgba(239, 68, 68, ${alpha})`;
            }
          }]
        })

        setRiskReturnScatter({
          datasets: [
            {
              label: 'Cổ phiếu',
              data: [
                { x: 15.2, y: 8.5, name: 'VNM' },
                { x: 22.1, y: 12.3, name: 'VIC' },
                { x: 28.7, y: 15.8, name: 'VHM' },
                { x: 18.4, y: 9.2, name: 'BID' },
                { x: 25.6, y: 11.7, name: 'CTG' },
                { x: 20.3, y: 10.1, name: 'VCB' },
                { x: 35.2, y: 18.9, name: 'GAS' },
                { x: 31.8, y: 16.4, name: 'MSN' }
              ],
              backgroundColor: 'rgba(59, 130, 246, 0.6)',
              borderColor: 'rgb(59, 130, 246)',
              pointRadius: 8,
              pointHoverRadius: 12
            },
            {
              label: 'Quỹ ETF',
              data: [
                { x: 12.1, y: 6.8, name: 'FTSE Vietnam ETF' },
                { x: 14.5, y: 7.9, name: 'VanEck Vietnam ETF' },
                { x: 11.8, y: 6.2, name: 'VNM ETF' }
              ],
              backgroundColor: 'rgba(34, 197, 94, 0.6)',
              borderColor: 'rgb(34, 197, 94)',
              pointRadius: 8,
              pointHoverRadius: 12
            },
            {
              label: 'Efficient Frontier',
              data: Array.from({length: 50}, (_, i) => ({
                x: 8 + i * 0.6,
                y: Math.sqrt(8 + i * 0.6) * 2.1 + Math.random() * 0.5
              })),
              borderColor: 'rgb(239, 68, 68)',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              showLine: true,
              fill: false,
              pointRadius: 0,
              borderWidth: 3
            }
          ]
        })

        setMonteCarlo({
          labels: Array.from({length: 1000}, (_, i) => i),
          datasets: Array.from({length: 100}, (_, i) => ({
            label: `Simulation ${i + 1}`,
            data: Array.from({length: 1000}, (_, j) => {
              let value = 100;
              for (let k = 0; k <= j; k++) {
                value *= (1 + (Math.random() - 0.45) * 0.02);
              }
              return value;
            }),
            borderColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.1)`,
            borderWidth: 1,
            fill: false,
            pointRadius: 0,
            tension: 0.1
          }))
        })

        setLiquidityAnalysis({
          labels: ['Tiền mặt', 'Tài khoản ngân hàng', 'Quỹ MMF', 'Cổ phiếu blue-chip', 'Cổ phiếu mid-cap', 'Bất động sản', 'Trái phiếu doanh nghiệp', 'Vàng'],
          datasets: [
            {
              type: 'bubble',
              label: 'Phân tích tính thanh khoản',
              data: [
                { x: 100, y: 0, r: 20, name: 'Tiền mặt' },
                { x: 99, y: 0.1, r: 35, name: 'Tài khoản ngân hàng' },
                { x: 95, y: 1.2, r: 15, name: 'Quỹ MMF' },
                { x: 85, y: 3.5, r: 45, name: 'Cổ phiếu blue-chip' },
                { x: 70, y: 8.2, r: 25, name: 'Cổ phiếu mid-cap' },
                { x: 30, y: 12.5, r: 60, name: 'Bất động sản' },
                { x: 75, y: 6.8, r: 18, name: 'Trái phiếu doanh nghiệp' },
                { x: 80, y: 5.1, r: 12, name: 'Vàng' }
              ],
              backgroundColor: function(context) {
                const colors = [
                  'rgba(34, 197, 94, 0.6)',
                  'rgba(59, 130, 246, 0.6)', 
                  'rgba(168, 85, 247, 0.6)',
                  'rgba(239, 68, 68, 0.6)',
                  'rgba(245, 158, 11, 0.6)',
                  'rgba(139, 92, 246, 0.6)',
                  'rgba(34, 197, 94, 0.6)',
                  'rgba(34, 197, 94, 0.6)'
                ];
                return colors[context.dataIndex % colors.length];
              }
            }
          ]
        })
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const formatCurrency = (amount) => {
    // Format to short form with K, M, B
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
    })
  }

  if (loading) {
    return <LoadingScreen message="Đang tải dashboard..." />
  }

  const stats = [
    {
      title: 'Tổng Số Dư',
      value: formatCurrency(dashboardData?.totalBalance || 0),
      change: '+8.2%',
      icon: DollarSignIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      changeColor: 'text-green-600'
    },
    {
      title: 'Thu Nhập Tháng',
      value: formatCurrency(dashboardData?.monthlyIncome || 0),
      change: '+12.5%',
      icon: TrendingUpIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      changeColor: 'text-green-600'
    },
    {
      title: 'Chi Tiêu Tháng',
      value: formatCurrency(dashboardData?.monthlyExpense || 0),
      change: '-5.3%',
      icon: CreditCardIcon,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      changeColor: 'text-green-600'
    },
    {
      title: 'Số Tài Khoản',
      value: dashboardData?.totalAccounts || 0,
      change: '+1',
      icon: PiggyBankIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      changeColor: 'text-green-600'
    },
    {
      title: 'Mục Tiêu Tiết Kiệm',
      value: `${dashboardData?.savingsGoalProgress || 0}%`,
      change: '+15%',
      icon: TargetIcon,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
      changeColor: 'text-green-600'
    },
    {
      title: 'Lợi Nhuận Đầu Tư',
      value: `${dashboardData?.investmentReturn || 0}%`,
      change: '+2.1%',
      icon: TrendingUpIcon,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
      changeColor: 'text-green-600'
    },
    {
      title: 'Tăng Trưởng Tháng',
      value: `${dashboardData?.monthlyGrowth || 0}%`,
      change: '+3.2%',
      icon: ActivityIcon,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-100',
      changeColor: 'text-green-600'
    },
    {
      title: 'Giao Dịch Chờ',
      value: dashboardData?.pendingTransactions || 0,
      change: '-2',
      icon: WalletIcon,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      changeColor: 'text-green-600'
    },
  ]

  // Chart data configurations
  const incomeExpenseChartData = incomeVsExpenses ? {
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
  } : null

  const savingsChartData = savingsOverTime ? {
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
  } : null

  const portfolioChartData = portfolioDistribution.length > 0 ? {
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
  } : null

  const weeklySpendingChartData = weeklySpending ? {
    labels: weeklySpending.labels,
    datasets: [
      {
        label: 'Chi Tiêu Hàng Ngày',
        data: weeklySpending.data,
        backgroundColor: 'rgba(34, 197, 94, 0.7)',
        borderWidth: 0,
        borderRadius: 0,
        borderSkipped: false,
      }
    ]
  } : null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Tổng quan tài chính của bạn - Cập nhật {new Date().toLocaleDateString('vi-VN')}
          </p>
        </div>
        <div className="mt-3 sm:mt-0 flex space-x-2">
          <button className="h-10 px-4 text-sm font-light bg-primary-600 hover:bg-primary-700 text-white rounded-md border-0 flex items-center">
            <TrendingUpIcon className="w-4 h-4 mr-1" />
            Xuất Báo Cáo
          </button>
          <button className="h-10 px-4 text-sm font-light bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-md border-0 flex items-center">
            <SettingsIcon className="w-4 h-4 mr-1" />
            Cài Đặt
          </button>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="relative overflow-hidden hover:shadow-md transition-all duration-300 group">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className={`p-2 rounded-lg ${stat.bgColor} dark:bg-opacity-20 mx-auto mb-3 w-fit group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                    {stat.value}
                  </p>
                  <div className="flex items-center justify-center space-x-1">
                    {stat.change.startsWith('+') || stat.change.startsWith('-') ? (
                      stat.change.startsWith('+') ? (
                        <ArrowUpIcon className="w-3 h-3 text-green-600" />
                      ) : (
                        <ArrowDownIcon className="w-3 h-3 text-red-600" />
                      )
                    ) : null}
                    <span className={`text-xs font-medium ${stat.changeColor}`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
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
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Thu nhập TB: {formatCurrency(32600000)}</span>
              <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Chi tiêu TB: {formatCurrency(24800000)}</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              {incomeExpenseChartData && <AreaChart data={incomeExpenseChartData} />}
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
              {savingsChartData && <LineChart data={savingsChartData} />}
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
            <div className="h-48">
              {portfolioChartData && <DoughnutChart data={portfolioChartData} />}
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
              {weeklySpendingChartData && <BarChart data={weeklySpendingChartData} />}
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
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
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
            <button className="p-4 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl hover:border-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900 transition-all duration-300 group">
              <div className="flex flex-col items-center space-y-2">
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full group-hover:scale-110 transition-transform">
                  <TrendingUpIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-gray-900 dark:text-white">Thêm Thu Nhập</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Ghi nhận khoản thu mới</p>
                </div>
              </div>
            </button>

            <button className="p-4 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl hover:border-red-300 hover:bg-red-50 dark:hover:bg-red-900 transition-all duration-300 group">
              <div className="flex flex-col items-center space-y-2">
                <div className="p-3 bg-red-100 dark:bg-red-900 rounded-full group-hover:scale-110 transition-transform">
                  <CreditCardIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-gray-900 dark:text-white">Thêm Chi Tiêu</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Ghi nhận khoản chi mới</p>
                </div>
              </div>
            </button>

            <button className="p-4 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900 transition-all duration-300 group">
              <div className="flex flex-col items-center space-y-2">
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full group-hover:scale-110 transition-transform">
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
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              Xem tất cả
            </button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${
                      transaction.type === 'income' 
                        ? 'bg-green-100 dark:bg-green-900' 
                        : 'bg-red-100 dark:bg-red-900'
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
