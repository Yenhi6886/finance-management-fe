import React, { useState, useEffect, useCallback, useMemo } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card.jsx';
import { Button } from '../../../components/ui/button.jsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../../components/ui/dialog.jsx';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../../../components/ui/alert-dialog.jsx';
import { Input } from '../../../components/ui/input.jsx';
import { Label } from '../../../components/ui/label.jsx';
import { categoryService } from '../services/categoryService.js';
import { toast } from 'sonner';
import { PlusCircle, Trash2, BadgePlus, Edit, MoreVertical, TrendingUp, TrendingDown, ArrowRightLeft, ChevronLeft, ChevronRight, EyeIcon, X, FileText, ArrowUpCircle, ArrowDownCircle, PieChart } from 'lucide-react';
import { useSettings } from '../../../shared/contexts/SettingsContext.jsx';
import { useTheme } from '../../../shared/contexts/ThemeContext.jsx';
import { useLanguage } from '../../../shared/contexts/LanguageContext.jsx';
import { formatCurrency } from '../../../shared/utils/formattingUtils.js';
import { useDateFormat } from '../../../shared/hooks/useDateFormat.js';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '../../../components/ui/dropdown-menu.jsx';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../../components/ui/tooltip.jsx';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { cn } from '../../../lib/utils.js';
import { LoadingSpinner } from '../../../components/Loading.jsx';

const EditCategoryModal = ({ isOpen, onClose, onCategoryUpdated, category }) => {
    const { t } = useLanguage();
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
                message: fieldName === t('transactions.categories.form.budgetAmount') 
                    ? t('transactions.categories.confirmLargeAmount.budgetMessage', { amount: amountValue.toLocaleString('vi-VN') })
                    : t('transactions.categories.confirmLargeAmount.incomeMessage', { amount: amountValue.toLocaleString('vi-VN') })
            };
        }
        return { isLarge: false };
    };

    const handleSubmit = async () => {
        if (!name.trim()) {
            toast.warning(t('transactions.categories.form.validation.nameRequired'));
            return;
        }

        const budgetValue = budgetAmount ? parseFloat(budgetAmount) : null;
        const incomeTargetValue = incomeTargetAmount ? parseFloat(incomeTargetAmount) : null;

        // Kiểm tra số tiền lớn
        let needsConfirmation = false;
        let confirmMessage = '';

        if (budgetValue) {
            const budgetCheck = checkLargeAmount(budgetValue, t('transactions.categories.form.budgetAmount'));
            if (budgetCheck.isLarge) {
                needsConfirmation = true;
                confirmMessage = budgetCheck.message;
            }
        }

        if (incomeTargetValue && !needsConfirmation) {
            const incomeCheck = checkLargeAmount(incomeTargetValue, t('transactions.categories.form.incomeTargetAmount'));
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
                toast.success(t('transactions.messages.categoryUpdated'));
            } else {
                await categoryService.createCategory(requestData);
                toast.success(t('transactions.messages.categoryAdded'));
            }
            onCategoryUpdated();
            handleClose();
        } catch (error) {
            toast.error(error.response?.data?.message || t('transactions.messages.errors.general'));
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
                <DialogHeader>
                    <DialogTitle>
                        {category?.id ? t('transactions.categories.editCategory') : t('transactions.categories.addCategory')}
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">{t('transactions.categories.form.name')}</Label>
                        <Input 
                            id="name" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            placeholder={t('transactions.categories.form.namePlaceholder')} 
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="budget">{t('transactions.categories.form.budgetAmount')}</Label>
                        <Input 
                            id="budget" 
                            type="number" 
                            value={budgetAmount} 
                            onChange={(e) => setBudgetAmount(e.target.value)} 
                            placeholder={t('transactions.categories.form.budgetAmountPlaceholder')} 
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="incomeTarget">{t('transactions.categories.form.incomeTargetAmount')}</Label>
                        <Input 
                            id="incomeTarget" 
                            type="number" 
                            value={incomeTargetAmount} 
                            onChange={(e) => setIncomeTargetAmount(e.target.value)} 
                            placeholder={t('transactions.categories.form.incomeTargetAmountPlaceholder')} 
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">{t('transactions.categories.form.description')}</Label>
                        <Input 
                            id="description" 
                            value={description} 
                            onChange={(e) => setDescription(e.target.value)} 
                            placeholder={t('transactions.categories.form.descriptionPlaceholder')} 
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={handleClose}>
                        {t('transactions.categories.form.cancel')}
                    </Button>
                    <Button onClick={handleSubmit} disabled={loading}>
                        {loading && <LoadingSpinner size="md" />}
                        {category?.id ? t('transactions.categories.form.edit') : t('transactions.categories.form.add')}
                    </Button>
                </DialogFooter>
            </DialogContent>
            
            {/* Confirm Dialog cho số tiền lớn */}
            <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t('transactions.categories.confirmLargeAmount.title')}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {pendingData && (
                                <>
                                    {pendingData.budgetAmount && pendingData.budgetAmount > 100000000000 && (
                                        <p>{t('transactions.categories.form.budgetAmount')}: {pendingData.budgetAmount.toLocaleString('vi-VN')} VND</p>
                                    )}
                                    {pendingData.incomeTargetAmount && pendingData.incomeTargetAmount > 100000000000 && (
                                        <p>{t('transactions.categories.form.incomeTargetAmount')}: {pendingData.incomeTargetAmount.toLocaleString('vi-VN')} VND</p>
                                    )}
                                    <p className="mt-2">{t('transactions.categories.confirmLargeAmount.confirmMessage')}</p>
                                </>
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>{t('transactions.categories.confirmLargeAmount.cancel')}</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={async () => {
                                setShowConfirmDialog(false);
                                if (pendingData) {
                                    await submitData(pendingData);
                                }
                            }}
                        >
                            {t('transactions.categories.confirmLargeAmount.confirm')}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Dialog>
    );
};


const ProgressBar = ({ value, max, variant = 'expense', settings, t }) => {
    const percentage = max > 0 ? (value / max) * 100 : 0;
    const clampedPercentage = Math.min(Math.max(percentage, 0), 100);

    let colorClass = 'bg-green-500';
    if (variant === 'expense') {
        if (clampedPercentage >= 100) colorClass = 'bg-red-500';
        else if (clampedPercentage > 75) colorClass = 'bg-yellow-500';
        else colorClass = 'bg-blue-500';
    }

    const tooltipContent = variant === 'expense'
        ? `${t('transactions.categories.progress.spent')}: ${formatCurrency(value, 'VND', settings)}`
        : `${t('transactions.categories.progress.earned')}: ${formatCurrency(value, 'VND', settings)}`;

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
    const { t } = useLanguage();
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
            toast.success(t('transactions.messages.categoryDeleted'));
            onCategoryDeleted();
            onOpenChange(false);
        } catch (error) {
            toast.error(error.response?.data?.message || t('transactions.messages.errors.deleteCategory'));
        } finally {
            setLoading(false);
        }
    };

    const isInputMatching = inputValue.trim() === category.name;

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{t('transactions.categories.confirmDelete.title')}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {t('transactions.categories.confirmDelete.description', { categoryName: category.name })}
                        <br/>
                        {t('transactions.categories.confirmDelete.instruction', { categoryName: category.name })}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={t('transactions.categories.confirmDelete.inputPlaceholder')}
                    className="mt-2"
                />
                <AlertDialogFooter>
                    <AlertDialogCancel>{t('transactions.categories.confirmDelete.cancel')}</AlertDialogCancel>
                    <AlertDialogAction
                        disabled={!isInputMatching || loading}
                        onClick={handleDelete}
                        className="bg-red-600 hover:bg-red-700"
                    >
                        {loading && <LoadingSpinner size="md" />}
                        {t('transactions.categories.confirmDelete.confirm')}
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
    const { t } = useLanguage();

    useEffect(() => {
        const fetchTransactions = async () => {
            if (!category) return;
            setLoading(true);
            try {
                const response = await categoryService.getTransactionsByCategoryId(category.id);
                setTransactions(response.data.data || []);
            } catch (error) {
                toast.error(t('transactions.messages.errors.loadCategoryDetails'));
            } finally {
                setLoading(false);
            }
        };
        fetchTransactions();
    }, [category, t]);

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
            data.push({ name: t('transactions.categories.summary.totalIncome'), value: totalIncome });
        }
        if (totalExpense > 0) {
            data.push({ name: t('transactions.categories.summary.totalExpense'), value: totalExpense });
        }
        return data;
    }, [totalIncome, totalExpense, t]);

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
                    <CardTitle>{t('transactions.categories.detail.title')}: {category.name}</CardTitle>
                    <CardDescription>{t('transactions.categories.detail.subtitle')}</CardDescription>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose}><X className="h-4 w-4" /></Button>
            </CardHeader>
            <CardContent>
                {loading ? <div className="text-center py-16"><LoadingSpinner size="xl" /></div> : (
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                        <div className="lg:col-span-3">
                            <h3 className="font-semibold mb-4">{t('transactions.categories.summary.history')}</h3>
                            {transactions.length > 0 ? (
                                <div className="divide-y max-h-96 overflow-y-auto pr-4">
                                    {transactions.map((tx) => (
                                        <div key={tx.id} className="flex items-center justify-between py-4 cursor-pointer hover:bg-muted/50 -mx-4 px-4" onClick={() => onTransactionClick(tx)}>
                                            <div className="flex items-center gap-4">
                                                {tx.type === 'INCOME' ? <ArrowUpCircle className="w-8 h-8 text-green-500 flex-shrink-0" /> : <ArrowDownCircle className="w-8 h-8 text-red-500 flex-shrink-0" />}
                                                <div>
                                                    <p className="font-semibold">{tx.description || (tx.type === 'INCOME' ? t('transactions.list.defaultIncome') : t('transactions.list.defaultExpense'))}</p>
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
                                    <h3 className="text-lg font-semibold">{t('transactions.categories.empty.title')}</h3>
                                    <p className="text-muted-foreground text-sm">{t('transactions.categories.empty.subtitle')}</p>
                                </div>
                            )}
                        </div>
                        <div className="lg:col-span-2 space-y-6">
                            <h3 className="font-semibold mb-4">{t('transactions.categories.summary.overview')}</h3>
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
                                        <p>{t('transactions.categories.empty.chart')}</p>
                                    </div>
                                )}
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center p-3 bg-muted rounded-md text-sm">
                                    <span>{t('transactions.categories.summary.totalIncome')}</span>
                                    <span className="font-bold text-green-600">{formatCurrency(totalIncome, 'VND', settings)}</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-muted rounded-md text-sm">
                                    <span>{t('transactions.categories.summary.totalExpense')}</span>
                                    <span className="font-bold text-red-500">{formatCurrency(totalExpense, 'VND', settings)}</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-muted rounded-md border-t text-sm">
                                    <span>{t('transactions.categories.summary.balance')}</span>
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
    const { t } = useLanguage();

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
            toast.error(t('transactions.messages.errors.loadCategories'));
        } finally {
            setLoading(false);
        }
    }, [t]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories, refreshTrigger]);

    // Chia categories thành các nhóm 3 danh mục mỗi slide
    const categorySlides = useMemo(() => {
        const slides = [];
        const categoriesPerSlide = 3;
        
        for (let i = 0; i < categories.length; i += categoriesPerSlide) {
            slides.push(categories.slice(i, i + categoriesPerSlide));
        }
        
        return slides;
    }, [categories]);

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

            {loading ? <div className="flex justify-center py-8"><LoadingSpinner size="xl" /></div> :
                categories.length === 0 ? (
                    <Card className="mt-6">
                        <CardContent className="flex flex-col items-center justify-center text-center p-10">
                            <BadgePlus className="w-12 h-12 text-muted-foreground/50 mb-4" />
                            <h3 className="text-lg font-semibold">{t('transactions.categories.empty.categories')}</h3>
                            <p className="text-muted-foreground text-sm">{t('transactions.categories.empty.categoriesSubtitle')}</p>
                            <Button onClick={() => handleOpenEditModal()} className="mt-4 rounded-md">
                                <PlusCircle className="mr-2 h-4 w-4" /> {t('transactions.categories.addCategory')}
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="relative mt-6">
                        <div className="embla">
                            <div className="embla__viewport" ref={emblaRef}>
                                <div className="embla__container">
                                    {categorySlides.map((slideCategories, slideIndex) => (
                                        <div key={slideIndex} className="embla__slide">
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-1">
                                                {slideCategories.map(cat => {
                                                    const hasBudget = cat.budgetAmount && cat.budgetAmount > 0;
                                                    const hasSpent = cat.spentAmount > 0;
                                                    const showExpenseTracker = hasBudget || hasSpent;
                                                    const hasIncomeTarget = cat.incomeTargetAmount && cat.incomeTargetAmount > 0;
                                                    const hasEarned = cat.earnedAmount > 0;
                                                    const showIncomeTracker = hasIncomeTarget || hasEarned;
                                                    return (
                                                        <Card key={cat.id} className={`flex flex-col h-full border-t-4 ${generateSoftColor(cat.id)}`}>
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
                                                                <DropdownMenuItem onSelect={() => handleViewDetails(cat)}>
                                                                    <EyeIcon className="mr-2 h-4 w-4"/>{t('transactions.categories.viewCategory')}
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem onSelect={() => onAddTransaction(String(cat.id))}>
                                                                    <ArrowRightLeft className="mr-2 h-4 w-4"/>{t('transactions.actions.addExpense')}
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem onSelect={() => handleOpenEditModal(cat)}>
                                                                    <Edit className="mr-2 h-4 w-4"/>{t('transactions.categories.editCategory')}
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem onSelect={() => handleOpenDeleteAlert(cat)} className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/50">
                                                                    <Trash2 className="mr-2 h-4 w-4"/>{t('transactions.categories.deleteCategory')}
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </CardHeader>
                                                    <CardContent className="space-y-4">
                                                        {showExpenseTracker && (
                                                                <div className="space-y-2">
                                                                    <div className="flex justify-between items-center">
                                                                        <p className="text-sm font-semibold flex items-center">
                                                                            <TrendingDown className="w-4 h-4 mr-2 text-red-500" /> 
                                                                            {t('transactions.categories.form.budgetAmount')}
                                                                        </p>
                                                                        <p className="text-sm font-bold">
                                                                            {hasBudget ? formatCurrency(cat.budgetAmount, 'VND', settings) : <span className="text-muted-foreground italic text-xs">{t('transactions.categories.status.notSet')}</span>}
                                                                        </p>
                                                                    </div>
                                                                    <ProgressBar value={cat.spentAmount} max={hasBudget ? cat.budgetAmount : cat.spentAmount} variant="expense" settings={settings} t={t} />
                                                                    <div className="text-xs text-muted-foreground flex justify-between">
                                                                        <span>{t('transactions.categories.progress.spent')}: {formatCurrency(cat.spentAmount, 'VND', settings)}</span>
                                                                        {hasBudget && <span>{t('transactions.categories.progress.remaining')}: {formatCurrency(cat.remainingAmount, 'VND', settings)}</span>}
                                                                    </div>
                                                                </div>
                                                            )}
                                                            {showIncomeTracker && (
                                                                <div className="space-y-2">
                                                                    <div className="flex justify-between items-center">
                                                                        <p className="text-sm font-semibold flex items-center">
                                                                            <TrendingUp className="w-4 h-4 mr-2 text-green-500" /> 
                                                                            {t('transactions.categories.form.incomeTargetAmount')}
                                                                        </p>
                                                                        <p className="text-sm font-bold">
                                                                            {hasIncomeTarget ? formatCurrency(cat.incomeTargetAmount, 'VND', settings) : <span className="text-muted-foreground italic text-xs">{t('transactions.categories.status.notSet')}</span>}
                                                                        </p>
                                                                    </div>
                                                                    <ProgressBar value={cat.earnedAmount} max={hasIncomeTarget ? cat.incomeTargetAmount : cat.earnedAmount} variant="income" settings={settings} t={t} />
                                                                    <div className="text-xs text-muted-foreground flex justify-between">
                                                                        <span>{t('transactions.categories.progress.earned')}: {formatCurrency(cat.earnedAmount, 'VND', settings)}</span>
                                                                    </div>
                                                                </div>
                                                            )}
                                                            {!showExpenseTracker && !showIncomeTracker && (
                                                                <p className="text-sm text-muted-foreground italic">{t('transactions.categories.status.noBudgetOrTarget')}</p>
                                                            )}
                                                        </CardContent>
                                                    </Card>
                                                )
                                            })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        {categorySlides.length > 1 && (
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