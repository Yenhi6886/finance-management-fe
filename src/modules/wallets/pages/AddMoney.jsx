import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import {
  ArrowLeftIcon,
  PlusIcon,
  WalletIcon,
  DollarSignIcon,
  CreditCardIcon,
  BanknoteIcon,
  TrendingUpIcon,
  CalendarIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  StarIcon,
  GiftIcon,
  RefreshCwIcon,
  ClockIcon,
  ReceiptIcon
} from 'lucide-react'
import { walletService } from '../services/walletService'

const AddMoney = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [wallets, setWallets] = useState([])
  const [selectedWallet, setSelectedWallet] = useState('')
  const [amount, setAmount] = useState('')
  const [addMethod, setAddMethod] = useState('bank') // bank, card, cash, transfer
  const [note, setNote] = useState('')
  const [category, setCategory] = useState('income') // income, bonus, refund, other
  const [isRecurring, setIsRecurring] = useState(false)
  const [recurringPeriod, setRecurringPeriod] = useState('monthly')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [showSuccess, setShowSuccess] = useState(false)
  const [transactionResult, setTransactionResult] = useState(null)
  const [recentTransactions, setRecentTransactions] = useState([])

  const fromPath = location.state?.from || '/wallets';

  useEffect(() => {
    fetchWallets()
    fetchRecentTransactions()
  }, [])

  const fetchWallets = async () => {
    try {
      const response = await walletService.getWallets()
      // Chỉ lấy các ví active và có quyền add money
      const activeWallets = response.data.filter(wallet =>
          wallet.status === 'active' &&
          (wallet.permissions.includes('add_money') || wallet.permissions.includes('full'))
      )
      setWallets(activeWallets)
    } catch (error) {
      console.error('Error fetching wallets:', error)
    }
  }

  const fetchRecentTransactions = async () => {
    try {
      const response = await walletService.getTransactions({ type: 'deposit', limit: 5 })
      setRecentTransactions(response.data)
    } catch (error) {
      console.error('Error fetching recent transactions:', error)
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!selectedWallet) {
      newErrors.selectedWallet = 'Vui lòng chọn ví'
    }

    if (!amount || parseFloat(amount) <= 0) {
      newErrors.amount = 'Số tiền phải lớn hơn 0'
    }

    if (parseFloat(amount) < 1000) {
      newErrors.amount = 'Số tiền tối thiểu là 1,000 ₫'
    }

    if (parseFloat(amount) > 100000000) {
      newErrors.amount = 'Số tiền tối đa là 100,000,000 ₫'
    }

    if (!addMethod) {
      newErrors.addMethod = 'Vui lòng chọn phương thức nạp tiền'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleAddMoney = async () => {
    if (!validateForm()) return

    setLoading(true)
    try {
      const transactionData = {
        walletId: selectedWallet,
        amount: parseFloat(amount),
        method: addMethod,
        note: note.trim(),
        category,
        isRecurring,
        recurringPeriod: isRecurring ? recurringPeriod : null
      }

      const response = await walletService.addMoney(transactionData)

      setTransactionResult({
        success: true,
        message: 'Nạp tiền thành công!',
        transactionId: response.data.transactionId,
        amount: parseFloat(amount),
        walletName: wallets.find(w => w.id === selectedWallet)?.name
      })

      setShowSuccess(true)

      // Reset form
      setSelectedWallet('')
      setAmount('')
      setNote('')
      setCategory('income')
      setIsRecurring(false)

      // Refresh data
      fetchWallets()
      fetchRecentTransactions()
    } catch (error) {
      setTransactionResult({
        success: false,
        message: error.message || 'Có lỗi xảy ra khi nạp tiền'
      })
      setShowSuccess(true)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount, currency = 'VND') => {
    const formatted = new Intl.NumberFormat('vi-VN').format(amount)
    return currency === 'USD' ? `$${formatted}` : `${formatted} ₫`
  }

  const getMethodIcon = (method) => {
    const icons = {
      bank: BanknoteIcon,
      card: CreditCardIcon,
      cash: DollarSignIcon,
      transfer: RefreshCwIcon
    }
    return icons[method] || DollarSignIcon
  }

  if (showSuccess && transactionResult) {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-8">
                <div className="text-center">
                  {transactionResult.success ? (
                      <>
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                          <CheckCircleIcon className="w-8 h-8 text-green-600 dark:text-green-400" />
                        </div>
                        <h3 className="text-xl font-bold text-green-600 dark:text-green-400 mb-2">
                          Nạp Tiền Thành Công!
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                          Đã nạp {formatCurrency(transactionResult.amount)} vào ví {transactionResult.walletName}
                        </p>
                      </>
                  ) : (
                      <>
                        <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
                          <AlertCircleIcon className="w-8 h-8 text-red-600 dark:text-red-400" />
                        </div>
                        <h3 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">
                          Nạp Tiền Thất Bại
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                          {transactionResult.message}
                        </p>
                      </>
                  )}

                  <div className="flex space-x-3">
                    <Button
                        onClick={() => setShowSuccess(false)}
                        className="flex-1 h-12 text-base font-light bg-green-600 hover:bg-green-700 text-white rounded-lg border-0"
                    >
                      Nạp Tiền Mới
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={() => navigate(fromPath)}
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

  return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Nạp Tiền
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Thêm tiền vào ví của bạn
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <Button
                  onClick={() => navigate(fromPath)}
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
                      <PlusIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Thông Tin Nạp Tiền</h2>
                  </div>

                  <div className="space-y-6">
                    {/* Wallet Selection */}
                    <div className="space-y-2">
                      <Label htmlFor="walletSelect" className="text-base font-medium">Chọn ví <span className="text-red-500">*</span></Label>
                      <select
                          id="walletSelect"
                          value={selectedWallet}
                          onChange={(e) => setSelectedWallet(e.target.value)}
                          className={`w-full h-12 px-4 text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                              errors.selectedWallet ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                          } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                      >
                        <option value="">Chọn ví để nạp tiền</option>
                        {wallets.map(wallet => (
                            <option key={wallet.id} value={wallet.id}>
                              {wallet.name} - {formatCurrency(wallet.balance, wallet.currency)}
                            </option>
                        ))}
                      </select>
                      {errors.selectedWallet && (
                          <p className="text-sm text-red-500">{errors.selectedWallet}</p>
                      )}
                    </div>

                    {/* Amount */}
                    <div className="space-y-2">
                      <Label htmlFor="amount" className="text-base font-medium">Số tiền <span className="text-red-500">*</span></Label>
                      <div className="relative">
                        <Input
                            id="amount"
                            type="number"
                            placeholder="Nhập số tiền"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className={`h-12 text-base pl-12 pr-4 ${errors.amount ? 'border-red-500' : ''}`}
                            min="1000"
                            max="100000000"
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
                    <div className="space-y-2">
                      <Label className="text-base font-medium">Số tiền nhanh</Label>
                      <div className="grid grid-cols-4 gap-3">
                        {[100000, 500000, 1000000, 5000000].map(quickAmount => (
                            <Button
                                key={quickAmount}
                                variant="ghost"
                                size="sm"
                                onClick={() => setAmount(quickAmount.toString())}
                                className="h-10 text-sm font-light bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg border-0"
                            >
                              {formatCurrency(quickAmount)}
                            </Button>
                        ))}
                      </div>
                    </div>

                    {/* Add Method */}
                    <div className="space-y-4">
                      <Label className="text-base font-medium">Phương thức nạp tiền <span className="text-red-500">*</span></Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {[
                          { method: 'bank', title: 'Ngân hàng', description: 'Chuyển khoản từ tài khoản ngân hàng' },
                          { method: 'card', title: 'Thẻ', description: 'Thẻ tín dụng hoặc thẻ ghi nợ' },
                          { method: 'cash', title: 'Tiền mặt', description: 'Nạp tiền mặt tại quầy' },
                          { method: 'transfer', title: 'Chuyển khoản', description: 'Từ ví hoặc tài khoản khác' }
                        ].map(({ method, title, description }) => {
                          const Icon = getMethodIcon(method)
                          return (
                              <div
                                  key={method}
                                  onClick={() => setAddMethod(method)}
                                  className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-sm ${
                                      addMethod === method
                                          ? 'border-green-500 bg-green-50 dark:bg-green-900/20 shadow-sm'
                                          : 'border-gray-200 dark:border-gray-600 hover:border-green-300'
                                  }`}
                              >
                                <div className="flex items-center space-x-3">
                                  <Icon className="w-5 h-5 text-green-600" />
                                  <div>
                                    <p className="font-medium text-gray-900 dark:text-white">{title}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
                                  </div>
                                </div>
                              </div>
                          )
                        })}
                      </div>
                      {errors.addMethod && (
                          <p className="text-sm text-red-500">{errors.addMethod}</p>
                      )}
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                      <Label className="text-base font-medium">Phân loại</Label>
                      <div className="grid grid-cols-5 gap-2">
                        {[
                          { value: 'income', label: 'Thu nhập' },
                          { value: 'bonus', label: 'Thưởng' },
                          { value: 'refund', label: 'Hoàn tiền' },
                          { value: 'gift', label: 'Quà tặng' },
                          { value: 'other', label: 'Khác' }
                        ].map(({ value, label }) => (
                            <Button
                                key={value}
                                variant="ghost"
                                size="sm"
                                onClick={() => setCategory(value)}
                                className={`h-10 text-sm font-light rounded-lg border-0 ${
                                    category === value
                                        ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                                        : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600'
                                }`}
                            >
                              {label}
                            </Button>
                        ))}
                      </div>
                    </div>

                    {/* Note */}
                    <div className="space-y-2">
                      <Label htmlFor="note" className="text-base font-medium">Ghi chú</Label>
                      <textarea
                          id="note"
                          placeholder="Ghi chú về giao dịch này..."
                          value={note}
                          onChange={(e) => setNote(e.target.value)}
                          rows={3}
                          className="w-full px-4 py-3 text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                      />
                    </div>

                    {/* Recurring */}
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="recurring"
                            checked={isRecurring}
                            onChange={(e) => setIsRecurring(e.target.checked)}
                            className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                        />
                        <Label htmlFor="recurring" className="text-base font-medium">
                          Nạp tiền định kỳ
                        </Label>
                      </div>

                      {isRecurring && (
                          <div className="ml-6 space-y-2">
                            <Label className="text-base font-medium">Chu kỳ</Label>
                            <div className="grid grid-cols-3 gap-2">
                              {[
                                { value: 'weekly', label: 'Hàng tuần' },
                                { value: 'monthly', label: 'Hàng tháng' },
                                { value: 'yearly', label: 'Hàng năm' }
                              ].map(({ value, label }) => (
                                  <Button
                                      key={value}
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => setRecurringPeriod(value)}
                                      className={`h-10 text-sm font-light rounded-lg border-0 ${
                                          recurringPeriod === value
                                              ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                                              : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600'
                                      }`}
                                  >
                                    {label}
                                  </Button>
                              ))}
                            </div>
                          </div>
                      )}
                    </div>

                    {/* Submit Button */}
                    <div className="pt-6">
                      <Button
                          onClick={handleAddMoney}
                          disabled={!selectedWallet || !amount || !addMethod || Object.keys(errors).length > 0 || loading}
                          className="w-full h-12 text-base font-light bg-green-600 hover:bg-green-700 text-white rounded-lg border-0"
                      >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        ) : (
                            <PlusIcon className="w-5 h-5 mr-2" />
                        )}
                        {loading ? 'Đang xử lý...' : 'Nạp Tiền'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Recent Transactions */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                      <ReceiptIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Giao Dịch Gần Đây</h3>
                  </div>

                  {recentTransactions.length === 0 ? (
                      <div className="text-center py-4">
                        <ReceiptIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Chưa có giao dịch nào
                        </p>
                      </div>
                  ) : (
                      <div className="space-y-3">
                        {recentTransactions.map(transaction => (
                            <div key={transaction.id} className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                                  <PlusIcon className="w-4 h-4 text-green-600" />
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900 dark:text-white text-sm">
                                    {transaction.wallet?.name}
                                  </p>
                                  <p className="text-xs text-gray-600 dark:text-gray-400">
                                    {new Date(transaction.createdAt).toLocaleDateString('vi-VN')}
                                  </p>
                                </div>
                              </div>
                              <span className="font-bold text-green-600 text-sm">
                          +{formatCurrency(transaction.amount)}
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
                      <p>Nạp tiền định kỳ để duy trì quản lý tài chính ổn định</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircleIcon className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <p>Sử dụng ghi chú để theo dõi nguồn gốc của tiền</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircleIcon className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <p>Phân loại danh mục giúp báo cáo tài chính chính xác hơn</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircleIcon className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <p>Kiểm tra thông tin trước khi xác nhận giao dịch</p>
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

export default AddMoney