import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../../../components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../../../components/ui/alert-dialog';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { useWallet } from '../../../shared/hooks/useWallet';
import { useNotification } from '../../../shared/contexts/NotificationContext';
import { categoryService } from '../services/categoryService';
import { transactionService } from '../services/transactionService';
import { toast } from 'sonner';
import { Loader2, Trash2 } from 'lucide-react';
import { formatCurrency } from '../../../shared/utils/formattingUtils.js';
import { useSettings } from '../../../shared/contexts/SettingsContext';
import { cn } from '../../../lib/utils';
import { IconComponent } from '../../../shared/config/icons';

const EditTransactionModal = ({ isOpen, onClose, onTransactionUpdated, transaction }) => {
    const { wallets } = useWallet();
    const { settings } = useSettings();
    const { refreshNotifications } = useNotification();
    const [amount, setAmount] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [walletId, setWalletId] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

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
        const newErrors = {};
        if (!amount || parseFloat(amount) <= 0) newErrors.amount = 'Số tiền phải lớn hơn 0.';
        if (!categoryId) newErrors.categoryId = 'Vui lòng chọn danh mục.';
        if (!walletId) newErrors.walletId = 'Vui lòng chọn ví.';
        if (!date) newErrors.date = 'Vui lòng chọn thời gian.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
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
                        <Input id={`amount-edit`} type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" />
                        {errors.amount && <p className="text-sm text-red-500">{errors.amount}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor={`category-edit`}>Danh mục *</Label>
                        <Select onValueChange={setCategoryId} value={categoryId}>
                            <SelectTrigger><SelectValue placeholder="Chọn danh mục" /></SelectTrigger>
                            <SelectContent>
                                {categories.map(cat => (
                                    <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.categoryId && <p className="text-sm text-red-500">{errors.categoryId}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor={`wallet-edit`}>Ví *</Label>
                        <Select onValueChange={setWalletId} value={walletId}>
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
                        {errors.walletId && <p className="text-sm text-red-500">{errors.walletId}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor={`description-edit`}>Ghi chú</Label>
                        <Input id={`description-edit`} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Ghi chú về giao dịch..." />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor={`date-edit`}>Thời gian *</Label>
                        <Input id={`date-edit`} type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} />
                        {errors.date && <p className="text-sm text-red-500">{errors.date}</p>}
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
        </Dialog>
    );
};

export default EditTransactionModal;