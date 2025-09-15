import React, { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
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
  TrashIcon,
  DollarSignIcon,
  CalendarIcon,
  FilterIcon,
  DownloadIcon,
  ArchiveIcon,
  ArchiveRestoreIcon,
  InfoIcon
} from 'lucide-react'
import { toast } from 'sonner'
import { WalletContext } from '../../../shared/contexts/WalletContext'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '../../../components/ui/alert-dialog'
import { Alert, AlertDescription, AlertTitle } from '../../../components/ui/alert'

const WalletDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { refreshWallets } = useContext(WalletContext)
  const [wallet, setWallet] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [monthlyStats, setMonthlyStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const fetchWalletDetail = async () => {
    try {
      setLoading(true)
      const response = await walletService.getWalletById(id)
      const walletData = response.data.data
      setWallet(walletData)
      setTransactions(walletData.transactions || [])
      setMonthlyStats(walletData.monthlyStats || { totalIncome: 0, totalExpense: 0, netChange: 0 })
    } catch (error) {
      console.error('Error fetching wallet detail:', error)
      toast.error(error.response?.data?.message || "Lỗi khi tải dữ liệu ví.")
      navigate('/wallets')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWalletDetail()
  }, [id])


  const handleConfirmDelete = async () => {
    if (!wallet) return
    try {
      await walletService.deleteWallet(wallet.id)
      await refreshWallets()
      navigate('/wallets', {
        state: { message: `Ví "${wallet.name}" đã được xóa thành công.`, type: 'success' }
      })
    } catch (error) {
      toast.error(error.response?.data?.message || 'Đã xảy ra lỗi khi xóa ví.')
      setIsDeleteDialogOpen(false)
    }
  }

  const handleArchiveToggle = async () => {
    if (!wallet) return
    const isArchiving = !wallet.isArchived
    const action = isArchiving ? walletService.archiveWallet : walletService.unarchiveWallet
    const successMessage = isArchiving ? 'lưu trữ' : 'khôi phục'
    try {
      const response = await action(wallet.id)
      setWallet(response.data.data)
      toast.success(`Ví "${wallet.name}" đã được ${successMessage} thành công.`)
      refreshWallets()
    } catch (error) {
      toast.error(error.response?.data?.message || `Lỗi khi ${successMessage} ví.`)
    }
  }

  const formatCurrency = (amount, currency = 'VND') => {
    if (typeof amount !== 'number') amount = parseFloat(amount) || 0
    return currency === 'USD'
        ? `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
        : `${amount.toLocaleString('vi-VN')} ₫`
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
    })
  }

  const getTransactionIcon = (type) => {
    return type === 'income' ? <ArrowUpIcon className="w-4 h-4 text-green-600" /> : <ArrowDownIcon className="w-4 h-4 text-red-600" />
  }

  const generateChartData = () => { return null }
  const generateExpenseChart = () => { return null }

  if (loading) {
    return (
        <div className="space-y-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 h-80 bg-muted rounded"></div>
              <div className="h-80 bg-muted rounded"></div>
            </div>
          </div>
        </div>
    )
  }

  if (!wallet) {
    return (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold">Không tìm thấy ví</h2>
          <Button onClick={() => navigate('/wallets')} size="sm" className="h-8 px-3 text-xs mt-4">Quay lại danh sách ví</Button>
        </div>
    )
  }

  const balanceChart = generateChartData()
  const expenseChart = generateExpenseChart()

  return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" onClick={() => navigate('/wallets')} className="h-8 px-3 text-xs"><ArrowLeftIcon className="w-3 h-3 mr-1.5" />Quay lại</Button>
            <div>
              <h1 className="text-3xl font-bold flex items-center space-x-3">
                <span className="text-2xl">{wallet.icon || '💰'}</span>
                <span>{wallet.name}</span>
                {wallet.isArchived && <span className="text-sm font-normal bg-muted text-muted-foreground px-2 py-1 rounded-md">Đã lưu trữ</span>}
              </h1>
              <p className="text-muted-foreground">{wallet.description || 'Không có mô tả'}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            {!wallet.isArchived && (
                <>
                  <Button variant="outline" size="sm" onClick={() => navigate('/transactions/deposit', { state: { from: location.pathname } })} className="h-8 px-3 text-xs"><PlusIcon className="w-3 h-3 mr-1.5" />Nạp tiền</Button>
                  <Button variant="outline" size="sm" onClick={() => navigate(`/wallets/${id}/edit`)} className="h-8 px-3 text-xs"><EditIcon className="w-3 h-3 mr-1.5" />Chỉnh sửa</Button>
                  <Button variant="outline" size="sm" onClick={() => navigate('/wallets/share', { state: { from: location.pathname } })} className="h-8 px-3 text-xs"><ShareIcon className="w-3 h-3 mr-1.5" />Chia sẻ</Button>
                </>
            )}
            <Button variant={wallet.isArchived ? "default" : "outline"} size="sm" onClick={handleArchiveToggle} className="h-8 px-3 text-xs">
              {wallet.isArchived ? <ArchiveRestoreIcon className="w-3 h-3 mr-1.5" /> : <ArchiveIcon className="w-3 h-3 mr-1.5" />}
              {wallet.isArchived ? 'Khôi phục' : 'Lưu trữ'}
            </Button>
            <Button variant="destructive" size="sm" onClick={() => setIsDeleteDialogOpen(true)} className="h-8 px-3 text-xs"><TrashIcon className="w-3 h-3 mr-1.5" />Xóa</Button>
          </div>
        </div>

        {wallet.isArchived && (
            <Alert variant="default" className="bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-700">
              <InfoIcon className="h-4 w-4 text-blue-600" />
              <AlertTitle className="text-blue-800 dark:text-blue-300">Ví đã được lưu trữ</AlertTitle>
              <AlertDescription className="text-blue-700 dark:text-blue-400">
                Ví này hiện đang ở chế độ chỉ xem. Để thực hiện các thay đổi, bạn cần khôi phục lại ví.
              </AlertDescription>
            </Alert>
        )}

        <div className={`grid grid-cols-1 md:grid-cols-4 gap-6 ${wallet.isArchived ? 'opacity-70' : ''}`}>
          <Card className="bg-gradient-to-r from-green-400 to-green-500 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Số Dư Hiện Tại</p>
                  <p className="text-2xl font-bold">{formatCurrency(wallet.balance, wallet.currency)}</p>
                </div>
                <DollarSignIcon className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>
          <Card><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-muted-foreground text-sm">Thu Nhập Tháng</p><p className="text-xl font-bold text-green-600">{formatCurrency(monthlyStats?.totalIncome || 0, wallet.currency)}</p></div><TrendingUpIcon className="w-8 h-8 text-green-600" /></div></CardContent></Card>
          <Card><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-muted-foreground text-sm">Chi Tiêu Tháng</p><p className="text-xl font-bold text-red-600">{formatCurrency(monthlyStats?.totalExpense || 0, wallet.currency)}</p></div><TrendingDownIcon className="w-8 h-8 text-red-600" /></div></CardContent></Card>
          <Card><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-muted-foreground text-sm">Thay Đổi Ròng</p><p className={`text-xl font-bold ${(monthlyStats?.netChange || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>{(monthlyStats?.netChange || 0) >= 0 ? '+' : ''}{formatCurrency(monthlyStats?.netChange || 0, wallet.currency)}</p></div><CalendarIcon className="w-8 h-8 text-blue-600" /></div></CardContent></Card>
        </div>

        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 ${wallet.isArchived ? 'opacity-70' : ''}`}>
          <Card><CardHeader><CardTitle>Xu Hướng Số Dư</CardTitle></CardHeader><CardContent><div className="h-64">{balanceChart && <LineChart data={balanceChart} />}</div></CardContent></Card>
          <Card><CardHeader><CardTitle>Chi Tiêu Theo Danh Mục</CardTitle></CardHeader><CardContent><div className="h-64">{expenseChart && <BarChart data={expenseChart} />}</div></CardContent></Card>
        </div>

        <Card className={`${wallet.isArchived ? 'opacity-70' : ''}`}>
          <CardHeader className="flex flex-row items-center justify-between"><CardTitle>Lịch Sử Giao Dịch</CardTitle><div className="flex space-x-2"><Button variant="outline" size="sm" className="h-7 px-2 text-xs" disabled={wallet.isArchived}><FilterIcon className="w-3 h-3 mr-1" />Lọc</Button><Button variant="outline" size="sm" className="h-7 px-2 text-xs" disabled={wallet.isArchived}><DownloadIcon className="w-3 h-3 mr-1" />Xuất file</Button></div></CardHeader>
          <CardContent><div className="space-y-3">{transactions.length > 0 ? (transactions.map((transaction) => (<div key={transaction.id} className="flex items-center justify-between p-4 bg-muted/40 rounded-lg"><div className="flex items-center space-x-4"><div className={`p-2 rounded-full ${transaction.type === 'income' ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'}`}>{getTransactionIcon(transaction.type)}</div><div><p className="font-semibold">{transaction.description}</p><div className="flex items-center space-x-2 text-sm text-muted-foreground"><span>{transaction.category}</span><span>•</span><span>{formatDate(transaction.date)}</span></div></div></div><div className="text-right"><p className={`text-lg font-bold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>{transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount, wallet.currency)}</p></div></div>))) : (<div className="text-center py-12"><p className="text-muted-foreground">Chưa có giao dịch nào trong ví này</p></div>)}</div></CardContent>
        </Card>

        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Bạn có chắc chắn muốn xóa ví?</AlertDialogTitle><AlertDialogDescription>Hành động này không thể được hoàn tác. Thao tác này sẽ xóa vĩnh viễn ví<span className="font-bold"> "{wallet?.name}" </span>và tất cả dữ liệu liên quan.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Hủy</AlertDialogCancel><AlertDialogAction onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700">Xóa</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
      </div>
  )
}

export default WalletDetail