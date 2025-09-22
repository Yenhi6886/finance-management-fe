import React, { useState, useEffect, useCallback } from 'react'
import { Button } from '../../../components/ui/button.jsx'
import { Input } from '../../../components/ui/input.jsx'
import { Label } from '../../../components/ui/label.jsx'
import {
  ArrowLeftIcon,
  Settings2Icon,
  UsersIcon,
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
  XIcon,
  ClockIcon,
  CheckIcon,
  XCircleIcon,
  BanIcon
} from 'lucide-react'
import { cn } from '../../../lib/utils.js'
import { walletService } from '../services/walletService.js'
import { Alert, AlertDescription, AlertTitle } from '../../../components/ui/alert.jsx'
import { LoadingSpinner as Loading, LottieLoader } from "../../../components/Loading.jsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select.jsx'
import { IconComponent } from '../../../shared/config/icons.js'
import { Badge } from '../../../components/ui/badge.jsx'
import { useAuth } from '../../auth/contexts/AuthContext.jsx'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog.jsx"
import { toast } from 'sonner'

const ShareWallet = () => {
  const { user } = useAuth(); // Get current user info
  const [myWallets, setMyWallets] = useState([])
  const [selectedWallet, setSelectedWallet] = useState('')
  const [permissionLevel, setPermissionLevel] = useState('VIEW')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const [loading, setLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPageLoading, setShowPageLoading] = useState(false)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  // Modal states
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [shareToRevoke, setShareToRevoke] = useState(null)

  const [sharedByMe, setSharedByMe] = useState([])
  const [sharedWithMe, setSharedWithMe] = useState([])
  const [activeTab, setActiveTab] = useState('share')

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

  const fetchSharedByMe = useCallback(async (showLoading = true) => {
    if (!user) return; // Wait until user info is available
    try {
      if (showLoading) setLoading(true)
      const response = await walletService.getWalletsSharedByMe()
      const allShares = response.data.data || [];
      // Filter out shares to the owner themselves
      setSharedByMe(allShares.filter(share => share.sharedWithEmail !== user.email));
    } catch (err) {
      setError('Không thể tải danh sách ví đã chia sẻ.')
    } finally {
      if (showLoading) setLoading(false)
    }
  }, [user])

  const fetchSharedWithMe = useCallback(async (showLoading = true) => {
    if (!user) return; // Wait until user info is available
    try {
      if (showLoading) setLoading(true)
      const response = await walletService.getWalletsSharedWithMe()
      const allShares = response.data.data || [];
      // Filter out wallets owned by the current user
      setSharedWithMe(allShares.filter(share => share.ownerEmail !== user.email));
    } catch (err) {
      setError('Không thể tải danh sách ví được chia sẻ.')
    } finally {
      if (showLoading) setLoading(false)
    }
  }, [user])

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchMyWallets(),
      fetchSharedByMe(false),
      fetchSharedWithMe(false)
    ]).finally(() => setLoading(false));
  }, [fetchMyWallets, fetchSharedByMe, fetchSharedWithMe])

  useEffect(() => {
    let timer;
    if (successMessage || error) {
      timer = setTimeout(() => {
        setSuccessMessage(null);
        setError(null);
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [successMessage, error]);

  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: currency || 'VND' }).format(amount);
  }

  const resetForm = () => {
    setEmail('')
    setMessage('')
    setPermissionLevel('VIEW')
    if (myWallets.length > 0) {
      setSelectedWallet(myWallets[0].id)
    }
  }

  const handleShare = async () => {
    setError(null)
    setSuccessMessage(null)

    if (!email) {
      setError('Vui lòng nhập email người nhận.')
      return;
    }

    setIsSubmitting(true)
    setShowPageLoading(true)

    const payload = {
      walletId: selectedWallet,
      permissionLevel,
      message,
      email
    }

    try {
      await walletService.shareWalletByInvitation(payload)
      setSuccessMessage('Lời mời chia sẻ ví đã được gửi thành công!')
      toast.success('Lời mời chia sẻ ví đã được gửi thành công!', {
        duration: 3000,
        position: 'top-right'
      })
      resetForm()
      fetchSharedByMe(false)
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Đã có lỗi xảy ra khi gửi lời mời.'
      setError(errorMessage)
      toast.error(errorMessage, {
        duration: 4000,
        position: 'top-right'
      })
    } finally {
      setIsSubmitting(false)
      setShowPageLoading(false)
    }
  }

  const handleRevoke = async (shareId) => {
    const shareItem = sharedByMe.find(share => share.id === shareId)
    setShareToRevoke(shareItem)
    setShowConfirmModal(true)
  }

  const confirmRevoke = async () => {
    if (!shareToRevoke) return

    setError(null)
    setSuccessMessage(null)
    setLoading(true)
    setShowConfirmModal(false)
    
    try {
      await walletService.revokeWalletShare(shareToRevoke.id)
      setSuccessMessage('Thu hồi/xóa chia sẻ thành công.')
      toast.success('Thu hồi/xóa chia sẻ thành công!', {
        duration: 3000,
        position: 'top-right'
      })
      fetchSharedByMe(false)
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Không thể thực hiện hành động này.'
      setError(errorMessage)
      toast.error(errorMessage, {
        duration: 4000,
        position: 'top-right'
      })
    } finally {
      setLoading(false)
      setShareToRevoke(null)
    }
  }

  const handlePermissionChange = async (shareId, newPermission) => {
    setError(null)
    setSuccessMessage(null)
    try {
      await walletService.updateSharePermission(shareId, newPermission)
      setSuccessMessage('Cập nhật quyền thành công.')
      toast.success('Cập nhật quyền thành công!', {
        duration: 3000,
        position: 'top-right'
      })
      fetchSharedByMe(false)
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Không thể cập nhật quyền.'
      setError(errorMessage)
      toast.error(errorMessage, {
        duration: 4000,
        position: 'top-right'
      })
      fetchSharedByMe(false)
    }
  }

  const permissionDisplay = {
    VIEW: { text: 'Chỉ xem', icon: EyeIcon, color: 'text-blue-600' },
    EDIT: { text: 'Chỉnh sửa', icon: Edit3Icon, color: 'text-amber-600' },
    OWNER: { text: 'Chủ sở hữu', icon: CrownIcon, color: 'text-red-600' }
  }

  const statusDisplay = {
    PENDING: { text: 'Đang chờ', icon: ClockIcon, color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' },
    ACCEPTED: { text: 'Đã chấp nhận', icon: CheckIcon, color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' },
    REJECTED: { text: 'Đã từ chối', icon: XCircleIcon, color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' },
    REVOKED: { text: 'Đã thu hồi', icon: BanIcon, color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' },
    EXPIRED: { text: 'Đã hết hạn', icon: ClockIcon, color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' },
  }

  const renderSharedByMeList = () => {
    if (loading) return <div className="flex justify-center py-8"><Loading /></div>
    if (sharedByMe.length === 0) {
      return <p className="text-center text-muted-foreground py-8">Bạn chưa chia sẻ ví nào cho người khác.</p>
    }
    return (
        <div className="space-y-4">
          {sharedByMe.map((share) => (
              <div key={share.id} className="bg-background border border-border rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-1">
                  <p className="font-semibold text-card-foreground">{share.walletName}</p>
                  <p className="text-sm text-muted-foreground">
                    Chia sẻ tới: <span className="font-medium text-primary">{share.sharedWithEmail}</span>
                  </p>
                  {share.createdAt && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Ngày gửi: {new Date(share.createdAt).toLocaleString('vi-VN')}
                      </p>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <Badge variant="outline" className={cn("py-2 px-3 text-xs w-full sm:w-auto justify-center", statusDisplay[share.status]?.color)}>
                    {React.createElement(statusDisplay[share.status]?.icon, { className: 'w-4 h-4 mr-2 flex-shrink-0' })}
                    {statusDisplay[share.status]?.text}
                  </Badge>
                  <Select
                      value={share.permissionLevel}
                      onValueChange={(value) => handlePermissionChange(share.id, value)}
                      disabled={share.status !== 'ACCEPTED'}
                  >
                    <SelectTrigger className="w-full sm:w-40 h-10 text-sm font-medium">
                      <SelectValue placeholder="Chọn quyền"/>
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(permissionDisplay).map(([key, {text, icon: Icon, color}]) => (
                          <SelectItem key={key} value={key}>
                            <div className="flex items-center space-x-2">
                              <Icon className={cn("w-4 h-4", color)} />
                              <span className={cn("font-medium", color)}>{text}</span>
                            </div>
                          </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button variant="destructive" size="sm" className="h-10 px-4" onClick={() => handleRevoke(share.id)}>
                    <Trash2Icon className="w-4 h-4 mr-0 sm:mr-2" />
                    <span className="hidden sm:inline">Thu hồi</span>
                  </Button>
                </div>
              </div>
          ))}
        </div>
    )
  }

  const renderSharedWithMeList = () => {
    if (loading) return <div className="flex justify-center py-8"><Loading /></div>
    if (sharedWithMe.length === 0) {
      return <p className="text-center text-muted-foreground py-8">Không có ví nào được chia sẻ với bạn.</p>
    }
    return (
        <div className="space-y-4">
          {sharedWithMe.map((share) => (
              <div key={share.id} className="bg-background border border-border rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <div className="bg-muted p-3 rounded-full">
                    <IconComponent name={share.icon} className="h-6 w-6 text-primary"/>
                  </div>
                  <div>
                    <p className="font-semibold text-card-foreground">{share.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Từ: <span className="font-medium text-primary">{share.ownerName}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge className={cn("py-2 px-3", permissionDisplay[share.permissionLevel]?.color)}>
                    {permissionDisplay[share.permissionLevel]?.text || share.permissionLevel}
                  </Badge>
                </div>
              </div>
          ))}
        </div>
    )
  }

  return (
      <div>
        {/* Page Loading Overlay with Backdrop Blur */}
        {showPageLoading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/20 backdrop-blur-sm">
            <div className="text-center">
              <LottieLoader size="lg" />
              <p className="mt-4 text-sm text-foreground/70 font-medium">Đang gửi lời mời...</p>
            </div>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-green-600">Chia Sẻ Ví</h1>
            <p className="text-muted-foreground mt-1">Gửi lời mời và quản lý quyền truy cập các ví của bạn.</p>
          </div>
          <Button onClick={() => window.history.back()} variant="ghost" size="sm">
            <ArrowLeftIcon className="w-4 h-4 mr-1" /> Quay lại
          </Button>
        </div>

        <div className="border-b border-border mb-6">
          <nav className="-mb-px flex space-x-6 overflow-x-auto">
            <button onClick={() => setActiveTab('share')} className={cn('flex items-center py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap', activeTab === 'share' ? 'border-green-500 text-green-600' : 'border-transparent text-muted-foreground hover:text-foreground')}>
              <UploadCloudIcon className="w-5 h-5 mr-2" /> Gửi Lời Mời
            </button>
            <button onClick={() => setActiveTab('sharedByMe')} className={cn('flex items-center py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap', activeTab === 'sharedByMe' ? 'border-green-500 text-green-600' : 'border-transparent text-muted-foreground hover:text-foreground')}>
              <Settings2Icon className="w-5 h-5 mr-2" /> Ví Đã Chia Sẻ ({sharedByMe.length})
            </button>
            <button onClick={() => setActiveTab('sharedWithMe')} className={cn('flex items-center py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap', activeTab === 'sharedWithMe' ? 'border-green-500 text-green-600' : 'border-transparent text-muted-foreground hover:text-foreground')}>
              <UsersIcon className="w-5 h-5 mr-2" /> Ví Được Chia Sẻ ({sharedWithMe.length})
            </button>
          </nav>
        </div>

        {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircleIcon className="h-4 w-4" />
              <AlertTitle>Lỗi</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
              <button onClick={() => setError(null)} className="absolute top-1.5 right-1.5 p-1"><XIcon className="h-4 w-4" /></button>
            </Alert>
        )}
        {successMessage && (
            <Alert variant="success" className="mb-4">
              <CheckCircle2Icon className="h-4 w-4" />
              <AlertTitle>Thành công</AlertTitle>
              <AlertDescription>{successMessage}</AlertDescription>
              <button onClick={() => setSuccessMessage(null)} className="absolute top-1.5 right-1.5 p-1"><XIcon className="h-4 w-4" /></button>
            </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {activeTab === 'share' && (
              <>
                <div className="lg:col-span-2">
                  <div className={cn("bg-card rounded-lg border p-6 relative transition-opacity", isSubmitting && "opacity-50 pointer-events-none")}>
                    {isSubmitting && (
                        <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10 rounded-lg">
                          <Loading />
                        </div>
                    )}
                    <h2 className="text-2xl font-semibold text-card-foreground mb-6">Gửi lời mời chia sẻ ví</h2>
                    <div className="space-y-6">
                      <div>
                        <Label htmlFor="walletSelect" className="font-medium">Chọn ví <span className="text-red-500">*</span></Label>
                        <Select onValueChange={setSelectedWallet} value={selectedWallet} disabled={myWallets.length === 0}>
                          <SelectTrigger className="mt-1 h-11 text-base">
                            <SelectValue placeholder="Chọn một ví để chia sẻ" />
                          </SelectTrigger>
                          <SelectContent>
                            {myWallets.map(wallet => (
                                <SelectItem key={wallet.id} value={wallet.id}>
                                  <div className="flex items-center space-x-2">
                                    <IconComponent name={wallet.icon} className="w-4 h-4" />
                                    <span>{wallet.name} - {formatCurrency(wallet.balance, wallet.currency)}</span>
                                  </div>
                                </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="font-medium">Loại quyền truy cập <span className="text-red-500">*</span></Label>
                        <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                          {[
                            { type: 'VIEW', icon: EyeIcon, title: 'Người Xem', description: 'Chỉ xem thông tin, không thể chỉnh sửa.' },
                            { type: 'EDIT', icon: Edit3Icon, title: 'Chỉnh Sửa', description: 'Thêm, sửa, xóa giao dịch.' },
                            { type: 'OWNER', icon: CrownIcon, title: 'Chủ Sở Hữu', description: 'Toàn quyền như bạn.' }
                          ].map(({ type, icon: Icon, title, description }) => (
                              <div key={type} onClick={() => setPermissionLevel(type)} className={cn('border rounded-lg p-4 cursor-pointer transition-all', permissionLevel === type ? 'border-green-500 bg-green-50 dark:bg-green-900/20 ring-2 ring-green-500' : 'border-border hover:border-muted-foreground/50')}>
                                <div className="flex items-center space-x-3 mb-2">
                                  <Icon className={cn('w-5 h-5', permissionLevel === type ? 'text-green-600' : 'text-muted-foreground')} />
                                  <span className="font-semibold text-card-foreground">{title}</span>
                                </div>
                                <p className="text-xs text-muted-foreground">{description}</p>
                              </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="emailInput">Email người nhận <span className="text-red-500">*</span></Label>
                        <Input id="emailInput" type="email" placeholder="example@email.com" className="mt-1 h-11" value={email} onChange={(e) => setEmail(e.target.value)} />
                      </div>

                      <div>
                        <Label htmlFor="message">Lời nhắn (tùy chọn)</Label>
                        <textarea id="message" placeholder="Gửi lời nhắn cho người nhận..." value={message} onChange={(e) => setMessage(e.target.value)} rows={3} className="mt-1 w-full p-2 text-sm border rounded-md bg-transparent border-border resize-none" maxLength={250} />
                        <p className="text-xs text-muted-foreground text-right mt-1">{message.length}/250 ký tự</p>
                      </div>

                      <Button onClick={handleShare} disabled={!selectedWallet || isSubmitting} className="w-full h-11 text-base">
                        {isSubmitting ? <Loading /> : <><MailIcon className="w-4 h-4 mr-2" /> Gửi Lời Mời</>}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-card rounded-lg border p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <StarIcon className="w-5 h-5 text-yellow-500" />
                      <h3 className="text-base font-semibold text-card-foreground">Mẹo Chia Sẻ An Toàn</h3>
                    </div>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start"><ShieldCheckIcon className="w-4 h-4 text-green-500 mr-2 mt-0.5" /><span>Chỉ chia sẻ với người bạn hoàn toàn tin tưởng.</span></li>
                      <li className="flex items-start"><ShieldCheckIcon className="w-4 h-4 text-green-500 mr-2 mt-0.5" /><span>Bắt đầu với quyền "Người Xem" và nâng cấp sau nếu cần.</span></li>
                      <li className="flex items-start"><ShieldCheckIcon className="w-4 h-4 text-green-500 mr-2 mt-0.5" /><span>Thường xuyên kiểm tra danh sách "Ví Đã Chia Sẻ".</span></li>
                    </ul>
                  </div>

                  <div className="bg-card rounded-lg border p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <LockIcon className="w-5 h-5 text-blue-500" />
                      <h3 className="text-base font-semibold text-card-foreground">Giải Thích Quyền</h3>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div className="p-3 border-l-4 border-blue-500 bg-muted">
                        <p className="font-medium text-card-foreground">Người Xem</p>
                        <p className="text-xs text-muted-foreground">Xem số dư, lịch sử giao dịch. Không thể thay đổi.</p>
                      </div>
                      <div className="p-3 border-l-4 border-amber-500 bg-muted">
                        <p className="font-medium text-card-foreground">Chỉnh Sửa</p>
                        <p className="text-xs text-muted-foreground">Toàn quyền xem, thêm/sửa/xóa giao dịch.</p>
                      </div>
                      <div className="p-3 border-l-4 border-red-500 bg-muted">
                        <p className="font-medium text-card-foreground">Chủ Sở Hữu</p>
                        <p className="text-xs text-muted-foreground">Mọi quyền của bạn, bao gồm cả chia sẻ và xóa ví.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
          )}

          {activeTab !== 'share' && (
              <div className="lg:col-span-3 bg-card rounded-lg border p-6">
                {activeTab === 'sharedByMe' ? renderSharedByMeList() : renderSharedWithMeList()}
              </div>
          )}
        </div>

        {/* Confirmation Modal */}
        <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30">
                  <AlertCircleIcon className="w-6 h-6 text-red-600" />
                </div>
                <span>Xác nhận thu hồi chia sẻ</span>
              </DialogTitle>
              <DialogDescription className="text-left">
                {shareToRevoke && (
                  <div className="mt-4 p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                        <IconComponent name="wallet" className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{shareToRevoke.walletName}</p>
                        <p className="text-sm text-muted-foreground">
                          Chia sẻ với: <span className="font-medium text-primary">{shareToRevoke.sharedWithEmail}</span>
                        </p>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p className="mb-2">Bạn có chắc chắn muốn thu hồi chia sẻ này không?</p>
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded p-3">
                        <p className="text-yellow-800 dark:text-yellow-200 text-xs">
                          ⚠️ Người dùng sẽ mất quyền truy cập vào ví này ngay lập tức và không thể khôi phục.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setShowConfirmModal(false)}
                className="flex-1"
              >
                Hủy bỏ
              </Button>
              <Button 
                variant="destructive" 
                onClick={confirmRevoke}
                disabled={loading}
                className="flex-1"
              >
                {loading ? (
                  <Loading size="sm" />
                ) : (
                  <>
                    <Trash2Icon className="w-4 h-4 mr-2" />
                    Xác nhận thu hồi
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
  )
}

export default ShareWallet