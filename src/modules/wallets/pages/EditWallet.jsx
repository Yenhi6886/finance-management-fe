import React, { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { walletService } from '../services/walletService'
import { ArrowLeftIcon, SaveIcon, Loader2, StarIcon, CheckCircleIcon } from 'lucide-react'
import { toast } from 'sonner'
import { WalletContext } from '../../../shared/contexts/WalletContext'
import { availableIcons, IconComponent, defaultIcon } from '../../../shared/config/icons'

const EditWallet = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { refreshWallets } = useContext(WalletContext)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    icon: defaultIcon,
    balance: '',
    currency: 'VND',
    description: ''
  })
  const [hasTransactions, setHasTransactions] = useState(false)
  const [errors, setErrors] = useState({})

  const currencies = [
    { code: 'VND', name: 'Việt Nam Đồng (₫)' }
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
            icon: walletData.icon || defaultIcon,
            balance: walletData.balance.toString(),
            currency: walletData.currency,
            description: walletData.description || ''
          })

          const hasTransactions = walletData.balance > 0 || walletData.transactionCount > 0
          setHasTransactions(hasTransactions)
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

  const formatPreviewCurrency = (amount) => {
    const numericAmount = parseFloat(amount) || 0
    return `${numericAmount.toLocaleString('vi-VN')} ₫`
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
    setFormData(prev => ({ ...prev, [name]: value }))
    const error = validateField(name, value)
    setErrors(prev => ({ ...prev, [name]: error }))
  }

  const handleIconChange = (icon) => {
    setFormData(prev => ({ ...prev, icon }))
    setErrors(prev => ({ ...prev, icon: '' }))
  }

  const validateForm = () => {
    const newErrors = {}
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key])
      if (error) newErrors[key] = error
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
        name: formData.name,
        icon: formData.icon,
        description: formData.description
      }

      await walletService.updateWallet(id, updateData)
      await refreshWallets()
      navigate('/wallets', {
        state: { message: `Ví "${formData.name}" đã được cập nhật thành công!`, type: 'success' },
        replace: true
      })
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật ví.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div>Đang tải dữ liệu ví...</div>
  }

  return (
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-green-600">Chỉnh Sửa Ví</h1>
            <p className="text-muted-foreground mt-1">Cập nhật thông tin cho ví của bạn</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Button onClick={() => navigate('/wallets')} variant="ghost" className="h-10 px-4 text-sm bg-muted hover:bg-muted/80 rounded-md">
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Quay lại
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600">
                  Chỉnh Sửa Thông Tin
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-base font-medium">Tên ví <span className="text-red-500">*</span></Label>
                  <Input 
                    id="name" 
                    name="name" 
                    type="text" 
                    placeholder="Ví tiền mặt, Tài khoản ngân hàng..." 
                    value={formData.name} 
                    onChange={handleInputChange} 
                    className={`h-12 text-base bg-background text-foreground border-input ${errors.name ? 'border-red-500' : ''}`} 
                    maxLength={51} 
                  />
                  {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {hasTransactions && (
                      <div className="space-y-2">
                        <Label htmlFor="balance" className="text-base font-medium">Số dư hiện tại</Label>
                        <Input 
                          id="balance" 
                          name="balance" 
                          type="text" 
                          placeholder="0" 
                          value={formatDisplayBalance(formData.balance)} 
                          className="h-12 text-base bg-background text-foreground border-input" 
                          disabled 
                        />
                      </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="currency" className="text-base font-medium">Loại tiền tệ</Label>
                    <select 
                      id="currency" 
                      name="currency" 
                      value={formData.currency} 
                      className="w-full h-12 px-3 text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 border-input bg-background text-foreground" 
                      disabled
                    >
                      {currencies.map((currency) => (<option key={currency.code} value={currency.code}>{currency.name}</option>))}
                    </select>
                  </div>
                </div>

                {!hasTransactions && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                            Ví chưa có giao dịch
                          </h3>
                          <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                            <p>Ví này chưa có giao dịch nào. Bạn có thể nạp tiền vào ví để bắt đầu sử dụng.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                )}

                <div className="space-y-2">
                  <Label className="text-base font-medium">Icon ví <span className="text-red-500">*</span></Label>
                  <div className="grid grid-cols-8 sm:grid-cols-12 gap-2 mt-2">
                    {Object.keys(availableIcons).map((iconName) => (
                        <button 
                          key={iconName} 
                          type="button" 
                          onClick={() => handleIconChange(iconName)} 
                          className={`flex items-center justify-center w-12 h-12 rounded-lg border transition-all ${
                            formData.icon === iconName 
                              ? 'bg-green-100 dark:bg-green-900 border-green-500 ring-1 ring-green-500' 
                              : 'bg-muted hover:bg-muted/80 border-border hover:border-green-300'
                          }`}
                        >
                          <IconComponent name={iconName} className="w-6 h-6 text-foreground" />
                        </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-base font-medium">Mô tả (Tùy chọn)</Label>
                  <textarea 
                    id="description" 
                    name="description" 
                    placeholder="Mô tả về mục đích của ví này..." 
                    value={formData.description} 
                    onChange={handleInputChange} 
                    rows={3} 
                    maxLength={201} 
                    className={`w-full px-4 py-3 text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none bg-background text-foreground ${errors.description ? 'border-red-500' : 'border-input'}`} 
                  />
                  {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description}</p>}
                </div>

                <div className="pt-4">
                  <Button type="submit" disabled={saving || Object.values(errors).some(e => e)} className="w-full h-12 text-base font-semibold bg-green-600 hover:bg-green-700 text-white rounded-lg">
                    {saving ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <SaveIcon className="w-5 h-5 mr-2" />}
                    {saving ? 'Đang lưu...' : 'Lưu Thay Đổi'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600">Xem trước</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 border rounded-lg bg-card border-border">
                  <div className="flex items-center gap-3 mb-4">
                    <IconComponent name={formData.icon} className="w-8 h-8 text-foreground"/>
                    <h3 className="font-bold text-lg text-foreground">{formData.name.trim() || 'Tên ví'}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">Số dư</p>
                  <p className="text-2xl font-bold text-foreground">{formatPreviewCurrency(formData.balance)}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg text-green-600">
                  <StarIcon className="w-5 h-5 text-yellow-500" /> Mẹo Hữu Ích
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircleIcon className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    <span>Mô tả rõ ràng giúp bạn nhớ lại mục đích của ví sau này.</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </form>
      </div>
  )
}

export default EditWallet