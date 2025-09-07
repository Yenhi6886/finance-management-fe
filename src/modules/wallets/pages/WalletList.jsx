import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { walletService } from '../services/walletService'
import { 
  PlusIcon, 
  WalletIcon, 
  EyeIcon, 
  EditIcon, 
  TrashIcon, 
  ShareIcon,
  ArchiveIcon,
  ArrowRightLeftIcon,
  CrownIcon,
  UsersIcon,
  ArchiveRestoreIcon,
  DollarSignIcon
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const WalletList = () => {
  const [wallets, setWallets] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalBalance, setTotalBalance] = useState(0)
  const [showArchived, setShowArchived] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetchWallets()
  }, [])

  const fetchWallets = async () => {
    try {
      setLoading(true)
      const response = await walletService.getWallets()
      const walletsData = response.data || []
      setWallets(walletsData)
      
      // Tính tổng số dư (chỉ ví không bị lưu trữ)
      const total = walletsData
        .filter(wallet => wallet.status === 'active')
        .reduce((sum, wallet) => {
          // Convert USD to VND for calculation (rate: 1 USD = 24000 VND)
          const balanceInVND = wallet.currency === 'USD' ? wallet.balance * 24000 : wallet.balance
          return sum + balanceInVND
        }, 0)
      setTotalBalance(total)
    } catch (error) {
      console.error('Error fetching wallets:', error)
      setWallets([]) // Set empty array on error
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteWallet = async (walletId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa ví này? Tất cả dữ liệu sẽ bị mất vĩnh viễn.')) {
      try {
        await walletService.deleteWallet(walletId)
        await fetchWallets()
      } catch (error) {
        console.error('Error deleting wallet:', error)
      }
    }
  }

  const handleArchiveWallet = async (walletId) => {
    try {
      await walletService.archiveWallet(walletId)
      await fetchWallets()
    } catch (error) {
      console.error('Error archiving wallet:', error)
    }
  }

  const handleUnarchiveWallet = async (walletId) => {
    try {
      await walletService.unarchiveWallet(walletId)
      await fetchWallets()
    } catch (error) {
      console.error('Error unarchiving wallet:', error)
    }
  }

  const formatCurrency = (amount, currency = 'VND') => {
    if (currency === 'USD') {
      return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
    }
    return `${amount.toLocaleString('vi-VN')} ₫`
  }

  const getWalletColor = (name) => {
    const colors = [
      'bg-blue-100 text-blue-700',
      'bg-green-100 text-green-700',
      'bg-purple-100 text-purple-700',
      'bg-orange-100 text-orange-700',
      'bg-green-100 text-green-700',
      'bg-indigo-100 text-indigo-700',
      'bg-teal-100 text-teal-700',
      'bg-red-100 text-red-700'
    ]
    const index = name.length % colors.length
    return colors[index]
  }

  const getPermissionBadge = (wallet) => {
    if (wallet.permissions.includes('full') && !wallet.isShared) {
      return "Chủ sở hữu"
    }
    if (wallet.permissions.includes('full') && wallet.isShared) {
      return "Chia sẻ - Chủ sở hữu"
    }
    if (wallet.permissions.includes('view') && !wallet.permissions.includes('full')) {
      return "Chỉ xem"
    }
    return null
  }

  const filteredWallets = (wallets || []).filter(wallet => 
    showArchived ? wallet.status === 'archived' : wallet.status === 'active'
  )

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Quản Lý Ví
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Quản lý các ví tiền và tài khoản của bạn
          </p>
        </div>
        <div className="mt-3 sm:mt-0 flex space-x-2">
          <Button
            onClick={() => setShowArchived(!showArchived)}
            variant="ghost"
            size="sm"
            className="h-10 px-4 text-sm font-light bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-md border-0"
          >
            {showArchived ? (
              <>
                <WalletIcon className="w-4 h-4 mr-1" />
                Ví Đang Dùng
              </>
            ) : (
              <>
                <ArchiveIcon className="w-4 h-4 mr-1" />
                Ví Lưu Trữ
              </>
            )}
          </Button>
          <Button
            onClick={() => navigate('/wallets/transfer')}
            variant="ghost"
            size="sm"
            className="h-10 px-4 text-sm font-light bg-green-100 hover:bg-green-200 dark:bg-green-900 dark:hover:bg-green-800 rounded-md border-0"
          >
            <ArrowRightLeftIcon className="w-4 h-4 mr-1" />
            Chuyển Tiền
          </Button>
          <Button
            onClick={() => navigate('/wallets/add')}
            variant="ghost"
            size="sm"
            className="h-10 px-4 text-sm font-light bg-green-600 hover:bg-green-700 text-white rounded-md border-0"
          >
            <PlusIcon className="w-4 h-4 mr-1" />
            Thêm Ví
          </Button>
        </div>
      </div>

      {/* Tổng quan */}
      {!showArchived && (
        <Card className="bg-gradient-to-r from-green-50 to-green-100 text-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm">Tổng Số Dư Tất Cả Ví</p>
                <p className="text-3xl font-bold text-gray-900">{formatCurrency(totalBalance)}</p>
                <p className="text-green-600 text-sm mt-1">
                  {wallets.filter(w => w.status === 'active').length} ví đang hoạt động
                </p>
              </div>
              <div className="text-right">
                <DollarSignIcon className="w-12 h-12 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Danh sách ví */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWallets.map((wallet) => (
          <Card 
            key={wallet.id} 
            className={`h-96 flex flex-col hover:shadow-lg transition-all duration-300 ${
              wallet.status === 'archived' ? 'opacity-75' : ''
            }`}
          >
            <CardHeader className="pb-3 flex-shrink-0">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className={`text-lg px-3 py-1 rounded-md inline-block ${getWalletColor(wallet.name)}`}>
                    {wallet.name}
                  </CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    {wallet.currency} • {wallet.status === 'archived' ? 'Đã lưu trữ' : 'Đang hoạt động'}
                  </p>
                  {getPermissionBadge(wallet) && (
                    <p className="text-xs mt-1">
                      <span className={`${
                        wallet.permissions.includes('full') && !wallet.isShared 
                          ? 'text-yellow-500' 
                          : wallet.permissions.includes('full') && wallet.isShared 
                            ? 'text-blue-500' 
                            : 'text-gray-500'
                      }`}>
                        {getPermissionBadge(wallet)}
                      </span>
                    </p>
                  )}
                </div>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 rounded-md border-0 hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => navigate(`/wallets/${wallet.id}`)}
                  >
                    <EyeIcon className="w-3 h-3" />
                  </Button>
                  {wallet.permissions.includes('full') && wallet.status === 'active' && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 rounded-md border-0 hover:bg-gray-100 dark:hover:bg-gray-800"
                        onClick={() => navigate(`/wallets/${wallet.id}/edit`)}
                      >
                        <EditIcon className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 rounded-md border-0 hover:bg-gray-100 dark:hover:bg-gray-800"
                        onClick={() => navigate(`/wallets/${wallet.id}/share`)}
                      >
                        <ShareIcon className="w-3 h-3" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0 flex-1 flex flex-col min-h-0">
              <div className="space-y-3 flex-1 min-h-0 overflow-hidden">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Số dư hiện tại</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(wallet.balance, wallet.currency)}
                  </p>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Số tiền ban đầu:</span>
                  <span className="font-medium">
                    {formatCurrency(wallet.initialAmount, wallet.currency)}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Thay đổi:</span>
                  <span className={`font-medium ${
                    wallet.balance >= wallet.initialAmount 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}>
                    {wallet.balance >= wallet.initialAmount ? '+' : ''}
                    {formatCurrency(wallet.balance - wallet.initialAmount, wallet.currency)}
                  </span>
                </div>

                {wallet.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 italic line-clamp-2">
                    {wallet.description}
                  </p>
                )}

                {wallet.isShared && wallet.permissions === 'viewer' && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded text-sm">
                    <p className="text-blue-700 dark:text-blue-300">
                      Được chia sẻ bởi: {wallet.sharedBy}
                    </p>
                  </div>
                )}

                {wallet.isShared && wallet.permissions.includes('full') && wallet.sharedWith && (
                  <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded text-sm">
                    <p className="text-green-700 dark:text-green-300">
                      Đã chia sẻ với: {wallet.sharedWith.length} người
                    </p>
                  </div>
                )}
              </div>

              {/* Action buttons - Always at bottom */}
              {wallet.permissions.includes('full') && (
                <div className="pt-4 mt-auto border-t border-gray-100 dark:border-gray-700 flex space-x-2 flex-shrink-0">
                  {wallet.status === 'archived' ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleUnarchiveWallet(wallet.id)}
                      className="flex-[2] h-8 text-xs font-light text-white rounded-md border-0"
                      style={{ backgroundColor: '#462E34' }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#3a2529'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#462E34'}
                    >
                      <ArchiveRestoreIcon className="w-3 h-3 mr-1" />
                      Khôi phục
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleArchiveWallet(wallet.id)}
                      className="flex-[2] h-8 text-xs font-light text-white rounded-md border-0"
                      style={{ backgroundColor: '#462E34' }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#3a2529'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#462E34'}
                    >
                      <ArchiveIcon className="w-3 h-3 mr-1" />
                      Lưu trữ
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteWallet(wallet.id)}
                    className="flex-1 h-8 text-xs font-light rounded-md border-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900"
                  >
                    <TrashIcon className="w-3 h-3" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty state */}
      {filteredWallets.length === 0 && (
        <Card className="p-12 text-center">
          <WalletIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {showArchived ? 'Không có ví nào được lưu trữ' : 'Chưa có ví nào'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {showArchived 
              ? 'Bạn chưa lưu trữ ví nào. Các ví đã lưu trữ sẽ hiển thị ở đây.'
              : 'Tạo ví đầu tiên để bắt đầu quản lý tài chính của bạn.'
            }
          </p>
          {!showArchived && (
            <Button
              onClick={() => navigate('/wallets/add')}
              variant="ghost"
              size="sm"
              className="h-10 px-4 text-sm font-light bg-green-600 hover:bg-green-700 text-white rounded-md border-0"
            >
              <PlusIcon className="w-4 h-4 mr-1" />
              Tạo Ví Đầu Tiên
            </Button>
          )}
        </Card>
      )}
    </div>
  )
}

export default WalletList
