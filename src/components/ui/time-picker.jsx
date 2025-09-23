import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select.jsx';
import { Clock } from 'lucide-react';
import { cn } from '../../lib/utils.js';

export function TimePicker({ value, onChange, className, disabled = false }) {
    // Tạo danh sách giờ (00-23)
    const hours = Array.from({ length: 24 }, (_, i) => 
        String(i).padStart(2, '0')
    );
    
    // Tạo danh sách phút (00-59, với bước nhảy 5 phút để dễ chọn)
    const minutes = Array.from({ length: 12 }, (_, i) => 
        String(i * 5).padStart(2, '0')
    );

    // Parse giá trị hiện tại
    const currentTime = value ? new Date(value) : new Date();
    const currentHour = String(currentTime.getHours()).padStart(2, '0');
    const currentMinute = String(Math.floor(currentTime.getMinutes() / 5) * 5).padStart(2, '0');

    const handleTimeChange = (hour, minute) => {
        if (value) {
            const date = new Date(value);
            date.setHours(parseInt(hour));
            date.setMinutes(parseInt(minute));
            onChange(date);
        } else {
            const now = new Date();
            now.setHours(parseInt(hour));
            now.setMinutes(parseInt(minute));
            onChange(now);
        }
    };

    return (
        <div className={cn("space-y-2", className)}>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Chọn giờ</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="flex-1">
                    <Select 
                        value={currentHour}
                        onValueChange={(hour) => handleTimeChange(hour, currentMinute)}
                        disabled={disabled}
                    >
                        <SelectTrigger className="h-9">
                            <SelectValue placeholder="Giờ" />
                        </SelectTrigger>
                        <SelectContent>
                            {hours.map(hour => (
                                <SelectItem key={hour} value={hour}>
                                    {hour}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <span className="text-muted-foreground">:</span>
                <div className="flex-1">
                    <Select 
                        value={currentMinute}
                        onValueChange={(minute) => handleTimeChange(currentHour, minute)}
                        disabled={disabled}
                    >
                        <SelectTrigger className="h-9">
                            <SelectValue placeholder="Phút" />
                        </SelectTrigger>
                        <SelectContent>
                            {minutes.map(minute => (
                                <SelectItem key={minute} value={minute}>
                                    {minute}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="text-xs text-muted-foreground">
                Thời gian hiện tại: {currentHour}:{currentMinute}
            </div>
        </div>
    );
}
