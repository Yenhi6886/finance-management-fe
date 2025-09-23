import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWallet } from '../shared/contexts/WalletContext.jsx'
import { useLanguage } from '../shared/contexts/LanguageContext.jsx'
import { cn } from '../lib/utils.js'
import AnimatedIcon from './ui/AnimatedIcon.jsx'
import addWalletAnimation from '../assets/icons/addWallet.json'
import { X, Check, FolderKanban } from 'lucide-react'
import { IconComponent } from '../shared/config/icons.js'
import { useSettings } from '../shared/contexts/SettingsContext.jsx'
import { formatCurrency } from '../shared/utils/formattingUtils.js'
import { categoryService } from '../modules/transactions/services/categoryService.js'
import { toast } from 'sonner'

const WalletPanel = ({ isOpen, onClose }) => {
    const { wallets, currentWallet, selectWallet, loading } = useWallet()
    const { settings } = useSettings()
    const { t } = useLanguage()
    const navigate = useNavigate()
    const [categories, setCategories] = useState([])

    useEffect(() => {
        const fetchCategories = async () => {
            if (isOpen) {
                try {
                    const response = await categoryService.getCategories()
                    setCategories(response.data.data || [])
                } catch (error) {
                    toast.error(t('common.loadError') || 'Không thể tải danh sách danh mục.')
                }
            }
        }
        fetchCategories()
    }, [isOpen])

    const handleSelectWallet = (wallet) => {
        selectWallet(wallet)
        onClose()
    }

    const handleNavigate = (path) => {
        navigate(path)
        onClose()
    }

    const handleCategorySelect = (categoryId) => {
        navigate(`/transactions?tab=categories&viewCategory=${categoryId}`)
        onClose()
    }

    return (
        <div
            className={cn(
                'bg-white dark:bg-background border-r border-gray-200 dark:border-gray-700 h-full flex-shrink-0 transition-all duration-300 ease-in-out overflow-hidden',
                isOpen ? 'w-72' : 'w-0'
            )}
        >
            <div className="w-72 flex flex-col h-full">
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{t('walletPanel.title')}</h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                    {loading ? (
                        <div className="text-center py-4">
                            <p className="text-gray-500 dark:text-gray-400">{t('walletPanel.loadingWallets')}</p>
                        </div>
                    ) : (
                        <>
                            {currentWallet && (
                                <div className="mb-4">
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('walletPanel.currentWallet')}</p>
                                    <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/60 rounded-lg">
                                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xl">
                                            <IconComponent name={currentWallet.icon} className="w-5 h-5 text-green-600 dark:text-green-200" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-green-800 dark:text-green-200 truncate">{currentWallet.name}</p>
                                            <p className="text-sm text-green-600 dark:text-green-400">
                                                {formatCurrency(currentWallet.balance, currentWallet.currency, settings)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div className="space-y-2">
                                {wallets.map((wallet) => (
                                    <button
                                        key={wallet.id}
                                        onClick={() => handleSelectWallet(wallet)}
                                        className="w-full flex items-center space-x-3 p-3 rounded-lg transition-colors text-left hover:bg-gray-50 dark:hover:bg-gray-800"
                                    >
                                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-xl">
                                            <IconComponent name={wallet.icon} className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-gray-800 dark:text-gray-200 truncate">{wallet.name}</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {formatCurrency(wallet.balance, wallet.currency, settings)}
                                            </p>
                                        </div>
                                        {currentWallet?.id === wallet.id && (
                                            <Check className="w-5 h-5 text-green-600 shrink-0" />
                                        )}
                                    </button>
                                ))}
                            </div>
                            {wallets.length === 0 && (
                                <div className="text-center py-4">
                                    <p className="text-gray-500 dark:text-gray-400">{t('walletPanel.noWallets')}</p>
                                </div>
                            )}
                        </>
                    )}

                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <h3 className="px-3 pb-2 text-sm font-semibold text-gray-600 dark:text-gray-400">{t('walletPanel.categories')}</h3>
                        <div className="space-y-2">
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => handleCategorySelect(category.id)}
                                    className="w-full flex items-center space-x-3 p-3 rounded-lg transition-colors text-left hover:bg-gray-50 dark:hover:bg-gray-800"
                                >
                                    <div className="w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                                        <FolderKanban className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-gray-800 dark:text-gray-200 truncate">{category.name}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="p-4">
                    <div className="grid grid-cols-2 gap-2">
                        <button onClick={() => handleNavigate('/wallets/add')} className="flex items-center justify-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
                            <AnimatedIcon animationData={addWalletAnimation} size={16} className="mr-1" play={true} loop={true} />
                            {t('navigation.addWallet')}
                        </button>
                        <button onClick={() => handleNavigate('/wallets')} className="flex items-center justify-center px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm">
                            {t('walletPanel.manage')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WalletPanel