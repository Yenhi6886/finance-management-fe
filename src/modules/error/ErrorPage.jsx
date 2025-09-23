import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../../shared/contexts/LanguageContext.jsx'
import { Button } from '../../components/ui/button.jsx'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/card.jsx'
import { AlertTriangleIcon, HomeIcon, ArrowLeftIcon } from 'lucide-react'

const ErrorPage = () => {
  const navigate = useNavigate()
  const { t } = useLanguage()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mb-4">
            <AlertTriangleIcon className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-3xl font-bold">{t('error.notFound.title')}</CardTitle>
          <CardDescription className="text-lg">
            {t('error.notFound.subtitle')}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            {t('error.notFound.description')}
          </p>
          <p className="text-sm text-muted-foreground">
            {t('error.notFound.instruction')}
          </p>
        </CardContent>

        <CardFooter className="flex flex-col space-y-2">
          <Button 
            className="w-full" 
            onClick={() => navigate('/dashboard')}
          >
            <HomeIcon className="w-4 h-4 mr-2" />
            {t('error.notFound.homeButton')}
          </Button>
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={() => navigate(-1)}
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            {t('error.notFound.backButton')}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default ErrorPage
