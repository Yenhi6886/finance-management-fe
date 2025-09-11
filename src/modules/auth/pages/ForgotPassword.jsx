import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { validationUtils } from '../../../shared/utils/validationUtils';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../../components/ui/card';
import { KeyIcon, ArrowLeftIcon, MailCheckIcon } from 'lucide-react';
import { errorHandler } from '../../../shared/utils/errorHandler';

const ForgotPassword = () => {
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
      setErrors({ email: { message: 'Email không hợp lệ' } });
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
            <CardTitle className="text-2xl font-bold">Kiểm tra email của bạn</CardTitle>
            <CardDescription>
              Nếu email của bạn tồn tại trong hệ thống, một liên kết để đặt lại mật khẩu đã được gửi đến.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4 text-center">
            <p className="text-sm text-muted-foreground">
              Vui lòng kiểm tra hộp thư (bao gồm cả thư mục spam) và làm theo hướng dẫn để hoàn tất việc đặt lại mật khẩu.
            </p>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button 
              variant="ghost" 
              className="w-full" 
              onClick={handleResend}
              disabled={!canResend || loading}
            >
              {canResend ? 'Gửi lại link' : `Gửi lại sau ${countdown}s`}
            </Button>
            <Link to="/login" className="w-full">
              <Button variant="outline" className="w-full">
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Quay lại đăng nhập
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
          <CardTitle className="text-2xl font-bold">Quên mật khẩu</CardTitle>
          <CardDescription>
            Nhập email để nhận link đặt lại mật khẩu.
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
              {loading ? 'Đang gửi...' : 'Gửi link reset'}
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
  );
};

export default ForgotPassword;