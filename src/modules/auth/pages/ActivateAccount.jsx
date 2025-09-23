import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useLanguage } from '../../../shared/contexts/LanguageContext.jsx'
import { authService } from '../services/authService.js'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card.jsx'
import { Button } from '../../../components/ui/button.jsx'
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react'

const ActivateAccount = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { t } = useLanguage()
  const [status, setStatus] = useState('activating') // 'activating', 'success', 'error'
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const token = searchParams.get('token')

    if (!token) {
      setStatus('error')
      setErrorMessage(t('auth.activateAccount.invalidLink'))
      return
    }

    const activate = async () => {
      try {
        await authService.activateAccount(token)
        setStatus('success')

        setTimeout(() => {
          navigate('/login', {
            state: {
              message: t('auth.activateAccount.successMessage')
            }
          })
        }, 3000) // Wait 3 seconds before redirect

      } catch (error) {
        setStatus('error')
        const message = error.response?.data?.message || t('auth.activateAccount.errorMessage')
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
              <p className="text-lg font-medium text-muted-foreground">{t('auth.activateAccount.activating')}</p>
              <p className="text-sm text-muted-foreground">{t('auth.activateAccount.pleaseWait')}</p>
            </div>
        )
      case 'success':
        return (
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <CheckCircle className="h-12 w-12 text-green-500" />
              <p className="text-lg font-medium">{t('auth.activateAccount.successTitle')}</p>
              <p className="text-sm text-muted-foreground">
                {t('auth.activateAccount.successDescription')}
              </p>
            </div>
        )
      case 'error':
        return (
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <AlertCircle className="h-12 w-12 text-destructive" />
              <p className="text-lg font-medium text-destructive">{t('auth.activateAccount.errorTitle')}</p>
              <p className="text-sm text-muted-foreground">{errorMessage}</p>
              <Button asChild>
                <Link to="/login">{t('auth.activateAccount.backToLogin')}</Link>
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
            <CardTitle className="text-center text-2xl font-bold">{t('auth.activateAccount.title')}</CardTitle>
          </CardHeader>
          <CardContent className="py-8">
            {renderContent()}
          </CardContent>
        </Card>
      </div>
  )
}

export default ActivateAccount