import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { LineChart, BarChart } from '../../../components/charts/ChartComponents'
import { walletService } from '../services/walletService'
import { 
  ArrowLeftIcon,
  EditIcon,
  ShareIcon,
  PlusIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  ArchiveIcon,
  TrashIcon,
  DollarSignIcon,
  CalendarIcon,
  FilterIcon,
  DownloadIcon
} from 'lucide-react'

const WalletDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [wallet, setWallet] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [monthlyStats, setMonthlyStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState('7days')

  useEffect(() => {
    fetchWalletDetail()
  }, [id])

  const fetchWalletDetail = async () => {
    try {
      setLoading(true)
      const response = await walletService.getWalletById(id)
      const walletData = response.data.data
      setWallet(walletData)
      setTransactions(walletData.transactions || [])
      setMonthlyStats(walletData.monthlyStats)
    } catch (error) {
      console.error('Error fetching wallet detail:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount, currency = 'VND') => {
    if (currency === 'USD') {
      return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
    }
    return `${amount.toLocaleString('vi-VN')} ₫`
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

  const getTransactionIcon = (type) => {
    return type === 'income' ? 
      <ArrowUpIcon className="w-4 h-4 text-green-600" /> : 
      <ArrowDownIcon className="w-4 h-4 text-red-600" />
  }

  const generateChartData = () => {
    if (!transactions.length) return null

    // Tạo data cho biểu đồ xu hướng số dư
    const sortedTransactions = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date))
    let runningBalance = wallet.initialAmount

    const balanceOverTime = {
      labels: [],
      datasets: [{
        label: 'Số dư',
        data: [],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4
      }]
    }

    sortedTransactions.forEach(transaction => {
      if (transaction.type === 'income') {
        runningBalance += transaction.amount
      } else {
        runningBalance -= transaction.amount
      }
      
      balanceOverTime.labels.push(new Date(transaction.date).toLocaleDateString('vi-VN'))
      balanceOverTime.datasets[0].data.push(runningBalance)
    })

    return balanceOverTime
  }

  const generateExpenseChart = () => {
    if (!transactions.length) return null

    const expensesByCategory = {}
    transactions
      .filter(t => t.type === 'expense')
      .forEach(transaction => {
        expensesByCategory[transaction.category] = 
          (expensesByCategory[transaction.category] || 0) + transaction.amount
      })

    return {
      labels: Object.keys(expensesByCategory),
      datasets: [{
        label: 'Chi tiêu theo danh mục',
        data: Object.values(expensesByCategory),
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(34, 197, 94, 0.8)'
        ],
        borderWidth: 0
      }]
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-80 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!wallet) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Không tìm thấy ví
        </h2>
        <Button 
          onClick={() => navigate('/wallets')}
          size="sm"
          className="h-8 px-3 text-xs mt-4"
        >
          Quay lại danh sách ví
        </Button>
      </div>
    )
  }

  const balanceChart = generateChartData()
  const expenseChart = generateExpenseChart()

  return (
    <div className="space-y-6">
      {/* Header */}        <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/wallets')}
            className="h-8 px-3 text-xs"
          >
            <ArrowLeftIcon className="w-3 h-3 mr-1.5" />
            Quay lại
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center space-x-3">
              <span className="text-2xl">{wallet.icon || '💰'}</span>
              <span>{wallet.name}</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {wallet.description || 'Không có mô tả'}
            </p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          {wallet.permissions === 'owner' && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/wallets/${wallet.id}/deposit`)}
                className="h-8 px-3 text-xs"
              >
                <PlusIcon className="w-3 h-3 mr-1.5" />
                Nạp tiền
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/wallets/${wallet.id}/edit`)}
                className="h-8 px-3 text-xs"
              >
                <EditIcon className="w-3 h-3 mr-1.5" />
                Chỉnh sửa
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/wallets/${wallet.id}/share`)}
                className="h-8 px-3 text-xs"
              >
                <ShareIcon className="w-3 h-3 mr-1.5" />
                Chia sẻ
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Thông tin tổng quan */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-green-400 to-green-500 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Số Dư Hiện Tại</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(wallet.balance, wallet.currency)}
                </p>
              </div>
              <DollarSignIcon className="w-8 h-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Thu Nhập Tháng</p>
                <p className="text-xl font-bold text-green-600">
                  {formatCurrency(monthlyStats?.totalIncome || 0, wallet.currency)}
                </p>
              </div>
              <TrendingUpIcon className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Chi Tiêu Tháng</p>
                <p className="text-xl font-bold text-red-600">
                  {formatCurrency(monthlyStats?.totalExpense || 0, wallet.currency)}
                </p>
              </div>
              <TrendingDownIcon className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Thay Đổi Ròng</p>
                <p className={`text-xl font-bold ${
                  (monthlyStats?.netChange || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {(monthlyStats?.netChange || 0) >= 0 ? '+' : ''}
                  {formatCurrency(monthlyStats?.netChange || 0, wallet.currency)}
                </p>
              </div>
              <CalendarIcon className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Biểu đồ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Xu Hướng Số Dư</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              {balanceChart && <LineChart data={balanceChart} />}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Chi Tiêu Theo Danh Mục</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              {expenseChart && <BarChart data={expenseChart} />}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lịch sử giao dịch */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Lịch Sử Giao Dịch</CardTitle>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
              <FilterIcon className="w-3 h-3 mr-1" />
              Lọc
            </Button>
            <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
              <DownloadIcon className="w-3 h-3 mr-1" />
              Xuất file
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {transactions.length > 0 ? (
              transactions.map((transaction) => (
                <div 
                  key={transaction.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-full ${
                      transaction.type === 'income' 
                        ? 'bg-green-100 dark:bg-green-900' 
                        : 'bg-red-100 dark:bg-red-900'
                    }`}>
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {transaction.description}
                      </p>
                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        <span>{transaction.category}</span>
                        <span>•</span>
                        <span>{formatDate(transaction.date)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${
                      transaction.type === 'income' 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}
                      {formatCurrency(transaction.amount, wallet.currency)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400">
                  Chưa có giao dịch nào trong ví này
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Thông tin ví */}
      <Card>
        <CardHeader>
          <CardTitle>Thông Tin Ví</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Loại tiền tệ
                </label>
                <p className="text-lg font-semibold">{wallet.currency}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Số tiền ban đầu
                </label>
                <p className="text-lg font-semibold">
                  {formatCurrency(wallet.initialAmount, wallet.currency)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Trạng thái
                </label>
                <p className="text-lg font-semibold">
                  {wallet.isArchived ? (
                    <span className="text-gray-600">Đã lưu trữ</span>
                  ) : (
                    <span className="text-green-600">Đang hoạt động</span>
                  )}
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Quyền truy cập
                </label>
                <p className="text-lg font-semibold">
                  {wallet.permissions === 'owner' ? 'Chủ sở hữu' : 'Chỉ xem'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Ngày tạo
                </label>
                <p className="text-lg font-semibold">
                  {new Date(wallet.createdAt).toLocaleDateString('vi-VN')}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Cập nhật lần cuối
                </label>
                <p className="text-lg font-semibold">
                  {formatDate(wallet.updatedAt)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default WalletDetail
