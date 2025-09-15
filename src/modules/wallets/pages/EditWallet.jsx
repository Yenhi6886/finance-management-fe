import React, { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { walletService } from '../services/walletService'
import { ArrowLeftIcon, SaveIcon, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { WalletContext } from '../../../shared/contexts/WalletContext'

const EditWallet = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { refreshWallets } = useContext(WalletContext)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    icon: '💰',
    balance: '',
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
    { code: 'VND', name: 'Việt Nam Đồng (₫)' },
    { code: 'USD', name: 'US Dollar ($)' }
  ]

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        setLoading(true)
        const response = await walletService.getWalletById(id)
        const walletData = response.data.data
        if (walletData) {
          setFormData({
            name: walletData.name,
            icon: walletData.icon || '💰',
            balance: walletData.balance.toString(),
            currency: walletData.currency,
            description: walletData.description || ''
          })
        } else {
          toast.error('Không tìm thấy ví bạn yêu cầu.')
          navigate('/wallets')
        }
      } catch (error) {
        toast.error('Có lỗi xảy ra khi tải thông tin ví.')
        navigate('/wallets')
      } finally {
        setLoading(false)
      }
    }
    fetchWallet()
  }, [id, navigate])

  const formatCurrency = (amount, currency = 'VND') => {
    if (typeof amount !== 'number' || isNaN(amount)) {
      amount = 0
    }
    return new Intl.NumberFormat(currency === 'USD' ? 'en-US' : 'vi-VN', {
      style: 'currency',
      currency: currency,
    }).format(amount)
  }

  const getWalletColor = (name) => {
    const colors = [
      'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400',
      'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400',
      'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-400',
      'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-400',
      'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-400'
    ]
    if (!name) return colors[0]
    let hash = 0
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash)
    }
    return colors[Math.abs(hash % colors.length)]
  }

  const formatDisplayBalance = (balance) => {
    if (!balance || balance === '0') return '0'
    const numericBalance = parseInt(balance, 10)
    if (isNaN(numericBalance)) return '0'
    return numericBalance.toLocaleString('vi-VN')
  }

  const validateField = (name, value) => {
    let error = ''
    switch (name) {
      case 'name':
        if (!value.trim()) error = 'Tên ví là bắt buộc.'
        else if (value.trim().length > 50) error = 'Tên ví không được quá 50 ký tự.'
        break
      case 'balance':
        if (value.trim() === '') error = 'Số dư là bắt buộc.'
        else if (isNaN(Number(value))) error = 'Số dư phải là một con số.'
        else if (Number(value) < 0) error = 'Số dư không được là số âm.'
        else if (String(value).replace(/\D/g, '').length > 10) error = 'Số tiền không được vượt quá 10 chữ số.'
        else if (Number(value) > 9999999999) error = 'Số tiền tối đa là 9,999,999,999.'
        break
      case 'currency':
        if (!value) error = 'Vui lòng chọn loại tiền tệ.'
        break
      case 'description':
        if (value.trim().length > 200) error = 'Mô tả không được quá 200 ký tự.'
        break
      default:
        break
    }
    return error
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target

    if (name === 'balance') {
      // Chỉ cho phép số, loại bỏ tất cả ký tự không phải số và dấu phân cách
      const sanitizedValue = value.replace(/[^0-9]/g, '')

      // Giới hạn 10 chữ số
      if (sanitizedValue.length <= 10) {
        setFormData(prev => ({ ...prev, [name]: sanitizedValue }))
        const error = validateField(name, sanitizedValue)
        setErrors(prev => ({ ...prev, [name]: error }))
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
      const error = validateField(name, value)
      setErrors(prev => ({ ...prev, [name]: error }))
    }
  }

  const handleIconChange = (icon) => {
    setFormData(prev => ({ ...prev, icon }))
    setErrors(prev => ({ ...prev, icon: '' }))
  }

  const validateForm = () => {
    const newErrors = {}
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key])
      if (error) {
        newErrors[key] = error
      }
    })
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) {
      toast.warning('Vui lòng kiểm tra lại các thông tin đã nhập.')
      return
    }

    setSaving(true)
    try {
      const updateData = {
        ...formData,
        balance: Number(formData.balance)
      }
      await walletService.updateWallet(id, updateData)
      await refreshWallets() // This is the crucial step to sync global state

      navigate('/wallets', {
        state: {
          message: `Ví "${formData.name}" đã được cập nhật thành công!`,
          type: 'success'
        },
        replace: true
      })
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật ví.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="h-48 bg-muted rounded-lg"></div>
          <div className="h-96 bg-muted rounded-lg"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          onClick={() => navigate('/wallets')}
          size="icon"
          className="h-8 w-8"
        >
          <ArrowLeftIcon className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Chỉnh Sửa Ví</h1>
          <p className="text-muted-foreground">Cập nhật thông tin cho ví của bạn</p>
        </div>
      </div>

      <Card>
        <CardContent>
          <div className={`p-4 border rounded-lg flex items-start space-x-4 transition-all ${Object.keys(errors).some(k => errors[k]) ? 'border-red-500/50' : 'border-border'}`}>
            <div className="text-4xl mt-1">{formData.icon || '💰'}</div>
            <div className="flex-1">
              <div className={`text-base font-bold px-2 py-1 rounded-md inline-flex items-center gap-2 mb-2 ${getWalletColor(formData.name)}`}>
                <span>{formData.icon || '💰'}</span>
                <span>{formData.name || '[Chưa có tên]'}</span>
              </div>
              <p className="text-sm text-muted-foreground">Số dư</p>
              <p className="text-2xl font-bold">
                {formatCurrency(parseFloat(formData.balance) || 0, formData.currency)}
              </p>
              {formData.description && (
                <p className="text-sm text-muted-foreground mt-2 italic line-clamp-2">
                  {formData.description}
                </p>
              )}
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
              <Label htmlFor="name">Tên ví <span className="text-red-500">*</span></Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Ví tiền mặt, Tài khoản ngân hàng..."
                value={formData.name}
                onChange={handleInputChange}
                className={errors.name ? 'border-red-500' : ''}
                maxLength={51}
              />
              {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="balance">Số dư hiện tại <span className="text-red-500">*</span></Label>
                <Input
                  id="balance"
                  name="balance"
                  type="text"
                  inputMode="decimal"
                  placeholder="0"
                  value={formatDisplayBalance(formData.balance)}
                  onChange={handleInputChange}
                  className={errors.balance ? 'border-red-500' : ''}
                />
                {errors.balance && <p className="text-sm text-red-500 mt-1">{errors.balance}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Loại tiền tệ <span className="text-red-500">*</span></Label>
                <select
                  id="currency"
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                  className={`w-full h-10 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${errors.currency ? 'border-red-500' : 'border-input'
                    } bg-background text-foreground`}
                >
                  {currencies.map((currency) => (
                    <option key={currency.code} value={currency.code}>
                      {currency.name}
                    </option>
                  ))}
                </select>
                {errors.currency && <p className="text-sm text-red-500 mt-1">{errors.currency}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Icon ví <span className="text-red-500">*</span></Label>
              <div className="grid grid-cols-8 sm:grid-cols-12 gap-2">
                {availableIcons.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => handleIconChange(icon)}
                    className={`p-3 text-2xl rounded-lg border-2 transition-all hover:scale-110 flex items-center justify-center aspect-square ${formData.icon === icon
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-muted-foreground/50'
                      }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Mô tả (Tùy chọn)</Label>
              <textarea
                id="description"
                name="description"
                placeholder="Mô tả về mục đích của ví này..."
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                maxLength={201}
                className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-none ${errors.description ? 'border-red-500' : 'border-input'
                  }`}
              />
              {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description}</p>}
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/wallets')}
                disabled={saving}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={saving || Object.values(errors).some(e => e)}
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <SaveIcon className="w-4 h-4 mr-2" />
                )}
                {saving ? 'Đang lưu...' : 'Lưu Thay Đổi'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default EditWallet