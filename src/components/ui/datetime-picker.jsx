import React from 'react';
import { FMDatePicker } from './fm-date-picker.jsx';
import { TimePicker } from './time-picker.jsx';
import { cn } from '../../lib/utils.js';

export function DateTimePicker({ 
    value, 
    onChange, 
    placeholder = "Chọn ngày và giờ",
    className,
    dateFormat = "dd/MM/yyyy",
    theme = "default",
    showTimePicker = true,
    disabled = false
}) {
    const handleDateChange = (selectedDate) => {
        if (selectedDate) {
            // Nếu có giá trị hiện tại, giữ nguyên giờ phút
            if (value) {
                const currentDate = new Date(value);
                selectedDate.setHours(currentDate.getHours());
                selectedDate.setMinutes(currentDate.getMinutes());
                selectedDate.setSeconds(0);
                selectedDate.setMilliseconds(0);
            } else {
                // Nếu không có giá trị hiện tại, đặt giờ hiện tại
                const now = new Date();
                selectedDate.setHours(now.getHours());
                selectedDate.setMinutes(now.getMinutes());
                selectedDate.setSeconds(0);
                selectedDate.setMilliseconds(0);
            }
            onChange(selectedDate);
        } else {
            onChange(null);
        }
    };

    const handleTimeChange = (updatedDate) => {
        onChange(updatedDate);
    };

    return (
        <div className={cn("space-y-3", className)}>
            {/* Date Picker */}
            <FMDatePicker
                value={value}
                onChange={handleDateChange}
                placeholder={placeholder}
                dateFormat={dateFormat}
                theme={theme}
                disabled={disabled}
            />
            
            {/* Time Picker */}
            {showTimePicker && (
                <TimePicker
                    value={value}
                    onChange={handleTimeChange}
                    disabled={disabled}
                />
            )}
        </div>
    );
}
