import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { useTheme } from '../../../shared/contexts/ThemeContext'
import { cn } from '../../../lib/utils'
import { Sun, Moon, Laptop, Palette, Languages, DollarSign, Check, Info, RefreshCw, Loader2, Calendar} from 'lucide-react'
import { toast } from 'sonner'
import { useSettings } from '../../../shared/contexts/SettingsContext'

const InterfaceSettings = () => {
    const { theme, setTheme } = useTheme()
    const [primaryColor, setPrimaryColor] = useState('hong')

    const themeOptions = [
        { id: 'light', name: 'Sáng', description: 'Giao diện sáng cho ban ngày', icon: Sun },
        { id: 'dark', name: 'Tối', description: 'Giao diện tối cho ban đêm', icon: Moon },
        { id: 'system', name: 'Theo hệ thống', description: 'Tự động theo cài đặt hệ thống', icon: Laptop },
    ]

    const colorOptions = [
        { id: 'xanh-duong', name: 'Xanh dương', colorClass: 'bg-blue-500' },
        { id: 'xanh-la', name: 'Xanh lá', colorClass: 'bg-green-500' },
        { id: 'tim', name: 'Tím', colorClass: 'bg-purple-500' },
        { id: 'do', name: 'Đỏ', colorClass: 'bg-red-500' },
        { id: 'cam', name: 'Cam', colorClass: 'bg-orange-500' },
        { id: 'hong', name: 'Hồng', colorClass: 'bg-pink-500' },
    ]

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-green-600 dark:text-green-400">Chế Độ Hiển Thị</CardTitle>
                    <CardDescription>Chọn chế độ sáng, tối hoặc theo hệ thống</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {themeOptions.map((option) => (
                        <div
                            key={option.id}
                            onClick={() => setTheme(option.id)}
                            className={cn(
                                'p-4 border rounded-lg cursor-pointer transition-all',
                                theme === option.id ? 'border-primary ring-2 ring-primary/50' : 'hover:border-primary/50'
                            )}
                        >
                            <option.icon className="w-6 h-6 mb-2" />
                            <h3 className="font-semibold">{option.name}</h3>
                            <p className="text-xs text-muted-foreground">{option.description}</p>
                        </div>
                    ))}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-green-600 dark:text-green-400">Màu Chủ Đạo</CardTitle>
                    <CardDescription>Chọn màu chủ đạo cho giao diện</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-4">
                    {colorOptions.map((color) => (
                        <div
                            key={color.id}
                            onClick={() => setPrimaryColor(color.id)}
                            className="text-center cursor-pointer group"
                        >
                            <div className={cn(
                                'w-16 h-10 rounded-lg flex items-center justify-center transition-all',
                                color.colorClass,
                                primaryColor === color.id ? 'ring-2 ring-offset-2 ring-primary dark:ring-offset-background' : 'group-hover:scale-105'
                            )}>
                                {primaryColor === color.id && <Check className="w-5 h-5 text-white" />}
                            </div>
                            <span className="text-sm mt-2 block">{color.name}</span>
                        </div>
                    ))}
                </CardContent>
            </Card>

            <Card className="bg-muted/30 border-dashed">
                <CardContent className="pt-6">
                    <div className="flex items-start space-x-3">
                        <Info className="w-5 h-5 text-muted-foreground mt-1" />
                        <div>
                            <h4 className="font-semibold">Thông Tin</h4>
                            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 mt-2">
                                <li>Cài đặt giao diện được lưu tự động trong trình duyệt</li>
                                <li>Chế độ "Theo hệ thống" sẽ tự động chuyển đổi theo cài đặt thiết bị</li>
                                <li>Màu chủ đạo ảnh hưởng đến các nút và liên kết quan trọng</li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

const LanguageSettings = () => {
    const [selectedLang, setSelectedLang] = useState('jp')
    const languages = [
        { code: 'vn', name: 'Tiếng Việt', native: 'Vietnamese', flag: 'VN' },
        { code: 'us', name: 'English', native: 'English', flag: 'US' },
        { code: 'jp', name: 'Tiếng Nhật', native: '日本語', flag: 'JP' },
        { code: 'kr', name: 'Tiếng Hàn', native: '한국어', flag: 'KR' },
    ]
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-green-600 dark:text-green-400">Chọn Ngôn Ngữ</CardTitle>
                    <CardDescription>Ngôn ngữ được lưu tự động và áp dụng cho toàn bộ ứng dụng</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {languages.map(lang => (
                        <div
                            key={lang.code}
                            onClick={() => setSelectedLang(lang.code)}
                            className={cn(
                                'p-4 border rounded-lg cursor-pointer transition-all flex justify-between items-center',
                                selectedLang === lang.code ? 'border-primary ring-2 ring-primary/50' : 'hover:border-primary/50'
                            )}
                        >
                            <div className="flex items-center space-x-4">
                                <span className="font-bold text-lg">{lang.flag}</span>
                                <div>
                                    <h3 className="font-semibold">{lang.name}</h3>
                                    <p className="text-xs text-muted-foreground">{lang.native}</p>
                                </div>
                            </div>
                            {selectedLang === lang.code && <Check className="w-5 h-5 text-primary" />}
                        </div>
                    ))}
                </CardContent>
            </Card>

            <Card className="bg-muted/30 border-dashed">
                <CardContent className="pt-6">
                    <div className="flex items-start space-x-3">
                        <Info className="w-5 h-5 text-muted-foreground mt-1" />
                        <div>
                            <h4 className="font-semibold">Thông Tin</h4>
                            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 mt-2">
                                <li>Ngôn ngữ được lưu tự động trong trình duyệt</li>
                                <li>Thay đổi ngôn ngữ sẽ áp dụng ngay lập tức</li>
                                <li>Hỗ trợ nhiều ngôn ngữ châu Á và châu Âu</li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

const ExchangeRateSettings = () => {
    const { settings, updateSettings, refreshSettings, loading: settingsLoading } = useSettings();
    const [newRate, setNewRate] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);

    const handleUpdateRate = async () => {
        const rateValue = parseFloat(newRate);
        if (isNaN(rateValue) || rateValue <= 0) {
            toast.warning("Vui lòng nhập một tỷ giá hợp lệ.");
            return;
        }

        setIsUpdating(true);
        await updateSettings({ usdToVndRate: rateValue });
        setNewRate('');
        setIsUpdating(false);
    };

    if (settingsLoading) {
        return <div>Đang tải cài đặt...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-green-600 dark:text-green-400">Tỷ Giá Hiện Tại</CardTitle>
                        <CardDescription>Tỷ giá USD/VND đang được áp dụng</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="p-4 border rounded-lg bg-muted/30">
                            <div className="flex justify-between items-center text-sm text-muted-foreground">
                                <span>USD/VND</span>
                                <RefreshCw className="w-4 h-4 text-green-500 cursor-pointer" onClick={refreshSettings}/>
                            </div>
                            <p className="text-3xl font-bold mt-2">
                                {settings?.usdToVndRate ? Number(settings.usdToVndRate).toLocaleString('vi-VN') : 'N/A'}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Cập nhật lần cuối: {settings?.updatedAt ? new Date(settings.updatedAt).toLocaleString('vi-VN') : 'Chưa có'}
                            </p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-green-600 dark:text-green-400">Cập Nhật Tỷ Giá</CardTitle>
                        <CardDescription>Thiết lập tỷ giá USD/VND mới</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="newRate">Tỷ giá mới (VND)</Label>
                            <Input
                                id="newRate"
                                type="number"
                                placeholder="Nhập tỷ giá USD/VND..."
                                value={newRate}
                                onChange={(e) => setNewRate(e.target.value)}
                            />
                            <p className="text-xs text-muted-foreground mt-1">Ví dụ: 25400 (1 USD = 25,400 VND)</p>
                        </div>
                        <Button className="w-full bg-green-600 hover:bg-green-700 rounded-lg" onClick={handleUpdateRate} disabled={isUpdating}>
                            {isUpdating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                            {isUpdating ? 'Đang cập nhật...' : 'Cập Nhật Tỷ Giá'}
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <Card className="bg-muted/30 border-dashed">
                <CardContent className="pt-6">
                    <div className="flex items-start space-x-3">
                        <Info className="w-5 h-5 text-muted-foreground mt-1" />
                        <div>
                            <h4 className="font-semibold">Thông Tin</h4>
                            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 mt-2">
                                <li>Tỷ giá được sử dụng cho tất cả các tính toán trong hệ thống</li>
                                <li>Thay đổi tỷ giá sẽ ảnh hưởng đến tất cả giao dịch mới</li>
                                <li>Tỷ giá phải lớn hơn 0 và được lưu với độ chính xác 4 chữ số thập phân</li>
                                <li>Dữ liệu được đồng bộ với backend API</li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

const FormatSettings = () => {
    const { settings, updateSettings, loading } = useSettings();

    const handleFormatChange = async (key, value) => {
        if (settings[key] === value) return;
        await updateSettings({ [key]: value });
    };

    const currencyFormats = [
        { id: 'dot_separator', name: 'Dấu chấm', example: '1.000.000' },
        { id: 'comma_separator', name: 'Dấu phẩy', example: '1,000,000' },
    ];

    const dateFormats = [
        { id: 'DD_MM_YYYY', name: 'Ngày/Tháng/Năm', example: '27/03/2023' },
        { id: 'MM_DD_YYYY', name: 'Tháng/Ngày/Năm', example: '03/27/2023' },
        { id: 'YYYY_MM_DD', name: 'Năm/Tháng/Ngày', example: '2023/03/27' },
    ];

    if (loading || !settings) return <div>Đang tải...</div>;

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-green-600 dark:text-green-400">Định Dạng Tiền Tệ</CardTitle>
                    <CardDescription>Chọn cách hiển thị dấu phân cách cho số tiền.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {currencyFormats.map((format) => (
                        <div key={format.id} onClick={() => handleFormatChange('currencyFormat', format.id)} className={cn('p-4 border rounded-lg cursor-pointer transition-all relative', settings.currencyFormat === format.id ? 'border-primary ring-2 ring-primary/50' : 'hover:border-primary/50')}>
                            {settings.currencyFormat === format.id && <div className="absolute top-2 right-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center"><Check className="w-3 h-3 text-white" /></div>}
                            <h3 className="font-semibold">{format.name}</h3>
                            <p className="text-sm text-muted-foreground">Ví dụ: {format.example}</p>
                        </div>
                    ))}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-green-600 dark:text-green-400">Định Dạng Ngày Tháng</CardTitle>
                    <CardDescription>Chọn cách hiển thị ngày tháng trong toàn bộ ứng dụng.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {dateFormats.map((format) => (
                        <div key={format.id} onClick={() => handleFormatChange('dateFormat', format.id)} className={cn('p-4 border rounded-lg cursor-pointer transition-all relative', settings.dateFormat === format.id ? 'border-primary ring-2 ring-primary/50' : 'hover:border-primary/50')}>
                            {settings.dateFormat === format.id && <div className="absolute top-2 right-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center"><Check className="w-3 h-3 text-white" /></div>}
                            <h3 className="font-semibold">{format.name}</h3>
                            <p className="text-sm text-muted-foreground">Ví dụ: {format.example}</p>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}


const Settings = () => {
    const [activeTab, setActiveTab] = useState('interface');

    const tabs = [
        { id: 'interface', name: 'Cài Đặt Giao Diện', icon: Palette },
        { id: 'language', name: 'Cài Đặt Ngôn Ngữ', icon: Languages },
        { id: 'format', name: 'Định Dạng', icon: Calendar },
        { id: 'rate', name: 'Tỷ Giá USD/VND', icon: DollarSign },
    ]

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-green-600 dark:text-green-400 flex items-center gap-3">
                    {React.createElement(tabs.find(t => t.id === activeTab).icon, { className: 'w-8 h-8' })}
                    {tabs.find(t => t.id === activeTab).name}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Tùy chỉnh các thiết lập cho ứng dụng của bạn.
                </p>
            </div>

            <div className="border-b border-border">
                <nav className="-mb-px flex flex-wrap gap-x-6 gap-y-2" aria-label="Tabs">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                'whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm',
                                activeTab === tab.id
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                            )}
                        >
                            {tab.name}
                        </button>
                    ))}
                </nav>
            </div>

            <div>
                {activeTab === 'interface' && <InterfaceSettings />}
                {activeTab === 'language' && <LanguageSettings />}
                {activeTab === 'format' && <FormatSettings />}
                {activeTab === 'rate' && <ExchangeRateSettings />}
            </div>
        </div>
    )
}

export default Settings;