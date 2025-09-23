import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../../../components/ui/dialog.jsx';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../../../components/ui/alert-dialog.jsx';
import { Button } from '../../../components/ui/button.jsx';
import { Input } from '../../../components/ui/input.jsx';
import { Label } from '../../../components/ui/label.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select.jsx';
import { FMDatePicker } from '../../../components/ui/fm-date-picker.jsx';
import { useWallet } from '../../../shared/hooks/useWallet.js';
import { useNotification } from '../../../shared/contexts/NotificationContext.jsx';
import { useLanguage } from '../../../shared/contexts/LanguageContext.jsx';
import { categoryService } from '../services/categoryService.js';
import { transactionService } from '../services/transactionService.js';
import { toast } from 'sonner';
import { Loader2, Trash2, AlertTriangle } from 'lucide-react';
import { formatCurrency } from '../../../shared/utils/formattingUtils.js';
import { useSettings } from '../../../shared/contexts/SettingsContext.jsx';
import { useDateFormat } from '../../../shared/hooks/useDateFormat.js';
import { cn } from '../../../lib/utils.js';
import { IconComponent } from '../../../shared/config/icons.js';
import { validateTransaction, validateField } from '../../../shared/utils/validationUtils.js';

const EditTransactionModal = ({ isOpen, onClose, onTransactionUpdated, transaction }) => {
    const { t } = useLanguage();
    const { wallets } = useWallet();
    const { settings } = useSettings();
    const { refreshNotifications } = useNotification();
    const { formatDateTime } = useDateFormat();
    const [amount, setAmount] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [walletId, setWalletId] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [showFutureDateConfirm, setShowFutureDateConfirm] = useState(false);
    const [pendingTransactionData, setPendingTransactionData] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await categoryService.getCategories();
                setCategories(response.data.data || []);
            } catch (error) {
                toast.error(t('transactions.messages.errors.loadCategories'));
            }
        };
        fetchCategories();
    }, [t]);

    // Function to check future date
    const isFutureDate = (dateString) => {
        const selectedDate = new Date(dateString);
        const now = new Date();
        return selectedDate > now;
    };

    // Function to format date for display
    const formatDateForDisplay = (dateString) => {
        return formatDateTime(dateString);
    };

    useEffect(() => {
        if (transaction) {
            setAmount(transaction.amount.toString());
            setCategoryId(String(transaction.categoryId) || '');
            setWalletId(String(transaction.walletId) || '');
            setDescription(transaction.description || '');

            const dateObj = new Date(transaction.date);
            const year = dateObj.getFullYear();
            const month = String(dateObj.getMonth() + 1).padStart(2, '0');
            const day = String(dateObj.getDate()).padStart(2, '0');
            const hours = String(dateObj.getHours()).padStart(2, '0');
            const minutes = String(dateObj.getMinutes()).padStart(2, '0');
            const localDateTimeString = `${year}-${month}-${day}T${hours}:${minutes}`;
            setDate(localDateTimeString);
        }
    }, [transaction]);

    if (!transaction) return null;

    const validate = () => {
        const formData = {
            amount,
            description,
            date,
            categoryId,
            walletId,
            type: transaction.type
        };

        const validationOptions = {
            categories,
            wallets,
            amountOptions: {
                min: 0,
                max: 999999999,
                decimalPlaces: 2,
                allowZero: false
            },
            descriptionOptions: {
                maxLength: 500,
                minLength: 0,
                allowSpecialChars: true,
                required: false,
                allowNewLines: true,
                allowEmojis: true,
                fieldName: t('transactions.edit.validation.fieldNameDescription')
            },
            dateOptions: {
                allowFuture: true,
                allowPast: true,
                maxFutureDays: 365,
                maxPastDays: 3650,
                required: true
            }
        };

        const validation = validateTransaction(formData, validationOptions);
        let errors = validation.errors;

        // Add validation for amount not exceeding wallet balance (for both income and expense)
        if (amount && walletId) {
            const selectedWallet = wallets.find(w => w.id.toString() === walletId);
            if (selectedWallet) {
                const amountValue = parseFloat(amount);
                const walletBalance = parseFloat(selectedWallet.balance);
                
                if (amountValue > walletBalance) {
                    errors.amount = t('transactions.edit.validation.amountExceedsBalance', { balance: formatCurrency(walletBalance, 'VND', settings) });
                }
            }
        }

        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Real-time validation function
    const validateFieldRealTime = (fieldName, value) => {
        const options = {
            categories,
            wallets,
            transactionType: transaction.type,
            amount: parseFloat(amount) || 0
        };

        const validation = validateField(fieldName, value, options);
        let errorMessage = null;

        if (!validation.isValid) {
            errorMessage = validation.errors[0];
        } else {
            // Add validation for amount not exceeding wallet balance (for both income and expense)
            if (fieldName === 'amount' && value && walletId) {
                const selectedWallet = wallets.find(w => w.id.toString() === walletId);
                if (selectedWallet) {
                    const amountValue = parseFloat(value);
                    const walletBalance = parseFloat(selectedWallet.balance);
                    
                    if (amountValue > walletBalance) {
                        errorMessage = t('transactions.edit.validation.amountExceedsBalance', { balance: formatCurrency(walletBalance, 'VND', settings) });
                    }
                }
            }
        }

        if (errorMessage) {
            setErrors(prev => ({
                ...prev,
                [fieldName]: errorMessage
            }));
        } else {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[fieldName];
                return newErrors;
            });
        }
    };

    const handleUpdate = async () => {
        try {
            const transactionData = {
                amount: parseFloat(amount),
                type: transaction.type,
                walletId: parseInt(walletId),
                categoryId: parseInt(categoryId),
                description: description.trim(),
                date: new Date(date).toISOString(),
            };
            await transactionService.updateTransaction(transaction.id, transactionData);
            toast.success(t('transactions.messages.transactionUpdated'));
            refreshNotifications();
            onTransactionUpdated();
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || t('transactions.messages.errors.updateTransaction'));
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        // Kiểm tra ngày tương lai
        if (isFutureDate(date)) {
            const transactionData = {
                amount: parseFloat(amount),
                type: transaction.type,
                walletId: parseInt(walletId),
                categoryId: parseInt(categoryId),
                description: description.trim(),
                date: date,
            };
            setPendingTransactionData(transactionData);
            setShowFutureDateConfirm(true);
            return;
        }

        // Tiến hành update nếu không phải ngày tương lai
        setLoading(true);
        await handleUpdate();
        setLoading(false);
    };

    const handleDelete = async () => {
        setLoading(true);
        try {
            await transactionService.deleteTransaction(transaction.id);
            toast.success(t('transactions.messages.transactionDeleted'));
            refreshNotifications();
            onTransactionUpdated();
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || t('transactions.messages.errors.deleteTransaction'));
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {t('transactions.edit.title')}{' '}
                        {transaction.type === 'INCOME' ?
                            <span className='text-green-600'>{t('transactions.edit.incomeTitle')}</span> :
                            <span className='text-red-600'>{t('transactions.edit.expenseTitle')}</span>}
                    </DialogTitle>
                    <DialogDescription>{t('transactions.edit.subtitle')}</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor={`amount-edit`}>{t('transactions.edit.form.amount')} *</Label>
                        <Input 
                            id={`amount-edit`} 
                            type="number" 
                            value={amount} 
                            onChange={(e) => {
                                setAmount(e.target.value);
                                validateFieldRealTime('amount', e.target.value);
                            }}
                            onBlur={(e) => validateFieldRealTime('amount', e.target.value)}
                            placeholder={t('transactions.edit.form.amountPlaceholder')} 
                            step="0.01"
                            min="0"
                            max="999999999"
                        />
                        {errors.amount && (
                            <div className="flex items-center gap-1 text-sm text-red-500">
                                <AlertTriangle className="h-3 w-3" />
                                {errors.amount}
                            </div>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor={`category-edit`}>{t('transactions.edit.form.category')} *</Label>
                        <Select 
                            onValueChange={(value) => {
                                setCategoryId(value);
                                validateFieldRealTime('categoryId', value);
                            }} 
                            value={categoryId}
                        >
                            <SelectTrigger><SelectValue placeholder={t('transactions.edit.form.categoryPlaceholder')} /></SelectTrigger>
                            <SelectContent>
                                {categories.map(cat => (
                                    <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.categoryId && (
                            <div className="flex items-center gap-1 text-sm text-red-500">
                                <AlertTriangle className="h-3 w-3" />
                                {errors.categoryId}
                            </div>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor={`wallet-edit`}>{t('transactions.edit.form.wallet')} *</Label>
                        <Select 
                            onValueChange={(value) => {
                                setWalletId(value);
                                validateFieldRealTime('walletId', value);
                                // Validate lại số tiền khi thay đổi ví (cho cả khoản thu và chi)
                                if (amount) {
                                    validateFieldRealTime('amount', amount);
                                }
                            }} 
                            value={walletId}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder={t('transactions.edit.form.walletPlaceholder')}>
                                    {walletId && wallets.find(w => w.id.toString() === walletId) && (
                                        <div className="flex items-center space-x-2">
                                            <IconComponent name={wallets.find(w => w.id.toString() === walletId).icon} className="w-4 h-4" />
                                            <span>{wallets.find(w => w.id.toString() === walletId).name} ({formatCurrency(wallets.find(w => w.id.toString() === walletId).balance, wallets.find(w => w.id.toString() === walletId).currency, settings)})</span>
                                        </div>
                                    )}
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                {wallets.map(w => (
                                    <SelectItem key={w.id} value={String(w.id)}>
                                        <div className="flex items-center space-x-2">
                                            <IconComponent name={w.icon} className="w-4 h-4" />
                                            <span>{w.name} ({formatCurrency(w.balance, w.currency, settings)})</span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.walletId && (
                            <div className="flex items-center gap-1 text-sm text-red-500">
                                <AlertTriangle className="h-3 w-3" />
                                {errors.walletId}
                            </div>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor={`description-edit`}>{t('transactions.edit.form.description')}</Label>
                        <Input 
                            id={`description-edit`} 
                            value={description} 
                            onChange={(e) => {
                                setDescription(e.target.value);
                                validateFieldRealTime('description', e.target.value);
                            }}
                            onBlur={(e) => validateFieldRealTime('description', e.target.value)}
                            placeholder={t('transactions.edit.form.descriptionPlaceholder')} 
                            maxLength={500}
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                            <div className="flex flex-col">
                                <span>{t('transactions.modal.form.descriptionHints.maxLength')}</span>
                                <span className="text-gray-400">{t('transactions.modal.form.descriptionHints.features')}</span>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className={description.length > 450 ? 'text-orange-500' : description.length > 480 ? 'text-red-500' : ''}>
                                    {description.length}/500
                                </span>
                                <span className="text-gray-400">
                                    {description.split(/\s+/).filter(word => word.length > 0).length} {t('transactions.modal.form.descriptionHints.wordCount')}
                                </span>
                            </div>
                        </div>
                        {errors.description && (
                            <div className="flex items-center gap-1 text-sm text-red-500">
                                <AlertTriangle className="h-3 w-3" />
                                {errors.description}
                            </div>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor={`date-edit`}>{t('transactions.edit.form.date')} *</Label>
                        <FMDatePicker
                            value={date ? new Date(date) : null}
                            onChange={(selectedDate) => {
                                if (selectedDate) {
                                    const dateString = selectedDate.toISOString().slice(0, 16);
                                    setDate(dateString);
                                    validateFieldRealTime('date', dateString);
                                } else {
                                    setDate('');
                                    validateFieldRealTime('date', '');
                                }
                            }}
                            placeholder={t('transactions.modal.form.datePlaceholder')}
                        />
                        {errors.date && (
                            <div className="flex items-center gap-1 text-sm text-red-500">
                                <AlertTriangle className="h-3 w-3" />
                                {errors.date}
                            </div>
                        )}
                    </div>
                    <DialogFooter className="pt-4 sm:justify-between">
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button type="button" variant="destructive" size="sm" className="rounded bg-red-600 hover:bg-red-700">
                                    <Trash2 className="mr-2 h-4 w-4"/>{t('transactions.edit.form.delete')}
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>{t('transactions.edit.confirmDelete.title')}</AlertDialogTitle>
                                    <AlertDialogDescription>{t('transactions.edit.confirmDelete.description')}</AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel size="sm" className="rounded">{t('transactions.edit.confirmDelete.cancel')}</AlertDialogCancel>
                                    <AlertDialogAction size="sm" className={cn("rounded", loading && 'cursor-not-allowed')} onClick={handleDelete} disabled={loading}>
                                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}{t('transactions.edit.confirmDelete.confirm')}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                        <Button type="submit" disabled={loading} size="sm" className="rounded">
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {t('transactions.edit.form.save')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
            
            {/* Confirm Dialog cho ngày tương lai */}
            <AlertDialog open={showFutureDateConfirm} onOpenChange={setShowFutureDateConfirm}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t('transactions.edit.confirmFutureDate.title')}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {t('transactions.edit.confirmFutureDate.description', { date: formatDateForDisplay(date) })}
                            <br />
                            <br />
                            <strong>{t('transactions.edit.confirmFutureDate.transactionInfo')}</strong>
                            <br />
                            • {t('transactions.edit.confirmFutureDate.transactionType')}: {transaction?.type === 'INCOME' ? t('transactions.list.defaultIncome') : t('transactions.list.defaultExpense')}
                            <br />
                            • {t('transactions.edit.confirmFutureDate.transactionAmount')}: {formatCurrency(parseFloat(amount), 'VND', settings)}
                            <br />
                            • {t('transactions.edit.confirmFutureDate.transactionDate')}: {formatDateForDisplay(date)}
                            <br />
                            <br />
                            {t('transactions.edit.confirmFutureDate.confirmMessage')}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>{t('transactions.edit.confirmFutureDate.cancel')}</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={async () => {
                                setShowFutureDateConfirm(false);
                                setLoading(true);
                                await handleUpdate();
                                setLoading(false);
                            }}
                        >
                            {t('transactions.edit.confirmFutureDate.confirm')}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Dialog>
    );
};

export default EditTransactionModal;