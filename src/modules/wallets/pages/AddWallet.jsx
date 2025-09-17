import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card'
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  StarIcon,
  Loader2
} from 'lucide-react'
import { toast } from 'sonner'
import { walletService } from '../services/walletService'
import { availableIcons, IconComponent, defaultIcon } from '../../../shared/config/icons'

const AddWallet = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    icon: defaultIcon,
    currency: 'VND',
    description: ''
  })
  const [errors, setErrors] = useState({})

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
        balance: 0, // Luôn tạo ví với số dư = 0
        name: formData.name.trim(),
        description: formData.description.trim()
      }

      await walletService.createWallet(walletData)

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

  const formatPreviewCurrency = (currencyCode = 'VND') => {
    const currencyInfo = currencies.find(c => c.code === currencyCode);
    const symbol = currencyInfo ? currencyInfo.symbol : '';

    if (currencyCode === 'USD') {
      return `$0`;
    }
    return `0 ${symbol}`;
  }

  return (
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-green-600">Thêm Ví Mới</h1>
            <p className="text-muted-foreground mt-1">
              Tạo một ví mới để quản lý tài chính của bạn
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Button
                onClick={() => window.history.back()}
                variant="ghost"
                size="sm"
                className="h-10 px-4 text-sm font-light bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-800/30 text-green-600 dark:text-green-400 rounded-md border-0"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-1" />
              Quay lại
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2">
            <Card>
              <div className="py-6 p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <h2 className="text-2xl font-semibold text-foreground">Thông Tin Ví</h2>
                </div>
              </div>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-base font-medium">Tên ví <span className="text-red-500">*</span></Label>
                  <Input
                      id="name"
                      type="text"
                      placeholder="Ví tiền mặt, Tài khoản ngân hàng..."
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={`h-12 text-base ${errors.name ? 'border-red-500' : ''}`}
                      maxLength={51}
                  />
                  {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label className="text-base font-medium">Icon ví</Label>
                  <div className="grid grid-cols-8 sm:grid-cols-12 gap-2 mt-2">
                    {Object.keys(availableIcons).map((iconName) => (
                        <button
                            type="button"
                            key={iconName}
                            onClick={() => handleInputChange('icon', iconName)}
                            className={`flex items-center justify-center w-12 h-12 rounded-lg transition-all ${
                                formData.icon === iconName
                                    ? 'bg-green-100 dark:bg-green-500/20 ring-1 ring-green-500'
                                    : 'bg-muted hover:bg-muted/80'
                            }`}
                        >
                          <IconComponent name={iconName} className={`w-5 h-5 ${formData.icon === iconName ? 'text-green-600 dark:text-green-400' : 'text-foreground'}`} />
                        </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency" className="text-base font-medium">Loại tiền tệ <span className="text-red-500">*</span></Label>
                  <select
                      id="currency"
                      value={formData.currency}
                      onChange={(e) => handleInputChange('currency', e.target.value)}
                      className="w-full h-12 px-3 text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 border-input bg-background"
                  >
                    {currencies.map((currency) => (
                        <option key={currency.code} value={currency.code}>{currency.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-base font-medium">Mô tả (tùy chọn)</Label>
                  <textarea
                      id="description"
                      placeholder="Mô tả về ví này..."
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 border-input bg-background resize-none"
                      maxLength={201}
                  />
                  {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description}</p>}
                </div>

                <div className="pt-4">
                  <Button
                      type="submit"
                      disabled={loading}
                      className="w-full h-12 text-base font-semibold bg-green-600 hover:bg-green-700 text-white rounded-lg"
                  >
                    {loading && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
                    {loading ? 'Đang tạo ví...' : 'Tạo Ví Mới'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600 dark:text-white">Xem trước</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 border rounded-lg bg-card">
                  <div className="flex items-center gap-3 mb-4">
                    <IconComponent name={formData.icon} className="w-6 h-6"/>
                    <h3 className="font-bold text-lg">{formData.name.trim() || 'Tên ví'}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">Số dư</p>
                  <p className="text-2xl font-bold">
                    {formatPreviewCurrency(formData.currency)}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg text-green-600 dark:text-white">
                  <StarIcon className="w-5 h-5 text-yellow-500" /> Mẹo Hữu Ích
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircleIcon className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    <span>Chọn icon phù hợp giúp bạn dễ dàng nhận biết ví khi giao dịch.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircleIcon className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    <span>Bạn có thể tạo nhiều ví cho các mục đích khác nhau như chi tiêu, tiết kiệm.</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </form>
      </div>
  )
}

export default AddWallet