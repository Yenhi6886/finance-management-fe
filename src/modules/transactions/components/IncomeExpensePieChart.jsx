import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useSettings } from '../../../shared/contexts/SettingsContext.jsx';
import { useTheme } from '../../../shared/contexts/ThemeContext.jsx';
import { formatCurrency } from '../../../shared/utils/formattingUtils.js';

const COLORS = ['#10b981', '#ef4444']; // Green for Income, Red for Expense

const CustomTooltip = ({ active, payload, settings }) => {
    if (active && payload && payload.length) {
        const data = payload[0];
        return (
            <div className="rounded-lg border bg-background p-2 shadow-sm text-sm">
                <p className="font-bold mb-1">{data.name}</p>
                <p className="text-foreground">
                    {formatCurrency(data.value, 'VND', settings)}
                </p>
            </div>
        );
    }
    return null;
};

const IncomeExpensePieChart = ({ data, totalIncome, totalExpense }) => {
    const { settings } = useSettings();
    const { theme } = useTheme();
    const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    const legendTextColor = isDark ? '#a1a1aa' : '#71717a';

    const total = totalIncome + totalExpense;

    return (
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    labelLine={false}
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip content={<CustomTooltip settings={settings} />} />
                <Legend
                    verticalAlign="bottom"
                    iconSize={10}
                    wrapperStyle={{ fontSize: '12px', color: legendTextColor }}
                    formatter={(value, entry) => {
                        const percentage = total > 0 ? ((entry.payload.value / total) * 100).toFixed(1) : 0;
                        return <span style={{ color: entry.color }}>{value} ({percentage}%)</span>;
                    }}
                />
            </PieChart>
        </ResponsiveContainer>
    );
};

export default IncomeExpensePieChart;