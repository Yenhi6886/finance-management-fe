import React, { useState, useEffect } from 'react'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Card } from '../../../components/ui/card'
import { Alert } from '../../../components/ui/alert'
import { 
  EditIcon,
  DollarSignIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  LoaderIcon,
  XIcon,
  CalendarIcon
} from 'lucide-react'
import { walletService } from '../services/walletService'
import { toast } from 'sonner'

const EditExpense = ({ isOpen, expense, onClose, onSuccess }) => {
  const [wallets, setWallets] = useState([])
  const [categories, setCategories] = useState([])
  const [formData, setFormData] = useState({
    walletId: '',
    amount: '',
    category: '',
    note: '',
    datetime: ''
  })
  const [originalExpense, setOriginalExpense] = useState(null)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    if (isOpen && expense) {
      fetchData()
      setOriginalExpense(expense)
      setFormData({
        walletId: expense.walletId,
        amount: expense.amount.toString(),
        category: expense.category,
        note: expense.note || '',
        datetime: new Date(expense.datetime).toISOString().slice(0, 16)
      })
      setErrors({})
      setShowSuccess(false)
    }
  }, [isOpen, expense])

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

      const response = await walletService.updateExpense(expense.id, expenseData)
      
      if (response.success) {
        setShowSuccess(true)
        toast.success('Cập nhật khoản chi thành công!')
        if (onSuccess) {
          onSuccess(response.data)
        }
      } else {
        setErrors({ 
          submit: response.message || 'Có lỗi xảy ra khi cập nhật khoản chi'
        })
        toast.error(response.message || 'Có lỗi xảy ra')
      }
    } catch (error) {
      console.error('Error updating expense:', error)
      setErrors({ 
        submit: 'Có lỗi xảy ra khi cập nhật khoản chi. Vui lòng thử lại.'
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
  const hasChanges = originalExpense && (
    formData.walletId !== originalExpense.walletId ||
    parseFloat(formData.amount) !== originalExpense.amount ||
    formData.category !== originalExpense.category ||
    formData.note !== (originalExpense.note || '') ||
    formData.datetime !== new Date(originalExpense.datetime).toISOString().slice(0, 16)
  )

  if (!isOpen || !expense) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <Card className="w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <EditIcon className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Sửa khoản chi</h2>
                <p className="text-sm text-muted-foreground">
                  Cập nhật thông tin chi tiêu
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
                  Cập nhật khoản chi thành công!
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

            {/* Changes Info */}
            {hasChanges && (
              <Alert className="border-amber-200 bg-amber-50">
                <AlertCircleIcon className="h-4 w-4 text-amber-600" />
                <div className="ml-2">
                  <p className="text-amber-800 text-sm">
                    Bạn đã thay đổi thông tin khoản chi
                  </p>
                </div>
              </Alert>
            )}

            {/* Preview */}
            {formData.amount && parseFloat(formData.amount) > 0 && selectedWallet && selectedCategory && (
              <Card className="p-4 bg-blue-50 border-blue-200">
                <h4 className="font-medium mb-3 text-blue-900">Xem trước thay đổi</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-700">Số tiền chi:</span>
                    <span className="font-medium text-blue-900">
                      {formatCurrency(parseFloat(formData.amount))}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Từ ví:</span>
                    <span className="text-blue-800">
                      {selectedWallet.icon} {selectedWallet.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Danh mục:</span>
                    <span className="text-blue-800">
                      {selectedCategory.icon} {selectedCategory.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Thời gian:</span>
                    <span className="text-blue-800">
                      {new Date(formData.datetime).toLocaleString('vi-VN')}
                    </span>
                  </div>
                  {formData.note && (
                    <div className="border-t border-blue-200 pt-2">
                      <span className="text-blue-700">Ghi chú: </span>
                      <span className="text-blue-800">{formData.note}</span>
                    </div>
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
                disabled={loading || showSuccess || !hasChanges}
                className="flex-1 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <LoaderIcon className="w-4 h-4 animate-spin" />
                    Đang cập nhật...
                  </>
                ) : (
                  <>
                    <EditIcon className="w-4 h-4" />
                    Cập nhật
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

export default EditExpense
