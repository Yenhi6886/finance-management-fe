import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../../components/ui/card.jsx';
import { Button } from '../../../components/ui/button.jsx';
import { LoadingSpinner as Loading } from '../../../components/Loading.jsx';
import { walletService } from '../services/walletService.js';
import { useAuth } from '../../auth/contexts/AuthContext.jsx';
import { formatCurrency } from '../../../shared/utils/formattingUtils.js';
import { IconComponent } from '../../../shared/config/icons.js';
import { Badge } from '../../../components/ui/badge.jsx';
import { useLanguage } from '../../../shared/contexts/LanguageContext.jsx';

const AcceptInvitation = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const { t } = useLanguage();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [invitation, setInvitation] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const token = searchParams.get('token');

    const getPermissionDisplay = (permission) => {
        return t(`wallets.acceptInvitation.permissions.${permission.toLowerCase()}`);
    };

    useEffect(() => {
        const verifyToken = async () => {
            if (!token) {
                setError(t('wallets.acceptInvitation.errors.invalidLink'));
                setLoading(false);
                return;
            }

            try {
                const response = await walletService.verifyInvitation(token);
                if (response.data.success) {
                    setInvitation(response.data.data);
                } else {
                    setError(response.data.message || t('wallets.acceptInvitation.errors.verifyFailed'));
                }
            } catch (err) {
                const errorMessage = err.response?.data?.message || t('wallets.acceptInvitation.errors.invalidToken');
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        verifyToken();
    }, [token]);

    const handleResponse = async (action) => {
        if (!isAuthenticated) {
            toast.error(t('wallets.acceptInvitation.errors.loginRequired'));
            navigate('/login', { state: { from: `/accept-invitation?token=${token}` } });
            return;
        }

        setIsProcessing(true);
        try {
            if (action === 'accept') {
                await walletService.acceptInvitation(token);
                toast.success(t('wallets.acceptInvitation.acceptSuccess', { walletName: invitation.walletName }));
                navigate('/wallets');
            } else {
                await walletService.rejectInvitation(token);
                toast.info(t('wallets.acceptInvitation.rejectSuccess'));
                navigate('/dashboard');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || t('wallets.acceptInvitation.errors.processError');
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
                            <CardTitle className="text-2xl text-red-500">{t('wallets.acceptInvitation.errorTitle')}</CardTitle>
                            <CardDescription>{error}</CardDescription>
                        </>
                    ) : (
                        <>
                            <div className="mx-auto bg-muted rounded-full p-3 w-fit">
                                <IconComponent name={invitation.wallet.icon || 'wallet'} className="h-8 w-8 text-primary" />
                            </div>
                            <CardTitle className="text-2xl">{t('wallets.acceptInvitation.title')}</CardTitle>
                            <CardDescription>
                                {t('wallets.acceptInvitation.description', { ownerName: invitation.ownerName, walletName: invitation.walletName })}
                            </CardDescription>
                        </>
                    )}
                </CardHeader>
                {invitation && !error && (
                    <>
                        <CardContent className="space-y-4">
                            {invitation.message && (
                                <div className="p-3 bg-muted rounded-md text-sm italic">
                                    <p className="font-semibold mb-1">{t('wallets.acceptInvitation.messageFrom', { ownerName: invitation.ownerName })}</p>
                                    <p>"{invitation.message}"</p>
                                </div>
                            )}
                            <div className="text-sm space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">{t('wallets.acceptInvitation.currentBalance')}</span>
                                    <span className="font-semibold">{formatCurrency(invitation.wallet.balance, invitation.wallet.currency)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">{t('wallets.acceptInvitation.permissionGranted')}</span>
                                    <Badge variant="secondary">{getPermissionDisplay(invitation.permissionLevel)}</Badge>
                                </div>
                            </div>
                            {!isAuthenticated && (
                                <div className="p-3 text-center bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-800 rounded-md text-sm">
                                    {t('wallets.acceptInvitation.authRequiredText')} <Link to={`/login?redirect=/accept-invitation?token=${token}`} className="font-bold underline">{t('auth.login.title')}</Link> {t('wallets.acceptInvitation.or')} <Link to="/register" className="font-bold underline">{t('auth.register.title')}</Link> {t('wallets.acceptInvitation.toAccept')}.
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
                                {isProcessing ? <Loading/> : t('wallets.acceptInvitation.reject')}
                            </Button>
                            <Button
                                className="w-full"
                                onClick={() => handleResponse('accept')}
                                disabled={isProcessing}
                            >
                                {isProcessing ? <Loading/> : t('wallets.acceptInvitation.accept')}
                            </Button>
                        </CardFooter>
                    </>
                )}
                {error && (
                    <CardFooter>
                        <Button asChild className="w-full">
                            <Link to="/dashboard">{t('wallets.acceptInvitation.backHome')}</Link>
                        </Button>
                    </CardFooter>
                )}
            </Card>
        </div>
    );
};

export default AcceptInvitation;