import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { validationUtils } from '../../../shared/utils/validationUtils.js'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { EyeIcon, EyeOffIcon } from 'lucide-react'

const Register = () => {
  const navigate = useNavigate()
  const { register, loading } = useAuth()

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const { confirmPassword, ...registerData } = formData
      await register(registerData)
      navigate('/login', {
        state: {
          message: 'Đăng ký thành công! Vui lòng kiểm tra email để kích hoạt tài khoản của bạn.'
        }
      })
    } catch (error) {
      // Error is handled in AuthContext
    }
  }

  return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4 py-2">
        {/* Logo at the top */}
        <div className="mt-4 mb-3">
          <div className="flex items-center justify-center">
            <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center mr-3">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 3.5V7H9V3.5L3 7V9C3 10.1 3.9 11 5 11S7 10.1 7 9H9V14C9 15.1 9.9 16 11 16H13C14.1 16 15 15.1 15 14V9H17C17 10.1 17.9 11 19 11S21 10.1 21 9ZM11 18V22H13V18H11Z"/>
              </svg>
            </div>
            <span className="text-3xl font-bold text-gray-800">XSPEND</span>
          </div>
        </div>
        
        {/* Horizontal line */}
        <div className="w-full border-t border-gray-200 mb-4"></div>

        {/* Title */}
        <div className="text-center mb-16 mt-8">
          <h1 className="text-4xl font-bold text-gray-800">Tạo tài khoản mới</h1>
        </div>
        
        {/* Form container */}
        <div className="w-full max-w-lg">
          <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="lastName" className="text-sm text-gray-600 mb-1 block">Họ <span className="text-red-500">*</span></Label>
                  <Input 
                    id="lastName" 
                    name="lastName" 
                    placeholder="Họ" 
                    value={formData.lastName} 
                    onChange={handleChange} 
                    className="h-12 border border-gray-200 bg-white placeholder:text-gray-400 focus:bg-white focus:border-gray-300 focus:ring-0 rounded-md text-sm transition-all duration-200"
                  />
                </div>
                <div>
                  <Label htmlFor="firstName" className="text-sm text-gray-600 mb-1 block">Tên <span className="text-red-500">*</span></Label>
                  <Input 
                    id="firstName" 
                    name="firstName" 
                    placeholder="Tên" 
                    value={formData.firstName} 
                    onChange={handleChange} 
                    className="h-12 border border-gray-200 bg-white placeholder:text-gray-400 focus:bg-white focus:border-gray-300 focus:ring-0 rounded-md text-sm transition-all duration-200"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="username" className="text-sm text-gray-600 mb-1 block">Tên đăng nhập <span className="text-red-500">*</span></Label>
                <Input 
                  id="username" 
                  name="username" 
                  placeholder="Tên đăng nhập" 
                  value={formData.username} 
                  onChange={handleChange} 
                  className="h-12 border border-gray-200 bg-white placeholder:text-gray-400 focus:bg-white focus:border-gray-300 focus:ring-0 rounded-md text-sm transition-all duration-200"
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-sm text-gray-600 mb-1 block">Email <span className="text-red-500">*</span></Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  placeholder="Email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  className="h-12 border border-gray-200 bg-white placeholder:text-gray-400 focus:bg-white focus:border-gray-300 focus:ring-0 rounded-md text-sm transition-all duration-200"
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-sm text-gray-600 mb-1 block">Mật khẩu <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <Input 
                    id="password" 
                    name="password" 
                    type={showPassword ? 'text' : 'password'} 
                    placeholder="••••••••" 
                    value={formData.password} 
                    onChange={handleChange} 
                    className="h-12 border border-gray-200 bg-white placeholder:text-gray-400 focus:bg-white focus:border-gray-300 focus:ring-0 rounded-md text-sm transition-all duration-200 pr-10"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <Label htmlFor="confirmPassword" className="text-sm text-gray-600 mb-1 block">Xác nhận mật khẩu <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <Input 
                    id="confirmPassword" 
                    name="confirmPassword" 
                    type={showConfirmPassword ? 'text' : 'password'} 
                    placeholder="••••••••" 
                    value={formData.confirmPassword} 
                    onChange={handleChange} 
                    className="h-12 border border-gray-200 bg-white placeholder:text-gray-400 focus:bg-white focus:border-gray-300 focus:ring-0 rounded-md text-sm transition-all duration-200 pr-10"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg mt-6 text-sm"
                disabled={loading}
              >
                {loading ? 'Đang xử lý...' : 'Tạo tài khoản'}
              </Button>
            </form>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Đã có tài khoản?{' '}
                <Link to="/login" className="text-emerald-500 hover:underline">
                  Đăng nhập
                </Link>
              </p>
            </div>
        </div>
      </div>
  )
}

export default Register