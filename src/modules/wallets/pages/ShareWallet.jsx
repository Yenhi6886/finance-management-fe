import React, { useState, useEffect, useCallback } from 'react'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import {
  ArrowLeftIcon,
  Settings2Icon,
  UsersIcon,
  LinkIcon,
  MailIcon,
  EyeIcon,
  Edit3Icon,
  CrownIcon,
  ShieldCheckIcon,
  StarIcon,
  LockIcon,
  UploadCloudIcon,
  Trash2Icon,
  AlertCircleIcon,
  CheckCircle2Icon,
  CopyIcon,
  XIcon
} from 'lucide-react'
import { cn } from '../../../lib/utils'
import { walletService } from '../services/walletService'
import { Alert, AlertDescription, AlertTitle } from '../../../components/ui/alert'
import { LoadingScreen } from "../../../components/Loading.jsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select'
import { IconComponent } from '../../../shared/config/icons'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "../../../components/ui/dialog.jsx";

const ShareWallet = () => {
  const [myWallets, setMyWallets] = useState([])
  const [selectedWallet, setSelectedWallet] = useState('')
  const [permissionLevel, setPermissionLevel] = useState('VIEW')
  const [shareMethod, setShareMethod] = useState('email')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [expiryDate, setExpiryDate] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [dateError, setDateError] = useState(null)

  const [sharedByMe, setSharedByMe] = useState([])
  const [sharedWithMe, setSharedWithMe] = useState([])
  const [activeTab, setActiveTab] = useState('share')

  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false)
  const [shareLink, setShareLink] = useState('')
  const [copyButtonText, setCopyButtonText] = useState('Sao chép')

  const fetchMyWallets = useCallback(async () => {
    try {
      const response = await walletService.getMyWallets()
      const walletsData = response.data.data || []
      setMyWallets(walletsData)
      if (walletsData.length > 0) {
        setSelectedWallet(walletsData[0].id)
      }
    } catch (err) {
      setError('Không thể tải danh sách ví của bạn.')
    }
  }, [])

  const fetchSharedByMe = useCallback(async () => {
    try {
      setLoading(true)
      const response = await walletService.getWalletsSharedByMe()
      setSharedByMe(response.data.data || [])
    } catch (err) {
      setError('Không thể tải danh sách ví đã chia sẻ.')
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchSharedWithMe = useCallback(async () => {
    try {
      setLoading(true)
      const response = await walletService.getWalletsSharedWithMe()
      setSharedWithMe(response.data.data || [])
    } catch (err) {
      setError('Không thể tải danh sách ví được chia sẻ.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMyWallets()
  }, [fetchMyWallets])

  useEffect(() => {
    if (activeTab === 'sharedByMe') {
      fetchSharedByMe()
    } else if (activeTab === 'sharedWithMe') {
      fetchSharedWithMe()
    }
  }, [activeTab, fetchSharedByMe, fetchSharedWithMe])

  useEffect(() => {
    let timer;
    if (successMessage || error) {
      timer = setTimeout(() => {
        setSuccessMessage(null);
        setError(null);
      }, 10000);
    }
    return () => clearTimeout(timer);
  }, [successMessage, error]);

  const formatCurrency = (amount, currency = 'VND') => {
    const formatted = new Intl.NumberFormat('vi-VN').format(amount)
    return currency === 'USD' ? `$${formatted}` : `${formatted} ₫`
  }

  const resetForm = () => {
    setEmail('')
    setMessage('')
    setExpiryDate('')
    setPermissionLevel('VIEW')
    setDateError(null)
    if (myWallets.length > 0) {
      setSelectedWallet(myWallets[0].id)
    }
  }

  const validateDate = (date) => {
    if (!date) return true // Empty date is allowed
    
    const selectedDate = new Date(date)
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Reset time to compare only dates
    
    if (selectedDate < today) {
      setDateError('Ngày hết hạn không được nhỏ hơn ngày hiện tại')
      return false
    }
    
    setDateError(null)
    return true
  }

  const handleDateChange = (e) => {
    const newDate = e.target.value
    setExpiryDate(newDate)
    validateDate(newDate)
  }

  const handleShare = async () => {
    setError(null)
    setSuccessMessage(null)
    setDateError(null)
    
    // Validate date before proceeding
    if (expiryDate && !validateDate(expiryDate)) {
      return
    }
    
    setLoading(true)

    // Convert date to proper format for backend
    let formattedExpiryDate = null
    if (expiryDate) {
      // Convert YYYY-MM-DD to LocalDateTime format (end of day)
      const date = new Date(expiryDate)
      date.setHours(23, 59, 59, 999) // Set to end of day
      formattedExpiryDate = date.toISOString()
    }

    const payload = {
      walletId: selectedWallet,
      permissionLevel,
      message,
      expiryDate: formattedExpiryDate
    }

    try {
      if (shareMethod === 'email') {
        if (!email) {
          setError('Vui lòng nhập email người nhận.')
          setLoading(false)
          return
        }
        await walletService.shareWalletByEmail({ ...payload, email })
        setSuccessMessage('Chia sẻ ví thành công. Một email thông báo đã được gửi tới người nhận.')
        resetForm()
        fetchSharedByMe()
      } else if (shareMethod === 'link') {
        const response = await walletService.createShareLink(payload)
        const token = response.data.data.shareToken
        const link = `${window.location.origin}/wallets/accept-share?token=${token}`
        setShareLink(link)
        setIsLinkModalOpen(true)
        setSuccessMessage('Tạo link chia sẻ thành công!')
        resetForm()
      }
    } catch (err) {
      // Handle specific error messages
      let errorMessage = 'Đã có lỗi xảy ra.'
      
      if (err.response?.data?.message) {
        const serverMessage = err.response.data.message
        
        // Handle common date-related errors
        if (serverMessage.includes('LocalDateTime') || serverMessage.includes('parse')) {
          errorMessage = 'Định dạng ngày không hợp lệ. Vui lòng chọn lại ngày hết hạn.'
        } else if (serverMessage.includes('past') || serverMessage.includes('expired')) {
          errorMessage = 'Ngày hết hạn phải là ngày trong tương lai.'
        } else if (serverMessage.includes('email')) {
          errorMessage = 'Email không hợp lệ hoặc không tồn tại.'
        } else if (serverMessage.includes('permission')) {
          errorMessage = 'Bạn không có quyền chia sẻ ví này.'
        } else if (serverMessage.includes('wallet')) {
          errorMessage = 'Ví được chọn không tồn tại hoặc đã bị xóa.'
        } else {
          errorMessage = serverMessage
        }
      }
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleRevoke = async (shareId) => {
    if (!window.confirm('Bạn có chắc chắn muốn thu hồi quyền truy cập vào ví này không?')) {
      return
    }

    setError(null)
    setSuccessMessage(null)
    setLoading(true)
    try {
      await walletService.revokeWalletShare(shareId)
      setSuccessMessage('Thu hồi quyền truy cập thành công.')
      fetchSharedByMe()
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể thu hồi quyền truy cập.')
    } finally {
      setLoading(false)
    }
  }

  const handlePermissionChange = async (walletId, userId, newPermission) => {
    setError(null)
    setSuccessMessage(null)
    try {
      await walletService.updateSharePermission(walletId, userId, newPermission)
      setSuccessMessage('Cập nhật quyền thành công.')
      setSharedByMe(prevShares =>
          prevShares.map(share =>
              share.walletId === walletId && share.sharedWithUserId === userId
                  ? { ...share, permissionLevel: newPermission }
                  : share
          )
      )
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể cập nhật quyền.')
    }
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink).then(() => {
      setCopyButtonText('Đã sao chép!')
      setTimeout(() => setCopyButtonText('Sao chép'), 2000)
    })
  }

  const permissionDisplay = {
    VIEW: { text: 'Chỉ xem', color: 'text-gray-500' },
    EDIT: { text: 'Chỉnh sửa', color: 'text-yellow-500' },
    OWNER: { text: 'Chủ sở hữu', color: 'text-red-500' }
  }

  const renderSharedByMeList = () => {
    if (loading) return <LoadingScreen />
    if (sharedByMe.length === 0) {
      return <p className="text-center text-gray-500 dark:text-gray-400 py-8">Bạn chưa chia sẻ ví nào.</p>
    }
    return (
        <div className="space-y-4">
          {sharedByMe.map((share) => (
              <div key={share.id} className="bg-background border border-border rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-1">
                  <p className="font-semibold text-card-foreground">{share.walletName}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Đã chia sẻ cho: <span className="font-medium text-primary">{share.sharedWithEmail}</span>
                  </p>
                  {share.createdAt && (
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      Chia sẻ lúc: {new Date(share.createdAt).toLocaleString('vi-VN', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <select
                      value={share.permissionLevel}
                      onChange={(e) => handlePermissionChange(share.walletId, share.sharedWithUserId, e.target.value)}
                      className="text-sm font-medium px-2 py-1 rounded bg-background border border-border focus:ring-2 focus:ring-primary dark:bg-card"
                  >
                    {Object.entries(permissionDisplay).map(([key, value]) => (
                        <option key={key} value={key}>
                          {value.text}
                        </option>
                    ))}
                  </select>
                  <Button variant="destructive" size="sm" onClick={() => handleRevoke(share.id)}>
                    <Trash2Icon className="w-4 h-4 mr-2" />
                    Thu hồi
                  </Button>
                </div>
              </div>
          ))}
        </div>
    )
  }

  const renderSharedWithMeList = () => {
    if (loading) return <LoadingScreen />
    if (sharedWithMe.length === 0) {
      return <p className="text-center text-gray-500 dark:text-gray-400 py-8">Không có ví nào được chia sẻ với bạn.</p>
    }
    return (
        <div className="space-y-4">
          {sharedWithMe.map((share) => (
              <div key={share.id} className="bg-background border border-border rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-1">
                  <p className="font-semibold text-card-foreground">{share.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Được chia sẻ bởi: <span className="font-medium text-primary">{share.ownerName} ({share.ownerEmail})</span>
                  </p>
                  {share.sharedAt && (
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      Chia sẻ lúc: {new Date(share.sharedAt).toLocaleString('vi-VN', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-4">
              <span className={cn('text-sm font-medium px-2 py-1 rounded', permissionDisplay[share.permissionLevel]?.color)}>
                {permissionDisplay[share.permissionLevel]?.text || share.permissionLevel}
              </span>
                </div>
              </div>
          ))}
        </div>
    )
  }

  return (
      <div>
        <Dialog open={isLinkModalOpen} onOpenChange={setIsLinkModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Link Chia Sẻ Ví</DialogTitle>
              <DialogDescription>
                Sao chép và gửi link này cho người bạn muốn chia sẻ. Link sẽ có hiệu lực cho đến khi bạn thu hồi hoặc hết hạn.
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center space-x-2">
              <div className="grid flex-1 gap-2">
                <Label htmlFor="link" className="sr-only">
                  Link
                </Label>
                <Input
                    id="link"
                    defaultValue={shareLink}
                    readOnly
                />
              </div>
              <Button type="submit" size="sm" className="px-3" onClick={handleCopyLink}>
                <span className="sr-only">Copy</span>
                <CopyIcon className="h-4 w-4" />
                {copyButtonText}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-green-600">
              Chia Sẻ Ví
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Chia sẻ ví với người khác và quản lý quyền truy cập
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Button
              onClick={() => window.history.back()}
              variant="ghost"
              size="sm"
              className="h-10 px-4 text-sm font-light bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-800/30 text-green-600 dark:text-green-400 rounded-sm border-0"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-1" />
              Quay lại
            </Button>
          </div>
        </div>

        <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
          <nav className="-mb-px flex space-x-6">
            <button
                onClick={() => setActiveTab('share')}
                className={cn(
                    'flex items-center py-3 px-1 border-b-2 font-medium text-sm',
                    activeTab === 'share'
                        ? 'border-green-500 text-green-600 dark:text-green-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                )}
            >
              <UploadCloudIcon className="w-5 h-5 mr-2" />
              Chia Sẻ Ví
            </button>
            <button
                onClick={() => setActiveTab('sharedByMe')}
                className={cn(
                    'flex items-center py-3 px-1 border-b-2 font-medium text-sm',
                    activeTab === 'sharedByMe'
                        ? 'border-green-500 text-green-600 dark:text-green-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                )}
            >
              <Settings2Icon className="w-5 h-5 mr-2" />
              Ví Đã Chia Sẻ ({sharedByMe.length})
            </button>
            <button
                onClick={() => setActiveTab('sharedWithMe')}
                className={cn(
                    'flex items-center py-3 px-1 border-b-2 font-medium text-sm',
                    activeTab === 'sharedWithMe'
                        ? 'border-green-500 text-green-600 dark:text-green-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                )}
            >
              <UsersIcon className="w-5 h-5 mr-2" />
              Ví Được Chia Sẻ ({sharedWithMe.length})
            </button>
          </nav>
        </div>

        {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircleIcon className="h-4 w-4" />
              <AlertTitle>Lỗi</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
              <button onClick={() => setError(null)} className="absolute top-1.5 right-1.5 p-1 rounded-md hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
                <XIcon className="h-4 w-4" />
              </button>
            </Alert>
        )}
        {successMessage && (
            <Alert variant="success" className="mb-4">
              <CheckCircle2Icon className="h-4 w-4" />
              <AlertTitle>Thành công</AlertTitle>
              <AlertDescription>{successMessage}</AlertDescription>
              <button onClick={() => setSuccessMessage(null)} className="absolute top-1.5 right-1.5 p-1 rounded-md hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
                <XIcon className="h-4 w-4" />
              </button>
            </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {activeTab === 'share' && (
              <>
                <div className="lg:col-span-2">
                  <div className="bg-white dark:bg-card rounded-lg border border-border p-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <h2 className="text-2xl font-semibold text-card-foreground">Chia Sẻ Ví</h2>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <Label htmlFor="walletSelect" className="font-medium">
                          Chọn ví để chia sẻ <span className="text-red-500">*</span>
                        </Label>
                        <Select onValueChange={setSelectedWallet} value={selectedWallet} disabled={myWallets.length === 0}>
                          <SelectTrigger className="mt-1 h-10 text-base border-2 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors hover:border-gray-400 dark:hover:border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed">
                            <SelectValue placeholder="Chọn ví để chia sẻ">
                              {selectedWallet && myWallets.find(w => w.id === selectedWallet) && (
                                <div className="flex items-center space-x-2">
                                  <IconComponent name={myWallets.find(w => w.id === selectedWallet).icon} className="w-4 h-4" />
                                  <span>{myWallets.find(w => w.id === selectedWallet).name} - {formatCurrency(myWallets.find(w => w.id === selectedWallet).balance, myWallets.find(w => w.id === selectedWallet).currency)}</span>
                                </div>
                              )}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {myWallets.length > 0 ? (
                                myWallets.map(wallet => (
                                    <SelectItem key={wallet.id} value={wallet.id}>
                                      <div className="flex items-center space-x-2">
                                        <IconComponent name={wallet.icon} className="w-4 h-4" />
                                        <span>{wallet.name} - {formatCurrency(wallet.balance, wallet.currency)}</span>
                                      </div>
                                    </SelectItem>
                                ))
                            ) : (
                                <SelectItem value="" disabled>Không có ví nào để chia sẻ</SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="font-medium">
                          Loại quyền truy cập <span className="text-red-500">*</span>
                        </Label>
                        <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                          {[
                            { type: 'VIEW', icon: EyeIcon, title: 'Người Xem', description: 'Chỉ có thể xem thông tin ví và lịch sử giao dịch' },
                            { type: 'EDIT', icon: Edit3Icon, title: 'Chỉnh Sửa', description: 'Thêm/sửa ghi chú, phân loại giao dịch. Không thể chuyển tiền' },
                            { type: 'OWNER', icon: CrownIcon, title: 'Chủ Sở Hữu', description: 'Có thể thực hiện mọi thao tác như chủ ví' }
                          ].map(({ type, icon: Icon, title, description }) => (
                              <div
                                  key={type}
                                  onClick={() => setPermissionLevel(type)}
                                  className={cn(
                                      'border rounded-lg p-4 cursor-pointer transition-all',
                                      permissionLevel === type
                                          ? 'border-green-500 bg-green-50 dark:bg-green-900/20 ring-2 ring-green-500'
                                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-400'
                                  )}
                              >
                                <div className="flex items-center space-x-3 mb-2">
                                  <Icon className={`w-5 h-5 ${permissionLevel === type ? 'text-green-600' : 'text-gray-500'}`} />
                                  <span className="font-semibold text-card-foreground flex items-center">{title}</span>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
                              </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label className="font-medium">Phương thức chia sẻ</Label>
                        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div
                              onClick={() => setShareMethod('email')}
                              className={cn(
                                  'border rounded-lg p-4 cursor-pointer transition-all flex items-center space-x-4',
                                  shareMethod === 'email' ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-gray-400'
                              )}
                          >
                            <MailIcon className={`w-6 h-6 ${shareMethod === 'email' ? 'text-green-600' : 'text-gray-500'}`} />
                            <div>
                              <p className="font-semibold text-card-foreground">Email</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Gửi lời mời qua email</p>
                            </div>
                          </div>
                          <div
                              onClick={() => setShareMethod('link')}
                              className={cn(
                                  'border rounded-lg p-4 cursor-pointer transition-all flex items-center space-x-4',
                                  shareMethod === 'link' ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-gray-400'
                              )}
                          >
                            <LinkIcon className={`w-6 h-6 ${shareMethod === 'link' ? 'text-green-600' : 'text-gray-500'}`} />
                            <div>
                              <p className="font-semibold text-card-foreground">Link Chia Sẻ</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Tạo link để chia sẻ</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {shareMethod === 'link' && (
                          <div className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-300 rounded-lg p-4 flex items-start space-x-3 text-sm">
                            <LinkIcon className="w-5 h-5 flex-shrink-0 mt-0.5"/>
                            <p>Tạo link chia sẻ để gửi cho bất kỳ ai. Link sẽ có thể truy cập được cho đến khi bạn thu hồi hoặc hết hạn.</p>
                          </div>
                      )}

                      {shareMethod === 'email' && (
                          <div>
                            <Label htmlFor="emailInput">Email người nhận</Label>
                            <Input id="emailInput" type="email" placeholder="Nhập email..." className="mt-1" value={email} onChange={(e) => setEmail(e.target.value)} />
                          </div>
                      )}

                      <div>
                        <Label htmlFor="message">Tin nhắn (tùy chọn)</Label>
                        <textarea
                            id="message"
                            placeholder="Thêm tin nhắn cá nhân..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows={3}
                            className="mt-1 w-full p-2 text-sm border rounded-md bg-background border-gray-300 dark:border-gray-600 resize-none"
                            maxLength={500}
                        />
                        <p className="text-xs text-gray-500 text-right mt-1">
                          {message.length}/500 ký tự
                        </p>
                      </div>

                      <div>
                        <Label htmlFor="expiryDate">Ngày hết hạn (tùy chọn)</Label>
                        <Input
                            id="expiryDate"
                            type="date"
                            value={expiryDate}
                            onChange={handleDateChange}
                            min={new Date().toISOString().split('T')[0]}
                            className={`mt-1 ${dateError ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                        />
                        {dateError && (
                          <p className="text-xs text-red-500 mt-1 flex items-center">
                            <AlertCircleIcon className="w-3 h-3 mr-1" />
                            {dateError}
                          </p>
                        )}
                        {!dateError && (
                          <p className="text-xs text-gray-500 mt-1">
                            Để trống nếu không muốn đặt thời hạn
                          </p>
                        )}
                      </div>

                      <div className="pt-2">
                        <Button
                            onClick={handleShare}
                            disabled={!selectedWallet || !permissionLevel || loading}
                            className="w-full bg-green-600 hover:bg-green-700 text-white"
                        >
                          {loading ? <LoadingScreen/> : <LinkIcon className="w-4 h-4 mr-2" />}
                          {shareMethod === 'link' ? 'Tạo Link Chia Sẻ' : 'Gửi Lời Mời'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-white dark:bg-card rounded-lg border border-border p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <StarIcon className="w-5 h-5 text-yellow-500" />
                      <h3 className="text-base font-semibold text-card-foreground">Mẹo Chia Sẻ</h3>
                    </div>
                    <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                      <li className="flex items-start"><ShieldCheckIcon className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" /><span>Chỉ chia sẻ với những người bạn tin tưởng</span></li>
                      <li className="flex items-start"><ShieldCheckIcon className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" /><span>Đặt thời hạn cho liên kết để tăng bảo mật</span></li>
                      <li className="flex items-start"><ShieldCheckIcon className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" /><span>Kiểm tra quyền truy cập thường xuyên</span></li>
                      <li className="flex items-start"><ShieldCheckIcon className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" /><span>Sử dụng quyền chỉ xem cho hầu hết trường hợp</span></li>
                    </ul>
                  </div>

                  <div className="bg-white dark:bg-card rounded-lg border border-border p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <LockIcon className="w-5 h-5 text-blue-500" />
                      <h3 className="text-base font-semibold text-card-foreground">Hướng Dẫn Quyền</h3>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div className="border border-gray-200 dark:border-gray-700 rounded-md p-3">
                        <div className="flex items-center space-x-2 mb-1">
                          <EyeIcon className="w-4 h-4 text-gray-500" />
                          <span className="font-medium text-card-foreground">Chỉ Xem</span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Xem số dư, lịch sử giao dịch. Không thể thay đổi gì.</p>
                      </div>
                      <div className="border border-gray-200 dark:border-gray-700 rounded-md p-3">
                        <div className="flex items-center space-x-2 mb-1">
                          <Edit3Icon className="w-4 h-4 text-gray-500" />
                          <span className="font-medium text-card-foreground">Chỉnh Sửa</span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Thêm/sửa ghi chú, phân loại giao dịch. Không thể chuyển tiền.</p>
                      </div>
                      <div className="border border-gray-200 dark:border-gray-700 rounded-md p-3">
                        <div className="flex items-center space-x-2 mb-1">
                          <CrownIcon className="w-4 h-4 text-gray-500" />
                          <span className="font-medium text-card-foreground">Toàn Quyền</span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Có thể thực hiện mọi thao tác như chủ ví.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
          )}

          {activeTab === 'sharedByMe' && (
              <div className="lg:col-span-3 bg-white dark:bg-card rounded-lg border border-border p-6">
                {renderSharedByMeList()}
              </div>
          )}

          {activeTab === 'sharedWithMe' && (
              <div className="lg:col-span-3 bg-white dark:bg-card rounded-lg border border-border p-6">
                {renderSharedWithMeList()}
              </div>
          )}
        </div>
      </div>
  )
}

export default ShareWallet