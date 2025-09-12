import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { walletService } from '../services/walletService'
import {
  PlusIcon,
  WalletIcon,
  EyeIcon,
  EditIcon,
  ArchiveIcon,
  DollarSignIcon
} from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'sonner'

const WalletList = () => {
  const [wallets, setWallets] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalBalance, setTotalBalance] = useState(0)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (location.state?.message) {
      if (location.state.type === 'success') {
        toast.success(location.state.message)
        // Làm mới dữ liệu khi có thông báo thành công
        fetchWallets()
      } else {
        toast.error(location.state.message)
      }
      
      // Xóa state để tránh hiển thị thông báo nhiều lần
      window.history.replaceState({}, document.title)
    }
  }, [location.state])

  const fetchWallets = async () => {
    try {
      setLoading(true)
      const response = await walletService.getWallets()
      const walletsData = response.data.data || []
      setWallets(walletsData)

      const total = walletsData
          .reduce((sum, wallet) => {
            const exchangeRate = 25400
            const balanceInVND = wallet.currency === 'USD' ? wallet.balance * exchangeRate : wallet.balance
            return sum + balanceInVND
          }, 0)
      setTotalBalance(total)
    } catch (error) {
      console.error('Error fetching wallets:', error)
      toast.error('Không thể tải danh sách ví.')
      setWallets([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWallets()
  }, [])

  const formatCurrency = (amount, currency = 'VND') => {
    if (typeof amount !== 'number') {
      amount = parseFloat(amount) || 0;
    }
    if (currency === 'USD') {
      return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
    }
    return `${amount.toLocaleString('vi-VN')} ₫`
  }

  const getWalletColor = (name) => {
    const colors = [
      'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
      'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
      'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
      'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
      'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
      'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300',
      'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
    ]
    const index = name.length % colors.length
    return colors[index]
  }

  if (loading) {
    return (
        <div className="space-y-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-48 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
    )
  }

  return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Quản Lý Ví</h1>
            <p className="text-muted-foreground mt-1">
              Tổng quan các ví tiền và tài khoản của bạn
            </p>
          </div>
          <div className="mt-3 sm:mt-0 flex space-x-2">
            <Button variant="outline">
              <ArchiveIcon className="w-4 h-4 mr-2" />
              Ví Lưu Trữ
            </Button>
            <Button onClick={() => navigate('/wallets/add')}>
              <PlusIcon className="w-4 h-4 mr-2" />
              Thêm Ví
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Tổng Số Dư</p>
                <p className="text-3xl font-bold">{formatCurrency(totalBalance)}</p>
                <p className="text-muted-foreground text-sm mt-1">
                  {wallets.length} ví đang hoạt động
                </p>
              </div>
              <div>
                <DollarSignIcon className="w-12 h-12 text-muted-foreground/30" />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wallets.map((wallet) => (
              <Card key={wallet.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className={`text-base px-2 py-1 rounded-md inline-block ${getWalletColor(wallet.name)}`}>
                      {wallet.icon} {wallet.name}
                    </CardTitle>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate(`/wallets/${wallet.id}`)}>
                        <EyeIcon className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate(`/wallets/${wallet.id}/edit`)}>
                        <EditIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Số dư</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(wallet.balance, wallet.currency)}
                  </p>
                  {wallet.description && (
                      <p className="text-sm text-muted-foreground mt-2 italic line-clamp-2">
                        {wallet.description}
                      </p>
                  )}
                </CardContent>
              </Card>
          ))}
        </div>

        {wallets.length === 0 && (
            <Card className="p-12 text-center">
              <WalletIcon className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Chưa có ví nào</h3>
              <p className="text-muted-foreground mb-4">
                Tạo ví đầu tiên để bắt đầu quản lý tài chính của bạn.
              </p>
              <Button onClick={() => navigate('/wallets/add')}>
                <PlusIcon className="w-4 h-4 mr-2" />
                Tạo Ví Đầu Tiên
              </Button>
            </Card>
        )}
      </div>
  )
}

export default WalletList