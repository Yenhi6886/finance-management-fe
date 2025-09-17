import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card';
import { cn } from '../../../lib/utils';
import { PlusCircle, FileText, ArrowUpCircle, ArrowDownCircle, Loader2, MinusCircle } from 'lucide-react';
import { transactionService } from '../services/transactionService';
import { useSettings } from '../../../shared/contexts/SettingsContext';
import { useWallet } from '../../../shared/hooks/useWallet';
import { formatCurrency, formatDate } from '../../../shared/utils/formattingUtils.js';
import AddTransactionModal from '../components/AddTransactionModal';
import EditTransactionModal from '../components/EditTransactionModal';
import ManageCategories from '../components/ManageCategories';
import { toast } from 'sonner';

const Transactions = () => {
    const [activeTab, setActiveTab] = useState('transactions');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [initialModalType, setInitialModalType] = useState('expense');
    const [initialCategoryId, setInitialCategoryId] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const { refreshWallets } = useWallet();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const initialCategoryIdToView = searchParams.get('viewCategory');

    useEffect(() => {
        if (initialCategoryIdToView) {
            setActiveTab('categories');
        }
    }, [initialCategoryIdToView]);

    const handleOpenAddModal = (type, categoryId = null) => {
        setInitialModalType(type);
        setInitialCategoryId(categoryId);
        setIsAddModalOpen(true);
    };

    const handleOpenEditModal = (transaction) => {
        setSelectedTransaction(transaction);
        setIsEditModalOpen(true);
    }

    const handleDataRefresh = useCallback(async () => {
        setRefreshTrigger(prev => prev + 1);
        await refreshWallets();
    }, [refreshWallets]);

    const handleAddTransactionFromCategory = (categoryId) => {
        handleOpenAddModal('expense', categoryId);
    };

    const onCategoryViewed = useCallback(() => {
        navigate('/transactions', { replace: true });
    }, [navigate]);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-green-600">Quản Lý Thu Chi</h1>
                <p className="text-muted-foreground mt-1">Theo dõi, phân loại và quản lý tất cả các khoản thu chi của bạn tại một nơi.</p>
            </div>
            <div className="border-b">
                <nav className="-mb-px flex space-x-6">
                    <button
                        onClick={() => setActiveTab('transactions')}
                        className={cn('whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm',
                            activeTab === 'transactions' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border')}
                    >
                        Giao Dịch
                    </button>
                    <button
                        onClick={() => setActiveTab('categories')}
                        className={cn('whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm',
                            activeTab === 'categories' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border')}
                    >
                        Danh Mục Chi Tiêu
                    </button>
                </nav>
            </div>

            {activeTab === 'transactions' && <TransactionList onOpenAddModal={handleOpenAddModal} onOpenEditModal={handleOpenEditModal} refreshTrigger={refreshTrigger} />}
            {activeTab === 'categories' && (
                <ManageCategories
                    onAddTransaction={handleAddTransactionFromCategory}
                    refreshTrigger={refreshTrigger}
                    onTransactionClick={handleOpenEditModal}
                    initialCategoryIdToView={initialCategoryIdToView}
                    onCategoryViewed={onCategoryViewed}
                />
            )}

            <AddTransactionModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                initialType={initialModalType}
                initialCategoryId={initialCategoryId}
                onTransactionAdded={handleDataRefresh}
            />

            <EditTransactionModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                transaction={selectedTransaction}
                onTransactionUpdated={handleDataRefresh}
            />
        </div>
    );
};

const TransactionList = ({ onOpenAddModal, onOpenEditModal, refreshTrigger }) => {
    const { settings } = useSettings();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTransactions = useCallback(async () => {
        setLoading(true);
        try {
            const response = await transactionService.getTransactions({ limit: 50 });
            setTransactions(response.data.data || []);
        } catch (error) {
            toast.error('Không thể tải danh sách giao dịch.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions, refreshTrigger]);

    const totalIncome = transactions.filter(t => t.type === 'INCOME').reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions.filter(t => t.type === 'EXPENSE').reduce((sum, t) => sum + t.amount, 0);
    const balance = totalIncome - totalExpense;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2 space-y-6">
                <Card>
                    <CardHeader><CardTitle>Bộ Lọc</CardTitle></CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground text-sm">Bộ lọc sẽ sớm được cập nhật.</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle>Danh Sách Giao Dịch</CardTitle></CardHeader>
                    <CardContent>
                        {loading ? <div className="text-center py-16"><Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" /></div> :
                            transactions.length > 0 ? (
                                <div className="divide-y">
                                    {transactions.map((tx) => (
                                        <div key={tx.id} className="flex items-center justify-between py-4 cursor-pointer hover:bg-muted/50 -mx-6 px-6" onClick={() => onOpenEditModal(tx)}>
                                            <div className="flex items-center gap-4">
                                                {tx.type === 'INCOME' ? <ArrowUpCircle className="w-8 h-8 text-green-500 flex-shrink-0" /> : <ArrowDownCircle className="w-8 h-8 text-red-500 flex-shrink-0" />}
                                                <div>
                                                    <p className="font-semibold">{tx.description || (tx.type === 'INCOME' ? 'Khoản thu nhập' : 'Khoản chi tiêu')}</p>
                                                    <p className="text-sm text-muted-foreground">{tx.walletName} • {tx.category || 'Chưa phân loại'} • {formatDate(tx.date, settings)}</p>
                                                </div>
                                            </div>
                                            <p className={cn("text-lg font-bold text-right pl-4", tx.type === 'INCOME' ? 'text-green-600' : 'text-red-600')}>
                                                {tx.type === 'INCOME' ? '+' : '-'}{formatCurrency(tx.amount, 'VND', settings)}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-16">
                                    <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold">Chưa có giao dịch nào</h3>
                                    <p className="text-muted-foreground text-sm">Bắt đầu ghi lại các khoản thu chi của bạn bằng cách thêm giao dịch mới.</p>
                                </div>
                            )}
                    </CardContent>
                </Card>
            </div>
            <div className="lg:col-span-1 space-y-6 sticky top-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Tổng Quan</CardTitle>
                        <CardDescription>Tổng hợp thu chi trong kỳ này</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-muted rounded-md">
                            <span className="text-sm font-medium">Tổng Thu</span>
                            <span className="font-bold text-green-600">{formatCurrency(totalIncome, 'VND', settings)}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-muted rounded-md">
                            <span className="text-sm font-medium">Tổng Chi</span>
                            <span className="font-bold text-red-500">{formatCurrency(totalExpense, 'VND', settings)}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-muted rounded-md border-t-2">
                            <span className="text-sm font-medium">Cân Bằng</span>
                            <span className={cn("font-bold", balance >= 0 ? 'text-foreground' : 'text-red-500')}>{formatCurrency(balance, 'VND', settings)}</span>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Hành Động</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-2">
                        <Button onClick={() => onOpenAddModal('expense')} variant="destructive" className="rounded-md bg-red-600 hover:bg-red-700 text-white"><MinusCircle className="mr-2 h-4 w-4" />Chi Tiêu</Button>
                        <Button onClick={() => onOpenAddModal('income')} className="rounded-md"><PlusCircle className="mr-2 h-4 w-4" />Thu Nhập</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
};

export default Transactions;