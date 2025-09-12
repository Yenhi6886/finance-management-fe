import React, { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { walletService } from '../services/walletService'
import { ArrowLeftIcon, SaveIcon, TrashIcon } from 'lucide-react'
import { WalletContext } from '../../../shared/contexts/WalletContext'

const EditWallet = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { refreshWallets } = useContext(WalletContext)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [wallet, setWallet] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    icon: '💰',
    currency: 'VND',
    description: ''
  })
  const [errors, setErrors] = useState({})

  const availableIcons = [
    '💰', '💵', '💳', '🏦', '🐷', '💎', '🎯', '📈',
    '💼', '🏠', '🚗', '✈️', '🍕', '🛒', '🎮', '📚',
    '⚽', '🎵', '💊', '👨‍👩‍👧‍👦', '🎁', '🔧', '📱', '💻'
  ]

  const currencies = [
    { code: 'VND', name: 'Việt Nam Đồng (₫)', symbol: '₫' },
    { code: 'USD', name: 'US Dollar ($)', symbol: '$' },
    { code: 'EUR', name: 'Euro (€)', symbol: '€' },
    { code: 'JPY', name: 'Japanese Yen (¥)', symbol: '¥' },
    { code: 'GBP', name: 'British Pound (£)', symbol: '£' },
    { code: 'KRW', name: 'Korean Won (₩)', symbol: '₩' }
  ]

  useEffect(() => {
    fetchWallet()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const fetchWallet = async () => {
    try {
      setLoading(true)
      const response = await walletService.getWalletById(id)
      const walletData = response.data.data
      setWallet(walletData)
      setFormData({
        name: walletData.name,
        icon: walletData.icon,
        currency: walletData.currency,
        description: walletData.description || ''
      })
    } catch (error) {
      console.error('Error fetching wallet:', error)
      navigate('/wallets')
    } finally {
      setLoading(false)
    }
  }

  const validateForm = () => {
    const newErrors = {}

    // Validation cho tên ví
    if (!formData.name || !formData.name.trim()) {
      newErrors.name = 'Tên ví là bắt buộc'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Tên ví phải có ít nhất 2 ký tự'
    } else if (formData.name.trim().length > 50) {
      newErrors.name = 'Tên ví không được quá 50 ký tự'
    } else if (!/^[a-zA-ZÀ-ỹ0-9\s\-_.]+$/.test(formData.name.trim())) {
      newErrors.name = 'Tên ví chỉ được chứa chữ cái, số, khoảng trắng và các ký tự đặc biệt: - _ .'
    }

    // Validation cho icon ví
    if (!formData.icon || formData.icon.trim() === '') {
      newErrors.icon = 'Vui lòng chọn icon cho ví'
    } else if (!availableIcons.includes(formData.icon)) {
      newErrors.icon = 'Icon không hợp lệ, vui lòng chọn từ danh sách có sẵn'
    }

    // Validation cho loại tiền tệ
    if (!formData.currency || formData.currency.trim() === '') {
      newErrors.currency = 'Vui lòng chọn loại tiền tệ'
    } else {
      const validCurrencies = currencies.map(c => c.code)
      if (!validCurrencies.includes(formData.currency)) {
        newErrors.currency = 'Loại tiền tệ không hợp lệ'
      }
    }

    // Validation cho mô tả (optional)
    if (formData.description) {
      if (formData.description.length > 200) {
        newErrors.description = 'Mô tả không được quá 200 ký tự'
      } else if (formData.description.trim().length > 0 && formData.description.trim().length < 5) {
        newErrors.description = 'Mô tả phải có ít nhất 5 ký tự nếu có nhập'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field, value) => {
    // Cập nhật form data
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    // Validation thời gian thực
    const newErrors = { ...errors }

    if (field === 'name') {
      if (!value || !value.trim()) {
        newErrors.name = 'Tên ví là bắt buộc'
      } else if (value.trim().length < 2) {
        newErrors.name = 'Tên ví phải có ít nhất 2 ký tự'
      } else if (value.trim().length > 50) {
        newErrors.name = 'Tên ví không được quá 50 ký tự'
      } else if (!/^[a-zA-ZÀ-ỹ0-9\s\-_.]+$/.test(value.trim())) {
        newErrors.name = 'Tên ví chỉ được chứa chữ cái, số, khoảng trắng và các ký tự đặc biệt: - _ .'
      } else {
        delete newErrors.name
      }
    }

    if (field === 'icon') {
      if (!value || value.trim() === '') {
        newErrors.icon = 'Vui lòng chọn icon cho ví'
      } else if (!availableIcons.includes(value)) {
        newErrors.icon = 'Icon không hợp lệ'
      } else {
        delete newErrors.icon
      }
    }

    if (field === 'currency') {
      if (!value || value.trim() === '') {
        newErrors.currency = 'Vui lòng chọn loại tiền tệ'
      } else {
        const validCurrencies = currencies.map(c => c.code)
        if (!validCurrencies.includes(value)) {
          newErrors.currency = 'Loại tiền tệ không hợp lệ'
        } else {
          delete newErrors.currency
        }
      }
    }

    if (field === 'description') {
      if (value && value.length > 200) {
        newErrors.description = 'Mô tả không được quá 200 ký tự'
      } else if (value && value.trim().length > 0 && value.trim().length < 5) {
        newErrors.description = 'Mô tả phải có ít nhất 5 ký tự nếu có nhập'
      } else {
        delete newErrors.description
      }
    }

    setErrors(newErrors)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      setSaving(true)

      await walletService.updateWallet(id, formData)

      navigate('/wallets', {
        state: {
          message: 'Ví đã được cập nhật thành công!',
          type: 'success'
        }
      })
    } catch (error) {
      console.error('Error updating wallet:', error)
      setErrors({
        submit: 'Có lỗi xảy ra khi cập nhật ví. Vui lòng thử lại.'
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa ví này? Tất cả dữ liệu sẽ bị mất vĩnh viễn.')) {
      try {
        await walletService.deleteWallet(id)
        await refreshWallets() // Refresh wallet context to update navbar
        navigate('/wallets', {
          state: {
            message: 'Ví đã được xóa thành công!',
            type: 'success'
          }
        })
      } catch (error) {
        console.error('Error deleting wallet:', error)
        setErrors({
          submit: 'Có lỗi xảy ra khi xóa ví. Vui lòng thử lại.'
        })
      }
    }
  }

  const formatCurrency = (amount, currency = 'VND') => {
    if (typeof amount !== 'number') {
      amount = parseFloat(amount) || 0;
    }
    if (currency === 'USD') {
      return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
    }
    return `${amount.toLocaleString('vi-VN')} ₫`
  }

  if (loading) {
    return (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
            <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
    )
  }

  if (!wallet) {
    return (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Không tìm thấy ví
          </h2>
          <Button
              onClick={() => navigate('/wallets')}
              size="sm"
              className="mt-4 h-8 px-3 text-xs"
          >
            Quay lại danh sách ví
          </Button>
        </div>
    )
  }

  if (wallet.permissions !== 'owner') {
    return (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Bạn không có quyền chỉnh sửa ví này
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Chỉ chủ sở hữu mới có thể chỉnh sửa ví
          </p>
          <Button
              onClick={() => navigate(`/wallets/${id}`)}
              size="sm"
              className="mt-4 h-8 px-3 text-xs"
          >
            Quay lại chi tiết ví
          </Button>
        </div>
    )
  }

  return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center space-x-4">
          <Button
              variant="outline"
              onClick={() => navigate(`/wallets/${id}`)}
              size="sm"
              className="h-8 px-3 text-xs"
          >
            <ArrowLeftIcon className="w-3 h-3 mr-1.5" />
            Quay lại
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Chỉnh Sửa Ví
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Cập nhật thông tin ví: {wallet.name}
            </p>
          </div>
        </div>

        <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <CardHeader>
            <CardTitle className="text-green-800 dark:text-green-200">
              Thông Tin Hiện Tại
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-green-600 dark:text-green-400">Số dư hiện tại:</p>
                <p className="text-lg font-bold">{formatCurrency(wallet.balance, wallet.currency)}</p>
              </div>
              <div>
                <p className="text-sm text-green-600 dark:text-green-400">Số tiền ban đầu:</p>
                <p className="text-lg font-bold">{formatCurrency(wallet.initialAmount, wallet.currency)}</p>
              </div>
              <div>
                <p className="text-sm text-green-600 dark:text-green-400">Ngày tạo:</p>
                <p className="text-lg font-bold">
                  {new Date(wallet.createdAt).toLocaleDateString('vi-VN')}
                </p>
              </div>
              <div>
                <p className="text-sm text-green-600 dark:text-green-400">Cập nhật lần cuối:</p>
                <p className="text-lg font-bold">
                  {new Date(wallet.updatedAt).toLocaleDateString('vi-VN')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Chỉnh Sửa Thông Tin</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Tên ví <span className="text-red-500">*</span>
                </Label>
                <Input
                    id="name"
                    type="text"
                    placeholder="Ví tiền mặt, Tài khoản ngân hàng..."
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={errors.name ? 'border-red-500' : ''}
                    maxLength={50}
                />
                {errors.name && (
                    <p className="text-sm text-red-500">{errors.name}</p>
                )}
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Chỉ chứa chữ cái, số và ký tự đặc biệt: - _ .</span>
                  <span>{formData.name.length}/50</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>
                  Icon ví <span className="text-red-500">*</span>
                </Label>
                <div className={`grid grid-cols-8 gap-2 ${errors.icon ? 'border border-red-500 rounded-lg p-2' : ''}`}>
                  {availableIcons.map((icon) => (
                      <button
                          key={icon}
                          type="button"
                          onClick={() => handleInputChange('icon', icon)}
                          className={`p-3 text-2xl rounded-lg border-2 transition-all hover:scale-110 ${
                              formData.icon === icon
                                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                                  : errors.icon 
                                    ? 'border-red-300 dark:border-red-700 hover:border-red-400'
                                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                          }`}
                      >
                        {icon}
                      </button>
                  ))}
                </div>
                {errors.icon && (
                    <p className="text-sm text-red-500">{errors.icon}</p>
                )}
                <p className="text-xs text-gray-500">Chọn một icon phù hợp để dễ nhận diện ví của bạn</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">
                  Loại tiền tệ <span className="text-red-500">*</span>
                </Label>
                <select
                    id="currency"
                    value={formData.currency}
                    onChange={(e) => handleInputChange('currency', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                        errors.currency ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    } bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
                >
                  {currencies.map((currency) => (
                      <option key={currency.code} value={currency.code}>
                        {currency.name}
                      </option>
                  ))}
                </select>
                {errors.currency && (
                    <p className="text-sm text-red-500">{errors.currency}</p>
                )}
                <p className="text-sm text-amber-600 dark:text-amber-400">
                  ⚠️ Thay đổi loại tiền tệ có thể ảnh hưởng đến việc tính toán số dư
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Mô tả</Label>
                <textarea
                    id="description"
                    placeholder="Mô tả về ví này... (tùy chọn)"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={3}
                    maxLength={200}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                        errors.description ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    } bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none`}
                />
                {errors.description && (
                    <p className="text-sm text-red-500">{errors.description}</p>
                )}
                <div className="flex justify-between">
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Mô tả tùy chọn về mục đích sử dụng ví (tối thiểu 5 ký tự nếu có nhập)
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {formData.description.length}/200
                  </p>
                </div>
              </div>

              <div className={`bg-gray-50 dark:bg-gray-800 p-4 rounded-lg ${Object.keys(errors).length > 0 && !errors.submit ? 'border-l-4 border-red-500' : ''}`}>
                <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                  Xem trước:
                  {Object.keys(errors).length > 0 && !errors.submit && (
                    <span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                      {Object.keys(errors).length} lỗi
                    </span>
                  )}
                  {Object.keys(errors).length === 0 && (
                    <span className="ml-2 text-xs bg-green-100 text-green-600 px-2 py-1 rounded">
                      ✓ Hợp lệ
                    </span>
                  )}
                </h4>
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">{formData.icon}</div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {formData.name || 'Tên ví'}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {formData.currency} • {formatCurrency(wallet.balance, formData.currency)}
                    </p>
                    {formData.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 italic mt-1">
                          {formData.description}
                        </p>
                    )}
                  </div>
                </div>
              </div>

              {errors.submit && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
                    <p className="text-sm text-red-600 dark:text-red-400">{errors.submit}</p>
                  </div>
              )}

              <div className="flex space-x-4 pt-4">
                <Button
                    type="submit"
                    disabled={saving || Object.keys(errors).length > 0}
                    size="sm"
                    className="flex-1 h-8 text-xs bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-1.5"></div>
                  ) : (
                      <SaveIcon className="w-3 h-3 mr-1.5" />
                  )}
                  {saving ? 'Đang lưu...' : Object.keys(errors).length > 0 ? 'Vui lòng sửa lỗi' : 'Lưu Thay Đổi'}
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(`/wallets/${id}`)}
                    disabled={saving}
                    size="sm"
                    className="h-8 px-3 text-xs"
                >
                  Hủy
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    onClick={handleDelete}
                    disabled={saving}
                    size="sm"
                    className="h-8 px-3 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <TrashIcon className="w-3 h-3 mr-1.5" />
                  Xóa Ví
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
  )
}

export default EditWallet