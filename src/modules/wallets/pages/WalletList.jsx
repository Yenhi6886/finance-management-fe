import React, { useState, useEffect, useContext, useMemo, useCallback, useRef } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { walletService } from '../services/walletService'
import {
  PlusIcon,
  WalletIcon,
  EyeIcon,
  EditIcon,
  ArchiveIcon,
  DollarSignIcon,
  TrashIcon,
  ArchiveRestoreIcon
} from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'sonner'
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
import { WalletContext } from '../../../shared/contexts/WalletContext'

const WalletList = () => {
  const { refreshWallets } = useContext(WalletContext)
  const [activeWallets, setActiveWallets] = useState([])
  const [archivedWallets, setArchivedWallets] = useState([])
  const [loading, setLoading] = useState(true)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [walletToDelete, setWalletToDelete] = useState(null)
  const [view, setView] = useState('active')
  const hasShownToastRef = useRef(false)
  const navigate = useNavigate()
  const location = useLocation()

  const fetchWallets = useCallback(async () => {
    try {
      setLoading(true)
      const [activeResponse, archivedResponse] = await Promise.all([
        walletService.getWallets(),
        walletService.getArchivedWallets()
      ])
      setActiveWallets(activeResponse.data.data || [])
      setArchivedWallets(archivedResponse.data.data || [])
    } catch (error) {
      console.error('Error fetching wallets:', error)
      toast.error('Không thể tải danh sách ví.')
      setActiveWallets([])
      setArchivedWallets([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // Reset flag when location changes (new navigation)
    hasShownToastRef.current = false
  }, [location.pathname, location.search])

  useEffect(() => {
    if (location.state?.message && !hasShownToastRef.current) {
      if (location.state.type === 'success') {
        toast.success(location.state.message)
      } else {
        toast.error(location.state.message)
      }
      hasShownToastRef.current = true
      fetchWallets()
      // Clear the state immediately to prevent duplicate toasts
      window.history.replaceState({}, document.title)
    }
  }, [location.state?.message, location.state?.type, fetchWallets])

  useEffect(() => {
    fetchWallets()
  }, [fetchWallets])

  const totalBalance = useMemo(() => {
    return activeWallets.reduce((sum, wallet) => {
      const exchangeRate = 25400
      const balanceInVND = wallet.currency === 'USD' ? wallet.balance * exchangeRate : wallet.balance
      return sum + Number(balanceInVND)
    }, 0)
  }, [activeWallets])

  const walletsToDisplay = view === 'active' ? activeWallets : archivedWallets
  const hasAnyWallets = activeWallets.length > 0 || archivedWallets.length > 0;


  const handleDeleteClick = (wallet) => {
    if (wallet.isArchived) {
      toast.info('Bạn cần khôi phục ví trước khi xóa.')
      return
    }
    setWalletToDelete(wallet)
    setIsDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!walletToDelete) return
    try {
      await walletService.deleteWallet(walletToDelete.id)
      await refreshWallets()
      toast.success(`Ví "${walletToDelete.name}" đã được xóa thành công.`)
      fetchWallets()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Đã xảy ra lỗi khi xóa ví.')
    } finally {
      setIsDeleteDialogOpen(false)
      setWalletToDelete(null)
    }
  }

  const handleArchiveToggle = async (wallet) => {
    const isArchiving = !wallet.isArchived
    const action = isArchiving ? walletService.archiveWallet : walletService.unarchiveWallet
    const successMessage = isArchiving ? 'lưu trữ' : 'khôi phục'

    try {
      await action(wallet.id)
      toast.success(`Ví "${wallet.name}" đã được ${successMessage} thành công.`)
      await fetchWallets()
      await refreshWallets()
    } catch (error) {
      toast.error(error.response?.data?.message || `Lỗi khi ${successMessage} ví.`)
    }
  }

  const formatCurrency = (amount, currency = 'VND') => {
    if (typeof amount !== 'number') {
      amount = parseFloat(amount) || 0
    }
    return currency === 'USD'
        ? `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
        : `${amount.toLocaleString('vi-VN')} ₫`
  }

  const getWalletColor = (name) => {
    const colors = [
      'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
      'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
      'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
      'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
      'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
    ]
    return colors[name.length % colors.length]
  }

  if (loading) {
    return (
        <div className="space-y-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="h-24 bg-muted rounded"></div>
          </div>
        </div>
    )
  }

  if (!hasAnyWallets) {
    return (
        <div className="text-center">
          <Card className="p-12 text-center">
            <WalletIcon className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold mb-2">
              Chào mừng bạn đến với X Spend
            </h3>
            <p className="text-muted-foreground mb-6">
              Tạo ví đầu tiên để bắt đầu quản lý tài chính của bạn.
            </p>
            <Button onClick={() => navigate('/wallets/add')}>
              <PlusIcon className="w-4 h-4 mr-2" />
              Tạo Ví Đầu Tiên
            </Button>
          </Card>
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
            <Button
                variant={view === 'archived' ? 'default' : 'outline'}
                onClick={() => setView(view === 'active' ? 'archived' : 'active')}
            >
              {view === 'active' ? <ArchiveIcon className="w-4 h-4 mr-2" /> : <WalletIcon className="w-4 h-4 mr-2" />}
              {view === 'active' ? `Ví Lưu Trữ (${archivedWallets.length})` : `Ví Hoạt Động (${activeWallets.length})`}
            </Button>
            <Button onClick={() => navigate('/wallets/add')}>
              <PlusIcon className="w-4 h-4 mr-2" />
              Thêm Ví
            </Button>
          </div>
        </div>

        {view === 'active' && activeWallets.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Tổng Số Dư</p>
                    <p className="text-3xl font-bold">{formatCurrency(totalBalance)}</p>
                    <p className="text-muted-foreground text-sm mt-1">
                      {activeWallets.length} ví đang hoạt động
                    </p>
                  </div>
                  <div>
                    <DollarSignIcon className="w-12 h-12 text-muted-foreground/30" />
                  </div>
                </div>
              </CardContent>
            </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {walletsToDisplay.map((wallet) => (
              <Card key={wallet.id} className={`hover:shadow-md transition-shadow ${wallet.isArchived ? 'opacity-60' : ''}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className={`text-base px-2 py-1 rounded-md inline-block ${getWalletColor(wallet.name)}`}>
                      {wallet.icon} {wallet.name}
                      {wallet.isArchived && <span className="text-xs ml-2">(Lưu trữ)</span>}
                    </CardTitle>
                    <div className="flex space-x-1">
                      {!wallet.isArchived && (
                          <>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate(`/wallets/${wallet.id}`)}><EyeIcon className="w-4 h-4" /></Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate(`/wallets/${wallet.id}/edit`)}><EditIcon className="w-4 h-4" /></Button>
                          </>
                      )}
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleArchiveToggle(wallet)}>
                        {wallet.isArchived ? <ArchiveRestoreIcon className="w-4 h-4 text-blue-500" /> : <ArchiveIcon className="w-4 h-4" />}
                      </Button>
                      <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={() => handleDeleteClick(wallet)}
                          disabled={wallet.isArchived}
                      >
                        <TrashIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Số dư</p>
                  <p className="text-2xl font-bold">{formatCurrency(wallet.balance, wallet.currency)}</p>
                  {wallet.description && <p className="text-sm text-muted-foreground mt-2 italic line-clamp-2">{wallet.description}</p>}
                </CardContent>
              </Card>
          ))}
        </div>

        {walletsToDisplay.length === 0 && (
            <Card className="p-12 text-center">
              <WalletIcon className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {view === 'active' ? 'Chưa có ví nào' : 'Không có ví nào được lưu trữ'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {view === 'active' ? 'Bạn có thể xem các ví đã lưu trữ hoặc tạo một ví mới.' : 'Bạn có thể khôi phục các ví không còn sử dụng.'}
              </p>
            </Card>
        )}

        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Bạn có chắc chắn muốn xóa ví?</AlertDialogTitle>
              <AlertDialogDescription>
                Hành động này không thể được hoàn tác. Thao tác này sẽ xóa vĩnh viễn ví
                <span className="font-bold">&quot;{walletToDelete?.name}&quot;</span>
                và tất cả dữ liệu liên quan.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Hủy</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700">Xóa</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
  )
}

export default WalletList