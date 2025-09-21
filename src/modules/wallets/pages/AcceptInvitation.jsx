import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { LoadingSpinner as Loading } from '../../../components/Loading';
import { walletService } from '../services/walletService';
import { useAuth } from '../../auth/contexts/AuthContext';
import { formatCurrency } from '../../../shared/utils/formattingUtils';
import { IconComponent } from '../../../shared/config/icons';
import { Badge } from '../../../components/ui/badge';

const permissionDisplayMap = {
    VIEW: 'Xem',
    EDIT: 'Chỉnh sửa & Giao dịch',
    OWNER: 'Chủ sở hữu'
};

const AcceptInvitation = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [invitation, setInvitation] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const token = searchParams.get('token');

    useEffect(() => {
        const verifyToken = async () => {
            if (!token) {
                setError('Đường dẫn không hợp lệ hoặc thiếu token mời.');
                setLoading(false);
                return;
            }

            try {
                const response = await walletService.verifyInvitation(token);
                if (response.data.success) {
                    setInvitation(response.data.data);
                } else {
                    setError(response.data.message || 'Không thể xác thực lời mời.');
                }
            } catch (err) {
                const errorMessage = err.response?.data?.message || 'Lời mời không hợp lệ, đã hết hạn hoặc đã được xử lý.';
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        verifyToken();
    }, [token]);

    const handleResponse = async (action) => {
        if (!isAuthenticated) {
            toast.error('Vui lòng đăng nhập để chấp nhận lời mời.');
            navigate('/login', { state: { from: `/accept-invitation?token=${token}` } });
            return;
        }

        setIsProcessing(true);
        try {
            if (action === 'accept') {
                await walletService.acceptInvitation(token);
                toast.success(`Bạn đã chấp nhận lời mời tham gia ví "${invitation.walletName}"!`);
                navigate('/wallets');
            } else {
                await walletService.rejectInvitation(token);
                toast.info('Bạn đã từ chối lời mời.');
                navigate('/dashboard');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Đã xảy ra lỗi khi xử lý yêu cầu của bạn.';
            toast.error(errorMessage);
        } finally {
            setIsProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <Loading />
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-background p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    {error ? (
                        <>
                            <CardTitle className="text-2xl text-red-500">Đã xảy ra lỗi</CardTitle>
                            <CardDescription>{error}</CardDescription>
                        </>
                    ) : (
                        <>
                            <div className="mx-auto bg-muted rounded-full p-3 w-fit">
                                <IconComponent name={invitation.wallet.icon || 'wallet'} className="h-8 w-8 text-primary" />
                            </div>
                            <CardTitle className="text-2xl">Lời Mời Chia Sẻ Ví</CardTitle>
                            <CardDescription>
                                <strong>{invitation.ownerName}</strong> đã mời bạn tham gia vào ví <strong>{invitation.walletName}</strong>.
                            </CardDescription>
                        </>
                    )}
                </CardHeader>
                {invitation && !error && (
                    <>
                        <CardContent className="space-y-4">
                            {invitation.message && (
                                <div className="p-3 bg-muted rounded-md text-sm italic">
                                    <p className="font-semibold mb-1">Lời nhắn từ {invitation.ownerName}:</p>
                                    <p>"{invitation.message}"</p>
                                </div>
                            )}
                            <div className="text-sm space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Số dư hiện tại:</span>
                                    <span className="font-semibold">{formatCurrency(invitation.wallet.balance, invitation.wallet.currency)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Quyền được cấp:</span>
                                    <Badge variant="secondary">{permissionDisplayMap[invitation.permissionLevel] || invitation.permissionLevel}</Badge>
                                </div>
                            </div>
                            {!isAuthenticated && (
                                <div className="p-3 text-center bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-800 rounded-md text-sm">
                                    Bạn cần <Link to={`/login?redirect=/accept-invitation?token=${token}`} className="font-bold underline">đăng nhập</Link> hoặc <Link to="/register" className="font-bold underline">đăng ký</Link> để chấp nhận.
                                </div>
                            )}
                        </CardContent>
                        <CardFooter className="flex justify-between gap-4">
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => handleResponse('reject')}
                                disabled={isProcessing}
                            >
                                {isProcessing ? <Loading/> : 'Từ chối'}
                            </Button>
                            <Button
                                className="w-full"
                                onClick={() => handleResponse('accept')}
                                disabled={isProcessing}
                            >
                                {isProcessing ? <Loading/> : 'Chấp nhận'}
                            </Button>
                        </CardFooter>
                    </>
                )}
                {error && (
                    <CardFooter>
                        <Button asChild className="w-full">
                            <Link to="/dashboard">Về trang chủ</Link>
                        </Button>
                    </CardFooter>
                )}
            </Card>
        </div>
    );
};

export default AcceptInvitation;