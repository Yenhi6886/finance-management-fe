import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { walletService } from '../services/walletService'
import { ArrowLeftIcon, CheckIcon, WalletIcon, DollarSignIcon } from 'lucide-react'
import { toast } from 'sonner'

const AddWallet = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    icon: '💰',
    currency: 'VND',
    initialBalance: '',
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
    { code: 'USD', name: 'US Dollar ($)', symbol: '$' }
  ]

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

    // Validation cho số tiền ban đầu
    if (formData.initialBalance && formData.initialBalance !== '') {
      const amount = parseFloat(String(formData.initialBalance).replace(/,/g, ''))
      if (isNaN(amount)) {
        newErrors.initialBalance = 'Số tiền phải là một số hợp lệ'
      } else if (amount < 0) {
        newErrors.initialBalance = 'Số tiền không được âm'
      } else if (amount > 999999999999) {
        newErrors.initialBalance = 'Số tiền quá lớn'
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
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      setLoading(true)
      const balance = formData.initialBalance ? parseFloat(String(formData.initialBalance).replace(/,/g, '')) : 0

      const walletData = {
        ...formData,
        initialBalance: balance
      }

      await walletService.createWallet(walletData)
      navigate('/wallets', {
        state: {
          message: 'Ví đã được tạo thành công!',
          type: 'success'
        }
      })

    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Có lỗi xảy ra khi tạo ví. Vui lòng thử lại.'
      toast.error(errorMsg)
      setErrors({ submit: errorMsg })
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount, currency = 'VND') => {
    if (typeof amount !== 'number') {
      amount = parseFloat(String(amount).replace(/,/g, '')) || 0;
    }
    if (currency === 'USD') {
      return amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    return amount.toLocaleString('vi-VN');
  }

  return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">
              Thêm Ví Mới
            </h1>
            <p className="text-muted-foreground mt-2">
              Tạo một ví mới để quản lý tài chính của bạn
            </p>
          </div>
          <div>
            <Button
                onClick={() => navigate('/wallets')}
                variant="outline"
                size="sm"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-1" />
              Quay lại
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card rounded-lg border p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <WalletIcon className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-semibold">Thông Tin Ví</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <Label htmlFor="name">Tên ví <span className="text-red-500">*</span></Label>
                  <Input
                      id="name"
                      type="text"
                      placeholder="Ví tiền mặt, Tài khoản ngân hàng..."
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={`mt-2 ${errors.name ? 'border-red-500' : ''}`}
                  />
                  {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
                </div>

                <div>
                  <Label>Icon ví</Label>
                  <div className="grid grid-cols-8 gap-2 mt-2">
                    {availableIcons.map((icon) => (
                        <button
                            key={icon}
                            type="button"
                            onClick={() => handleInputChange('icon', icon)}
                            className={`p-3 text-2xl rounded-lg border transition-all ${
                                formData.icon === icon
                                    ? 'border-primary bg-primary/10'
                                    : 'hover:border-primary/50'
                            }`}
                        >
                          {icon}
                        </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="initialBalance">Số tiền ban đầu</Label>
                    <Input
                        id="initialBalance"
                        type="text"
                        placeholder="0"
                        value={formData.initialBalance}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, '')
                          handleInputChange('initialBalance', value ? formatCurrency(value, formData.currency) : '')
                        }}
                        className={`mt-2 ${errors.initialBalance ? 'border-red-500' : ''}`}
                    />
                    {errors.initialBalance && <p className="text-sm text-red-500 mt-1">{errors.initialBalance}</p>}
                  </div>

                  <div>
                    <Label htmlFor="currency">Loại tiền tệ <span className="text-red-500">*</span></Label>
                    <select
                        id="currency"
                        value={formData.currency}
                        onChange={(e) => handleInputChange('currency', e.target.value)}
                        className="w-full h-10 px-3 mt-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                    >
                      {currencies.map((currency) => (
                          <option key={currency.code} value={currency.code}>{currency.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Mô tả</Label>
                  <textarea
                      id="description"
                      placeholder="Mô tả về ví này..."
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 mt-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background resize-none"
                  />
                </div>
              </div>
            </div>
            <div className="flex space-x-4">
              <Button type="submit" disabled={loading}>
                {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>}
                <CheckIcon className="w-4 h-4 mr-2" />
                Tạo Ví
              </Button>
              <Button type="button" variant="ghost" onClick={() => navigate('/wallets')} disabled={loading}>
                Hủy
              </Button>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg border sticky top-8 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <DollarSignIcon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Xem trước</h3>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg p-4 text-white">
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">{formData.icon}</div>
                  <div>
                    <p className="font-semibold">{formData.name || 'Tên ví'}</p>
                    <p className="text-sm opacity-80">
                      {formatCurrency(formData.initialBalance || 0, formData.currency)} {currencies.find(c => c.code === formData.currency)?.symbol}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
  )
}

export default AddWallet