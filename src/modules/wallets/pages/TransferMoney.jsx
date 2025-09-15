import React, { useState, useEffect } from 'react'
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
  ReceiptIcon
} from 'lucide-react'
import { walletService } from '../services/walletService'

const TransferMoney = () => {
  const [wallets, setWallets] = useState([])
  const [fromWallet, setFromWallet] = useState('')
  const [toWallet, setToWallet] = useState('')
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [transferFee, setTransferFee] = useState(0)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [transferResult, setTransferResult] = useState(null)
  const [recentTransfers, setRecentTransfers] = useState([])

  useEffect(() => {
    fetchWallets()
    fetchRecentTransfers()
  }, [])

  const fetchWallets = async () => {
    try {
      const response = await walletService.getWallets()
      
      // Kiểm tra cấu trúc response từ backend
      let walletData = []
      if (response.data && response.data.data) {
        // Nếu có wrapper ApiResponse
        walletData = response.data.data
      } else if (Array.isArray(response.data)) {
        // Nếu data trực tiếp là array
        walletData = response.data
      }
      
      // Lọc chỉ lấy các ví active (không bị archive)
      const activeWallets = Array.isArray(walletData) ? walletData.filter(wallet => 
        !wallet.isArchived
      ) : []
      
      setWallets(activeWallets)
    } catch (error) {
      console.error('Error fetching wallets:', error)
      console.error('Error response:', error.response?.data)
      console.error('Error status:', error.response?.status)
    }
  }

  const fetchRecentTransfers = async () => {
    try {
      const response = await walletService.getTransactions({ type: 'transfer', limit: 5 })
      const transfers = response.data.data || response.data
      setRecentTransfers(transfers)
    } catch (error) {
      console.error('Error fetching recent transfers:', error)
    }
  }

  const calculateTransferFee = (fromWalletId, toWalletId, amount) => {
    const from = wallets.find(w => w.id.toString() === fromWalletId.toString())
    const to = wallets.find(w => w.id.toString() === toWalletId.toString())
    
    if (!from || !to || !amount) return 0
    
    // Phí cơ bản
    let fee = 0
    
    // Nếu khác loại tiền tệ
    if (from.currency !== to.currency) {
      fee = amount * 0.02 // 2% phí quy đổi
    } else {
      // Phí chuyển cơ bản giữa các ví cùng loại tiền tệ
      fee = Math.min(amount * 0.001, 10000) // 0.1% tối đa 10k
    }
    
    return Math.round(fee)
  }

  const validateTransfer = () => {
    const newErrors = {}
    
    if (!fromWallet) {
      newErrors.fromWallet = 'Vui lòng chọn ví nguồn'
    }
    
    if (!toWallet) {
      newErrors.toWallet = 'Vui lòng chọn ví đích'
    }
    
    if (fromWallet && toWallet && fromWallet === toWallet) {
      newErrors.toWallet = 'Ví đích phải khác ví nguồn'
    }
    
    // Validation cho amount
    if (!amount || amount.trim() === '') {
      newErrors.amount = 'Vui lòng nhập số tiền'
    } else {
      const amountValue = parseFloat(amount)
      if (isNaN(amountValue) || amountValue <= 0) {
        newErrors.amount = 'Số tiền phải lớn hơn 0'
      } else if (amountValue < 1000) {
        newErrors.amount = 'Số tiền tối thiểu là 1,000 ₫'
      } else if (fromWallet) {
        const wallet = wallets.find(w => w.id.toString() === fromWallet.toString())
        if (wallet && amountValue + transferFee > parseFloat(wallet.balance)) {
          newErrors.amount = 'Số dư không đủ (bao gồm phí chuyển)'
        }
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleAmountChange = (value) => {
    setAmount(value)
    
    // Clear amount error when user types
    if (errors.amount) {
      const newErrors = { ...errors }
      delete newErrors.amount
      setErrors(newErrors)
    }
    
    if (fromWallet && toWallet && value) {
      const fee = calculateTransferFee(fromWallet, toWallet, parseFloat(value))
      setTransferFee(fee)
    } else {
      setTransferFee(0)
    }
  }

  const handleWalletChange = () => {
    // Clear wallet errors when selection changes
    const newErrors = { ...errors }
    let hasChanges = false
    
    if (errors.fromWallet) {
      delete newErrors.fromWallet
      hasChanges = true
    }
    
    if (errors.toWallet) {
      delete newErrors.toWallet
      hasChanges = true
    }
    
    if (hasChanges) {
      setErrors(newErrors)
    }
    
    if (fromWallet && toWallet && amount) {
      const fee = calculateTransferFee(fromWallet, toWallet, parseFloat(amount))
      setTransferFee(fee)
    }
  }

  const handleSwapWallets = () => {
    const temp = fromWallet
    setFromWallet(toWallet)
    setToWallet(temp)
    handleWalletChange()
  }

  const handleTransfer = () => {
    if (validateTransfer()) {
      setShowConfirmation(true)
    }
  }

  const confirmTransfer = async () => {
    setLoading(true)
    try {
      const transferData = {
        fromWalletId: fromWallet,
        toWalletId: toWallet,
        amount: parseFloat(amount),
        note: note.trim(),
        fee: transferFee
      }

      await walletService.transferMoney(transferData)
      
      setTransferResult({
        success: true,
        message: 'Chuyển tiền thành công!',
        transactionId: 'TXN' + Date.now(),
        amount: parseFloat(amount),
        fee: transferFee,
        fromWalletName: wallets.find(w => w.id.toString() === fromWallet.toString())?.name,
        toWalletName: wallets.find(w => w.id.toString() === toWallet.toString())?.name
      })
      
      setShowConfirmation(false)
      
      // Reset form
      setFromWallet('')
      setToWallet('')
      setAmount('')
      setNote('')
      setTransferFee(0)
      
      // Refresh data
      fetchWallets()
      fetchRecentTransfers()
    } catch (error) {
      setTransferResult({
        success: false,
        message: error.message || 'Có lỗi xảy ra khi chuyển tiền'
      })
      setShowConfirmation(false)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount, currency = 'VND') => {
    if (!amount && amount !== 0) return '0 ₫'
    const formatted = new Intl.NumberFormat('vi-VN').format(amount)
    
    // Handle currency enum từ backend
    switch(currency) {
      case 'USD':
        return `$${formatted}`
      case 'EUR':
        return `€${formatted}`
      case 'VND':
      default:
        return `${formatted} ₫`
    }
  }

  // Success/Error Result Screen
  if (transferResult) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-8">
              <div className="text-center">
                {transferResult.success ? (
                  <>
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircleIcon className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-xl font-bold text-green-600 dark:text-green-400 mb-2">
                      Chuyển Tiền Thành Công!
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Đã chuyển {formatCurrency(transferResult.amount)} từ {transferResult.fromWalletName} sang {transferResult.toWalletName}
                    </p>
                    
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Mã giao dịch:</span>
                        <span className="font-mono text-sm text-gray-900 dark:text-white">
                          {transferResult.transactionId}
                        </span>
                      </div>
                      {transferResult.fee > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Phí chuyển:</span>
                          <span className="text-gray-900 dark:text-white">
                            {formatCurrency(transferResult.fee)}
                          </span>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
                      <AlertCircleIcon className="w-8 h-8 text-red-600 dark:text-red-400" />
                    </div>
                    <h3 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">
                      Chuyển Tiền Thất Bại
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {transferResult.message}
                    </p>
                  </>
                )}
                
                <div className="flex space-x-3">
                  <Button
                    onClick={() => setTransferResult(null)}
                    className="flex-1 h-12 text-base font-light bg-green-600 hover:bg-green-700 text-white rounded-lg border-0"
                  >
                    Chuyển Tiền Mới
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => window.history.back()}
                    className="flex-1 h-12 text-base font-light bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg border-0"
                  >
                    Quay Lại
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Confirmation Modal
  if (showConfirmation) {
    const fromWalletData = wallets.find(w => w.id.toString() === fromWallet.toString())
    const toWalletData = wallets.find(w => w.id.toString() === toWallet.toString())
    
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShieldCheckIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Xác Nhận Chuyển Tiền
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Vui lòng kiểm tra thông tin trước khi xác nhận
                </p>
                
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Từ ví</p>
                      <p className="font-medium text-gray-900 dark:text-white">{fromWalletData?.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Số dư: {formatCurrency(fromWalletData?.balance, fromWalletData?.currency)}
                      </p>
                    </div>
                    <ArrowRightIcon className="w-6 h-6 text-gray-400" />
                    <div className="text-right">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Đến ví</p>
                      <p className="font-medium text-gray-900 dark:text-white">{toWalletData?.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Số dư: {formatCurrency(toWalletData?.balance, toWalletData?.currency)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 dark:border-gray-600 pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Số tiền chuyển:</span>
                      <span className="font-bold text-gray-900 dark:text-white">
                        {formatCurrency(parseFloat(amount))}
                      </span>
                    </div>
                    {transferFee > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Phí chuyển:</span>
                        <span className="text-gray-900 dark:text-white">
                          {formatCurrency(transferFee)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between border-t border-gray-200 dark:border-gray-600 pt-2">
                      <span className="font-medium text-gray-900 dark:text-white">Tổng cộng:</span>
                      <span className="font-bold text-green-600">
                        {formatCurrency(parseFloat(amount) + transferFee)}
                      </span>
                    </div>
                  </div>
                  
                  {note && (
                    <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Ghi chú:</p>
                      <p className="text-gray-900 dark:text-white italic">&ldquo;{note}&rdquo;</p>
                    </div>
                  )}
                </div>
                
                <div className="flex space-x-3">
                  <Button
                    onClick={confirmTransfer}
                    disabled={loading}
                    className="flex-1 h-12 text-base font-light bg-green-600 hover:bg-green-700 text-white rounded-lg border-0"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    ) : (
                      <CheckCircleIcon className="w-5 h-5 mr-2" />
                    )}
                    {loading ? 'Đang xử lý...' : 'Xác Nhận'}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setShowConfirmation(false)}
                    disabled={loading}
                    className="flex-1 h-12 text-base font-light bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg border-0"
                  >
                    Hủy
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Chuyển Tiền
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Chuyển tiền giữa các ví của bạn
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Button
              onClick={() => window.history.back()}
              variant="ghost"
              size="sm"
              className="h-10 px-4 text-sm font-light bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-800/30 text-green-700 dark:text-green-400 rounded-md border-0"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-1" />
              Quay lại
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                    <ArrowLeftRightIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Thông Tin Chuyển Tiền</h2>
                </div>

                <div className="space-y-6">
                  {/* No wallets message */}
                  {wallets.length === 0 && (
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                      <div className="flex items-center space-x-2">
                        <AlertCircleIcon className="w-5 h-5 text-yellow-600" />
                        <div>
                          <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                            Chưa có ví nào để chuyển tiền
                          </p>
                          <p className="text-xs text-yellow-600 dark:text-yellow-400">
                            Bạn cần tạo ít nhất 2 ví để thực hiện chuyển tiền
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Wallet Selection */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* From Wallet */}
                    <div className="space-y-2">
                      <Label htmlFor="fromWallet" className="text-base font-medium">Từ ví <span className="text-red-500">*</span></Label>
                      <select
                        id="fromWallet"
                        value={fromWallet}
                        onChange={(e) => {
                          setFromWallet(e.target.value)
                          handleWalletChange()
                        }}
                        className={`w-full h-12 px-4 text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                          errors.fromWallet ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                        } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                      >
                        <option value="">Chọn ví nguồn</option>
                        {wallets.map(wallet => (
                          <option key={wallet.id} value={wallet.id}>
                            {wallet.name} - {formatCurrency(wallet.balance, wallet.currency)}
                            {wallet.sharedBy && ` (Chia sẻ bởi: ${wallet.sharedBy})`}
                          </option>
                        ))}
                      </select>
                      {errors.fromWallet && (
                        <p className="text-sm text-red-500">{errors.fromWallet}</p>
                      )}
                    </div>

                    {/* To Wallet */}
                    <div className="space-y-2">
                      <Label htmlFor="toWallet" className="text-base font-medium">Đến ví <span className="text-red-500">*</span></Label>
                      <select
                        id="toWallet"
                        value={toWallet}
                        onChange={(e) => {
                          setToWallet(e.target.value)
                          handleWalletChange()
                        }}
                        className={`w-full h-12 px-4 text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                          errors.toWallet ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                        } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                      >
                        <option value="">Chọn ví đích</option>
                        {wallets.filter(w => w.id !== fromWallet).map(wallet => (
                          <option key={wallet.id} value={wallet.id}>
                            {wallet.name} - {formatCurrency(wallet.balance, wallet.currency)}
                            {wallet.sharedBy && ` (Chia sẻ bởi: ${wallet.sharedBy})`}
                          </option>
                        ))}
                      </select>
                      {errors.toWallet && (
                        <p className="text-sm text-red-500">{errors.toWallet}</p>
                      )}
                    </div>
                  </div>

                  {/* Swap Button */}
                  {fromWallet && toWallet && (
                    <div className="flex justify-center">
                      <Button
                        onClick={handleSwapWallets}
                        variant="ghost"
                        size="sm"
                        className="h-10 px-4 text-sm font-light bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-800/30 text-blue-700 dark:text-blue-400 rounded-lg border-0"
                      >
                        <RefreshCwIcon className="w-4 h-4 mr-2" />
                        Hoán đổi ví
                      </Button>
                    </div>
                  )}

                  {/* Amount */}
                  <div className="space-y-2">
                    <Label htmlFor="amount" className="text-base font-medium">Số tiền chuyển <span className="text-red-500">*</span></Label>
                    <div className="relative">
                      <Input
                        id="amount"
                        type="number"
                        placeholder="Nhập số tiền"
                        value={amount}
                        onChange={(e) => handleAmountChange(e.target.value)}
                        className={`h-12 text-base pl-12 pr-4 ${errors.amount ? 'border-red-500' : ''}`}
                        min="1000"
                        step="1000"
                      />
                      <DollarSignIcon className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                    </div>
                    {errors.amount && (
                      <p className="text-sm text-red-500">{errors.amount}</p>
                    )}
                    {amount && !errors.amount && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Số tiền: {formatCurrency(parseFloat(amount))}
                      </p>
                    )}
                  </div>

                  {/* Quick Amount Buttons */}
                  {fromWallet && (
                    <div className="space-y-2">
                      <Label className="text-base font-medium">Số tiền nhanh</Label>
                      <div className="grid grid-cols-4 gap-3">
                        {(() => {
                          const wallet = wallets.find(w => w.id === fromWallet)
                          const balance = wallet?.balance || 0
                          const quickAmounts = [
                            Math.min(100000, balance * 0.25),
                            Math.min(500000, balance * 0.5),
                            Math.min(1000000, balance * 0.75),
                            balance * 0.9
                          ].filter(amount => amount >= 1000)
                          
                          return quickAmounts.map((quickAmount, index) => (
                            <Button
                              key={index}
                              variant="ghost"
                              size="sm"
                              onClick={() => handleAmountChange(Math.floor(quickAmount).toString())}
                              className="h-10 text-sm font-light bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg border-0"
                            >
                              {formatCurrency(Math.floor(quickAmount))}
                            </Button>
                          ))
                        })()}
                      </div>
                    </div>
                  )}

                  {/* Transfer Fee Display */}
                  {transferFee > 0 && (
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                      <div className="flex items-center space-x-2">
                        <AlertCircleIcon className="w-5 h-5 text-yellow-600" />
                        <div>
                          <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                            Phí chuyển tiền: {formatCurrency(transferFee)}
                          </p>
                          <p className="text-xs text-yellow-600 dark:text-yellow-400">
                            Áp dụng do khác loại tiền tệ hoặc loại ví
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Note */}
                  <div className="space-y-2">
                    <Label htmlFor="note" className="text-base font-medium">Ghi chú (tùy chọn)</Label>
                    <textarea
                      id="note"
                      placeholder="Nhập ghi chú cho giao dịch..."
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                    />
                    <p className="text-xs text-gray-500">
                      {note.length}/200 ký tự
                    </p>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-6">
                    <Button
                      onClick={handleTransfer}
                      disabled={
                        !fromWallet || 
                        !toWallet || 
                        !amount || 
                        amount.trim() === '' ||
                        Object.keys(errors).length > 0 ||
                        wallets.length === 0
                      }
                      className="w-full h-12 text-base font-light bg-green-600 hover:bg-green-700 text-white rounded-lg border-0 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      <ArrowLeftRightIcon className="w-5 h-5 mr-2" />
                      {wallets.length === 0 ? 'Không có ví' : 'Chuyển Tiền'}
                    </Button>
                    
                    {/* Help text when button is disabled */}
                    {(!fromWallet || !toWallet || !amount || Object.keys(errors).length > 0) && wallets.length > 0 && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-2">
                        {!fromWallet || !toWallet ? 'Vui lòng chọn ví nguồn và ví đích' :
                         !amount ? 'Vui lòng nhập số tiền' :
                         Object.keys(errors).length > 0 ? 'Vui lòng sửa các lỗi trên' : ''}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Transfers */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <ReceiptIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Chuyển Tiền Gần Đây</h3>
                </div>
                
                {recentTransfers.length === 0 ? (
                  <div className="text-center py-4">
                    <ReceiptIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Chưa có giao dịch nào
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentTransfers.map(transfer => (
                      <div key={transfer.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                            <ArrowLeftRightIcon className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white text-sm">
                              {transfer.fromWallet?.name} → {transfer.toWallet?.name}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              {new Date(transfer.createdAt).toLocaleDateString('vi-VN')}
                            </p>
                          </div>
                        </div>
                        <span className="font-bold text-blue-600 text-sm">
                          {formatCurrency(transfer.amount)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Tips */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                    <StarIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Mẹo Hữu Ích</h3>
                </div>
                
                <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-start space-x-2">
                    <CheckCircleIcon className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <p>Chuyển tiền giữa các ví cùng loại tiền tệ để tránh phí quy đổi</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircleIcon className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <p>Kiểm tra số dư trước khi thực hiện chuyển tiền</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircleIcon className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <p>Sử dụng ghi chú để theo dõi mục đích chuyển tiền</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircleIcon className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <p>Xác nhận kỹ thông tin trước khi thực hiện giao dịch</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TransferMoney
