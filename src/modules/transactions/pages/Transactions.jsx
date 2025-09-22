import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card.jsx';
import { Label } from '../../../components/ui/label.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select.jsx';
import { FMDatePicker } from '../../../components/ui/fm-date-picker.jsx';
import { cn } from '../../../lib/utils.js';
import { PlusCircle, FileText, ArrowUpCircle, ArrowDownCircle, Loader2, MinusCircle, X, BarChart3Icon } from 'lucide-react';
import { transactionService } from '../services/transactionService.js';
import { categoryService } from '../services/categoryService.js';
import { useSettings } from '../../../shared/contexts/SettingsContext.jsx';
import { useWallet } from '../../../shared/hooks/useWallet.js';
import { formatCurrency, formatRelativeTime} from '../../../shared/utils/formattingUtils.js';
import { useDateFormat } from '../../../shared/hooks/useDateFormat.js';
import AddTransactionModal from '../components/AddTransactionModal.jsx';
import EditTransactionModal from '../components/EditTransactionModal.jsx';
import ManageCategories from '../components/ManageCategories.jsx';
import CategoryDetailView from '../components/CategoryDetailView.jsx';
import { toast } from 'sonner';
import { format } from 'date-fns';

const Transactions = () => {
    const [activeTab, setActiveTab] = useState('transactions');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [initialModalType, setInitialModalType] = useState('expense');
    const [initialCategoryId, setInitialCategoryId] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const { refreshWallets } = useWallet();
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const [viewingCategory, setViewingCategory] = useState(null);
    const actionFromUrl = searchParams.get('action');
    const { formatDate } = useDateFormat();

    useEffect(() => {
        const tab = searchParams.get('tab') || 'transactions';
        const categoryId = searchParams.get('viewCategory');

        setActiveTab(tab);

        const fetchAndSetCategory = async (id) => {
            try {
                const response = await categoryService.getCategoryById(id);
                setViewingCategory(response.data.data);
            } catch (error) {
                toast.error("Không tìm thấy danh mục để xem.");
                setViewingCategory(null);
                setSearchParams(params => {
                    params.delete('viewCategory');
                    return params;
                }, { replace: true });
            }
        };

        if (tab === 'categories' && categoryId) {
            // Only fetch if the category ID in URL is different from the one in state
            if (viewingCategory?.id?.toString() !== categoryId) {
                fetchAndSetCategory(categoryId);
            }
        } else {
            setViewingCategory(null);
        }
    }, [searchParams]);


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
        if (viewingCategory) {
            try {
                const response = await categoryService.getCategoryById(viewingCategory.id);
                setViewingCategory(response.data.data);
            } catch (error) {
                handleCloseCategoryView();
            }
        }
        await refreshWallets();
    }, [refreshWallets, viewingCategory]);

    const handleAddTransactionFromCategory = (categoryId) => {
        handleOpenAddModal('expense', categoryId);
    };

    const handleTabChange = (tabName) => {
        setSearchParams(params => {
            params.set('tab', tabName);
            params.delete('viewCategory');
            return params;
        }, { replace: true });
    };

    const handleViewCategory = (category) => {
        const currentCategoryId = searchParams.get('viewCategory');

        setSearchParams(params => {
            if (String(category.id) === currentCategoryId) {
                params.delete('viewCategory');
            } else {
                params.set('tab', 'categories');
                params.set('viewCategory', category.id);
            }
            return params;
        }, { replace: true });
    };

    const handleCloseCategoryView = () => {
        setSearchParams(params => {
            params.delete('viewCategory');
            return params;
        }, { replace: true });
    };

    const onAutoModalOpened = useCallback(() => {
        navigate('/transactions?tab=categories', { replace: true });
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
                        onClick={() => handleTabChange('transactions')}
                        className={cn('whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm',
                            activeTab === 'transactions' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border')}
                    >
                        Giao Dịch
                    </button>
                    <button
                        onClick={() => handleTabChange('categories')}
                        className={cn('whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm',
                            activeTab === 'categories' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border')}
                    >
                        Danh Mục Chi Tiêu
                    </button>
                </nav>
            </div>

            {activeTab === 'transactions' && <TransactionList onOpenAddModal={handleOpenAddModal} onOpenEditModal={handleOpenEditModal} refreshTrigger={refreshTrigger} />}
            {activeTab === 'categories' && (
                <div className="space-y-6">
                    <ManageCategories
                        onAddTransaction={handleAddTransactionFromCategory}
                        refreshTrigger={refreshTrigger}
                        onTransactionClick={handleOpenEditModal}
                        onViewCategory={handleViewCategory}
                        autoOpenAddModal={actionFromUrl === 'add'}
                        onAutoModalOpened={onAutoModalOpened}
                    />
                    {viewingCategory && (
                        <CategoryDetailView
                            key={viewingCategory.id}
                            category={viewingCategory}
                            onClose={handleCloseCategoryView}
                            onTransactionClick={handleOpenEditModal}
                        />
                    )}
                </div>
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
    const navigate = useNavigate();
    const { settings } = useSettings();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [quickSelectValue, setQuickSelectValue] = useState(null);

    const fetchTransactions = useCallback(async () => {
        setLoading(true);
        try {
            const params = { limit: 50 };
            if (selectedCategory) {
                params.categoryId = selectedCategory;
            }
            if (selectedDate) {
                params.date = format(selectedDate, 'yyyy-MM-dd');
            }
            const response = await transactionService.getTransactions(params);
            setTransactions(response.data.data || []);
        } catch (error) {
            toast.error('Không thể tải danh sách giao dịch.');
        } finally {
            setLoading(false);
        }
    }, [selectedCategory, selectedDate]);

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions, refreshTrigger]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await categoryService.getCategories();
                setCategories(response.data.data || []);
            } catch (error) {
                toast.error('Không thể tải danh sách danh mục.');
            }
        };
        fetchCategories();
    }, []);


    const totalIncome = transactions.filter(t => t.type === 'INCOME').reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions.filter(t => t.type === 'EXPENSE').reduce((sum, t) => sum + t.amount, 0);
    const balance = totalIncome - totalExpense;

    const SummaryAndActions = () => (
        <div className="space-y-6">
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
                <CardContent className="flex flex-col gap-2">
                    <div className="grid grid-cols-2 gap-2">
                        <Button onClick={() => onOpenAddModal('expense')} variant="destructive" className="rounded-md bg-red-600 hover:bg-red-700 text-white"><MinusCircle className="mr-2 h-4 w-4" />Chi Tiêu</Button>
                        <Button onClick={() => onOpenAddModal('income')} className="rounded-md"><PlusCircle className="mr-2 h-4 w-4" />Thu Nhập</Button>
                    </div>
                    <Button onClick={() => navigate('/reports')} variant="secondary" className="w-full rounded-md">
                        <BarChart3Icon className="mr-2 h-4 w-4" />
                        Xem Báo Cáo Chi Tiết
                    </Button>
                </CardContent>
            </Card>
        </div>
    );

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="block lg:hidden space-y-6">
                <SummaryAndActions />
            </div>
            <div className="lg:col-span-2 space-y-6">
                <Card>
                    <CardHeader><CardTitle>Bộ Lọc</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Lọc theo danh mục</Label>
                            <Select value={selectedCategory || ''} onValueChange={(value) => setSelectedCategory(value === 'all' ? null : value)}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Chọn danh mục" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tất cả danh mục</SelectItem>
                                    {categories.map((category) => (
                                        <SelectItem key={category.id} value={String(category.id)}>
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Lọc theo ngày</Label>
                            <div className="flex gap-2">
                                <FMDatePicker
                                    value={selectedDate}
                                    onChange={(selectedDate) => setSelectedDate(selectedDate)}
                                    placeholder="Chọn ngày"
                                    className="flex-1"
                                />
                                <Select value={quickSelectValue || undefined} onValueChange={(value) => {
                                    setQuickSelectValue(value);
                                    if (value === "today") {
                                        setSelectedDate(new Date());
                                    } else if (value === "yesterday") {
                                        const yesterday = new Date();
                                        yesterday.setDate(yesterday.getDate() - 1);
                                        setSelectedDate(yesterday);
                                    }
                                }}>
                                    <SelectTrigger className="w-40">
                                        <SelectValue placeholder="Chọn ngày nhanh" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="today">Hôm nay</SelectItem>
                                        <SelectItem value="yesterday">Hôm qua</SelectItem>
                                    </SelectContent>
                                </Select>
                                {selectedDate && (
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => {
                                            setSelectedDate(null);
                                            setQuickSelectValue(null);
                                        }}
                                        className="shrink-0"
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        </div>
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
                                                    <p className="text-sm text-muted-foreground">{tx.walletName} • {tx.category || 'Chưa phân loại'} • {formatRelativeTime(tx.date)}</p>
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
                                    <p className="text-muted-foreground text-sm">Không tìm thấy giao dịch nào phù hợp với bộ lọc của bạn.</p>
                                </div>
                            )}
                    </CardContent>
                </Card>
            </div>
            <div className="hidden lg:block lg:col-span-1 space-y-6 sticky top-6">
                <SummaryAndActions />
            </div>
        </div>
    )
};

export default Transactions;