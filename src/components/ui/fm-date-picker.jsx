import React from "react"
import DatePicker from "react-datepicker"
import { vi } from "date-fns/locale"
import { format } from "date-fns"
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react"
import { cn } from "../../lib/utils.js"
import "react-datepicker/dist/react-datepicker.css"
import "./date-picker.css"

export function FMDatePicker({ 
    value, 
    onChange, 
    placeholder = "Chọn ngày", 
    className,
    showMonthYearPicker = false,
    dateFormat = "dd/MM/yyyy",
    theme = "default" // "default" or "green"
}) {
    const selected = value ? (value instanceof Date ? value : new Date(value)) : null
    const themeClass = theme === "green" ? "budget-green" : ""
    
    return (
        <div className={cn("w-full", className)}>
            <div className="relative">
                <DatePicker
                    selected={selected}
                    onChange={(d) => onChange(d)}
                    placeholderText={placeholder}
                    dateFormat={dateFormat}
                    locale={vi}
                    showMonthYearPicker={showMonthYearPicker}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pr-9 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    calendarClassName={cn("fm-calendar hide-month", themeClass)}
                    popperClassName={cn("fm-popper", themeClass)}
                    showPopperArrow={false}
                    renderCustomHeader={showMonthYearPicker ? undefined : ({ date, decreaseMonth, increaseMonth, prevMonthButtonDisabled, nextMonthButtonDisabled }) => (
                        <div className="flex items-center justify-between px-3 pt-3">
                            <button type="button" onClick={decreaseMonth} disabled={prevMonthButtonDisabled} className="h-7 w-7 flex items-center justify-center rounded-md border hover:bg-accent disabled:opacity-40">
                                <ChevronLeft className="h-4 w-4" />
                            </button>
                            <span className="text-sm font-semibold">{format(date, "MMMM yyyy", { locale: vi })}</span>
                            <button type="button" onClick={increaseMonth} disabled={nextMonthButtonDisabled} className="h-7 w-7 flex items-center justify-center rounded-md border hover:bg-accent disabled:opacity-40">
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    )}
                />
                <CalendarIcon className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-60" />
            </div>
        </div>
    )
}
