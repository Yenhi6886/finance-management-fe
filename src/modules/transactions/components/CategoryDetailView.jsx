import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { X, Loader2, FileText, ArrowUpCircle, ArrowDownCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { categoryService } from '../services/categoryService';
import { toast } from 'sonner';
import { useSettings } from '../../../shared/contexts/SettingsContext';
import { formatCurrency, formatDate } from '../../../shared/utils/formattingUtils';
import { cn } from '../../../lib/utils';

const CategoryDetailView = ({ category, onClose, onTransactionClick }) => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const { settings } = useSettings();
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
                                                    <p className="text-sm text-muted-foreground">{tx.walletName} • {formatDate(tx.date, settings)}</p>
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
                            <div className="h-80 relative flex items-center justify-center">
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
                                                outerRadius={120}
                                                paddingAngle={5}
                                                labelLine={false}
                                            >
                                                {chartData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip content={<CustomTooltip />} />
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

export default CategoryDetailView;