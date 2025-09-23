import React from 'react'
import Lottie from 'lottie-react'
import { cn } from '../lib/utils.js'
import { useLanguage } from '../shared/contexts/LanguageContext.jsx'
import loadingAnimation from '../assets/loading.json'

const LoadingSpinner = ({ size = 'md', className }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  }

  return (
    <div className={cn(sizeClasses[size], className)}>
      <Lottie 
        animationData={loadingAnimation}
        loop={true}
        autoplay={true}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  )
}

const LottieLoader = ({ size = 'md', className }) => {
  const sizeClasses = {
    sm: 'w-52 h-52',
    md: 'w-72 h-72',
    lg: 'w-96 h-96',
    xl: 'w-128 h-128'
  }

  return (
    <div className={cn(sizeClasses[size], className)}>
      <Lottie 
        animationData={loadingAnimation}
        loop={true}
        autoplay={true}
      />
    </div>
  )
}

const LoadingScreen = ({ message }) => {
  const { t } = useLanguage();
  const defaultMessage = message || t('common.loading');
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="text-center">
        <LottieLoader size="lg" />
      </div>
    </div>
  )
}

const LoadingButton = ({ loading, children, ...props }) => {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={cn(
        'inline-flex items-center justify-center',
        props.className
      )}
    >
      {loading && <LoadingSpinner size="sm" className="mr-2" />}
      {children}
    </button>
  )
}

export { LoadingSpinner, LoadingScreen, LoadingButton, LottieLoader }
