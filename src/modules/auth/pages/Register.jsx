import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { EyeIcon, EyeOffIcon, AlertTriangle } from 'lucide-react'
import {
    validateName,
    validateUsername,
    isValidEmail,
    validatePhoneNumber,
    validatePassword
} from '../../../shared/utils/validationUtils'

// Google Icon Component
const GoogleIcon = ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
)

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
    const [agreedToTerms, setAgreedToTerms] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))

        // Xác thực real-time
        validateFieldRealTime(name, value)
    }

    const validateFieldRealTime = (fieldName, value) => {
        let error = ''

        switch (fieldName) {
            case 'firstName':
            case 'lastName':
                const nameErrors = validateName(value)
                error = nameErrors.length > 0 ? nameErrors[0] : ''
                break
            case 'username':
                const usernameErrors = validateUsername(value)
                error = usernameErrors.length > 0 ? usernameErrors[0] : ''
                break
            case 'email':
                if (value && !isValidEmail(value)) {
                    error = 'Email không hợp lệ'
                }
                break
            case 'phoneNumber':
                if (value) {
                    const phoneErrors = validatePhoneNumber(value)
                    error = phoneErrors.length > 0 ? phoneErrors[0] : ''
                }
                break
            case 'password':
                const passwordErrors = validatePassword(value)
                error = passwordErrors.length > 0 ? passwordErrors[0] : ''
                break
            case 'confirmPassword':
                if (value && value !== formData.password) {
                    error = 'Mật khẩu xác nhận không khớp'
                }
                break
            default:
                break
        }

        setErrors(prev => ({ ...prev, [fieldName]: error }))
    }

    const validateForm = () => {
        const newErrors = {}

        // Xác thực họ
        const lastNameErrors = validateName(formData.lastName)
        if (lastNameErrors.length > 0) {
            newErrors.lastName = lastNameErrors[0]
        }

        // Xác thực tên
        const firstNameErrors = validateName(formData.firstName)
        if (firstNameErrors.length > 0) {
            newErrors.firstName = firstNameErrors[0]
        }

        // Xác thực tên đăng nhập
        const usernameErrors = validateUsername(formData.username)
        if (usernameErrors.length > 0) {
            newErrors.username = usernameErrors[0]
        }

        // Xác thực email
        if (!formData.email) {
            newErrors.email = 'Email là bắt buộc'
        } else if (!isValidEmail(formData.email)) {
            newErrors.email = 'Email không hợp lệ'
        }

        // Xác thực mật khẩu
        const passwordErrors = validatePassword(formData.password)
        if (passwordErrors.length > 0) {
            newErrors.password = passwordErrors[0]
        }

        // Xác thực xác nhận mật khẩu
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Xác nhận mật khẩu là bắt buộc'
        } else if (formData.confirmPassword !== formData.password) {
            newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!agreedToTerms) {
            setErrors({ terms: 'Vui lòng đồng ý với Điều khoản dịch vụ và Chính sách bảo mật để tiếp tục.' })
            return
        }

        // Xác thực form trước khi submit
        if (!validateForm()) {
            return
        }

        try {
            const { confirmPassword, ...registerData } = formData
            await register(registerData)
            navigate('/login', {
                state: {
                    message: 'Đăng ký thành công! Vui lòng kiểm tra email để kích hoạt tài khoản của bạn.'
                }
            })
        } catch (error) {
            // nếu AuthContext ném lỗi có message, hiển thị chung
            const message = error?.response?.data?.message || error?.message || 'Đăng ký thất bại. Vui lòng thử lại.'
            setErrors({ general: message })
        }
    }

    return (
        <div className="min-h-screen bg-background flex flex-col items-center px-4 py-2">
            <div className="mt-4 mb-3">
                <div className="flex items-center justify-center">
                    <span className="text-3xl font-bold text-foreground">XSPEND</span>
                </div>
            </div>

            <div className="w-full border-t border-border mb-4"></div>

            <div className="text-center mb-16 mt-8">
                <h1 className="text-4xl font-bold text-foreground">Tạo tài khoản mới</h1>
            </div>

            <div className="w-full max-w-lg">
                <div className="mb-6">
                    <a href="http://localhost:8080/api/auth/oauth2/google" className="w-full">
                        <Button variant="outline" className="w-full h-12 bg-green-50 hover:bg-green-100 border-green-200 text-green-700 hover:text-green-800 transition-colors">
                            <GoogleIcon className="w-5 h-5 mr-2" />
                            Đăng ký với Google
                        </Button>
                    </a>
                </div>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="bg-background px-4 text-muted-foreground">
                            hoặc đăng ký bằng email
                        </span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {errors.general && (
                        <p className="text-red-500 text-sm mb-2">{errors.general}</p>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="lastName" className="text-sm text-muted-foreground mb-1 block">Họ <span className="text-red-500">*</span></Label>
                            <Input
                                id="lastName"
                                name="lastName"
                                placeholder="Họ"
                                value={formData.lastName}
                                onChange={handleChange}
                                onBlur={(e) => validateFieldRealTime('lastName', e.target.value)}
                                className={`h-12 border-border bg-muted/50 placeholder:text-muted-foreground focus:bg-background focus:border-primary focus:ring-0 rounded-md text-sm transition-all duration-200 ${
                                    errors.lastName ? 'border-red-500 focus:border-red-500' : ''
                                }`}
                            />
                            {errors.lastName && (
                                <div className="flex items-center gap-1 text-sm text-red-500 mt-1">
                                    <AlertTriangle className="h-3 w-3" />
                                    {errors.lastName}
                                </div>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="firstName" className="text-sm text-muted-foreground mb-1 block">Tên <span className="text-red-500">*</span></Label>
                            <Input
                                id="firstName"
                                name="firstName"
                                placeholder="Tên"
                                value={formData.firstName}
                                onChange={handleChange}
                                onBlur={(e) => validateFieldRealTime('firstName', e.target.value)}
                                className={`h-12 border-border bg-muted/50 placeholder:text-muted-foreground focus:bg-background focus:border-primary focus:ring-0 rounded-md text-sm transition-all duration-200 ${
                                    errors.firstName ? 'border-red-500 focus:border-red-500' : ''
                                }`}
                            />
                            {errors.firstName && (
                                <div className="flex items-center gap-1 text-sm text-red-500 mt-1">
                                    <AlertTriangle className="h-3 w-3" />
                                    {errors.firstName}
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="username" className="text-sm text-muted-foreground mb-1 block">Tên đăng nhập <span className="text-red-500">*</span></Label>
                        <Input
                            id="username"
                            name="username"
                            placeholder="Tên đăng nhập"
                            value={formData.username}
                            onChange={handleChange}
                            onBlur={(e) => validateFieldRealTime('username', e.target.value)}
                            className={`h-12 border-border bg-muted/50 placeholder:text-muted-foreground focus:bg-background focus:border-primary focus:ring-0 rounded-md text-sm transition-all duration-200 ${
                                errors.username ? 'border-red-500 focus:border-red-500' : ''
                            }`}
                        />
                        {errors.username && (
                            <div className="flex items-center gap-1 text-sm text-red-500 mt-1">
                                <AlertTriangle className="h-3 w-3" />
                                {errors.username}
                            </div>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="email" className="text-sm text-muted-foreground mb-1 block">Email <span className="text-red-500">*</span></Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            onBlur={(e) => validateFieldRealTime('email', e.target.value)}
                            className={`h-12 border-border bg-muted/50 placeholder:text-muted-foreground focus:bg-background focus:border-primary focus:ring-0 rounded-md text-sm transition-all duration-200 ${
                                errors.email ? 'border-red-500 focus:border-red-500' : ''
                            }`}
                        />
                        {errors.email && (
                            <div className="flex items-center gap-1 text-sm text-red-500 mt-1">
                                <AlertTriangle className="h-3 w-3" />
                                {errors.email}
                            </div>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="password" className="text-sm text-muted-foreground mb-1 block">Mật khẩu <span className="text-red-500">*</span></Label>
                        <div className="relative">
                            <Input
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Nhập mật khẩu"
                                value={formData.password}
                                onChange={handleChange}
                                onBlur={(e) => validateFieldRealTime('password', e.target.value)}
                                className={`h-12 border-border bg-muted/50 placeholder:text-muted-foreground focus:bg-background focus:border-primary focus:ring-0 rounded-md text-sm transition-all duration-200 pr-10 ${
                                    errors.password ? 'border-red-500 focus:border-red-500' : ''
                                }`}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                            </button>
                        </div>
                        {errors.password && (
                            <div className="flex items-center gap-1 text-sm text-red-500 mt-1">
                                <AlertTriangle className="h-3 w-3" />
                                {errors.password}
                            </div>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="confirmPassword" className="text-sm text-muted-foreground mb-1 block">Xác nhận mật khẩu <span className="text-red-500">*</span></Label>
                        <div className="relative">
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder="Xác nhận lại mật khẩu"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                onBlur={(e) => validateFieldRealTime('confirmPassword', e.target.value)}
                                className={`h-12 border-border bg-muted/50 placeholder:text-muted-foreground focus:bg-background focus:border-primary focus:ring-0 rounded-md text-sm transition-all duration-200 pr-10 ${
                                    errors.confirmPassword ? 'border-red-500 focus:border-red-500' : ''
                                }`}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <div className="flex items-center gap-1 text-sm text-red-500 mt-1">
                                <AlertTriangle className="h-3 w-3" />
                                {errors.confirmPassword}
                            </div>
                        )}
                    </div>

                    <div className="flex items-start space-x-2 py-2 mt-4">
                        <input
                            type="checkbox"
                            id="terms-register"
                            checked={agreedToTerms}
                            onChange={(e) => {
                                setAgreedToTerms(e.target.checked)
                                if (e.target.checked) {
                                    setErrors(prev => ({ ...prev, terms: null }))
                                }
                            }}
                            className="w-4 h-4 mt-0.5 border-border rounded text-green-600 focus:ring-green-500"
                        />
                        <label htmlFor="terms-register" className="text-sm text-muted-foreground leading-relaxed">
                            Bằng cách đăng ký, tôi đồng ý với{' '}
                            <a href="#" className="text-green-600 hover:underline">Điều khoản dịch vụ</a>
                            {' '}và{' '}
                            <a href="#" className="text-green-600 hover:underline">Chính sách bảo mật</a>
                            <span className="text-red-500 ml-1">*</span>
                        </label>
                    </div>

                    {errors.terms && (
                        <p className="text-red-500 text-sm mt-1">{errors.terms}</p>
                    )}

                    <Button
                        type="submit"
                        className={`w-full h-12 font-medium rounded-lg mt-6 text-sm transition-colors ${
                            agreedToTerms
                                ? 'bg-green-600 hover:bg-green-700 text-white'
                                : 'bg-gray-400 cursor-not-allowed text-gray-600'
                        }`}
                        disabled={loading || !agreedToTerms}
                    >
                        {loading ? 'Đang xử lý...' : 'Tạo tài khoản'}
                    </Button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-muted-foreground">
                        Đã có tài khoản?{' '}
                        <Link to="/login" className="text-primary hover:underline font-semibold">
                            Đăng nhập
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Register