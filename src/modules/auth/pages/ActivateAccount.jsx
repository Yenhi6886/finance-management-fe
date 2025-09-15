import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { authService } from '../services/authService'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react'

const ActivateAccount = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState('activating') // 'activating', 'success', 'error'
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const token = searchParams.get('token')

    if (!token) {
      setStatus('error')
      setErrorMessage('Đường dẫn kích hoạt không hợp lệ hoặc thiếu token.')
      return
    }

    const activate = async () => {
      try {
        await authService.activateAccount(token)
        setStatus('success')

        setTimeout(() => {
          navigate('/login', {
            state: {
              message: 'Tài khoản đã được kích hoạt thành công! Vui lòng đăng nhập.'
            }
          })
        }, 3000) // Đợi 3 giây trước khi chuyển hướng

      } catch (error) {
        setStatus('error')
        const message = error.response?.data?.message || 'Kích hoạt tài khoản thất bại. Token có thể đã hết hạn hoặc không hợp lệ.'
        setErrorMessage(message)
      }
    }

    activate()
  }, [searchParams, navigate])

  const renderContent = () => {
    switch (status) {
      case 'activating':
        return (
            <div className="flex flex-col items-center justify-center space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-lg font-medium text-muted-foreground">Đang kích hoạt tài khoản của bạn...</p>
              <p className="text-sm text-muted-foreground">Vui lòng đợi trong giây lát.</p>
            </div>
        )
      case 'success':
        return (
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <CheckCircle className="h-12 w-12 text-green-500" />
              <p className="text-lg font-medium">Kích hoạt thành công!</p>
              <p className="text-sm text-muted-foreground">
                Tài khoản của bạn đã sẵn sàng. Sẽ tự động chuyển đến trang đăng nhập sau 3 giây.
              </p>
            </div>
        )
      case 'error':
        return (
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <AlertCircle className="h-12 w-12 text-destructive" />
              <p className="text-lg font-medium text-destructive">Kích hoạt thất bại</p>
              <p className="text-sm text-muted-foreground">{errorMessage}</p>
              <Button asChild>
                <Link to="/login">Quay lại trang đăng nhập</Link>
              </Button>
            </div>
        )
      default:
        return null
    }
  }

  return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold">Kích hoạt tài khoản</CardTitle>
          </CardHeader>
          <CardContent className="py-8">
            {renderContent()}
          </CardContent>
        </Card>
      </div>
  )
}

export default ActivateAccount