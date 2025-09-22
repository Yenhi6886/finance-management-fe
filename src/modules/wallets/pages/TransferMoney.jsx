import React, { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../../components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../../../components/ui/alert-dialog'
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ArrowLeftRightIcon,
  ShieldCheckIcon,
  RefreshCwIcon,
  StarIcon,
  ReceiptIcon,
  Loader2,
  Frown,
  PlusCircle,
  WalletCards
} from 'lucide-react'
import { walletService } from '../services/walletService'
import { useSettings } from '../../../shared/contexts/SettingsContext'
import { formatCurrency, formatDate } from '../../../shared/utils/formattingUtils.js'
import { toast } from 'sonner'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select'
import { IconComponent } from '../../../shared/config/icons'
import { validateDescription } from '../../../shared/utils/validationUtils'
import { AlertTriangle } from 'lucide-react'

const TransferFormSkeleton = () => (
    <div className="p-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-3 bg-muted rounded-lg animate-pulse h-12 w-12"></div>
        <div className="h-8 w-1/2 bg-muted rounded animate-pulse"></div>
      </div>
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="h-6 w-1/4 bg-muted rounded"></div>
            <div className="h-12 w-full bg-muted rounded-lg"></div>
          </div>
          <div className="space-y-2">
            <div className="h-6 w-1/4 bg-muted rounded"></div>
            <div className="h-12 w-full bg-muted rounded-lg"></div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-6 w-1/3 bg-muted rounded"></div>
          <div className="h-12 w-full bg-muted rounded-lg"></div>
        </div>
        <div className="space-y-2">
          <div className="h-6 w-1/4 bg-muted rounded"></div>
          <div className="h-24 w-full bg-muted rounded-lg"></div>
        </div>
        <div className="pt-6">
          <div className="h-12 w-full bg-muted-foreground rounded-lg"></div>
        </div>
      </div>
    </div>
)

const PageStateDisplay = ({ icon, title, message, children }) => (
    <div className="p-8 text-center">
      <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6">{message}</p>
      {children}
    </div>
)

const TransferMoney = () => {
  const [wallets, setWallets] = useState([])
  const [fromWallet, setFromWallet] = useState('')
  const [toWallet, setToWallet] = useState('')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')

  const [pageStatus, setPageStatus] = useState('loading')
  const [pageError, setPageError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [errors, setErrors] = useState({})
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [successData, setSuccessData] = useState(null)
  const [recentTransfers, setRecentTransfers] = useState([])
  const { settings } = useSettings()
  const navigate = useNavigate()

  const fetchData = async () => {
    try {
      const [walletRes, transRes] = await Promise.all([
        walletService.getWallets(),
        walletService.getTransactions({ type: 'TRANSFER', limit: 5 })
      ]);
      const activeWallets = (walletRes.data.data || []).filter(wallet => !wallet.archived);
      setWallets(activeWallets);
      setRecentTransfers(transRes.data.data || []);
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu:', error);
      setPageError('Không thể tải dữ liệu cần thiết. Vui lòng thử lại.');
      setPageStatus('error');
    }
  }

  useEffect(() => {
    setPageStatus('loading')
    fetchData().then(() => setPageStatus('success'));
  }, [])

  const validateTransfer = () => {
    const newErrors = {}
    const fromWalletData = wallets.find(w => w.id.toString() === fromWallet)
    const toWalletData = wallets.find(w => w.id.toString() === toWallet)

    if (!fromWallet) newErrors.fromWallet = 'Vui lòng chọn ví nguồn'
    if (!toWallet) newErrors.toWallet = 'Vui lòng chọn ví đích'
    if (fromWallet && fromWallet === toWallet) newErrors.toWallet = 'Ví đích phải khác ví nguồn'
    if (fromWalletData && toWalletData && fromWalletData.currency !== toWalletData.currency) {
      newErrors.toWallet = 'Hai ví phải cùng loại tiền tệ'
    }

    const numericAmount = parseFloat(amount)
    if (!amount || numericAmount <= 0) {
      newErrors.amount = 'Số tiền phải lớn hơn 0'
    } else if (numericAmount < 1000) {
      newErrors.amount = 'Số tiền tối thiểu là 1,000'
    } else if (fromWalletData && numericAmount > fromWalletData.balance) {
      newErrors.amount = 'Số dư không đủ để thực hiện giao dịch'
    }

    // Xác thực ghi chú
    const descriptionValidation = validateDescription(description, {
      maxLength: 500,
      minLength: 0,
      allowSpecialChars: true,
      required: false,
      allowNewLines: true,
      allowEmojis: true,
      fieldName: 'Ghi chú'
    });
    
    if (!descriptionValidation.isValid) {
      newErrors.description = descriptionValidation.errors[0];
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Xác thực ghi chú thời gian thực
  const validateDescriptionRealTime = (value) => {
    const validation = validateDescription(value, {
      maxLength: 500,
      minLength: 0,
      allowSpecialChars: true,
      required: false,
      allowNewLines: true,
      allowEmojis: true,
      fieldName: 'Ghi chú'
    });
    
    if (!validation.isValid) {
      setErrors(prev => ({
        ...prev,
        description: validation.errors[0]
      }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.description;
        return newErrors;
      });
    }
  };

  const handleSwapWallets = () => {
    setFromWallet(toWallet)
    setToWallet(fromWallet)
  }

  const handleOpenConfirm = () => {
    if (validateTransfer()) {
      setIsConfirmModalOpen(true)
    }
  }

  const resetForm = () => {
    setFromWallet('')
    setToWallet('')
    setAmount('')
    setDescription('')
    setErrors({})
  }

  const confirmTransfer = async () => {
    setIsConfirmModalOpen(false)
    setIsSubmitting(true)
    try {
      const transferData = {
        fromWalletId: Number(fromWallet),
        toWalletId: Number(toWallet),
        amount: Number(amount),
        description: description.trim()
      }
      await walletService.transferMoney(transferData)

      setSuccessData({
        amount: Number(amount),
        fromWalletName: wallets.find(w => w.id.toString() === fromWallet)?.name,
        toWalletName: wallets.find(w => w.id.toString() === toWallet)?.name
      });

      setIsSuccessModalOpen(true);
      resetForm();
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi chuyển tiền');
    } finally {
      setIsSubmitting(false)
    }
  }

  const toWallets = useMemo(() => {
    if (!fromWallet) return wallets
    const fromWalletData = wallets.find(w => w.id.toString() === fromWallet)
    if (!fromWalletData) return wallets
    return wallets.filter(w => w.id.toString() !== fromWallet && w.currency === fromWalletData.currency)
  }, [fromWallet, wallets])

  const renderMainContent = () => {
    if (pageStatus === 'loading') {
      return <TransferFormSkeleton />
    }
    if (pageStatus === 'error') {
      return (
          <PageStateDisplay icon={<Frown className="w-5 h-5 text-red-500" />} title="Đã xảy ra lỗi" message={pageError}>
            <Button onClick={fetchData}><RefreshCwIcon className="w-4 h-4 mr-2" />Thử lại</Button>
          </PageStateDisplay>
      )
    }
    if (pageStatus === 'success' && wallets.length < 2) {
      const message = wallets.length === 0 ? 'Bạn chưa có ví nào. Hãy tạo ví mới để bắt đầu.' : 'Bạn cần ít nhất hai ví để thực hiện chuyển tiền.'
      return (
          <PageStateDisplay icon={<WalletCards className="w-8 h-8 text-blue-500" />} title="Chưa sẵn sàng để chuyển tiền" message={message}>
            <Button asChild><Link to="/wallets/add"><PlusCircle className="w-4 h-4 mr-2" />Tạo ví mới</Link></Button>
          </PageStateDisplay>
      )
    }

    return (
        <div className="p-8">
          <div className="flex items-center space-x-3 mb-6"><h2 className="text-2xl font-semibold text-foreground">Thông Tin Chuyển Tiền</h2></div>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
              <div className="space-y-2">
                <Label htmlFor="fromWallet">Từ ví <span className="text-red-500">*</span></Label>
                <Select onValueChange={(value) => { setFromWallet(value); setToWallet(''); }} value={fromWallet}>
                  <SelectTrigger className={`w-full h-12 ${errors.fromWallet ? 'border-red-500' : 'border-border'}`}>
                    <SelectValue placeholder="Chọn ví nguồn">
                      {fromWallet && wallets.find(w => w.id === fromWallet) && (
                        <div className="flex items-center space-x-2">
                          <IconComponent name={wallets.find(w => w.id === fromWallet).icon} className="w-4 h-4" />
                          <span>{wallets.find(w => w.id === fromWallet).name} - {formatCurrency(wallets.find(w => w.id === fromWallet).balance, wallets.find(w => w.id === fromWallet).currency, settings)}</span>
                        </div>
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {wallets.map(w => (
                      <SelectItem key={w.id} value={w.id}>
                        <div className="flex items-center space-x-2">
                          <IconComponent name={w.icon} className="w-4 h-4" />
                          <span>{w.name} - {formatCurrency(w.balance, w.currency, settings)}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.fromWallet && <p className="text-sm text-red-500">{errors.fromWallet}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="toWallet">Đến ví <span className="text-red-500">*</span></Label>
                <Select onValueChange={setToWallet} value={toWallet} disabled={!fromWallet}>
                  <SelectTrigger className={`w-full h-12 ${errors.toWallet ? 'border-red-500' : 'border-border'} ${!fromWallet ? 'bg-muted' : ''}`}>
                    <SelectValue placeholder="Chọn ví đích">
                      {toWallet && toWallets.find(w => w.id === toWallet) && (
                        <div className="flex items-center space-x-2">
                          <IconComponent name={toWallets.find(w => w.id === toWallet).icon} className="w-4 h-4" />
                          <span>{toWallets.find(w => w.id === toWallet).name} - {formatCurrency(toWallets.find(w => w.id === toWallet).balance, toWallets.find(w => w.id === toWallet).currency, settings)}</span>
                        </div>
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {toWallets.map(w => (
                      <SelectItem key={w.id} value={w.id}>
                        <div className="flex items-center space-x-2">
                          <IconComponent name={w.icon} className="w-4 h-4" />
                          <span>{w.name} - {formatCurrency(w.balance, w.currency, settings)}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.toWallet && <p className="text-sm text-red-500">{errors.toWallet}</p>}
                {fromWallet && toWallets.length === 0 && <p className="text-sm text-yellow-600 mt-1">Không có ví đích hợp lệ (cần cùng loại tiền tệ).</p>}
              </div>
            </div>
            {fromWallet && toWallet && <div className="flex justify-center"><Button onClick={handleSwapWallets} variant="ghost" size="sm" className="h-10 px-4 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-800/30 text-blue-700 dark:text-blue-400 rounded-lg"><RefreshCwIcon className="w-4 h-4 mr-2" />Hoán đổi ví</Button></div>}
            <div className="space-y-2">
              <Label htmlFor="amount">Số tiền chuyển <span className="text-red-500">*</span></Label>
              <div className="relative"><Input id="amount" type="number" placeholder="Nhập số tiền" value={amount} onChange={(e) => setAmount(e.target.value)} className={`h-12 pl-4 pr-12 ${errors.amount ? 'border-red-500' : ''}`} min="1000" step="1000" /><span className="text-muted-foreground absolute right-4 top-1/2 -translate-y-1/2">₫</span></div>
              {errors.amount && <p className="text-sm text-red-500">{errors.amount}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Ghi chú (tùy chọn)</Label>
              <textarea 
                id="description" 
                placeholder="Nhập ghi chú cho giao dịch..." 
                value={description} 
                onChange={(e) => {
                  setDescription(e.target.value);
                  validateDescriptionRealTime(e.target.value);
                }}
                onBlur={(e) => validateDescriptionRealTime(e.target.value)}
                rows={3} 
                maxLength={500}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary border-border bg-background resize-none" 
              />
              <div className="flex justify-between text-xs text-gray-500">
                <div className="flex flex-col">
                  <span>Nhập tối đa 500 ký tự, có thể xuống dòng</span>
                  <span className="text-gray-400">Hỗ trợ emoji và ký tự đặc biệt</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className={description.length > 450 ? 'text-orange-500' : description.length > 480 ? 'text-red-500' : ''}>
                    {description.length}/500
                  </span>
                  <span className="text-gray-400">
                    {description.split(/\s+/).filter(word => word.length > 0).length} từ
                  </span>
                </div>
              </div>
              {errors.description && (
                <div className="flex items-center gap-1 text-sm text-red-500">
                  <AlertTriangle className="h-3 w-3" />
                  {errors.description}
                </div>
              )}
            </div>
            <div className="pt-6"><Button onClick={handleOpenConfirm} disabled={isSubmitting || !fromWallet || !toWallet || !amount} className="w-full h-12 rounded-lg">{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} {isSubmitting ? 'Đang chuyển...' : 'Chuyển Tiền'}</Button></div>
          </div>
        </div>
    )
  }

  return (
      <>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-green-600">Chuyển tiền</h1>
            <p className="text-muted-foreground mt-2">Chuyển tiền nhanh chóng và an toàn giữa các ví của bạn</p></div>
          <div className="mt-4 sm:mt-0">
            <Button onClick={() => navigate(-1)} variant="ghost" size="sm" className="h-10 px-4 text-sm font-light bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-800/30 text-green-600 dark:text-green-400 rounded-md border-0"><ArrowLeftIcon className="w-4 h-4 mr-1" />Quay lại</Button>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2"><div className="bg-card rounded-lg shadow-lg border border-border">{renderMainContent()}</div></div>
          <div className="space-y-6">
            <div className="bg-card rounded-lg shadow-lg border border-border">
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-6"><div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg"><ReceiptIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" /></div><h3 className="text-lg font-semibold text-foreground">Chuyển Tiền Gần Đây</h3></div>
                {recentTransfers && recentTransfers.length > 0 ? (
                    <div className="space-y-3">
                      {recentTransfers.map(t => (
                          <div key={t.id} className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center"><ArrowLeftRightIcon className="w-4 h-4 text-blue-600" /></div>
                              <div>
                                <p className="font-medium text-foreground text-sm" title={t.fromWalletName + ' → ' + t.toWalletName}>{t.fromWalletName} → {t.toWalletName}</p>
                                <p className="text-xs text-muted-foreground">{formatDate(t.date, settings)}</p>
                              </div>
                            </div>
                            <span className="font-bold text-sm text-red-600">-{formatCurrency(t.amount, 'VND', settings)}</span>
                          </div>
                      ))}
                    </div>
                ) : (
                    <div className="text-center py-4">
                      <ReceiptIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" /><p className="text-sm text-muted-foreground">Chưa có giao dịch nào</p>
                    </div>
                )}
              </div>
            </div>
            <div className="bg-card rounded-lg shadow-lg border border-border">
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-6"><div className="p-2 bg-yellow-100 dark:bg-yellow-900/50 rounded-lg"><StarIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-400" /></div><h3 className="text-lg font-semibold text-foreground">Mẹo Hữu Ích</h3></div>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-start space-x-2"><CheckCircleIcon className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" /><p>Chỉ có thể chuyển tiền giữa các ví có cùng loại tiền tệ.</p></div>
                  <div className="flex items-start space-x-2"><CheckCircleIcon className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" /><p>Kiểm tra kỹ số dư và thông tin ví trước khi xác nhận.</p></div>
                  <div className="flex items-start space-x-2"><CheckCircleIcon className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" /><p>Sử dụng ghi chú để theo dõi mục đích chuyển tiền dễ dàng hơn.</p></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <AlertDialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Xác nhận Chuyển Tiền</AlertDialogTitle>
              <AlertDialogDescription asChild>
                <div className="pt-2 text-sm">
                  <p className="mb-4">Vui lòng kiểm tra lại thông tin chuyển tiền trước khi xác nhận.</p>
                  <div className="space-y-3 rounded-md border bg-muted/50 p-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Từ ví:</span>
                      <span className="font-semibold text-foreground">{wallets.find(w => w.id.toString() === fromWallet)?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Đến ví:</span>
                      <span className="font-semibold text-foreground">{wallets.find(w => w.id.toString() === toWallet)?.name}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="text-muted-foreground">Số tiền:</span>
                      <span className="font-bold text-lg text-primary">{formatCurrency(parseFloat(amount || 0), 'VND', settings)}</span>
                    </div>
                    {description.trim() && (
                        <div className="flex justify-between items-start pt-2 border-t">
                          <span className="text-muted-foreground">Ghi chú:</span>
                          <span className="font-semibold text-foreground text-right pl-4">{description}</span>
                        </div>
                    )}
                  </div>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isSubmitting}>Hủy</AlertDialogCancel>
              <AlertDialogAction onClick={confirmTransfer} disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Xác nhận
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Dialog open={isSuccessModalOpen} onOpenChange={setIsSuccessModalOpen}>
          <DialogContent>
            <DialogHeader>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
                <CheckCircleIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
              </div>
              <DialogTitle className="text-center">Chuyển Tiền Thành Công!</DialogTitle>
              <DialogDescription className="text-center px-4">
                Đã chuyển thành công {formatCurrency(successData?.amount || 0, 'VND', settings)} từ ví {successData?.fromWalletName} đến ví {successData?.toWalletName}.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={() => setIsSuccessModalOpen(false)} className="w-full">Đóng</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
  )
}

export default TransferMoney