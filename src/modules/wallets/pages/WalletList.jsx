import React, { useState, useEffect, useContext, useCallback, useRef } from 'react'
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
  ArchiveRestoreIcon,
  Loader2
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
  const [isTogglingArchive, setIsTogglingArchive] = useState(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [walletToDelete, setWalletToDelete] = useState(null)
  const [view, setView] = useState('active')
  const hasShownToastRef = useRef(false)
  const navigate = useNavigate()
  const location = useLocation()
  const [totalBalanceVND, setTotalBalanceVND] = useState(0)
  const [totalBalanceUSD, setTotalBalanceUSD] = useState(0)
  const [balanceLoading, setBalanceLoading] = useState(false)
  const [totalWallets, setTotalWallets] = useState(0)



  

  const fetchWallets = useCallback(async () => {
    try {
      setLoading(true)
      setBalanceLoading(true)
      
      // Gọi API song song
      const results = await Promise.allSettled([
        walletService.getWallets(),
        walletService.getArchivedWallets(),
        walletService.getTotalBalanceVND(),
        walletService.getTotalBalanceUSD()
      ])
      
      // Xử lý danh sách ví active
      if (results[0].status === 'fulfilled') {
        const wallets = results[0].value.data.data || []
        setActiveWallets(wallets)
        setTotalWallets(wallets.length)
      } else {
        console.error('Error fetching active wallets:', results[0].reason)
        setActiveWallets([])
        setTotalWallets(0)
      }
      
      // Xử lý danh sách ví archived
      if (results[1].status === 'fulfilled') {
        setArchivedWallets(results[1].value.data.data || [])
      } else {
        console.error('Error fetching archived wallets:', results[1].reason)
        setArchivedWallets([])
      }
      
      // Xử lý tổng số dư VND từ API
      if (results[2].status === 'fulfilled') {
        const response = results[2].value
        
        // Chỉ lấy totalBalanceVND từ response
        if (response.data && response.data.data && typeof response.data.data.totalBalanceVND === 'number') {
          setTotalBalanceVND(response.data.data.totalBalanceVND)
          console.log('SUCCESS: VND Balance from API:', response.data.data.totalBalanceVND)
        } else {
          console.log('FALLBACK: API không trả về totalBalanceVND hợp lệ')
          // Fallback: tính từ danh sách ví
          const activeWallets = results[0].status === 'fulfilled' ? (results[0].value.data.data || []) : []
          const calculatedVND = activeWallets.reduce((total, wallet) => {
            return total + (wallet.currency === 'VND' ? wallet.balance : 0)
          }, 0)
          setTotalBalanceVND(calculatedVND)
          console.log('FALLBACK: Calculated VND:', calculatedVND)
        }
      } else {
        console.log('ERROR: VND API failed:', results[2].reason)
        // Fallback: tính từ danh sách ví
        const activeWallets = results[0].status === 'fulfilled' ? (results[0].value.data.data || []) : []
        const calculatedVND = activeWallets.reduce((total, wallet) => {
          return total + (wallet.currency === 'VND' ? wallet.balance : 0)
        }, 0)
        setTotalBalanceVND(calculatedVND)
        console.log('FALLBACK after error: Calculated VND:', calculatedVND)
      } 
      
      // Xử lý tổng số dư USD (backup hoặc nếu không có trong summary)
      if (results[3].status === 'fulfilled' && results[3].value.data && results[3].value.data.data) {
        const usdData = results[3].value.data.data
        setTotalBalanceUSD(usdData.totalBalanceUSD || 0)
      } else {
        // Fallback: tính từ danh sách ví
        const activeWallets = results[0].status === 'fulfilled' ? (results[0].value.data.data || []) : []
        const calculatedUSD = activeWallets.reduce((total, wallet) => {
          return total + (wallet.currency === 'USD' ? wallet.balance : 0)
        }, 0)
        setTotalBalanceUSD(calculatedUSD)
      }
      
    } catch (error) {
      console.error('Error fetching wallets:', error)
      toast.error('Không thể tải danh sách ví.')
      setActiveWallets([])
      setArchivedWallets([])
      setTotalBalanceVND(0)
      setTotalBalanceUSD(0)
    } finally {
      setLoading(false)
      setBalanceLoading(false)
    }
  }, [])

  useEffect(() => {
    // This is the main effect for loading data
    fetchWallets()
  }, [fetchWallets])

  useEffect(() => {
    // This effect handles notifications from other pages
    if (location.state?.message && !hasShownToastRef.current) {
      if (location.state.type === 'success') {
        toast.success(location.state.message)
      } else {
        toast.error(location.state.message)
      }
      hasShownToastRef.current = true

      // After showing toast, refresh local data and global context
      fetchWallets()
      refreshWallets()

      // Clean up the location state to prevent re-triggering
      window.history.replaceState({}, document.title)
    }
    // We only want this to run when location.state changes
  }, [location.state, fetchWallets, refreshWallets])

  const handleDeleteClick = (wallet) => {
    if (view === 'archived') {
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
      await fetchWallets()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Đã xảy ra lỗi khi xóa ví.')
    } finally {
      setIsDeleteDialogOpen(false)
      setWalletToDelete(null)
    }
  }

  const handleArchiveToggle = async (wallet) => {
    setIsTogglingArchive(wallet.id)
    const isArchiving = view === 'active'
    const action = isArchiving ? walletService.archiveWallet : walletService.unarchiveWallet
    const successMessage = isArchiving ? 'lưu trữ' : 'khôi phục'

    try {
      await action(wallet.id)
      toast.success(`Ví "${wallet.name}" đã được ${successMessage} thành công.`)
      await fetchWallets()
      await refreshWallets()
    } catch (error) {
      toast.error(error.response?.data?.message || `Lỗi khi ${successMessage} ví.`)
    } finally {
      setIsTogglingArchive(null)
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
    if (!name) return colors[0];
    let hash = 0
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash % colors.length)]
  }

  const walletsToDisplay = view === 'active' ? activeWallets : archivedWallets
  const hasAnyWallets = activeWallets.length > 0 || archivedWallets.length > 0;

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
          <div className="mt-3 sm:mt-0">
            <Button onClick={() => navigate('/wallets/add')}>
              <PlusIcon className="w-4 h-4 mr-2" />
              Thêm Ví
            </Button>
          </div>
        </div>

        <div className="flex space-x-2 border-b">
          <Button variant="ghost" className={`relative h-10 px-4 py-2 ${view === 'active' ? 'text-primary' : 'text-muted-foreground'}`} onClick={() => setView('active')}>
            Ví Hoạt Động ({activeWallets.length})
            {view === 'active' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"></div>}
          </Button>
          <Button variant="ghost" className={`relative h-10 px-4 py-2 ${view === 'archived' ? 'text-primary' : 'text-muted-foreground'}`} onClick={() => setView('archived')}>
            Ví Lưu Trữ ({archivedWallets.length})
            {view === 'archived' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"></div>}
          </Button>
        </div>

        {view === 'active' && activeWallets.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Tổng số dư VND */}
              <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-700 dark:text-green-300 text-sm font-medium">Tổng Số Dư VND</p>
                      <p className="text-2xl font-bold text-green-800 dark:text-green-200 mt-1">
                        {balanceLoading ? (
                          <span className="inline-block animate-pulse bg-green-300 dark:bg-green-700 h-8 w-32 rounded"></span>
                        ) : (
                          formatCurrency(totalBalanceVND, 'VND')
                        )}
                      </p>
                      <p className="text-green-600 dark:text-green-400 text-xs mt-2">
                        Tiền Việt Nam
                      </p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-green-200 dark:bg-green-800/50 flex items-center justify-center">
                      <DollarSignIcon className="w-6 h-6 text-green-700 dark:text-green-300" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tổng số dư USD */}
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-700 dark:text-blue-300 text-sm font-medium">Tổng Số Dư USD</p>
                      <p className="text-2xl font-bold text-blue-800 dark:text-blue-200 mt-1">
                        {balanceLoading ? (
                          <span className="inline-block animate-pulse bg-blue-300 dark:bg-blue-700 h-8 w-32 rounded"></span>
                        ) : (
                          formatCurrency(totalBalanceUSD, 'USD')
                        )}
                      </p>
                      <p className="text-blue-600 dark:text-blue-400 text-xs mt-2">
                        Đô la Mỹ
                      </p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-blue-200 dark:bg-blue-800/50 flex items-center justify-center">
                      <DollarSignIcon className="w-6 h-6 text-blue-700 dark:text-blue-300" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Thông tin tổng quan ví */}
              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-700 dark:text-purple-300 text-sm font-medium">Tổng Ví</p>
                      <p className="text-2xl font-bold text-purple-800 dark:text-purple-200 mt-1">
                        {balanceLoading ? (
                          <span className="inline-block animate-pulse bg-purple-300 dark:bg-purple-700 h-8 w-16 rounded"></span>
                        ) : (
                          totalWallets || activeWallets.length
                        )}
                      </p>
                      <p className="text-purple-600 dark:text-purple-400 text-xs mt-2">
                        Tổng số ví
                      </p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-purple-200 dark:bg-purple-800/50 flex items-center justify-center">
                      <WalletIcon className="w-6 h-6 text-purple-700 dark:text-purple-300" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
        )}

        {/* Thông tin chi tiết tỷ giá và phân tích */}
        {view === 'active' && activeWallets.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Đã ẩn phần phân tích theo loại tiền tệ */}
              
              {/* Tỷ giá ước tính */}
              {totalBalanceUSD > 0 && (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>💡 Tỷ giá ước tính: 1 USD ≈ 25,400 VND</span>
                    </div>
                    <div className="mt-2 text-sm">
                      <span className="font-medium">USD quy đổi:</span>
                      <span className="ml-2 font-bold text-green-600">
                        ~{formatCurrency(totalBalanceUSD * 25400, 'VND')}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
        )}

        {/* Thông tin tỷ giá đơn giản */}
        {view === 'active' && activeWallets.length > 0 && totalBalanceUSD > 0 && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>
                    💡 Tỷ giá ước tính: 1 USD ≈ 25,400 VND
                  </span>
                  <span>
                    Tương đương: ~{formatCurrency(totalBalanceUSD * 25400, 'VND')}
                  </span>
                </div>
              </CardContent>
            </Card>
        )}

        {walletsToDisplay.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {walletsToDisplay.map((wallet) => (
                  <Card key={wallet.id} className={`hover:shadow-md transition-shadow ${view === 'archived' ? 'bg-muted/50' : ''}`}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className={`text-base px-2 py-1 rounded-md inline-block ${getWalletColor(wallet.name)}`}>
                          {wallet.icon} {wallet.name}
                        </CardTitle>
                        <div className="flex space-x-1">
                          {view === 'active' && (
                              <>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate(`/wallets/${wallet.id}`)}><EyeIcon className="w-4 h-4" /></Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate(`/wallets/${wallet.id}/edit`)}><EditIcon className="w-4 h-4" /></Button>
                              </>
                          )}
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleArchiveToggle(wallet)} disabled={isTogglingArchive === wallet.id}>
                            {isTogglingArchive === wallet.id ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                                view === 'archived' ? <ArchiveRestoreIcon className="w-4 h-4 text-blue-500" /> : <ArchiveIcon className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-500 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                              onClick={() => handleDeleteClick(wallet)}
                              disabled={view === 'archived'}
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
        ) : (
            <Card className="p-12 text-center mt-6">
              <WalletIcon className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {view === 'active' ? 'Chưa có ví nào đang hoạt động' : 'Không có ví nào trong kho lưu trữ'}
              </h3>
              <p className="text-muted-foreground">
                {view === 'active' ? 'Tạo một ví mới hoặc khôi phục ví từ kho lưu trữ.' : 'Bạn có thể khôi phục các ví không còn sử dụng từ đây.'}
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