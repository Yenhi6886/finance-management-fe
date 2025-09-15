import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { walletService } from '../services/walletService'
import { ArrowLeftIcon, CheckIcon, WalletIcon, DollarSignIcon, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { WalletContext } from '../../../shared/contexts/WalletContext'

const AddWallet = () => {
  const navigate = useNavigate()
  const { refreshWallets } = useContext(WalletContext)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    icon: '💰',
    currency: 'VND',
    balance: '0',
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

  const validateField = (field, value) => {
    let error = null
    switch (field) {
      case 'name':
        if (!value.trim()) error = 'Tên ví là bắt buộc.'
        else if (value.trim().length > 50) error = 'Tên ví không được quá 50 ký tự.'
        break;
      case 'balance':
        const numericBalance = parseFloat(value);
        if (value && isNaN(numericBalance)) error = 'Số tiền phải là một số hợp lệ.';
        else if (numericBalance < 0) error = 'Số tiền không được là số âm.';
        else if (value.replace(/[^0-9]/g, '').length > 10) error = 'Số tiền không được vượt quá 10 chữ số.';
        break;
      case 'description':
        if (value && value.trim().length > 200) error = 'Mô tả không được quá 200 ký tự.';
        break;
      default:
        break;
    }
    return error
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }

  const handleBalanceChange = (e) => {
    const value = e.target.value;
    const sanitizedValue = value.replace(/[^0-9]/g, '');
    if (sanitizedValue.length <= 10) {
      handleInputChange('balance', sanitizedValue);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      toast.warning('Vui lòng kiểm tra lại các thông tin đã nhập.');
      return;
    }

    setLoading(true)
    try {
      const walletData = {
        ...formData,
        balance: parseFloat(formData.balance) || 0,
        name: formData.name.trim(),
        description: formData.description.trim()
      }

      await walletService.createWallet(walletData)
      // We don't need to refresh here, WalletList will do it upon receiving the message.

      navigate('/wallets', {
        state: {
          message: `Ví "${walletData.name}" đã được tạo thành công!`,
          type: 'success'
        },
        replace: true
      })

    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Có lỗi xảy ra khi tạo ví. Vui lòng thử lại.'
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const formatDisplayCurrency = (amountStr) => {
    if (!amountStr) return '0';
    const amount = parseInt(amountStr, 10);
    if (isNaN(amount)) return '0';
    return amount.toLocaleString('vi-VN');
  }

  const formatPreviewCurrency = (amountStr, currencyCode = 'VND') => {
    const amount = parseInt(amountStr, 10) || 0;
    const currencyInfo = currencies.find(c => c.code === currencyCode);
    const symbol = currencyInfo ? currencyInfo.symbol : '';

    if (currencyCode === 'USD') {
      return amount.toLocaleString('en-US') + ' ' + symbol;
    }
    return amount.toLocaleString('vi-VN') + ' ' + symbol;
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
                  maxLength={51}
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
                      className={`p-3 text-2xl rounded-lg border transition-all ${formData.icon === icon
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
                  <Label htmlFor="balance">Số tiền ban đầu</Label>
                  <Input
                    id="balance"
                    type="text"
                    placeholder="0"
                    value={formatDisplayCurrency(formData.balance)}
                    onChange={handleBalanceChange}
                    className={`mt-2 ${errors.balance ? 'border-red-500' : ''}`}
                  />
                  {errors.balance && <p className="text-sm text-red-500 mt-1">{errors.balance}</p>}
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
                  maxLength={201}
                />
                {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description}</p>}
              </div>
            </div>
          </div>
          <div className="flex space-x-4">
            <Button type="submit" disabled={loading}>
              {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <CheckIcon className="w-4 h-4 mr-2" />
              )}
              {loading ? 'Đang tạo...' : 'Tạo Ví'}
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
                  <p className="font-semibold">{formData.name.trim() || 'Tên ví'}</p>
                  <p className="text-sm opacity-80">
                    {formatPreviewCurrency(formData.balance, formData.currency)}
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