import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { validationUtils } from '../../../shared/utils/validationUtils.js'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../../components/ui/card'
import { KeyIcon, ArrowLeftIcon } from 'lucide-react'

const ForgotPassword = () => {
  const navigate = useNavigate()
  const { forgotPassword, loading } = useAuth()
  
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    setEmail(e.target.value)
    
    // Clear error when user starts typing
    if (errors.email) {
      setErrors({})
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!email) {
      newErrors.email = { message: 'Email là bắt buộc' }
    } else if (!validationUtils.isValidEmail(email)) {
      newErrors.email = { message: 'Email không hợp lệ' }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      await forgotPassword(email)
      setSubmitted(true)
    } catch (error) {
      // Error is handled in AuthContext
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
              <KeyIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-2xl font-bold">Email đã được gửi</CardTitle>
            <CardDescription>
              Vui lòng kiểm tra email của bạn
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4 text-center">
            <p className="text-sm text-muted-foreground">
              Chúng tôi đã gửi link đặt lại mật khẩu đến email của bạn. Vui lòng kiểm tra hộp thư (bao gồm cả thư mục spam) và làm theo hướng dẫn.
            </p>
            {/* <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>Lưu ý bảo mật:</strong> Mật khẩu mới được gửi trực tiếp qua email. Đây là giải pháp tạm thời cho Sprint 1.
              </p>
            </div> */}
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => navigate('/login')}
            >
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Quay lại đăng nhập
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full" 
              onClick={() => setSubmitted(false)}
            >
              Gửi lại email
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mb-4">
            <KeyIcon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
          <CardTitle className="text-2xl font-bold">Quên mật khẩu</CardTitle>
          <CardDescription>
            Nhập email để nhận mật khẩu mới qua email
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Nhập địa chỉ email đã đăng ký"
                value={email}
                onChange={handleChange}
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? 'Đang gửi...' : 'Gửi mật khẩu mới'}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm text-muted-foreground">
            Nhớ ra mật khẩu?{' '}
            <Link 
              to="/login" 
              className="text-primary-600 hover:text-primary-500 font-medium"
            >
              Đăng nhập ngay
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

export default ForgotPassword
