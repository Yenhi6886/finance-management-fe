import React, { useState, useEffect } from 'react'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Card } from '../../../components/ui/card'
import { Alert } from '../../../components/ui/alert'
import { 
  MinusIcon,
  DollarSignIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  LoaderIcon,
  XIcon,
  CalendarIcon
} from 'lucide-react'
import { walletService } from '../services/walletService'
import { toast } from 'sonner'

const AddExpense = ({ isOpen, onClose, onSuccess }) => {
  const [wallets, setWallets] = useState([])
  const [categories, setCategories] = useState([])
  const [formData, setFormData] = useState({
    walletId: '',
    amount: '',
    category: '',
    note: '',
    datetime: new Date().toISOString().slice(0, 16) // Format for datetime-local input
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    if (isOpen) {
      fetchData()
      resetForm()
    }
  }, [isOpen])

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false)
        onClose()
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [showSuccess, onClose])

  const fetchData = async () => {
    try {
      const [walletsResponse, categoriesResponse] = await Promise.all([
        walletService.getWallets(),
        walletService.getExpenseCategories()
      ])
      
      // Filter active wallets
      const activeWallets = walletsResponse.data.filter(wallet => 
        wallet.status === 'active'
      )
      setWallets(activeWallets)
      setCategories(categoriesResponse.data)
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Có lỗi khi tải dữ liệu')
    }
  }

  const resetForm = () => {
    setFormData({
      walletId: '',
      amount: '',
      category: '',
      note: '',
      datetime: new Date().toISOString().slice(0, 16)
    })
    setErrors({})
    setShowSuccess(false)
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.walletId) {
      newErrors.walletId = 'Vui lòng chọn ví'
    }
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Số tiền phải lớn hơn 0'
    }
    
    if (parseFloat(formData.amount) < 1000) {
      newErrors.amount = 'Số tiền tối thiểu là 1,000 ₫'
    }

    if (!formData.category) {
      newErrors.category = 'Vui lòng chọn danh mục chi tiêu'
    }

    if (!formData.datetime) {
      newErrors.datetime = 'Vui lòng chọn thời gian'
    }

    if (formData.note && formData.note.length > 255) {
      newErrors.note = 'Ghi chú không được quá 255 ký tự'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)
    setErrors({})

    try {
      const expenseData = {
        walletId: formData.walletId,
        amount: parseFloat(formData.amount),
        category: formData.category,
        note: formData.note.trim(),
        datetime: formData.datetime
      }

      const response = await walletService.addExpense(expenseData)
      
      if (response.success) {
        setShowSuccess(true)
        toast.success('Thêm khoản chi thành công!')
        if (onSuccess) {
          onSuccess(response.data)
        }
      } else {
        setErrors({ 
          submit: response.message || 'Có lỗi xảy ra khi thêm khoản chi'
        })
        toast.error(response.message || 'Có lỗi xảy ra')
      }
    } catch (error) {
      console.error('Error adding expense:', error)
      setErrors({ 
        submit: 'Có lỗi xảy ra khi thêm khoản chi. Vui lòng thử lại.'
      })
      toast.error('Có lỗi xảy ra. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND' 
    }).format(amount)
  }

  const selectedWallet = wallets.find(w => w.id === formData.walletId)
  const selectedCategory = categories.find(c => c.id === formData.category)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <Card className="w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <MinusIcon className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Thêm khoản chi</h2>
                <p className="text-sm text-muted-foreground">
                  Ghi lại chi tiêu của bạn
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <XIcon className="w-4 h-4" />
            </Button>
          </div>

          {/* Success Alert */}
          {showSuccess && (
            <Alert className="mb-6 border-green-200 bg-green-50">
              <CheckCircleIcon className="h-4 w-4 text-green-600" />
              <div className="ml-2">
                <p className="text-green-800 font-medium">
                  Thêm khoản chi thành công!
                </p>
              </div>
            </Alert>
          )}

          {/* Error Alert */}
          {errors.submit && (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertCircleIcon className="h-4 w-4 text-red-600" />
              <div className="ml-2">
                <p className="text-red-800">{errors.submit}</p>
              </div>
            </Alert>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Wallet Selection */}
            <div className="space-y-2">
              <Label htmlFor="walletId" className="text-sm font-medium">
                Ví chi tiền <span className="text-red-500">*</span>
              </Label>
              <select
                id="walletId"
                value={formData.walletId}
                onChange={(e) => handleInputChange('walletId', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md ${errors.walletId ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Chọn ví...</option>
                {wallets.map((wallet) => (
                  <option key={wallet.id} value={wallet.id}>
                    {wallet.icon} {wallet.name} - {formatCurrency(wallet.balance)}
                  </option>
                ))}
              </select>
              {errors.walletId && (
                <p className="text-red-500 text-sm">{errors.walletId}</p>
              )}
            </div>

            {/* Amount Input */}
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-sm font-medium">
                Số tiền chi <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <DollarSignIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="amount"
                  type="number"
                  placeholder="Nhập số tiền..."
                  value={formData.amount}
                  onChange={(e) => handleInputChange('amount', e.target.value)}
                  className={`pl-10 ${errors.amount ? 'border-red-500' : ''}`}
                  min="0"
                  step="1000"
                />
              </div>
              {errors.amount && (
                <p className="text-red-500 text-sm">{errors.amount}</p>
              )}
            </div>

            {/* Category Selection */}
            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-medium">
                Danh mục chi <span className="text-red-500">*</span>
              </Label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md ${errors.category ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Chọn danh mục...</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-red-500 text-sm">{errors.category}</p>
              )}
            </div>

            {/* Datetime Input */}
            <div className="space-y-2">
              <Label htmlFor="datetime" className="text-sm font-medium">
                Thời gian <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="datetime"
                  type="datetime-local"
                  value={formData.datetime}
                  onChange={(e) => handleInputChange('datetime', e.target.value)}
                  className={`pl-10 ${errors.datetime ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.datetime && (
                <p className="text-red-500 text-sm">{errors.datetime}</p>
              )}
            </div>

            {/* Note Input */}
            <div className="space-y-2">
              <Label htmlFor="note" className="text-sm font-medium">
                Ghi chú
              </Label>
              <Input
                id="note"
                type="text"
                placeholder="Nhập ghi chú (tùy chọn)..."
                value={formData.note}
                onChange={(e) => handleInputChange('note', e.target.value)}
                className={errors.note ? 'border-red-500' : ''}
                maxLength={255}
              />
              {errors.note && (
                <p className="text-red-500 text-sm">{errors.note}</p>
              )}
              <p className="text-xs text-muted-foreground">
                {formData.note.length}/255 ký tự
              </p>
            </div>

            {/* Preview */}
            {formData.amount && parseFloat(formData.amount) > 0 && selectedWallet && selectedCategory && (
              <Card className="p-4 bg-red-50 border-red-200">
                <h4 className="font-medium mb-3 text-red-900">Xem trước giao dịch</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-red-700">Số tiền chi:</span>
                    <span className="font-medium text-red-900">
                      {formatCurrency(parseFloat(formData.amount))}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-red-700">Từ ví:</span>
                    <span className="text-red-800">
                      {selectedWallet.icon} {selectedWallet.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-red-700">Danh mục:</span>
                    <span className="text-red-800">
                      {selectedCategory.icon} {selectedCategory.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-red-700">Số dư hiện tại:</span>
                    <span className="text-red-800">
                      {formatCurrency(selectedWallet.balance)}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-red-200 pt-2">
                    <span className="text-red-700 font-medium">Số dư sau chi:</span>
                    <span className={`font-bold ${
                      (selectedWallet.balance - parseFloat(formData.amount)) >= 0 
                        ? 'text-red-900' 
                        : 'text-red-600'
                    }`}>
                      {formatCurrency(selectedWallet.balance - parseFloat(formData.amount))}
                    </span>
                  </div>
                  {(selectedWallet.balance - parseFloat(formData.amount)) < 0 && (
                    <p className="text-red-600 text-xs">
                      ⚠️ Số dư không đủ!
                    </p>
                  )}
                </div>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
                disabled={loading}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={loading || showSuccess}
                className="flex-1 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <LoaderIcon className="w-4 h-4 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <MinusIcon className="w-4 h-4" />
                    Thêm chi tiêu
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  )
}

export default AddExpense
