import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../../../components/ui/dialog.jsx';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../../../components/ui/alert-dialog.jsx';
import { Button } from '../../../components/ui/button.jsx';
import { Input } from '../../../components/ui/input.jsx';
import { Label } from '../../../components/ui/label.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select.jsx';
import { useWallet } from '../../../shared/hooks/useWallet.js';
import { useNotification } from '../../../shared/contexts/NotificationContext.jsx';
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
                toast.error('Không thể tải danh mục.');
            }
        };
        fetchCategories();
    }, []);

    // Hàm kiểm tra ngày tương lai
    const isFutureDate = (dateString) => {
        const selectedDate = new Date(dateString);
        const now = new Date();
        return selectedDate > now;
    };

    // Hàm format ngày để hiển thị
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
                fieldName: 'Ghi chú'
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

        // Thêm validation cho số tiền không vượt quá số dư ví (cho cả khoản thu và chi)
        if (amount && walletId) {
            const selectedWallet = wallets.find(w => w.id.toString() === walletId);
            if (selectedWallet) {
                const amountValue = parseFloat(amount);
                const walletBalance = parseFloat(selectedWallet.balance);
                
                if (amountValue > walletBalance) {
                    errors.amount = `Số tiền không được vượt quá số dư hiện tại (${formatCurrency(walletBalance, 'VND', settings)})`;
                }
            }
        }

        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Hàm xác thực thời gian thực
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
            // Thêm validation cho số tiền không vượt quá số dư ví (cho cả khoản thu và chi)
            if (fieldName === 'amount' && value && walletId) {
                const selectedWallet = wallets.find(w => w.id.toString() === walletId);
                if (selectedWallet) {
                    const amountValue = parseFloat(value);
                    const walletBalance = parseFloat(selectedWallet.balance);
                    
                    if (amountValue > walletBalance) {
                        errorMessage = `Số tiền không được vượt quá số dư hiện tại (${formatCurrency(walletBalance, 'VND', settings)})`;
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
            toast.success('Cập nhật giao dịch thành công!');
            refreshNotifications();
            onTransactionUpdated();
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật.');
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
            toast.success('Xóa giao dịch thành công!');
            refreshNotifications();
            onTransactionUpdated();
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi xóa.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        Chi Tiết{' '}
                        {transaction.type === 'INCOME' ?
                            <span className='text-green-600'>Giao Dịch Thu</span> :
                            <span className='text-red-600'>Giao Dịch Chi</span>}
                    </DialogTitle>
                    <DialogDescription>Chỉnh sửa hoặc xóa giao dịch của bạn tại đây.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor={`amount-edit`}>Số tiền *</Label>
                        <Input 
                            id={`amount-edit`} 
                            type="number" 
                            value={amount} 
                            onChange={(e) => {
                                setAmount(e.target.value);
                                validateFieldRealTime('amount', e.target.value);
                            }}
                            onBlur={(e) => validateFieldRealTime('amount', e.target.value)}
                            placeholder="0" 
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
                        <Label htmlFor={`category-edit`}>Danh mục *</Label>
                        <Select 
                            onValueChange={(value) => {
                                setCategoryId(value);
                                validateFieldRealTime('categoryId', value);
                            }} 
                            value={categoryId}
                        >
                            <SelectTrigger><SelectValue placeholder="Chọn danh mục" /></SelectTrigger>
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
                        <Label htmlFor={`wallet-edit`}>Ví *</Label>
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
                                <SelectValue placeholder="Chọn ví">
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
                        <Label htmlFor={`description-edit`}>Ghi chú</Label>
                        <Input 
                            id={`description-edit`} 
                            value={description} 
                            onChange={(e) => {
                                setDescription(e.target.value);
                                validateFieldRealTime('description', e.target.value);
                            }}
                            onBlur={(e) => validateFieldRealTime('description', e.target.value)}
                            placeholder="Ghi chú về giao dịch..." 
                            maxLength={500}
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                            <div className="flex flex-col">
                                <span>Nhập tối đa 500 ký tự, có thể xuống dòng</span>
                                <span className="text-gray-400">Hỗ trợ emoji và ký tự đặc biệt</span>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className={description.length > 450 ? 'text-orange-500' : description.length > 480 ? 'text-red-500' : ''}>
                                    {description.length}/500
                                </span>
                                <span className="text-gray-400">
                                    {description.split(/\s+/).filter(word => word.length > 0).length} từ
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
                        <Label htmlFor={`date-edit`}>Thời gian *</Label>
                        <Input 
                            id={`date-edit`} 
                            type="datetime-local" 
                            value={date} 
                            onChange={(e) => {
                                setDate(e.target.value);
                                validateFieldRealTime('date', e.target.value);
                            }}
                            onBlur={(e) => validateFieldRealTime('date', e.target.value)}
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
                                    <Trash2 className="mr-2 h-4 w-4"/>Xóa
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
                                    <AlertDialogDescription>Hành động này không thể hoàn tác. Giao dịch sẽ bị xóa vĩnh viễn và số dư ví sẽ được cập nhật lại.</AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel size="sm" className="rounded">Hủy</AlertDialogCancel>
                                    <AlertDialogAction size="sm" className={cn("rounded", loading && 'cursor-not-allowed')} onClick={handleDelete} disabled={loading}>
                                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}Tiếp tục xóa
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                        <Button type="submit" disabled={loading} size="sm" className="rounded">
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Lưu Thay Đổi
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
            
            {/* Confirm Dialog cho ngày tương lai */}
            <AlertDialog open={showFutureDateConfirm} onOpenChange={setShowFutureDateConfirm}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Xác nhận ngày tương lai</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bạn đang cập nhật giao dịch với ngày <strong>{formatDateForDisplay(date)}</strong> (ngày tương lai).
                            <br />
                            <br />
                            <strong>Thông tin giao dịch:</strong>
                            <br />
                            • Loại: {transaction?.type === 'INCOME' ? 'Khoản thu' : 'Khoản chi'}
                            <br />
                            • Số tiền: {formatCurrency(parseFloat(amount), 'VND', settings)}
                            <br />
                            • Ngày: {formatDateForDisplay(date)}
                            <br />
                            <br />
                            Bạn có chắc chắn muốn tiếp tục?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={async () => {
                                setShowFutureDateConfirm(false);
                                setLoading(true);
                                await handleUpdate();
                                setLoading(false);
                            }}
                        >
                            Xác nhận
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Dialog>
    );
};

export default EditTransactionModal;