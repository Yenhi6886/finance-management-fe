import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../../shared/contexts/LanguageContext.jsx';
import { authService } from '../services/authService.js';
import { validationUtils } from '../../../shared/utils/validationUtils.js';
import { Button } from '../../../components/ui/button.jsx';
import { Input } from '../../../components/ui/input.jsx';
import { Label } from '../../../components/ui/label.jsx';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../../components/ui/card.jsx';
import { KeyIcon, ArrowLeftIcon, MailCheckIcon } from 'lucide-react';
import { errorHandler } from '../../../shared/utils/errorHandler.js';

const ForgotPassword = () => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Resend countdown logic
  const [canResend, setCanResend] = useState(false);
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    let timer;
    if (submitted && !canResend) {
      timer = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown <= 1) {
            clearInterval(timer);
            setCanResend(true);
            return 0;
          }
          return prevCountdown - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [submitted, canResend]);

  const handleRequest = useCallback(async () => {
    if (!validationUtils.isValidEmail(email)) {
      setErrors({ email: { message: t('auth.forgotPassword.validation.emailInvalid') } });
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      await authService.forgotPassword(email);
      setSubmitted(true);
      setCanResend(false); // Disable resend button on new request
      setCountdown(30); // Reset countdown
    } catch (error) {
      // Per requirement, always show a generic message.
      // Specific errors can be logged or handled differently if needed.
      setSubmitted(true);
    }
    finally {
      setLoading(false);
    }
  }, [email]);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleRequest();
  };

  const handleResend = () => {
    if (canResend) {
      handleRequest();
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
              <MailCheckIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-2xl font-bold">{t('auth.forgotPassword.success.title')}</CardTitle>
            <CardDescription>
              {t('auth.forgotPassword.success.description')}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4 text-center">
            <p className="text-sm text-muted-foreground">
              {t('auth.forgotPassword.success.instruction')}
            </p>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button 
              variant="ghost" 
              className="w-full" 
              onClick={handleResend}
              disabled={!canResend || loading}
            >
              {canResend ? t('auth.forgotPassword.success.resendLink') : t('auth.forgotPassword.success.resendCountdown', { seconds: countdown })}
            </Button>
            <Link to="/login" className="w-full">
              <Button variant="outline" className="w-full">
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                {t('auth.forgotPassword.success.backToLogin')}
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mb-4">
            <KeyIcon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
          <CardTitle className="text-2xl font-bold">{t('auth.forgotPassword.title')}</CardTitle>
          <CardDescription>
            {t('auth.forgotPassword.description')}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t('auth.forgotPassword.emailLabel')}</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder={t('auth.forgotPassword.emailPlaceholder')}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({});
                }}
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
              {loading ? t('auth.forgotPassword.sending') : t('auth.forgotPassword.sendResetLink')}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm text-muted-foreground">
            {t('auth.forgotPassword.rememberPassword')}{' '}
            <Link 
              to="/login" 
              className="text-primary-600 hover:text-primary-500 font-medium"
            >
              {t('auth.forgotPassword.loginNow')}
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ForgotPassword;