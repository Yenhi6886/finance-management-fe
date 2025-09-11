import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Card } from '../../../components/ui/card'
import { Alert } from '../../../components/ui/alert'
import { 
  ArrowLeftIcon,
  PlusIcon,
  DollarSignIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  LoaderIcon
} from 'lucide-react'
import { walletService } from '../services/walletService'

const DepositMoney = () => {
  const { walletId } = useParams()
  const navigate = useNavigate()
  
  const [wallet, setWallet] = useState(null)
  const [amount, setAmount] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [showSuccess, setShowSuccess] = useState(false)
  const [depositResult, setDepositResult] = useState(null)

  // Preset amounts for quick selection
  const presetAmounts = [50000, 100000, 200000, 500000, 1000000, 2000000]

  useEffect(() => {
    const fetchWalletDetails = async () => {
      try {
        const response = await walletService.getWalletById(walletId)
        setWallet(response.data)
      } catch (error) {
        console.error('Error fetching wallet details:', error)
        navigate('/wallets')
      }
    }
    
    fetchWalletDetails()
  }, [walletId, navigate])

  // Auto clear success message after 5 seconds
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false)
        setDepositResult(null)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [showSuccess])

  const validateForm = () => {
    const newErrors = {}
    
    if (!amount || parseFloat(amount) <= 0) {
      newErrors.amount = 'Số tiền phải lớn hơn 0'
    }
    
    if (parseFloat(amount) < 1000) {
      newErrors.amount = 'Số tiền tối thiểu là 1,000 ₫'
    }

    if (parseFloat(amount) > 100000000) {
      newErrors.amount = 'Số tiền tối đa là 100,000,000 ₫'
    }

    if (notes.length > 255) {
      newErrors.notes = 'Ghi chú không được quá 255 ký tự'
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
      const depositData = {
        amount: parseFloat(amount),
        notes: notes.trim()
      }

      const response = await walletService.depositMoney(walletId, depositData)
      
      if (response.success) {
        setDepositResult(response.data)
        setShowSuccess(true)
        setAmount('')
        setNotes('')
        
        // Show success toast
        toast.success('Nạp tiền thành công!', {
          description: `Đã nạp ${formatCurrency(depositData.amount)} vào ví ${wallet.name}`,
          duration: 4000
        })
        
        // Cập nhật balance của wallet
        setWallet(prev => ({
          ...prev,
          balance: response.data.newBalance
        }))
      } else {
        setErrors({ 
          submit: response.message || 'Có lỗi xảy ra khi nạp tiền'
        })
        
        // Show error toast
        toast.error('Nạp tiền thất bại', {
          description: response.message || 'Có lỗi xảy ra khi nạp tiền',
          duration: 4000
        })
      }
    } catch (error) {
      console.error('Error depositing money:', error)
      setErrors({ 
        submit: 'Có lỗi xảy ra khi nạp tiền. Vui lòng thử lại.'
      })
      
      // Show error toast
      toast.error('Lỗi hệ thống', {
        description: 'Có lỗi xảy ra khi nạp tiền. Vui lòng thử lại.',
        duration: 4000
      })
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND' 
    }).format(amount)
  }

  if (!wallet) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoaderIcon className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/wallets')}
          className="flex items-center gap-2"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Quay lại
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Nạp tiền vào ví</h1>
          <p className="text-muted-foreground">
            Thêm tiền vào ví {wallet.name}
          </p>
        </div>
      </div>

      {/* Success Alert */}
      {showSuccess && depositResult && (
        <Alert className="mb-6 border-green-200 bg-green-50">
          <CheckCircleIcon className="h-4 w-4 text-green-600" />
          <div className="ml-2">
            <h4 className="text-green-800 font-medium">
              {depositResult.message}
            </h4>
            <p className="text-green-700 text-sm mt-1">
              Số dư mới: {formatCurrency(depositResult.newBalance)}
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

      {/* Wallet Info */}
      <Card className="p-6 mb-6">
        <div className="flex items-center gap-3">
          <div className="text-3xl">{wallet.icon}</div>
          <div>
            <h3 className="font-semibold text-lg">{wallet.name}</h3>
            <p className="text-muted-foreground">
              Số dư hiện tại: {formatCurrency(wallet.balance)}
            </p>
          </div>
        </div>
      </Card>

      {/* Deposit Form */}
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm font-medium">
              Số tiền muốn nạp <span className="text-red-500">*</span>
            </Label>
            
            {/* Preset Amount Buttons */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              {presetAmounts.map((preset) => (
                <Button
                  key={preset}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setAmount(preset.toString())}
                  className="text-xs h-8"
                >
                  {formatCurrency(preset).replace('₫', '').trim()}
                </Button>
              ))}
            </div>
            
            <div className="relative">
              <DollarSignIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="amount"
                type="number"
                placeholder="Nhập số tiền..."
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={`pl-10 ${errors.amount ? 'border-red-500' : ''}`}
                min="0"
                step="1000"
              />
            </div>
            {errors.amount && (
              <p className="text-red-500 text-sm">{errors.amount}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Số tiền tối thiểu: 1,000 ₫ - Tối đa: 100,000,000 ₫
            </p>
          </div>

          {/* Notes Input */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium">
              Ghi chú
            </Label>
            <Input
              id="notes"
              type="text"
              placeholder="Nhập ghi chú (tùy chọn)..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className={errors.notes ? 'border-red-500' : ''}
              maxLength={255}
            />
            {errors.notes && (
              <p className="text-red-500 text-sm">{errors.notes}</p>
            )}
            <p className="text-xs text-muted-foreground">
              {notes.length}/255 ký tự
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/wallets')}
              className="flex-1"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <LoaderIcon className="w-4 h-4 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                <>
                  <PlusIcon className="w-4 h-4" />
                  Nạp tiền
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>

      {/* Preview Card */}
      {amount && parseFloat(amount) > 0 && (
        <Card className="p-6 mt-6 bg-blue-50 border-blue-200">
          <h4 className="font-medium mb-3 text-blue-900">Xem trước giao dịch</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-blue-700">Số tiền nạp:</span>
              <span className="font-medium text-blue-900">
                {formatCurrency(parseFloat(amount))}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700">Số dư hiện tại:</span>
              <span className="text-blue-800">
                {formatCurrency(wallet.balance)}
              </span>
            </div>
            <div className="flex justify-between border-t border-blue-200 pt-2">
              <span className="text-blue-700 font-medium">Số dư sau nạp:</span>
              <span className="font-bold text-blue-900">
                {formatCurrency(wallet.balance + parseFloat(amount))}
              </span>
            </div>
            {notes && (
              <div className="border-t border-blue-200 pt-2">
                <span className="text-blue-700">Ghi chú: </span>
                <span className="text-blue-800">{notes}</span>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  )
}

export default DepositMoney
