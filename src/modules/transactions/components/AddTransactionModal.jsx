import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader,DialogFooter } from '../../../components/ui/dialog.jsx';
import { Button } from '../../../components/ui/button.jsx';
import { Input } from '../../../components/ui/input.jsx';
import { Label } from '../../../components/ui/label.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select.jsx';
import { Textarea } from '../../../components/ui/textarea.jsx';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../../../components/ui/alert-dialog.jsx';
import { useWallet } from '../../../shared/hooks/useWallet.js';
import { useNotification } from '../../../shared/contexts/NotificationContext.jsx';
import { categoryService } from '../services/categoryService.js';
import { transactionService } from '../services/transactionService.js';
import { toast } from 'sonner';
import { Loader2, AlertTriangle } from 'lucide-react';
import { formatCurrency } from '../../../shared/utils/formattingUtils.js';
import { useSettings } from '../../../shared/contexts/SettingsContext.jsx';
import { useDateFormat } from '../../../shared/hooks/useDateFormat.js';
import { cn } from '../../../lib/utils.js';
import { IconComponent } from '../../../shared/config/icons.js';
import { validateTransaction, validateField } from '../../../shared/utils/validationUtils.js';

const TransactionForm = ({ type, onFormSubmit, initialCategoryId, onFutureDateConfirm }) => {
    const { wallets, currentWallet } = useWallet();
    const { settings } = useSettings();
    const [amount, setAmount] = useState('');
    const [categoryId, setCategoryId] = useState(initialCategoryId || '');
    const [walletId, setWalletId] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(() => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    });
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [showFutureDateConfirm, setShowFutureDateConfirm] = useState(false);
    const [pendingTransactionData, setPendingTransactionData] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setWalletId(currentWallet ? String(currentWallet.id) : '');
                const response = await categoryService.getCategories();
                setCategories(response.data.data || []);
            } catch (error) {
                toast.error('Không thể tải danh mục.');
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        if(initialCategoryId) {
            setCategoryId(initialCategoryId);
        }
    }, [initialCategoryId]);

    // Hàm kiểm tra ngày tương lai
    const isFutureDate = (dateString) => {
        const selectedDate = new Date(dateString);
        const now = new Date();
        return selectedDate > now;
    };

    // Hàm format ngày để hiển thị
    const formatDateForDisplay = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const validate = () => {
        const formData = {
            amount,
            description,
            date,
            categoryId,
            walletId,
            type
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
            transactionType: type,
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        // Kiểm tra ngày tương lai
        if (isFutureDate(date)) {
            const transactionData = {
                amount: parseFloat(amount),
                type: type.toUpperCase(),
                walletId: parseInt(walletId),
                categoryId: parseInt(categoryId),
                description: description.trim(),
                date: date,
            };
            if (onFutureDateConfirm) {
                onFutureDateConfirm(transactionData);
            }
            return;
        }

        // Tiến hành submit nếu không phải ngày tương lai
        await submitTransaction();
    };

    const submitTransaction = async () => {
        setLoading(true);
        try {
            // Sửa lỗi múi giờ - chuyển đổi đúng cách
            const localDate = new Date(pendingTransactionData?.date || date);
            const utcDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000);

            const transactionData = {
                amount: parseFloat(amount),
                type: type.toUpperCase(),
                walletId: parseInt(walletId),
                categoryId: parseInt(categoryId),
                description: description.trim(),
                date: utcDate.toISOString(),
            };
            await onFormSubmit(transactionData);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor={`amount-${type}`}>Số tiền *</Label>
                <Input 
                    id={`amount-${type}`} 
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
                <Label htmlFor={`category-${type}`}>Danh mục *</Label>
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
                            <SelectItem
                                key={cat.id}
                                value={String(cat.id)}
                                className="hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors duration-200"
                            >
                                {cat.name}
                            </SelectItem>
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
                <Label htmlFor={`wallet-${type}`}>Ví *</Label>
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
                            <SelectItem
                                key={w.id}
                                value={String(w.id)}
                                className="hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors duration-200"
                            >
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
                <Label htmlFor={`description-${type}`}>Ghi chú</Label>
                <Textarea
                    id={`description-${type}`}
                    value={description}
                    onChange={(e) => {
                        setDescription(e.target.value);
                        validateFieldRealTime('description', e.target.value);
                    }}
                    onBlur={(e) => validateFieldRealTime('description', e.target.value)}
                    placeholder={`Ghi chú về khoản ${type === 'income' ? 'thu' : 'chi'}...`}
                    rows={3}
                    maxLength={500}
                    className="resize-none"
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
                <Label htmlFor={`date-${type}`}>Thời gian *</Label>
                <Input 
                    id={`date-${type}`} 
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
            <DialogFooter className="pt-4 sm:justify-end flex">
                <Button type="submit" disabled={loading} size="sm" className={cn('rounded', type === 'expense' && 'bg-red-600 hover:bg-red-700')}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Thêm Khoản {type === 'income' ? 'Thu' : 'Chi'}
                </Button>
            </DialogFooter>
        </form>
    );
};

const AddTransactionModal = ({ isOpen, onClose, initialType, onTransactionAdded, initialCategoryId }) => {
    const [activeTab, setActiveTab] = useState(initialType);
    const { refreshWallets } = useWallet();
    const { refreshNotifications } = useNotification();
    const [showFutureDateConfirm, setShowFutureDateConfirm] = useState(false);
    const [pendingTransactionData, setPendingTransactionData] = useState(null);

    useEffect(() => {
        if(isOpen) {
            setActiveTab(initialType);
        }
    }, [isOpen, initialType]);

    // Hàm xử lý confirm ngày tương lai
    const handleFutureDateConfirm = (transactionData) => {
        setPendingTransactionData(transactionData);
        setShowFutureDateConfirm(true);
    };

    // Hàm format ngày để hiển thị
    const formatDateForDisplay = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleFormSubmit = async (transactionData) => {
        const response = await transactionService.createTransaction(transactionData);
        const newTransaction = response.data.data;

        if (newTransaction.type === 'EXPENSE' && newTransaction.budgetExceeded) {

            toast.warning(`Bạn đã chi tiêu vượt ngân sách cho danh mục '${newTransaction.category}'.`, {
                icon: <AlertTriangle className="w-4 h-4" />,
                duration: 5000,
                closeButton: true,
            });
        } else if (newTransaction.type === 'INCOME' && newTransaction.incomeTargetReached) {
            toast.success('Chúc mừng! Bạn đã đạt mục tiêu thu nhập cho danh mục này.');
        } else {
            toast.success(`Thêm khoản ${newTransaction.type === 'INCOME' ? 'thu' : 'chi'} thành công!`);
        }

        await refreshWallets();
        refreshNotifications();
        onTransactionAdded();
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <div className="flex border-b">
                        <button onClick={() => setActiveTab('expense')} className={cn('flex-1 py-3 text-sm font-semibold border-b-2', activeTab === 'expense' ? 'text-primary border-primary' : 'text-muted-foreground border-transparent hover:text-primary')}>Thêm Khoản Chi</button>
                        <button onClick={() => setActiveTab('income')} className={cn('flex-1 py-3 text-sm font-semibold border-b-2', activeTab === 'income' ? 'text-primary border-primary' : 'text-muted-foreground border-transparent hover:text-primary')}>Thêm Khoản Thu</button>
                    </div>
                </DialogHeader>
                <div className="py-4">
                    {activeTab === 'expense' && <TransactionForm type="expense" onFormSubmit={handleFormSubmit} initialCategoryId={initialCategoryId} onFutureDateConfirm={handleFutureDateConfirm} />}
                    {activeTab === 'income' && <TransactionForm type="income" onFormSubmit={handleFormSubmit} initialCategoryId={initialCategoryId} onFutureDateConfirm={handleFutureDateConfirm} />}
                </div>
            </DialogContent>
            
            {/* Confirm Dialog cho ngày tương lai */}
            <AlertDialog open={showFutureDateConfirm} onOpenChange={setShowFutureDateConfirm}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Xác nhận ngày tương lai</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bạn đang tạo giao dịch với ngày <strong>{pendingTransactionData && formatDateForDisplay(pendingTransactionData.date)}</strong> (ngày tương lai).
                            <br />
                            <br />
                            <strong>Thông tin giao dịch:</strong>
                            <br />
                            • Loại: {pendingTransactionData?.type === 'INCOME' ? 'Khoản thu' : 'Khoản chi'}
                            <br />
                            • Số tiền: {pendingTransactionData && formatCurrency(pendingTransactionData.amount, 'VND', {})}
                            <br />
                            • Ngày: {pendingTransactionData && formatDateForDisplay(pendingTransactionData.date)}
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
                                if (pendingTransactionData) {
                                    await handleFormSubmit(pendingTransactionData);
                                }
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

export default AddTransactionModal;