import React, { useState, useEffect, useCallback, useMemo, useContext } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../../components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../../../components/ui/alert-dialog';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { categoryService } from '../services/categoryService';
import { toast } from 'sonner';
import { PlusCircle, Trash2, Loader2, BadgePlus, Edit, MoreVertical, TrendingUp, TrendingDown, ArrowRightLeft, ChevronLeft, ChevronRight, EyeIcon, X, FileText, ArrowUpCircle, ArrowDownCircle, PieChart } from 'lucide-react';
import { useSettings } from '../../../shared/contexts/SettingsContext';
import { useTheme } from '../../../shared/contexts/ThemeContext';
import { WalletContext } from '../../../shared/contexts/WalletContext';
import { formatCurrency } from '../../../shared/utils/formattingUtils.js';
import { useDateFormat } from '../../../shared/hooks/useDateFormat';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '../../../components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../../components/ui/tooltip';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { cn } from '../../../lib/utils';

const EditCategoryModal = ({ isOpen, onClose, onCategoryUpdated, category }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [budgetAmount, setBudgetAmount] = useState('');
    const [incomeTargetAmount, setIncomeTargetAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [pendingData, setPendingData] = useState(null);

    useEffect(() => {
        if (category) {
            setName(category.name || '');
            setDescription(category.description || '');
            setBudgetAmount(category.budgetAmount || '');
            setIncomeTargetAmount(category.incomeTargetAmount || '');
        }
    }, [category]);

    // Hàm kiểm tra số tiền lớn và hiển thị confirm dialog
    const checkLargeAmount = (amount, fieldName) => {
        const amountValue = parseFloat(amount);
        const LARGE_AMOUNT_THRESHOLD = 100000000000; // 100 tỉ
        
        if (amountValue > LARGE_AMOUNT_THRESHOLD) {
            return {
                isLarge: true,
                message: `${fieldName} của bạn là ${amountValue.toLocaleString('vi-VN')} VND (hơn 100 tỉ). Bạn có chắc chắn muốn tiếp tục?`
            };
        }
        return { isLarge: false };
    };

    const handleSubmit = async () => {
        if (!name.trim()) {
            toast.warning('Tên danh mục không được để trống.');
            return;
        }

        const budgetValue = budgetAmount ? parseFloat(budgetAmount) : null;
        const incomeTargetValue = incomeTargetAmount ? parseFloat(incomeTargetAmount) : null;

        // Kiểm tra số tiền lớn
        let needsConfirmation = false;
        let confirmMessage = '';

        if (budgetValue) {
            const budgetCheck = checkLargeAmount(budgetValue, 'Ngân sách chi tiêu');
            if (budgetCheck.isLarge) {
                needsConfirmation = true;
                confirmMessage = budgetCheck.message;
            }
        }

        if (incomeTargetValue && !needsConfirmation) {
            const incomeCheck = checkLargeAmount(incomeTargetValue, 'Mục tiêu thu nhập');
            if (incomeCheck.isLarge) {
                needsConfirmation = true;
                confirmMessage = incomeCheck.message;
            }
        }

        // Nếu cần xác nhận, hiển thị dialog
        if (needsConfirmation) {
            setPendingData({
                name,
                description,
                budgetAmount: budgetValue,
                incomeTargetAmount: incomeTargetValue
            });
            setShowConfirmDialog(true);
            return;
        }

        // Tiến hành submit nếu không cần xác nhận
        await submitData({
            name,
            description,
            budgetAmount: budgetValue,
            incomeTargetAmount: incomeTargetValue
        });
    };

    const submitData = async (data) => {
        setLoading(true);
        const requestData = {
            name: data.name,
            description: data.description,
            budgetAmount: data.budgetAmount,
            budgetPeriod: data.budgetAmount ? 'MONTHLY' : null,
            incomeTargetAmount: data.incomeTargetAmount,
            incomeTargetPeriod: data.incomeTargetAmount ? 'MONTHLY' : null,
        };

        try {
            if (category && category.id) {
                await categoryService.updateCategory(category.id, requestData);
                toast.success('Cập nhật danh mục thành công!');
            } else {
                await categoryService.createCategory(requestData);
                toast.success('Thêm danh mục thành công!');
            }
            onCategoryUpdated();
            handleClose();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra.');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setName('');
        setDescription('');
        setBudgetAmount('');
        setIncomeTargetAmount('');
        setShowConfirmDialog(false);
        setPendingData(null);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader><DialogTitle>{category?.id ? 'Chỉnh Sửa' : 'Thêm'} Danh Mục</DialogTitle></DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Tên danh mục</Label>
                        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="VD: Ăn uống, Di chuyển..." />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="budget">Ngân sách chi tiêu hàng tháng (tùy chọn)</Label>
                        <Input id="budget" type="number" value={budgetAmount} onChange={(e) => setBudgetAmount(e.target.value)} placeholder="VD: 5000000" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="incomeTarget">Mục tiêu thu nhập hàng tháng (tùy chọn)</Label>
                        <Input id="incomeTarget" type="number" value={incomeTargetAmount} onChange={(e) => setIncomeTargetAmount(e.target.value)} placeholder="VD: 10000000" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Ghi chú</Label>
                        <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Nhập ghi chú (tùy chọn)" />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={handleClose}>Hủy</Button>
                    <Button onClick={handleSubmit} disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {category?.id ? 'Lưu Thay Đổi' : 'Thêm'}
                    </Button>
                </DialogFooter>
            </DialogContent>
            
            {/* Confirm Dialog cho số tiền lớn */}
            <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Xác nhận số tiền lớn</AlertDialogTitle>
                        <AlertDialogDescription>
                            {pendingData && (
                                <>
                                    {pendingData.budgetAmount && pendingData.budgetAmount > 100000000000 && (
                                        <p>Ngân sách chi tiêu: {pendingData.budgetAmount.toLocaleString('vi-VN')} VND</p>
                                    )}
                                    {pendingData.incomeTargetAmount && pendingData.incomeTargetAmount > 100000000000 && (
                                        <p>Mục tiêu thu nhập: {pendingData.incomeTargetAmount.toLocaleString('vi-VN')} VND</p>
                                    )}
                                    <p className="mt-2">Bạn có chắc chắn muốn tiếp tục với số tiền này?</p>
                                </>
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={async () => {
                                setShowConfirmDialog(false);
                                if (pendingData) {
                                    await submitData(pendingData);
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


const ProgressBar = ({ value, max, variant = 'expense', settings }) => {
    const percentage = max > 0 ? (value / max) * 100 : 0;
    const clampedPercentage = Math.min(Math.max(percentage, 0), 100);

    let colorClass = 'bg-green-500';
    if (variant === 'expense') {
        if (clampedPercentage >= 100) colorClass = 'bg-red-500';
        else if (clampedPercentage > 75) colorClass = 'bg-yellow-500';
        else colorClass = 'bg-blue-500';
    }

    const tooltipContent = variant === 'expense'
        ? `Đã chi: ${formatCurrency(value, 'VND', settings)}`
        : `Đã thu: ${formatCurrency(value, 'VND', settings)}`;

    return (
        <TooltipProvider delayDuration={100}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className="w-full bg-muted rounded-full h-2">
                        <div className={cn("h-2 rounded-full transition-all", colorClass)} style={{ width: `${clampedPercentage}%` }}></div>
                    </div>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{tooltipContent}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

const DeleteCategoryDialog = ({ category, open, onOpenChange, onCategoryDeleted }) => {
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!open) {
            setInputValue('');
        }
    }, [open]);

    if (!category) return null;

    const handleDelete = async () => {
        setLoading(true);
        try {
            await categoryService.deleteCategory(category.id);
            toast.success(`Đã xóa danh mục "${category.name}".`);
            onCategoryDeleted();
            onOpenChange(false);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Không thể xóa danh mục.');
        } finally {
            setLoading(false);
        }
    };

    const isInputMatching = inputValue.trim() === category.name;

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Hành động này không thể hoàn tác. Tất cả các giao dịch thuộc danh mục <span className="font-bold text-foreground">{category.name}</span> sẽ được gỡ bỏ khỏi danh mục này.
                        <br/>
                        Để xác nhận, vui lòng nhập <strong className="text-red-500">{category.name}</strong> vào ô bên dưới.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Nhập tên danh mục để xác nhận"
                    className="mt-2"
                />
                <AlertDialogFooter>
                    <AlertDialogCancel>Hủy</AlertDialogCancel>
                    <AlertDialogAction
                        disabled={!isInputMatching || loading}
                        onClick={handleDelete}
                        className="bg-red-600 hover:bg-red-700"
                    >
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Xóa Danh Mục
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

const CategoryDetailView = ({ category, onClose, onTransactionClick }) => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const { settings } = useSettings();
    const { formatDate } = useDateFormat();
    const { theme } = useTheme();

    useEffect(() => {
        const fetchTransactions = async () => {
            if (!category) return;
            setLoading(true);
            try {
                const response = await categoryService.getTransactionsByCategoryId(category.id);
                setTransactions(response.data.data || []);
            } catch (error) {
                toast.error('Không thể tải chi tiết giao dịch.');
            } finally {
                setLoading(false);
            }
        };
        fetchTransactions();
    }, [category]);

    const { totalIncome, totalExpense } = useMemo(() => {
        return transactions.reduce((acc, tx) => {
            if (tx.type === 'INCOME') {
                acc.totalIncome += tx.amount;
            } else if (tx.type === 'EXPENSE') {
                acc.totalExpense += tx.amount;
            }
            return acc;
        }, { totalIncome: 0, totalExpense: 0 });
    }, [transactions]);

    const chartData = useMemo(() => {
        const data = [];
        if (totalIncome > 0) {
            data.push({ name: 'Tổng Thu', value: totalIncome });
        }
        if (totalExpense > 0) {
            data.push({ name: 'Tổng Chi', value: totalExpense });
        }
        return data;
    }, [totalIncome, totalExpense]);

    const COLORS = ['#10b981', '#ef4444']; // Green for Income, Red for Expense
    const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    const legendTextColor = isDark ? '#a1a1aa' : '#71717a';

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0];
            const total = totalIncome + totalExpense;
            const percentage = total > 0 ? ((data.value / total) * 100).toFixed(1) : 0;
            return (
                <div className="rounded-lg border bg-background p-2 shadow-sm text-sm">
                    <p className="font-bold mb-1">{data.name}</p>
                    <p className="text-foreground">
                        {formatCurrency(data.value, 'VND', settings)}
                        <span className="text-muted-foreground"> ({percentage}%)</span>
                    </p>
                </div>
            );
        }
        return null;
    };

    const hasChartData = totalIncome > 0 || totalExpense > 0;

    return (
        <Card className="mt-6 animate-in fade-in-0 slide-in-from-bottom-5 duration-500">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Chi Tiết Danh Mục: {category.name}</CardTitle>
                    <CardDescription>Tổng quan thu chi và danh sách giao dịch.</CardDescription>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose}><X className="h-4 w-4" /></Button>
            </CardHeader>
            <CardContent>
                {loading ? <div className="text-center py-16"><Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" /></div> : (
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                        <div className="lg:col-span-3">
                            <h3 className="font-semibold mb-4">Lịch sử giao dịch</h3>
                            {transactions.length > 0 ? (
                                <div className="divide-y max-h-96 overflow-y-auto pr-4">
                                    {transactions.map((tx) => (
                                        <div key={tx.id} className="flex items-center justify-between py-4 cursor-pointer hover:bg-muted/50 -mx-4 px-4" onClick={() => onTransactionClick(tx)}>
                                            <div className="flex items-center gap-4">
                                                {tx.type === 'INCOME' ? <ArrowUpCircle className="w-8 h-8 text-green-500 flex-shrink-0" /> : <ArrowDownCircle className="w-8 h-8 text-red-500 flex-shrink-0" />}
                                                <div>
                                                    <p className="font-semibold">{tx.description || (tx.type === 'INCOME' ? 'Khoản thu nhập' : 'Khoản chi tiêu')}</p>
                                                    <p className="text-sm text-muted-foreground">{tx.walletName} • {formatDate(tx.date)}</p>
                                                </div>
                                            </div>
                                            <p className={cn("text-lg font-bold text-right pl-4", tx.type === 'INCOME' ? 'text-green-600' : 'text-red-600')}>
                                                {tx.type === 'INCOME' ? '+' : '-'}{formatCurrency(tx.amount, 'VND', settings)}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-16 border rounded-lg">
                                    <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold">Chưa có giao dịch nào</h3>
                                    <p className="text-muted-foreground text-sm">Chưa có giao dịch nào được ghi nhận cho danh mục này.</p>
                                </div>
                            )}
                        </div>
                        <div className="lg:col-span-2 space-y-6">
                            <h3 className="font-semibold mb-4">Tổng quan</h3>
                            <div className="h-64 relative flex items-center justify-center">
                                {hasChartData ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RechartsPieChart>
                                            <Pie
                                                data={chartData}
                                                dataKey="value"
                                                nameKey="name"
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={50}
                                                outerRadius={80}
                                                paddingAngle={5}
                                                labelLine={false}
                                            >
                                                {chartData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <RechartsTooltip content={<CustomTooltip />} />
                                            <Legend
                                                verticalAlign="bottom"
                                                iconSize={10}
                                                wrapperStyle={{ fontSize: '12px', color: legendTextColor }}
                                                formatter={(value, entry) => {
                                                    const total = totalIncome + totalExpense;
                                                    const percentage = total > 0 ? ((entry.payload.value / total) * 100).toFixed(1) : 0;
                                                    return <span style={{ color: entry.color }}>{value} ({percentage}%)</span>;
                                                }}
                                            />
                                        </RechartsPieChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="text-center text-muted-foreground">
                                        <PieChart className="w-12 h-12 mx-auto mb-2" />
                                        <p>Chưa có dữ liệu thu chi.</p>
                                    </div>
                                )}
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center p-3 bg-muted rounded-md text-sm">
                                    <span>Tổng Thu</span>
                                    <span className="font-bold text-green-600">{formatCurrency(totalIncome, 'VND', settings)}</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-muted rounded-md text-sm">
                                    <span>Tổng Chi</span>
                                    <span className="font-bold text-red-500">{formatCurrency(totalExpense, 'VND', settings)}</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-muted rounded-md border-t text-sm">
                                    <span>Cân Bằng</span>
                                    <span className={cn("font-bold", (totalIncome - totalExpense) >= 0 ? 'text-foreground' : 'text-red-500')}>{formatCurrency(totalIncome - totalExpense, 'VND', settings)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

const ManageCategories = ({ onAddTransaction, refreshTrigger, onTransactionClick, onViewCategory, initialCategoryIdToView, onCategoryViewed, autoOpenAddModal, onAutoModalOpened }) => {
    const [categories, setCategories] = useState([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [detailedCategory, setDetailedCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const { settings } = useSettings();
    const { currentWallet } = useContext(WalletContext);
    
    // Kiểm tra quyền của người dùng với ví hiện tại
    const isShared = !!currentWallet?.sharedBy;
    const canAddTransaction = isShared ? ['EDIT', 'OWNER'].includes(currentWallet?.permissionLevel) : true;

    // Generate random soft colors for category borders
    const generateSoftColor = (id) => {
        const colors = [
            'border-t-blue-200 bg-blue-50/30 dark:border-t-blue-400 dark:bg-blue-900/10',
            'border-t-green-200 bg-green-50/30 dark:border-t-green-400 dark:bg-green-900/10',
            'border-t-purple-200 bg-purple-50/30 dark:border-t-purple-400 dark:bg-purple-900/10',
            'border-t-pink-200 bg-pink-50/30 dark:border-t-pink-400 dark:bg-pink-900/10',
            'border-t-yellow-200 bg-yellow-50/30 dark:border-t-yellow-400 dark:bg-yellow-900/10',
            'border-t-indigo-200 bg-indigo-50/30 dark:border-t-indigo-400 dark:bg-indigo-900/10',
            'border-t-red-200 bg-red-50/30 dark:border-t-red-400 dark:bg-red-900/10',
            'border-t-teal-200 bg-teal-50/30 dark:border-t-teal-400 dark:bg-teal-900/10',
            'border-t-orange-200 bg-orange-50/30 dark:border-t-orange-400 dark:bg-orange-900/10',
            'border-t-cyan-200 bg-cyan-50/30 dark:border-t-cyan-400 dark:bg-cyan-900/10',
        ];
        return colors[id % colors.length];
    };

    const [emblaRef, emblaApi] = useEmblaCarousel({
        align: 'start',
        containScroll: 'trimSnaps'
    });
    const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
    const [nextBtnEnabled, setNextBtnEnabled] = useState(false);

    const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setPrevBtnEnabled(emblaApi.canScrollPrev());
        setNextBtnEnabled(emblaApi.canScrollNext());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        emblaApi.on('select', onSelect);
        emblaApi.on('reInit', onSelect);
        return () => emblaApi.off('select', onSelect);
    }, [emblaApi, onSelect]);

    const fetchCategories = useCallback(async () => {
        setLoading(true);
        try {
            const response = await categoryService.getCategories();
            setCategories(response.data.data || []);
        } catch (error) {
            toast.error('Không thể tải danh sách danh mục.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories, refreshTrigger]);

    // Clear local detailed category if parent is handling category viewing
    useEffect(() => {
        if (onViewCategory && detailedCategory) {
            setDetailedCategory(null);
        }
    }, [onViewCategory]);

    useEffect(() => {
        if (initialCategoryIdToView && categories.length > 0) {
            const categoryToView = categories.find(cat => String(cat.id) === String(initialCategoryIdToView));
            if (categoryToView) {
                setDetailedCategory(categoryToView);
                if (onCategoryViewed) {
                    onCategoryViewed();
                }
            }
        }
    }, [categories, initialCategoryIdToView, onCategoryViewed]);

    useEffect(() => {
        if (autoOpenAddModal && !loading) {
            handleOpenEditModal();
            // Call callback to clean up URL parameters
            if (onAutoModalOpened) {
                onAutoModalOpened();
            }
        }
    }, [autoOpenAddModal, loading]);

    const handleOpenEditModal = (category = null) => {
        setSelectedCategory(category);
        setIsEditModalOpen(true);
    };

    const handleOpenDeleteAlert = (category) => {
        setSelectedCategory(category);
        setIsDeleteAlertOpen(true);
    };

    const handleViewDetails = (category) => {
        // Use the parent's onViewCategory if available (from Transactions.jsx)
        if (onViewCategory) {
            onViewCategory(category);
        } else {
            // Fallback to local state management
            if (detailedCategory && detailedCategory.id === category.id) {
                setDetailedCategory(null);
            } else {
                setDetailedCategory(category);
            }
        }
    };

    return (
        <>
            <div className="flex items-center justify-between pb-4 border-b">
                <h2 className="text-2xl font-bold tracking-tight text-green-600">{`Tổng quan Danh mục (${categories.length})`}</h2>
                <Button onClick={() => handleOpenEditModal()} className="rounded-md">
                    <PlusCircle className="mr-2 h-4 w-4" /> Thêm Danh Mục
                </Button>
            </div>

            {loading ? <div className="text-center py-8"><Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" /></div> :
                categories.length === 0 ? (
                    <Card className="mt-6">
                        <CardContent className="flex flex-col items-center justify-center text-center p-10">
                            <BadgePlus className="w-12 h-12 text-muted-foreground/50 mb-4" />
                            <h3 className="text-lg font-semibold">Chưa có danh mục nào</h3>
                            <p className="text-muted-foreground text-sm">Hãy bắt đầu bằng cách thêm danh mục đầu tiên.</p>
                            <Button onClick={() => handleOpenEditModal()} className="mt-4 rounded-md">
                                <PlusCircle className="mr-2 h-4 w-4" /> Thêm Danh Mục Đầu Tiên
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="relative mt-6">
                        <div className="embla">
                            <div className="embla__viewport" ref={emblaRef}>
                                <div className="embla__container">
                                    {categories.map(cat => {
                                        const hasBudget = cat.budgetAmount && cat.budgetAmount > 0;
                                        const hasSpent = cat.spentAmount > 0;
                                        const showExpenseTracker = hasBudget || hasSpent;
                                        const hasIncomeTarget = cat.incomeTargetAmount && cat.incomeTargetAmount > 0;
                                        const hasEarned = cat.earnedAmount > 0;
                                        const showIncomeTracker = hasIncomeTarget || hasEarned;
                                        return (
                                            <div className="embla__slide" key={cat.id}>
                                                <Card className={`flex flex-col h-full border-t-4 ${generateSoftColor(cat.id)}`}>
                                                    <CardHeader className="flex flex-row items-start justify-between">
                                                        <div>
                                                            <CardTitle
                                                                onClick={() => handleViewDetails(cat)}
                                                                className="cursor-pointer hover:text-primary transition-colors"
                                                            >
                                                                {cat.name}
                                                            </CardTitle>
                                                            {cat.description && <CardDescription>{cat.description}</CardDescription>}
                                                        </div>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="h-4 w-4"/></Button></DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem onSelect={() => handleViewDetails(cat)}><EyeIcon className="mr-2 h-4 w-4"/>Xem Chi Tiết</DropdownMenuItem>
                                                                {canAddTransaction && (
                                                                    <DropdownMenuItem onSelect={() => onAddTransaction(String(cat.id))}><ArrowRightLeft className="mr-2 h-4 w-4"/>Thêm Giao Dịch</DropdownMenuItem>
                                                                )}
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem onSelect={() => handleOpenEditModal(cat)}><Edit className="mr-2 h-4 w-4"/>Chỉnh sửa</DropdownMenuItem>
                                                                <DropdownMenuItem onSelect={() => handleOpenDeleteAlert(cat)} className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/50"><Trash2 className="mr-2 h-4 w-4"/>Xóa</DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </CardHeader>
                                                    <CardContent className="space-y-4">
                                                        {showExpenseTracker && (
                                                                <div className="space-y-2">
                                                                    <div className="flex justify-between items-center">
                                                                        <p className="text-sm font-semibold flex items-center"><TrendingDown className="w-4 h-4 mr-2 text-red-500" /> Ngân sách chi tiêu</p>
                                                                        <p className="text-sm font-bold">
                                                                            {hasBudget ? formatCurrency(cat.budgetAmount, 'VND', settings) : <span className="text-muted-foreground italic text-xs">Không đặt</span>}
                                                                        </p>
                                                                    </div>
                                                                    <ProgressBar value={cat.spentAmount} max={hasBudget ? cat.budgetAmount : cat.spentAmount} variant="expense" settings={settings} />
                                                                    <div className="text-xs text-muted-foreground flex justify-between">
                                                                        <span>Đã chi: {formatCurrency(cat.spentAmount, 'VND', settings)}</span>
                                                                        {hasBudget && <span>Còn lại: {formatCurrency(cat.remainingAmount, 'VND', settings)}</span>}
                                                                    </div>
                                                                </div>
                                                            )}
                                                            {showIncomeTracker && (
                                                                <div className="space-y-2">
                                                                    <div className="flex justify-between items-center">
                                                                        <p className="text-sm font-semibold flex items-center"><TrendingUp className="w-4 h-4 mr-2 text-green-500" /> Mục tiêu thu nhập</p>
                                                                        <p className="text-sm font-bold">
                                                                            {hasIncomeTarget ? formatCurrency(cat.incomeTargetAmount, 'VND', settings) : <span className="text-muted-foreground italic text-xs">Không đặt</span>}
                                                                        </p>
                                                                    </div>
                                                                    <ProgressBar value={cat.earnedAmount} max={hasIncomeTarget ? cat.incomeTargetAmount : cat.earnedAmount} variant="income" settings={settings} />
                                                                    <div className="text-xs text-muted-foreground flex justify-between">
                                                                        <span>Đã thu: {formatCurrency(cat.earnedAmount, 'VND', settings)}</span>
                                                                    </div>
                                                                </div>
                                                            )}
                                                            {!showExpenseTracker && !showIncomeTracker && (
                                                                <p className="text-sm text-muted-foreground italic">Chưa đặt ngân sách hoặc mục tiêu</p>
                                                            )}
                                                    </CardContent>
                                                </Card>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                        {categories.length > 3 && (
                            <>
                                <Button onClick={scrollPrev} disabled={!prevBtnEnabled} variant="outline" size="icon" className="h-9 w-9 rounded-full absolute -left-4 top-1/2 -translate-y-1/2 z-10 opacity-75 hover:opacity-100 disabled:opacity-0 transition-all"><ChevronLeft className="h-4 w-4" /></Button>
                                <Button onClick={scrollNext} disabled={!nextBtnEnabled} variant="outline" size="icon" className="h-9 w-9 rounded-full absolute -right-4 top-1/2 -translate-y-1/2 z-10 opacity-75 hover:opacity-100 disabled:opacity-0 transition-all"><ChevronRight className="h-4 w-4" /></Button>
                            </>
                        )}
                    </div>
                )}

            <EditCategoryModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} onCategoryUpdated={fetchCategories} category={selectedCategory} />
            <DeleteCategoryDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen} category={selectedCategory} onCategoryDeleted={fetchCategories} />
            {/* Only show local CategoryDetailView if no parent onViewCategory handler is provided */}
            {!onViewCategory && detailedCategory && (
                <CategoryDetailView
                    category={detailedCategory}
                    onClose={() => setDetailedCategory(null)}
                    onTransactionClick={onTransactionClick}
                />
            )}
        </>
    );
};

export default ManageCategories;    