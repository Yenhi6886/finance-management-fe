import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../../components/ui/card'
import { Alert, AlertDescription } from '../../../components/ui/alert'
import { EyeIcon, EyeOffIcon, Info, LogInIcon } from 'lucide-react'

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
    try {
      await login(formData)
      navigate('/dashboard')
    } catch (error) {
      // Error is handled in AuthContext and errorHandler
    }
  }

  return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
              <LogInIcon className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">Chào mừng trở lại</CardTitle>
            <CardDescription>
              Đăng nhập để tiếp tục quản lý tài chính của bạn.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {notification && (
                <Alert className="mb-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                  <Info className="h-4 w-4 text-blue-500" />
                  <AlertDescription className="text-blue-700 dark:text-blue-300">
                    {notification}
                  </AlertDescription>
                </Alert>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="identifier">Email hoặc Tên đăng nhập</Label>
                <Input
                    id="identifier"
                    name="identifier"
                    type="text"
                    placeholder="Nhập email hoặc tên đăng nhập"
                    value={formData.identifier}
                    onChange={handleChange}
                    autoComplete="username"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Mật khẩu</Label>
                  <Link
                      to="/forgot-password"
                      className="text-sm font-medium text-primary hover:underline"
                  >
                    Quên mật khẩu?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      autoComplete="current-password"
                      className="pr-10"
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

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Đang xử lý...' : 'Đăng nhập'}
              </Button>
              
              {/* Divider */}
              <div className="relative my-5" style={{ marginBottom: '10px' }}>
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300 dark:border-gray-600" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-gray-900 px-2 text-gray-500 dark:text-gray-400">
                    Hoặc đăng nhập với
                  </span>
                </div>
              </div>
              
              {/* Google Login Button */}
              <a 
                href="http://localhost:8080/oauth2/authorize/google"
                className="w-full"
              >
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full h-11 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                >
                  <GoogleIcon className="mr-3 h-5 w-5" />
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    Đăng nhập với Google
                  </span>
                </Button>
              </a>
            </form>
          </CardContent>

          <CardFooter>
            <p className="text-center text-sm text-muted-foreground w-full">
              Chưa có tài khoản?{' '}
              <Link to="/register" className="font-medium text-primary hover:underline">
                Đăng ký ngay
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
  )
}

export default Login