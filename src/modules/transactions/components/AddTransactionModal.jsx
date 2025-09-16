import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { useWallet } from '../../../shared/hooks/useWallet';
import { categoryService } from '../services/categoryService';
import { transactionService } from '../services/transactionService';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { formatCurrency } from '../../../shared/utils/formattingUtils.js';
import { useSettings } from '../../../shared/contexts/SettingsContext';
import { cn } from '../../../lib/utils';

const TransactionForm = ({ type, onFormSubmit }) => {
    const { wallets } = useWallet();
    const { settings } = useSettings();
    const [amount, setAmount] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [walletId, setWalletId] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(new Date().toISOString().slice(0, 16));
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

    const validate = () => {
        const newErrors = {};
        if (!amount || parseFloat(amount) <= 0) newErrors.amount = 'Số tiền phải lớn hơn 0.';
        if (!categoryId) newErrors.categoryId = 'Vui lòng chọn danh mục.';
        if (!walletId) newErrors.walletId = 'Vui lòng chọn ví.';
        if (!date) newErrors.date = 'Vui lòng chọn thời gian.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        try {
            const transactionData = {
                amount: parseFloat(amount),
                type: type.toUpperCase(),
                walletId: parseInt(walletId),
                categoryId: parseInt(categoryId),
                description: description.trim(),
                date: new Date(date).toISOString(),
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
                <Input id={`amount-${type}`} type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" />
                {errors.amount && <p className="text-sm text-red-500">{errors.amount}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor={`category-${type}`}>Danh mục *</Label>
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
                <Label htmlFor={`wallet-${type}`}>Ví *</Label>
                <Select onValueChange={setWalletId} value={walletId}>
                    <SelectTrigger><SelectValue placeholder="Chọn ví" /></SelectTrigger>
                    <SelectContent>
                        {wallets.map(w => (
                            <SelectItem key={w.id} value={String(w.id)}>{w.name} ({formatCurrency(w.balance, w.currency, settings)})</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.walletId && <p className="text-sm text-red-500">{errors.walletId}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor={`description-${type}`}>Ghi chú</Label>
                <Input id={`description-${type}`} value={description} onChange={(e) => setDescription(e.target.value)} placeholder={`Ghi chú về khoản ${type === 'income' ? 'thu' : 'chi'}...`} />
            </div>
            <div className="space-y-2">
                <Label htmlFor={`date-${type}`}>Thời gian *</Label>
                <Input id={`date-${type}`} type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} />
                {errors.date && <p className="text-sm text-red-500">{errors.date}</p>}
            </div>
            <DialogFooter className="pt-4">
                <Button type="submit" disabled={loading} className={cn(type === 'expense' && 'bg-red-600 hover:bg-red-700')}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Thêm Khoản {type === 'income' ? 'Thu' : 'Chi'}
                </Button>
            </DialogFooter>
        </form>
    );
};

const AddTransactionModal = ({ isOpen, onClose, initialType, onTransactionAdded }) => {
    const [activeTab, setActiveTab] = useState(initialType);

    useEffect(() => {
        if(isOpen) {
            setActiveTab(initialType);
        }
    }, [isOpen, initialType]);

    const handleFormSubmit = async (transactionData) => {
        await transactionService.createTransaction(transactionData);
        toast.success(`Thêm khoản ${transactionData.type === 'INCOME' ? 'thu' : 'chi'} thành công!`);
        onTransactionAdded();
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <div className="flex border-b">
                        <button onClick={() => setActiveTab('expense')} className={cn('flex-1 py-3 text-sm font-semibold', activeTab === 'expense' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground')}>Thêm Khoản Chi</button>
                        <button onClick={() => setActiveTab('income')} className={cn('flex-1 py-3 text-sm font-semibold', activeTab === 'income' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground')}>Thêm Khoản Thu</button>
                    </div>
                </DialogHeader>
                <div className="py-4">
                    {activeTab === 'expense' && <TransactionForm type="expense" onFormSubmit={handleFormSubmit} />}
                    {activeTab === 'income' && <TransactionForm type="income" onFormSubmit={handleFormSubmit} />}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AddTransactionModal;