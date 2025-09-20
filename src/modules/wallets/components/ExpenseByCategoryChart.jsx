import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { formatCurrency } from '../../../shared/utils/formattingUtils'
import { useSettings } from '../../../shared/contexts/SettingsContext'
import { useTheme } from '../../../shared/contexts/ThemeContext'

const COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
  '#F7DC6F', '#BB8FCE', '#85C1E9', '#F8C471', '#82E0AA'
]

const ExpenseByCategoryChart = ({ data, currency, totalExpense }) => {
  const { settings } = useSettings()
  const { theme } = useTheme()
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const entry = payload[0]
      const percentage = totalExpense > 0 ? ((entry.value / totalExpense) * 100).toFixed(1) : 0

      return (
          <div className="rounded-lg border bg-background p-2 shadow-sm text-sm">
            <p className="font-bold mb-1">{entry.payload.categoryName}</p>
            <p className="text-foreground">
              {formatCurrency(entry.value, currency, settings)}
              <span className="text-muted-foreground"> ({percentage}%)</span>
            </p>
          </div>
      )
    }
    return null
  }

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (percent < 0.05) return null

    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
        <text
            x={x}
            y={y}
            fill="white"
            textAnchor={x > cx ? 'start' : 'end'}
            dominantBaseline="central"
            className="text-xs font-semibold"
        >
          {`${(percent * 100).toFixed(0)}%`}
        </text>
    )
  }

  const legendTextColor = isDark ? '#a1a1aa' : '#71717a';

  return (
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={<CustomLabel />}
                outerRadius={80}
                innerRadius={40}
                fill="#8884d8"
                dataKey="totalAmount"
                nameKey="categoryName"
            >
              {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
                iconSize={10}
                layout="vertical"
                verticalAlign="middle"
                align="right"
                wrapperStyle={{ fontSize: '12px', lineHeight: '20px', color: legendTextColor }}
                formatter={(value, entry) => (
                    <span style={{ color: entry.color || legendTextColor }}>{value}</span>
                )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
  )
}

export default ExpenseByCategoryChart