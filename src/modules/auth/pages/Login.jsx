import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Alert, AlertDescription } from '../../../components/ui/alert'
import { EyeIcon, EyeOffIcon, Info} from 'lucide-react'

// Google Icon Component
const GoogleIcon = ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
)

const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, loading } = useAuth()

  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [notification, setNotification] = useState(null)
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  useEffect(() => {
    if (location.state?.message) {
      setNotification(location.state.message)
      window.history.replaceState({}, document.title)
    }
  }, [location.state])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!agreedToTerms) {
      setNotification('Vui lòng đồng ý với Điều khoản dịch vụ và Chính sách bảo mật để tiếp tục.')
      return
    }
    
    try {
      await login(formData)
      navigate('/dashboard')
    } catch (error) {
      // Error is handled in AuthContext and errorHandler
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
          <h1 className="text-4xl font-bold text-foreground">Chào mừng đến với XSPEND</h1>
        </div>

        <div className="w-full max-w-lg">
          {notification && (
              <Alert className="mb-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                <Info className="h-4 w-4 text-blue-500" />
                <AlertDescription className="text-blue-700 dark:text-blue-300">
                  {notification}
                </AlertDescription>
              </Alert>
          )}

          <div className="mb-6">
            <a href="https://api.mozu.media/api/auth/oauth2/google" className="w-full">
              <Button variant="outline" className="w-full h-12 bg-green-50 hover:bg-green-100 border-green-200 text-green-700 hover:text-green-800 transition-colors">
                <GoogleIcon className="w-5 h-5 mr-2" />
                Đăng nhập với Google
              </Button>
            </a>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
                <span className="bg-background px-4 text-muted-foreground">
                  hoặc đăng nhập bằng email
                </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="identifier" className="text-sm text-muted-foreground mb-1 block">Email hoặc tên đăng nhập</Label>
              <Input
                  id="identifier"
                  name="identifier"
                  type="text"
                  placeholder="Nhập email hoặc tên đăng nhập"
                  value={formData.identifier}
                  onChange={handleChange}
                  autoComplete="username"
                  className="h-12 border-border bg-muted/50 placeholder:text-muted-foreground focus:bg-background focus:border-primary focus:ring-0 rounded-md text-sm hover:border-primary/50 transition-all duration-200"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-sm text-muted-foreground mb-1 block">Mật khẩu</Label>
              <div className="relative">
                <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Nhập mật khẩu"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                    className="h-12 border-border bg-muted/50 placeholder:text-muted-foreground focus:bg-background focus:border-primary focus:ring-0 rounded-md text-sm hover:border-primary/50 transition-all duration-200 pr-10"
                />
                <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex justify-end mt-2">
              <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                Quên mật khẩu?
              </Link>
            </div>

            <div className="flex items-start space-x-2 py-2">
              <input
                  type="checkbox"
                  id="terms"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="w-4 h-4 mt-0.5 border-border rounded text-green-600 focus:ring-green-500"
              />
              <label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed">
                Bằng cách đăng nhập, bạn đồng ý với{' '}
                <a href="#" className="text-green-600 hover:underline">Điều khoản dịch vụ</a>
                {' '}và{' '}
                <a href="#" className="text-green-600 hover:underline">Chính sách bảo mật</a>
                <span className="text-red-500 ml-1">*</span>
              </label>
            </div>

            <Button
                type="submit"
                className={`w-full h-12 font-medium rounded-lg mt-6 text-sm transition-colors ${
                  agreedToTerms 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'bg-gray-400 cursor-not-allowed text-gray-600'
                }`}
                disabled={loading || !agreedToTerms}
            >
              {loading ? 'Đang xử lý...' : 'Đăng nhập'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Chưa có tài khoản?{' '}
              <Link to="/register" className="text-primary hover:underline font-semibold">
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </div>
      </div>
  )
}

export default Login