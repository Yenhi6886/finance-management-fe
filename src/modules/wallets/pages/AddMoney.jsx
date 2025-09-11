import React, { useState, useEffect } from 'react'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { 
  ArrowLeftIcon,
  DollarSignIcon,
  CheckCircleIcon,
  AlertCircleIcon
} from 'lucide-react'
import { walletService } from '../services/walletService'
import { toast } from 'sonner'

const AddMoney = () => {
  const [wallets, setWallets] = useState([])
  const [selectedWallet, setSelectedWallet] = useState('')
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [showSuccess, setShowSuccess] = useState(false)
  const [transactionResult, setTransactionResult] = useState(null)

  useEffect(() => {
    fetchWallets()
  }, [])

  const fetchWallets = async () => {
    try {
      const response = await walletService.getWallets()
      // Chỉ lấy ví của chính user (không bao gồm ví được share từ người khác)
      const ownedWallets = response.data.filter(wallet => 
        wallet.status === 'active' && wallet.ownedByCurrentUser
      )
      setWallets(ownedWallets)
    } catch (error) {
      console.error('Error fetching wallets:', error)
      toast.error('Không thể tải danh sách ví')
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!selectedWallet) {
      newErrors.selectedWallet = 'Vui lòng chọn ví'
    }
    
    if (!amount || parseFloat(amount) <= 0) {
      newErrors.amount = 'Vui lòng nhập số tiền hợp lệ'
    } else if (parseFloat(amount) < 1000) {
      newErrors.amount = 'Số tiền tối thiểu là 1,000 VND'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setLoading(true)
    
    try {
      const transactionData = {
        walletId: selectedWallet,
        amount: parseFloat(amount),
        note: note.trim() || 'Nạp tiền vào ví'
      }
      
      await walletService.addMoney(transactionData)
      
      setTransactionResult({
        success: true,
        amount: parseFloat(amount),
        walletName: wallets.find(w => w.id === selectedWallet)?.name,
        message: 'Giao dịch thành công!'
      })
      setShowSuccess(true)
      
      // Reset form
      setSelectedWallet('')
      setAmount('')
      setNote('')
      setErrors({})
      
    } catch (error) {
      console.error('Lỗi khi nạp tiền:', error)
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

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.history.back()}
                className="h-10 w-10 p-0 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <ArrowLeftIcon className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Nạp Tiền Vào Ví</h1>
                <p className="text-gray-600 dark:text-gray-400">Thêm tiền vào ví của bạn</p>
              </div>
            </div>
          </div>

          {/* Main Form */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Thông Tin Nạp Tiền</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
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
                  <Label htmlFor="amount" className="text-base font-medium">Số tiền muốn thêm vào ví <span className="text-red-500">*</span></Label>
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

                {/* Submit Button */}
                <div className="pt-4">
                  <Button
                    type="submit"
                    disabled={!selectedWallet || !amount || Object.keys(errors).length > 0 || loading}
                    className="w-full h-12 text-base font-light bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white rounded-lg border-0"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Đang xử lý...
                      </div>
                    ) : (
                      <>
                        <DollarSignIcon className="w-5 h-5 mr-2" />
                        Nạp Tiền
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddMoney
