import React, { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  DollarSignIcon,
  CheckCircleIcon,
  AlertCircleIcon,
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
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [transferResult, setTransferResult] = useState(null)
  const [recentTransfers, setRecentTransfers] = useState([])

  const fetchWallets = async () => {
    setPageStatus('loading')
    setPageError(null)
    try {
      const response = await walletService.getWallets()
      const walletList = response.data.data || []
      const activeWallets = walletList.filter(wallet => !wallet.archived)
      setWallets(activeWallets)
      setPageStatus('success')
    } catch (error) {
      setPageError('Không thể tải danh sách ví. Vui lòng kiểm tra kết nối và thử lại.')
      setPageStatus('error')
    }
  }

  const fetchRecentTransfers = async () => {
    try {
      const response = await walletService.getTransactions({ type: 'transfer', limit: 5 })
      setRecentTransfers(response.data.data || [])
    } catch (error) {
      console.error('Lỗi khi tải giao dịch gần đây:', error)
      setRecentTransfers([])
    }
  }

  useEffect(() => {
    fetchWallets()
    fetchRecentTransfers()
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

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSwapWallets = () => {
    setFromWallet(toWallet)
    setToWallet(fromWallet)
  }

  const handleTransfer = () => {
    if (validateTransfer()) {
      setShowConfirmation(true)
    }
  }

  const confirmTransfer = async () => {
    setIsSubmitting(true)
    try {
      const transferData = {
        fromWalletId: Number(fromWallet),
        toWalletId: Number(toWallet),
        amount: Number(amount),
        description: description.trim()
      }
      await walletService.transferMoney(transferData)
      setTransferResult({
        success: true,
        message: 'Chuyển tiền thành công!',
        transactionId: 'TXN' + Date.now(),
        amount: Number(amount),
        fromWalletName: wallets.find(w => w.id.toString() === fromWallet)?.name,
        toWalletName: wallets.find(w => w.id.toString() === toWallet)?.name
      })
      setShowConfirmation(false)
      setFromWallet('')
      setToWallet('')
      setAmount('')
      setDescription('')
      setErrors({})
      fetchWallets()
      fetchRecentTransfers()
    } catch (error) {
      setTransferResult({
        success: false,
        message: error.response?.data?.message || 'Có lỗi xảy ra khi chuyển tiền'
      })
      setShowConfirmation(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatCurrency = (amount, currency = 'VND') => {
    if (isNaN(amount)) return ''
    const formatted = new Intl.NumberFormat('vi-VN').format(amount)
    return currency === 'USD' ? `$${formatted}` : `${formatted} ₫`
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
          <PageStateDisplay
              icon={<Frown className="w-5 h-5 text-red-500" />}
              title="Đã xảy ra lỗi"
              message={pageError}
          >
            <Button onClick={fetchWallets}>
              <RefreshCwIcon className="w-4 h-4 mr-2" />
              Thử lại
            </Button>
          </PageStateDisplay>
      )
    }
    if (pageStatus === 'success' && wallets.length < 2) {
      const message = wallets.length === 0
          ? 'Bạn chưa có ví nào. Hãy tạo ví mới để bắt đầu.'
          : 'Bạn cần ít nhất hai ví để thực hiện chuyển tiền.'
      return (
          <PageStateDisplay
              icon={<WalletCards className="w-8 h-8 text-blue-500" />}
              title="Chưa sẵn sàng để chuyển tiền"
              message={message}
          >
            <Button asChild>
              <Link to="/wallets/add">
                <PlusCircle className="w-4 h-4 mr-2" />
                Tạo ví mới
              </Link>
            </Button>
          </PageStateDisplay>
      )
    }

    return (
        <div className="p-8">
          <div className="flex items-center space-x-3 mb-6">
            <h2 className="text-2xl font-semibold text-foreground">Thông Tin Chuyển Tiền</h2>
          </div>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
              <div className="space-y-2">
                <Label htmlFor="fromWallet">Từ ví <span className="text-red-500">*</span></Label>
                <select id="fromWallet" value={fromWallet} onChange={(e) => { setFromWallet(e.target.value); setToWallet(''); }} className={`w-full h-12 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${errors.fromWallet ? 'border-red-500' : 'border-border'} bg-background`}>
                  <option value="">Chọn ví nguồn</option>
                  {wallets.map(w => <option key={w.id} value={w.id}>{w.name} - {formatCurrency(w.balance, w.currency)}</option>)}
                </select>
                {errors.fromWallet && <p className="text-sm text-red-500">{errors.fromWallet}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="toWallet">Đến ví <span className="text-red-500">*</span></Label>
                <select id="toWallet" value={toWallet} onChange={(e) => setToWallet(e.target.value)} disabled={!fromWallet} className={`w-full h-12 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${errors.toWallet ? 'border-red-500' : 'border-border'} bg-background disabled:bg-muted`}>
                  <option value="">Chọn ví đích</option>
                  {toWallets.map(w => <option key={w.id} value={w.id}>{w.name} - {formatCurrency(w.balance, w.currency)}</option>)}
                </select>
                {errors.toWallet && <p className="text-sm text-red-500">{errors.toWallet}</p>}
                {fromWallet && toWallets.length === 0 && <p className="text-sm text-yellow-600 mt-1">Không có ví đích hợp lệ (cần cùng loại tiền tệ).</p>}
              </div>
            </div>
            {fromWallet && toWallet && <div className="flex justify-center"><Button onClick={handleSwapWallets} variant="ghost" size="sm" className="h-10 px-4 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-800/30 text-blue-700 dark:text-blue-400 rounded-lg"><RefreshCwIcon className="w-4 h-4 mr-2" />Hoán đổi ví</Button></div>}
            <div className="space-y-2">
              <Label htmlFor="amount">Số tiền chuyển <span className="text-red-500">*</span></Label>
              <div className="relative"><Input id="amount" type="number" placeholder="Nhập số tiền" value={amount} onChange={(e) => setAmount(e.target.value)} className={`h-12 pl-12 pr-4 ${errors.amount ? 'border-red-500' : ''}`} min="1000" step="1000" /><DollarSignIcon className="w-5 h-5 text-muted-foreground absolute left-4 top-1/2 transform -translate-y-1/2" /></div>
              {errors.amount && <p className="text-sm text-red-500">{errors.amount}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Ghi chú (tùy chọn)</Label>
              <textarea id="description" placeholder="Nhập ghi chú cho giao dịch..." value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary border-border bg-background resize-none" />
            </div>
            <div className="pt-6"><Button onClick={handleTransfer} disabled={isSubmitting || !fromWallet || !toWallet || !amount} className="w-full h-12 rounded-lg">{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} {isSubmitting ? 'Đang chuyển...' : 'Chuyển Tiền'}</Button></div>
          </div>
        </div>
    )
  }

  if (transferResult) return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-card rounded-lg shadow-lg border border-border p-8">
          <div className="text-center">
            {transferResult.success ? (
                <><div className="w-16 h-16 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircleIcon className="w-8 h-8 text-green-600 dark:text-green-400" /></div><h3 className="text-xl font-bold text-green-600 dark:text-green-400 mb-2">Chuyển Tiền Thành Công!</h3><p className="text-muted-foreground mb-6">Đã chuyển {formatCurrency(transferResult.amount)} từ {transferResult.fromWalletName} sang {transferResult.toWalletName}</p></>
            ) : (
                <><div className="w-16 h-16 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center mx-auto mb-4"><AlertCircleIcon className="w-8 h-8 text-red-600 dark:text-red-400" /></div><h3 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">Chuyển Tiền Thất Bại</h3><p className="text-muted-foreground mb-4">{transferResult.message}</p></>
            )}
            <div className="flex space-x-3"><Button onClick={() => setTransferResult(null)} className="flex-1 h-12 rounded-lg">Chuyển Tiền Mới</Button><Button variant="outline" onClick={() => window.history.back()} className="flex-1 h-12 rounded-lg">Quay Lại</Button></div>
          </div>
        </div>
      </div>
  )

  if (showConfirmation) {
    const fromWalletData = wallets.find(w => w.id.toString() === fromWallet)
    const toWalletData = wallets.find(w => w.id.toString() === toWallet)
    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-card rounded-lg shadow-lg border border-border p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mx-auto mb-4"><ShieldCheckIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" /></div>
              <h3 className="text-xl font-bold text-foreground mb-2">Xác Nhận Chuyển Tiền</h3>
              <p className="text-muted-foreground mb-6">Vui lòng kiểm tra thông tin trước khi xác nhận</p>
              <div className="bg-muted rounded-lg p-6 mb-6 space-y-4 text-left">
                <div className="flex items-center justify-between"><div className="text-left"><p className="text-sm text-muted-foreground">Từ ví</p><p className="font-medium text-foreground">{fromWalletData?.name}</p><p className="text-sm text-muted-foreground">Số dư: {formatCurrency(fromWalletData?.balance, fromWalletData?.currency)}</p></div><ArrowRightIcon className="w-6 h-6 text-gray-400" /><div className="text-right"><p className="text-sm text-muted-foreground">Đến ví</p><p className="font-medium text-foreground">{toWalletData?.name}</p><p className="text-sm text-muted-foreground">Số dư: {formatCurrency(toWalletData?.balance, toWalletData?.currency)}</p></div></div>
                <div className="border-t border-border pt-4 space-y-2"><div className="flex justify-between"><span className="font-medium text-foreground">Tổng cộng:</span><span className="font-bold text-green-600">{formatCurrency(parseFloat(amount))}</span></div></div>
                {description && <div className="border-t border-border pt-4 text-left"><p className="text-sm text-muted-foreground">Ghi chú:</p><p className="text-foreground italic">"{description}"</p></div>}
              </div>
              <div className="flex space-x-3">
                <Button onClick={confirmTransfer} disabled={isSubmitting} className="flex-1 h-12 rounded-lg">{isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Đang xử lý...</> : <><CheckCircleIcon className="w-5 h-5 mr-2" />Xác Nhận</>}</Button>
                <Button variant="outline" onClick={() => setShowConfirmation(false)} disabled={isSubmitting} className="flex-1 h-12 rounded-lg">Hủy</Button>
              </div>
            </div>
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
            <Button
                onClick={() => window.history.back()}
                variant="ghost"
                size="sm"
                className="h-10 px-4 text-sm font-light bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-800/30 text-green-600 dark:text-green-400 rounded-md border-0"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-1" />
              Quay lại
            </Button>
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
                              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
                                <ArrowLeftRightIcon className="w-4 h-4 text-blue-600" />
                              </div>
                              <div>
                                <p className="font-medium text-foreground text-sm" title={t.fromWalletName + ' → ' + t.toWalletName}>
                                  {t.fromWalletName} → {t.toWalletName}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(t.date).toLocaleDateString('vi-VN')}
                                </p>
                              </div>
                            </div>
                            <span className="font-bold text-sm text-red-600">
                              -{formatCurrency(t.amount)}
                            </span>
                          </div>
                      ))}
                    </div>
                ) : (
                    <div className="text-center py-4">
                      <ReceiptIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Chưa có giao dịch nào
                      </p>
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
      </>
  )
}

export default TransferMoney