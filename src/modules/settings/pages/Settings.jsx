import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../components/ui/card.jsx'
import { Button } from '../../../components/ui/button.jsx'
import { Input } from '../../../components/ui/input.jsx'
import { Label } from '../../../components/ui/label.jsx'
import { useTheme } from '../../../shared/contexts/ThemeContext.jsx'
import { useLanguage } from '../../../shared/contexts/LanguageContext.jsx'
import { cn } from '../../../lib/utils.js'
import { Sun, Moon, Laptop, Palette, Languages, Check, Info, Calendar} from 'lucide-react'
import { useSettings } from '../../../shared/contexts/SettingsContext.jsx'
import DateFormatDemo from '../../../components/DateFormatDemo.jsx'
import { languages } from '../../../shared/i18n/index.js'

const InterfaceSettings = () => {
    const { theme, setTheme } = useTheme()
    const { t } = useLanguage()
    const [primaryColor, setPrimaryColor] = useState('hong')

    const themeOptions = [
        { id: 'light', name: t('settings.interface.light'), description: t('settings.interface.lightDesc'), icon: Sun },
        { id: 'dark', name: t('settings.interface.dark'), description: t('settings.interface.darkDesc'), icon: Moon },
        { id: 'system', name: t('settings.interface.system'), description: t('settings.interface.systemDesc'), icon: Laptop },
    ]

    const colorOptions = [
        { id: 'xanh-duong', name: t('settings.interface.blue'), colorClass: 'bg-blue-500' },
        { id: 'xanh-la', name: t('settings.interface.green'), colorClass: 'bg-green-500' },
        { id: 'tim', name: t('settings.interface.purple'), colorClass: 'bg-purple-500' },
        { id: 'do', name: t('settings.interface.red'), colorClass: 'bg-red-500' },
        { id: 'cam', name: t('settings.interface.orange'), colorClass: 'bg-orange-500' },
        { id: 'hong', name: t('settings.interface.pink'), colorClass: 'bg-pink-500' },
    ]

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-green-600 dark:text-green-400">{t('settings.interface.displayMode')}</CardTitle>
                    <CardDescription>{t('settings.interface.displayModeDesc')}</CardDescription>
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
                    <CardTitle className="text-green-600 dark:text-green-400">{t('settings.interface.primaryColor')}</CardTitle>
                    <CardDescription>{t('settings.interface.primaryColorDesc')}</CardDescription>
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
                            <h4 className="font-semibold">{t('settings.interface.interfaceInfo')}</h4>
                            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 mt-2">
                                {t('settings.interface.interfaceInfoList').map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

const LanguageSettings = () => {
    const { currentLanguage, changeLanguage, t } = useLanguage()

    const availableLanguages = Object.entries(languages).map(([code, info]) => ({
        code,
        name: code === 'vi' ? t('settings.language.vietnamese') : t('settings.language.english'),
        native: info.nativeName,
        flag: info.flag
    }))

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-green-600 dark:text-green-400">{t('settings.language.chooseLanguage')}</CardTitle>
                    <CardDescription>{t('settings.language.chooseLanguageDesc')}</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {availableLanguages.map(lang => (
                        <div
                            key={lang.code}
                            onClick={() => changeLanguage(lang.code)}
                            className={cn(
                                'p-4 border rounded-lg cursor-pointer transition-all flex justify-between items-center',
                                currentLanguage === lang.code ? 'border-primary ring-2 ring-primary/50' : 'hover:border-primary/50'
                            )}
                        >
                            <div className="flex items-center space-x-4">
                                <span className="font-bold text-lg">{lang.flag}</span>
                                <div>
                                    <h3 className="font-semibold">{lang.name}</h3>
                                    <p className="text-xs text-muted-foreground">{lang.native}</p>
                                </div>
                            </div>
                            {currentLanguage === lang.code && <Check className="w-5 h-5 text-primary" />}
                        </div>
                    ))}
                </CardContent>
            </Card>

            <Card className="bg-muted/30 border-dashed">
                <CardContent className="pt-6">
                    <div className="flex items-start space-x-3">
                        <Info className="w-5 h-5 text-muted-foreground mt-1" />
                        <div>
                            <h4 className="font-semibold">{t('settings.language.languageInfo')}</h4>
                            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 mt-2">
                                {t('settings.language.languageInfoList').map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
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
    const { t } = useLanguage();

    const handleFormatChange = async (key, value) => {
        if (settings[key] === value) return;
        await updateSettings({ [key]: value });
    };

    const currencyFormats = [
        { id: 'dot_separator', name: t('settings.format.dotSeparator'), example: t('settings.format.dotExample') },
        { id: 'comma_separator', name: t('settings.format.commaSeparator'), example: t('settings.format.commaExample') },
    ];

    const dateFormats = [
        { id: 'DD_MM_YYYY', name: t('settings.format.dayMonthYear'), example: '27/03/2023' },
        { id: 'MM_DD_YYYY', name: t('settings.format.monthDayYear'), example: '03/27/2023' },
        { id: 'YYYY_MM_DD', name: t('settings.format.yearMonthDay'), example: '2023/03/27' },
    ];

    if (loading || !settings) return <div>{t('common.loading')}</div>;

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-green-600 dark:text-green-400">{t('settings.format.currencyFormat')}</CardTitle>
                    <CardDescription>{t('settings.format.currencyFormatDesc')}</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {currencyFormats.map((format) => (
                        <div key={format.id} onClick={() => handleFormatChange('currencyFormat', format.id)} className={cn('p-4 border rounded-lg cursor-pointer transition-all relative', settings.currencyFormat === format.id ? 'border-primary ring-2 ring-primary/50' : 'hover:border-primary/50')}>
                            {settings.currencyFormat === format.id && <div className="absolute top-2 right-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center"><Check className="w-3 h-3 text-white" /></div>}
                            <h3 className="font-semibold">{format.name}</h3>
                            <p className="text-sm text-muted-foreground">{t('common.example', 'Ví dụ')}: {format.example}</p>
                        </div>
                    ))}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-green-600 dark:text-green-400">{t('settings.format.dateFormat')}</CardTitle>
                    <CardDescription>{t('settings.format.dateFormatDesc')}</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {dateFormats.map((format) => (
                        <div key={format.id} onClick={() => handleFormatChange('dateFormat', format.id)} className={cn('p-4 border rounded-lg cursor-pointer transition-all relative', settings.dateFormat === format.id ? 'border-primary ring-2 ring-primary/50' : 'hover:border-primary/50')}>
                            {settings.dateFormat === format.id && <div className="absolute top-2 right-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center"><Check className="w-3 h-3 text-white" /></div>}
                            <h3 className="font-semibold">{format.name}</h3>
                            <p className="text-sm text-muted-foreground">{t('common.example', 'Ví dụ')}: {format.example}</p>
                        </div>
                    ))}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-green-600 dark:text-green-400">{t('settings.format.previewFormat')}</CardTitle>
                    <CardDescription>{t('settings.format.previewFormatDesc')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <DateFormatDemo />
                </CardContent>
            </Card>
        </div>
    );
}


const Settings = () => {
    const [activeTab, setActiveTab] = useState('interface');
    const { t } = useLanguage();

    const tabs = [
        { id: 'interface', name: t('settings.tabs.interface'), icon: Palette },
        { id: 'language', name: t('settings.tabs.language'), icon: Languages },
        { id: 'format', name: t('settings.tabs.format'), icon: Calendar },
    ]

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-green-600 dark:text-green-400 flex items-center gap-3">
                    {React.createElement(tabs.find(t => t.id === activeTab).icon, { className: 'w-8 h-8' })}
                    {tabs.find(t => t.id === activeTab).name}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    {t('settings.subtitle')}
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
            </div>
        </div>
    )
}

export default Settings;