import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import {
  ArrowLeftIcon,
  PlusIcon,
  DollarSignIcon,
  CreditCardIcon,
  BanknoteIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  StarIcon,
  ReceiptIcon,
  RefreshCwIcon as TransferIcon
} from 'lucide-react'
import { walletService } from '../services/walletService'

const AddMoney = () => {
  const [wallets, setWallets] = useState([])
  const [selectedWallet, setSelectedWallet] = useState('')
  const [amount, setAmount] = useState('')
  const [addMethod, setAddMethod] = useState('Ngân hàng')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [showSuccess, setShowSuccess] = useState(false)
  const [transactionResult, setTransactionResult] = useState(null)
  const [recentTransactions, setRecentTransactions] = useState([])

  useEffect(() => {
    fetchWallets()
    fetchRecentTransactions()
  }, [])

  const fetchWallets = async () => {
    try {
      const response = await walletService.getWallets()
      const walletList = response.data.data || []
      const activeWallets = walletList.filter(wallet => !wallet.archived)
      setWallets(activeWallets)
    } catch (error) {
      console.error('Error fetching wallets:', error)
      setWallets([])
    }
  }

  const fetchRecentTransactions = async () => {
    try {
      const response = await walletService.getTransactions({ type: 'INCOME', limit: 5 })
      setRecentTransactions(response.data.data || [])
    } catch (error) {
      console.error('Error fetching recent transactions:', error)
      setRecentTransactions([])
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!selectedWallet) {
      newErrors.selectedWallet = 'Vui lòng chọn ví'
    }
    if (!amount || parseFloat(amount) <= 0) {
      newErrors.amount = 'Số tiền phải lớn hơn 0'
    } else if (parseFloat(amount) < 1000) {
      newErrors.amount = 'Số tiền tối thiểu là 1,000'
    } else if (parseFloat(amount) > 100000000) {
      newErrors.amount = 'Số tiền tối đa là 100,000,000'
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
        amount: parseFloat(amount),
        method: addMethod,
        description: note.trim()
      }

      const response = await walletService.addMoney(selectedWallet, transactionData)

      setTransactionResult({
        success: true,
        message: 'Nạp tiền thành công!',
        transactionId: response.data.data.id,
        amount: parseFloat(amount),
        walletName: wallets.find(w => w.id.toString() === selectedWallet)?.name
      })
      setShowSuccess(true)
      setSelectedWallet('')
      setAmount('')
      setNote('')
      fetchWallets()
      fetchRecentTransactions()
    } catch (error) {
      setTransactionResult({
        success: false,
        message: error.response?.data?.message || 'Có lỗi xảy ra khi nạp tiền'
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

  if (showSuccess && transactionResult) {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-card rounded-lg shadow-lg border border-border p-8">
            <div className="text-center">
              {transactionResult.success ? (
                  <>
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircleIcon className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-xl font-bold text-green-600 dark:text-green-400 mb-2">
                      Nạp Tiền Thành Công!
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Đã nạp {formatCurrency(transactionResult.amount)} vào ví {transactionResult.walletName}
                    </p>
                  </>
              ) : (
                  <>
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <AlertCircleIcon className="w-8 h-8 text-red-600 dark:text-red-400" />
                    </div>
                    <h3 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">
                      Nạp Tiền Thất Bại
                    </h3>
                    <p className="text-muted-foreground mb-4">
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
                  onClick={() => window.history.back()}
                  className="flex-1 h-12 text-base font-light bg-muted hover:bg-muted/80 text-muted-foreground rounded-lg border-0"
                >
                  Quay Lại
                </Button>
              </div>
            </div>
          </div>
        </div>
    )
  }

  const paymentMethods = [
    { key: 'Ngân hàng', label: 'Ngân hàng', description: 'Chuyển khoản từ tài khoản ngân hàng', icon: BanknoteIcon },
    { key: 'Thẻ', label: 'Thẻ', description: 'Thẻ tín dụng hoặc thẻ ghi nợ', icon: CreditCardIcon },
    { key: 'Tiền mặt', label: 'Tiền mặt', description: 'Nạp tiền mặt tại quầy', icon: DollarSignIcon },
    { key: 'Chuyển khoản', label: 'Chuyển khoản', description: 'Từ ví hoặc tài khoản khác', icon: TransferIcon }
  ]

  return (
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Nạp Tiền
              </h1>
              <p className="text-muted-foreground mt-2">
                Thêm tiền vào ví của bạn
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-card rounded-lg shadow-lg border border-border">
                <div className="p-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <h2 className="text-2xl font-semibold text-foreground">Thông Tin Nạp Tiền</h2>
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="walletSelect">Chọn ví <span className="text-red-500">*</span></Label>
                      <select
                          id="walletSelect"
                          value={selectedWallet}
                          onChange={(e) => setSelectedWallet(e.target.value)}
                          className={`w-full h-12 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${errors.selectedWallet ? 'border-red-500' : 'border-border'} bg-background`}
                      >
                        <option value="">Chọn ví để nạp tiền</option>
                        {wallets.map(w => (
                            <option key={w.id} value={w.id}>{w.name} - {formatCurrency(w.balance, w.currency)}</option>
                        ))}
                      </select>
                      {errors.selectedWallet && <p className="text-sm text-red-500">{errors.selectedWallet}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="amount">Số tiền <span className="text-red-500">*</span></Label>
                      <div className="relative">
                        <Input
                            id="amount"
                            type="number"
                            placeholder="Nhập số tiền"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className={`h-12 pl-12 pr-4 ${errors.amount ? 'border-red-500' : ''}`}
                            min="1000"
                            max="100000000"
                            step="1000"
                        />
                        <DollarSignIcon className="w-5 h-5 text-muted-foreground absolute left-4 top-1/2 transform -translate-y-1/2" />
                      </div>
                      {errors.amount && <p className="text-sm text-red-500">{errors.amount}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label>Số tiền nhanh</Label>
                      <div className="grid grid-cols-4 gap-3">
                        {[100000, 500000, 1000000, 5000000].map(quickAmount => (
                            <Button
                                key={quickAmount}
                                variant="ghost"
                                size="sm"
                                onClick={() => setAmount(quickAmount.toString())}
                                className="h-10 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg"
                            >
                              {formatCurrency(quickAmount)}
                            </Button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label>Phương thức nạp tiền <span className="text-red-500">*</span></Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {paymentMethods.map(({ key, label, description, icon: Icon }) => (
                            <div
                                key={key}
                                onClick={() => setAddMethod(label)}
                                className={`p-4 border rounded-lg cursor-pointer transition-all ${addMethod === label ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-border hover:border-green-300'}`}
                            >
                              <div className="flex items-center space-x-3">
                                <Icon className="w-5 h-5 text-green-600 dark:text-green-400" />
                                <div>
                                  <p className="font-medium text-card-foreground">{label}</p>
                                  <p className="text-sm text-muted-foreground">{description}</p>
                                </div>
                              </div>
                            </div>
                        ))}
                      </div>
                      {errors.addMethod && <p className="text-sm text-red-500">{errors.addMethod}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="note">Ghi chú</Label>
                      <textarea
                          id="note"
                          placeholder="Ghi chú về giao dịch này..."
                          value={note}
                          onChange={(e) => setNote(e.target.value)}
                          rows={3}
                          className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground resize-none"
                      />
                    </div>

                    <div className="pt-6">
                      <Button
                          onClick={handleAddMoney}
                          disabled={!selectedWallet || !amount || !addMethod || loading}
                          className="w-full h-12 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                      >
                        {loading ? 'Đang xử lý...' : 'Nạp Tiền'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-card rounded-lg shadow-lg border border-border">
                <div className="p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                      <ReceiptIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-card-foreground">Giao Dịch Gần Đây</h3>
                  </div>
                  {recentTransactions.length > 0 ? (
                      <div className="space-y-3">
                        {recentTransactions.map(t => (
                            <div key={t.id} className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center">
                                  <PlusIcon className="w-4 h-4 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                  <p className="font-medium text-card-foreground text-sm" title={t.description}>
                                    {t.description.length > 25 ? `${t.description.substring(0, 25)}...` : t.description}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {new Date(t.date).toLocaleDateString('vi-VN')}
                                  </p>
                                </div>
                              </div>
                              <span className="font-bold text-green-600 dark:text-green-400 text-sm">
                          +{formatCurrency(t.amount)}
                        </span>
                            </div>
                        ))}
                      </div>
                  ) : (
                      <div className="text-center py-4">
                        <ReceiptIcon className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Chưa có giao dịch nào</p>
                      </div>
                  )}
                </div>
              </div>
              <div className="bg-card rounded-lg shadow-lg border border-border">
                <div className="p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-yellow-100 dark:bg-yellow-900/50 rounded-lg">
                      <StarIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-card-foreground">Mẹo Hữu Ích</h3>
                  </div>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <div className="flex items-start space-x-2">
                      <CheckCircleIcon className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <p>Sử dụng ghi chú để theo dõi nguồn gốc của tiền.</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircleIcon className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <p>Kiểm tra kỹ thông tin ví và số tiền trước khi xác nhận.</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircleIcon className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <p>Thường xuyên kiểm tra lịch sử giao dịch để quản lý tài chính tốt hơn.</p>
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