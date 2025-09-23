import React from 'react'
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts'
import { useSettings } from '../../../shared/contexts/SettingsContext.jsx'
import { useTheme } from '../../../shared/contexts/ThemeContext.jsx'
import { useLanguage } from '../../../shared/contexts/LanguageContext.jsx'
import { formatCurrency, formatDate } from '../../../shared/utils/formattingUtils.js'

const CustomTooltip = ({ active, payload, label, currency, settings, t }) => {
    if (active && payload && payload.length) {
        return (
            <div className="rounded-lg border bg-background p-2 shadow-sm">
                <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col space-y-1">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              {t('charts.balanceTrend.date')}
            </span>
                        <span className="font-bold text-muted-foreground">
              {formatDate(label, settings)}
            </span>
                    </div>
                    <div className="flex flex-col space-y-1">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              {t('charts.balanceTrend.balance')}
            </span>
                        <span className="font-bold">
              {formatCurrency(payload[0].value, currency, settings)}
            </span>
                    </div>
                </div>
            </div>
        )
    }
    return null
}

const BalanceTrendChart = ({ data, currency }) => {
    const { t } = useLanguage()
    const { settings } = useSettings()
    const { theme } = useTheme()
    const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    const strokeColor = isDark ? '#10B981' : '#059669'
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
    const textColor = isDark ? '#a1a1aa' : '#71717a'

    return (
        <ResponsiveContainer width="100%" height={256}>
            <AreaChart
                data={data}
                margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis
                    dataKey="date"
                    stroke={textColor}
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => formatDate(value, settings)}
                />
                <YAxis
                    stroke={textColor}
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${(value / 1000000).toFixed(0)}tr`}
                />
                <Tooltip
                    content={<CustomTooltip currency={currency} settings={settings} t={t} />}
                    cursor={{ fill: 'rgba(16, 185, 129, 0.1)' }}
                />
                <defs>
                    <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={strokeColor} stopOpacity={0.8}/>
                        <stop offset="95%" stopColor={strokeColor} stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <Area
                    type="monotone"
                    dataKey="balance"
                    stroke={strokeColor}
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorBalance)"
                />
            </AreaChart>
        </ResponsiveContainer>
    )
}

export default BalanceTrendChart