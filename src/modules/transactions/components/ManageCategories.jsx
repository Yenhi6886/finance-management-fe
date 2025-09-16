import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../../components/ui/dialog';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { categoryService } from '../services/categoryService';
import { toast } from 'sonner';
import { PlusCircle, Trash2, Loader2, BadgePlus, Edit, MoreVertical, TrendingUp, TrendingDown } from 'lucide-react';
import { useSettings } from '../../../shared/contexts/SettingsContext';
import { formatCurrency } from '../../../shared/utils/formattingUtils.js';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../../components/ui/dropdown-menu';
import { cn } from '../../../lib/utils';

const EditCategoryModal = ({ isOpen, onClose, onCategoryUpdated, category }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [budgetAmount, setBudgetAmount] = useState('');
    const [incomeTargetAmount, setIncomeTargetAmount] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (category) {
            setName(category.name || '');
            setDescription(category.description || '');
            setBudgetAmount(category.budgetAmount || '');
            setIncomeTargetAmount(category.incomeTargetAmount || '');
        }
    }, [category]);

    const handleSubmit = async () => {
        if (!name.trim()) {
            toast.warning('Tên danh mục không được để trống.');
            return;
        }
        setLoading(true);
        const budgetValue = budgetAmount ? parseFloat(budgetAmount) : null;
        const incomeTargetValue = incomeTargetAmount ? parseFloat(incomeTargetAmount) : null;

        const requestData = {
            name,
            description,
            budgetAmount: budgetValue,
            budgetPeriod: budgetValue ? 'MONTHLY' : null,
            incomeTargetAmount: incomeTargetValue,
            incomeTargetPeriod: incomeTargetValue ? 'MONTHLY' : null,
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
        </Dialog>
    );
};


const ProgressBar = ({ value, max, variant = 'expense' }) => {
    const percentage = max > 0 ? (value / max) * 100 : 0;
    const clampedPercentage = Math.min(Math.max(percentage, 0), 100);

    let colorClass = 'bg-green-500'; // Default for income
    if (variant === 'expense') {
        if (clampedPercentage >= 100) colorClass = 'bg-red-500';
        else if (clampedPercentage > 75) colorClass = 'bg-yellow-500';
        else colorClass = 'bg-blue-500';
    }

    return (
        <div className="w-full bg-muted rounded-full h-2">
            <div className={cn("h-2 rounded-full transition-all", colorClass)} style={{ width: `${clampedPercentage}%` }}></div>
        </div>
    );
};

const ManageCategories = () => {
    const [categories, setCategories] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const { settings } = useSettings();

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const response = await categoryService.getCategories();
            setCategories(response.data.data || []);
        } catch (error) {
            toast.error('Không thể tải danh sách danh mục.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleOpenModal = (category = null) => {
        setSelectedCategory(category);
        setIsModalOpen(true);
    };

    return (
        <>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold tracking-tight text-green-600">Quản Lý Danh Mục</h2>
                <Button onClick={() => handleOpenModal()} className="rounded-md">
                    <PlusCircle className="mr-2 h-4 w-4" /> Thêm Danh Mục
                </Button>
            </div>

            {loading ? <div className="text-center py-8"><Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" /></div> :
                categories.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center text-center p-10">
                            <BadgePlus className="w-12 h-12 text-muted-foreground/50 mb-4" />
                            <h3 className="text-lg font-semibold">Chưa có danh mục nào</h3>
                            <p className="text-muted-foreground text-sm">Hãy bắt đầu bằng cách thêm danh mục đầu tiên.</p>
                            <Button onClick={() => handleOpenModal()} className="mt-4 rounded-md">
                                <PlusCircle className="mr-2 h-4 w-4" /> Thêm Danh Mục Đầu Tiên
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categories.map(cat => (
                            <Card key={cat.id}>
                                <CardHeader className="flex flex-row items-start justify-between">
                                    <div>
                                        <CardTitle>{cat.name}</CardTitle>
                                        {cat.description && <CardDescription>{cat.description}</CardDescription>}
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="h-4 w-4"/></Button></DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onSelect={() => handleOpenModal(cat)}><Edit className="mr-2 h-4 w-4"/>Chỉnh sửa</DropdownMenuItem>
                                            <DropdownMenuItem className="text-red-600"><Trash2 className="mr-2 h-4 w-4"/>Xóa</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {cat.budgetAmount > 0 && (
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <p className="text-sm font-semibold flex items-center"><TrendingDown className="w-4 h-4 mr-2 text-red-500" /> Ngân sách chi tiêu</p>
                                                <p className="text-sm font-bold">{formatCurrency(cat.budgetAmount, 'VND', settings)}</p>
                                            </div>
                                            <ProgressBar value={cat.spentAmount} max={cat.budgetAmount} variant="expense"/>
                                            <div className="text-xs text-muted-foreground flex justify-between">
                                                <span>Đã chi: {formatCurrency(cat.spentAmount, 'VND', settings)}</span>
                                                <span>Còn lại: {formatCurrency(cat.remainingAmount, 'VND', settings)}</span>
                                            </div>
                                        </div>
                                    )}
                                    {cat.incomeTargetAmount > 0 && (
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <p className="text-sm font-semibold flex items-center"><TrendingUp className="w-4 h-4 mr-2 text-green-500" /> Mục tiêu thu nhập</p>
                                                <p className="text-sm font-bold">{formatCurrency(cat.incomeTargetAmount, 'VND', settings)}</p>
                                            </div>
                                            <ProgressBar value={cat.earnedAmount} max={cat.incomeTargetAmount} variant="income" />
                                            <div className="text-xs text-muted-foreground flex justify-between">
                                                <span>Đã thu: {formatCurrency(cat.earnedAmount, 'VND', settings)}</span>
                                            </div>
                                        </div>
                                    )}
                                    {!(cat.budgetAmount > 0) && !(cat.incomeTargetAmount > 0) && (
                                        <p className="text-sm text-muted-foreground italic">Chưa đặt ngân sách hoặc mục tiêu</p>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

            <EditCategoryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onCategoryUpdated={fetchCategories} category={selectedCategory} />
        </>
    );
};

export default ManageCategories;