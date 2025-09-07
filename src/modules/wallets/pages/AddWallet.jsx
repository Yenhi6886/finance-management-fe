import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { walletService } from '../services/walletService'
import { ArrowLeftIcon, CheckIcon, WalletIcon, DollarSignIcon } from 'lucide-react'

const AddWallet = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    icon: '💰',
    currency: 'VND',
    initialAmount: '',
    description: ''
  })
  const [errors, setErrors] = useState({})

  // Danh sách icon có sẵn
  const availableIcons = [
    '💰', '💵', '💳', '🏦', '🐷', '💎', '🎯', '📈', 
    '💼', '🏠', '🚗', '✈️', '🍕', '🛒', '🎮', '📚',
    '⚽', '🎵', '💊', '👨‍👩‍👧‍👦', '🎁', '🔧', '📱', '💻'
  ]

  // Danh sách loại tiền tệ
  const currencies = [
    { code: 'VND', name: 'Việt Nam Đồng (₫)', symbol: '₫' },
    { code: 'USD', name: 'US Dollar ($)', symbol: '$' },
    { code: 'EUR', name: 'Euro (€)', symbol: '€' },
    { code: 'JPY', name: 'Japanese Yen (¥)', symbol: '¥' },
    { code: 'GBP', name: 'British Pound (£)', symbol: '£' },
    { code: 'KRW', name: 'Korean Won (₩)', symbol: '₩' }
  ]

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Tên ví là bắt buộc'
    } else if (formData.name.length < 2) {
      newErrors.name = 'Tên ví phải có ít nhất 2 ký tự'
    } else if (formData.name.length > 50) {
      newErrors.name = 'Tên ví không được quá 50 ký tự'
    }

    if (!formData.currency) {
      newErrors.currency = 'Vui lòng chọn loại tiền tệ'
    }

    if (formData.initialAmount && formData.initialAmount !== '') {
      const amount = parseFloat(formData.initialAmount)
      if (isNaN(amount)) {
        newErrors.initialAmount = 'Số tiền phải là một số hợp lệ'
      } else if (amount < 0) {
        newErrors.initialAmount = 'Số tiền không được âm'
      } else if (amount > 999999999999) {
        newErrors.initialAmount = 'Số tiền quá lớn'
      }
    }

    if (formData.description && formData.description.length > 200) {
      newErrors.description = 'Mô tả không được quá 200 ký tự'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      setLoading(true)
      
      const walletData = {
        ...formData,
        initialAmount: formData.initialAmount ? parseFloat(formData.initialAmount) : 0
      }

      await walletService.createWallet(walletData)
      
      navigate('/wallets', { 
        state: { 
          message: 'Ví đã được tạo thành công!',
          type: 'success'
        }
      })
    } catch (error) {
      console.error('Error creating wallet:', error)
      setErrors({
        submit: 'Có lỗi xảy ra khi tạo ví. Vui lòng thử lại.'
      })
    } finally {
      setLoading(false)
    }
  }

  const formatCurrencyInput = (value, currency) => {
    if (!value) return ''
    const num = parseFloat(value)
    if (isNaN(num)) return value
    
    if (currency === 'VND') {
      return num.toLocaleString('vi-VN')
    } else if (currency === 'USD') {
      return num.toLocaleString('en-US', { minimumFractionDigits: 2 })
    }
    return value
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Thêm Ví Mới
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Tạo một ví mới để quản lý tài chính của bạn
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Button
              onClick={() => navigate('/wallets')}
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
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                    <WalletIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Thông Tin Ví</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Tên ví */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-base font-medium">
                      Tên ví <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Ví tiền mặt, Tài khoản ngân hàng..."
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={`h-12 text-base ${errors.name ? 'border-red-500' : ''}`}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500">{errors.name}</p>
                    )}
                  </div>

                  {/* Icon ví */}
                  <div className="space-y-4">
                    <Label className="text-base font-medium">Icon ví</Label>
                    <div className="grid grid-cols-8 gap-3">
                      {availableIcons.map((icon) => (
                        <button
                          key={icon}
                          type="button"
                          onClick={() => handleInputChange('icon', icon)}
                          className={`p-4 text-2xl rounded-lg border transition-all duration-200 hover:scale-105 hover:shadow-sm ${
                            formData.icon === icon
                              ? 'border-green-500 bg-green-50 dark:bg-green-900/20 shadow-sm'
                              : 'border-gray-200 dark:border-gray-600 hover:border-green-300'
                          }`}
                        >
                          {icon}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Loại tiền tệ */}
                  <div className="space-y-2">
                    <Label htmlFor="currency" className="text-base font-medium">
                      Loại tiền tệ <span className="text-red-500">*</span>
                    </Label>
                    <select
                      id="currency"
                      value={formData.currency}
                      onChange={(e) => handleInputChange('currency', e.target.value)}
                      className={`w-full h-12 px-4 text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                        errors.currency ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
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
                  </div>

                  {/* Số tiền ban đầu */}
                  <div className="space-y-2">
                    <Label htmlFor="initialAmount" className="text-base font-medium">Số tiền ban đầu</Label>
                    <div className="relative">
                      <Input
                        id="initialAmount"
                        type="text"
                        placeholder="0"
                        value={formData.initialAmount}
                        onChange={(e) => {
                          const value = e.target.value.replace(/,/g, '')
                          if (value === '' || /^\d*\.?\d*$/.test(value)) {
                            handleInputChange('initialAmount', value)
                          }
                        }}
                        onBlur={(e) => {
                          const formatted = formatCurrencyInput(e.target.value, formData.currency)
                          handleInputChange('initialAmount', formatted)
                        }}
                        className={`h-12 text-base pr-12 ${errors.initialAmount ? 'border-red-500' : ''}`}
                      />
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                        {currencies.find(c => c.code === formData.currency)?.symbol}
                      </div>
                    </div>
                    {errors.initialAmount && (
                      <p className="text-sm text-red-500">{errors.initialAmount}</p>
                    )}
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Số tiền hiện có trong ví này (có thể để trống)
                    </p>
                  </div>

                  {/* Mô tả */}
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-base font-medium">Mô tả</Label>
                    <textarea
                      id="description"
                      placeholder="Mô tả về ví này..."
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={4}
                      className={`w-full px-4 py-3 text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                        errors.description ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      } bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none`}
                    />
                    {errors.description && (
                      <p className="text-sm text-red-500">{errors.description}</p>
                    )}
                    <div className="flex justify-between">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Mô tả tùy chọn về mục đích sử dụng ví
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {formData.description.length}/200
                      </p>
                    </div>
                  </div>

                  {/* Error message */}
                  {errors.submit && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                      <p className="text-sm text-red-600 dark:text-red-400">{errors.submit}</p>
                    </div>
                  )}

                  {/* Submit buttons */}
                  <div className="flex space-x-4 pt-6">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="flex-1 h-12 text-base font-light bg-green-600 hover:bg-green-700 text-white rounded-lg border-0"
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      ) : (
                        <CheckIcon className="w-5 h-5 mr-2" />
                      )}
                      {loading ? 'Đang tạo...' : 'Tạo Ví'}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => navigate('/wallets')}
                      disabled={loading}
                      className="h-12 px-6 text-base font-light bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg border-0"
                    >
                      Hủy
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 sticky top-8">
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <DollarSignIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Xem trước</h3>
                </div>
                
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg p-6 text-white mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="text-4xl">{formData.icon}</div>
                    <div className="flex-1">
                      <p className="text-lg font-semibold">
                        {formData.name || 'Tên ví'}
                      </p>
                      <p className="text-green-100 text-sm">
                        {formData.currency} • {
                          formData.initialAmount ? 
                            `${formatCurrencyInput(formData.initialAmount, formData.currency)} ${currencies.find(c => c.code === formData.currency)?.symbol}` :
                            `0 ${currencies.find(c => c.code === formData.currency)?.symbol}`
                        }
                      </p>
                    </div>
                  </div>
                  
                  {formData.description && (
                    <div className="mt-4 pt-4 border-t border-green-400/30">
                      <p className="text-sm text-green-100 italic">
                        {formData.description}
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Loại tiền tệ:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {currencies.find(c => c.code === formData.currency)?.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Số dư ban đầu:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formData.initialAmount ? 
                        `${formatCurrencyInput(formData.initialAmount, formData.currency)} ${currencies.find(c => c.code === formData.currency)?.symbol}` :
                        `0 ${currencies.find(c => c.code === formData.currency)?.symbol}`
                      }
                    </span>
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

export default AddWallet
