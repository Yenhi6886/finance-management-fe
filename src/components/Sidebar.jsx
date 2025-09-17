import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../modules/auth/contexts/AuthContext.jsx'
import { useTheme } from '../shared/contexts/ThemeContext.jsx'
import { useNotification } from '../shared/contexts/NotificationContext.jsx'
import { cn } from '../lib/utils.js'
import AnimatedIcon from './ui/AnimatedIcon'
import { Button } from './ui/button'
import { Avatar } from './ui/avatar'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip'
import { NotificationPanel } from './NotificationPanel'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog'
import {
  SunIcon,
  MoonIcon,
  UserIcon,
  SettingsIcon,
  LogOutIcon,
  KeyIcon,
} from 'lucide-react'

import listWalletAnimation from '../assets/icons/listwallet.json'
import listWalletDarkAnimation from '../assets/icons/listwalletdark.json'
import addWalletAnimation from '../assets/icons/addWallet.json'
import dashboardAnimation from '../assets/icons/dashboard.json'
import creditCardAnimation from '../assets/icons/credit.json'
import chartAnimation from '../assets/icons/chart.json'
import notificationAnimation from '../assets/icons/notification.json'
import walletAnimation from '../assets/icons/wallet.json'
import walletDarkAnimation from '../assets/icons/walletdark.json'
import userAnimation from '../assets/icons/profile.json'


const Sidebar = ({ onToggleWalletPanel }) => {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [isUserMenuAnimating, setIsUserMenuAnimating] = useState(false)
  const [hoveredItem, setHoveredItem] = useState(null)
  const [showFirstMobileText, setShowFirstMobileText] = useState(true);
  const location = useLocation()
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { unreadCount } = useNotification();

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const handleUserMenuToggle = () => {
    if (showUserMenu) {
      setIsUserMenuAnimating(false)
      setTimeout(() => setShowUserMenu(false), 350)
    } else {
      setShowUserMenu(true)
      setTimeout(() => setIsUserMenuAnimating(true), 10)
    }
  }

  const closeUserMenu = () => {
    setIsUserMenuAnimating(false)
    setTimeout(() => setShowUserMenu(false), 350)
  }

  useEffect(() => {
    const mobileTextInterval = setInterval(() => {
      setShowFirstMobileText(prev => !prev);
    }, 3500);
    return () => clearInterval(mobileTextInterval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest('.user-menu-container')) {
        closeUserMenu()
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserMenu]);

  const currentListWalletIcon = theme === 'dark' ? listWalletDarkAnimation : listWalletAnimation;
  const currentWalletNavIcon = theme === 'dark' ? walletDarkAnimation : walletAnimation;

  const menuItems = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      href: '/dashboard',
      icon: dashboardAnimation,
    },
    {
      id: 'transactions',
      title: 'Thu Chi',
      href: '/transactions',
      icon: currentWalletNavIcon,
      size: 35,
    },
    {
      id: 'wallets',
      title: 'Ví Tiền',
      href: '/wallets',
      icon: creditCardAnimation,
    },
    {
      id: 'reports',
      title: 'Báo Cáo',
      href: '/reports',
      icon: chartAnimation,
    },
  ]

  const addWalletItem = {
    id: 'add-wallet',
    title: 'Thêm Mới',
    href: '/wallets/add',
    icon: addWalletAnimation,
  };

  const mobileMenuItems = [
    menuItems[0], // Dashboard
    menuItems[1], // Thu Chi
    addWalletItem,
    menuItems[2], // Ví Tiền
    menuItems[3], // Báo cáo
  ];


  return (
      <TooltipProvider delayDuration={0} skipDelayDuration={0}>
        <div className="md:relative sticky bottom-0 z-50 bg-white dark:bg-background border-t md:border-t-0 md:border-r border-gray-200 dark:border-gray-700 w-full md:w-20 md:h-full flex-shrink-0 md:order-first order-last">
          <div className="flex md:flex-col h-full">

            {/* Desktop Only: Logo/WalletPanel Toggle */}
            <div className="hidden md:flex items-center justify-center h-20 px-2 bg-white dark:bg-background relative">
              <button
                  onClick={onToggleWalletPanel}
                  onMouseEnter={() => setHoveredItem('list-wallet')}
                  onMouseLeave={() => setHoveredItem(null)}
                  className="flex items-center justify-center hover:scale-105 transition-transform duration-200"
              >
                <AnimatedIcon
                    animationData={currentListWalletIcon}
                    size={64}
                    className="text-gray-600 dark:text-gray-400"
                    play={hoveredItem === 'list-wallet'}
                />
              </button>
            </div>

            {/* Desktop Only: Add Wallet Button */}
            <div className="hidden md:block px-2 pt-0 pb-0">
              <Link
                  to="/wallets/add"
                  className="flex flex-col items-center py-1 px-1 rounded-xl space-y-1 group transition-all duration-200 hover:scale-105"
              >
                <div className="w-12 h-12 bg-green-500 dark:bg-green-500 rounded-full flex items-center justify-center p-2 transition-all duration-200 group-hover:bg-green-600 dark:group-hover:bg-green-400 shadow-lg">
                  <AnimatedIcon
                      animationData={addWalletAnimation}
                      size={24}
                      className="text-white"
                      play={true}
                      loop={true}
                  />
                </div>
                <span className="text-xs text-center leading-tight truncate w-full font-light text-green-600 dark:text-green-400">Thêm Ví</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex flex-1 flex-col py-1 space-y-0.5 px-2 pt-4">
              {menuItems.map((item) => {
                const isActive = location.pathname.startsWith(item.href);
                return (
                    <div key={item.href}>
                      <Link to={item.href} onMouseEnter={() => setHoveredItem(item.id)} onMouseLeave={() => setHoveredItem(null)} className={cn("flex flex-col items-center py-1 px-1 rounded-xl space-y-1 transition-all duration-200 group", isActive ? "text-green-800 dark:text-green-300" : "text-green-600 dark:text-green-400")}>
                        <div className={cn("w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-200", isActive ? "bg-green-100 dark:bg-white/10" : "group-hover:bg-green-100 dark:group-hover:bg-white/10")}>
                          <AnimatedIcon animationData={item.icon} size={item.size || 25} play={hoveredItem === item.id} />
                        </div>
                        <span className={cn("text-xs text-center leading-tight truncate w-full", isActive ? "font-medium" : "font-light")}>{item.title}</span>
                      </Link>
                    </div>
                )
              })}
            </nav>

            {/* Mobile Navigation */}
            <nav className="md:hidden flex flex-row items-center justify-around w-full h-16">
              {mobileMenuItems.map((item) => {
                const isActive = location.pathname.startsWith(item.href);
                if (item.id === 'add-wallet') {
                  return (
                      <div key={item.id} className="flex-1 flex justify-center">
                        <Link to={item.href} className="-mt-8 z-10 flex flex-col items-center">
                          <div className="w-16 h-16 bg-green-500 dark:bg-green-500 rounded-full flex items-center justify-center p-2 transition-all duration-200 shadow-lg border-4 border-white dark:border-background">
                            <AnimatedIcon animationData={item.icon} size={32} className="text-white" play={true} loop={true} />
                          </div>
                          <div className="relative h-4 w-24 text-center overflow-hidden mt-1.5">
                            <div className={cn(
                                "absolute inset-0 flex items-center justify-center transition-all duration-500 ease-in-out",
                                showFirstMobileText ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
                            )}>
                              <span className="text-[11px] font-semibold text-green-600 dark:text-green-400">Thêm ví ngay</span>
                            </div>
                            <div className={cn(
                                "absolute inset-0 flex items-center justify-center transition-all duration-500 ease-in-out",
                                showFirstMobileText ? "translate-y-full opacity-0" : "translate-y-0 opacity-100"
                            )}>
                              <span className={cn(
                                  "text-[11px] font-semibold text-green-600 dark:text-green-300 bg-green-100 dark:bg-green-900/50 px-2.5 py-0.5 rounded-full transition-transform duration-300 ease-out",
                                  showFirstMobileText ? "scale-0" : "scale-100 delay-200"
                              )}>
                                Xspend
                              </span>
                            </div>
                          </div>
                        </Link>
                      </div>
                  )
                }
                return (
                    <Link key={item.id} to={item.href} className={cn("relative flex flex-col items-center justify-center flex-1 h-full gap-1 pt-1 transition-colors", isActive ? "text-green-600 dark:text-green-400" : "text-gray-500 dark:text-gray-400")}>
                      <span className={cn("absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-1 bg-green-600 rounded-full transition-transform duration-300 ease-out", isActive ? 'scale-x-100' : 'scale-x-0')} />
                      <div className="w-8 h-8 flex items-center justify-center">
                        <AnimatedIcon animationData={item.icon} size={item.size || 24} play={isActive} />
                      </div>
                      <span className={cn("text-xs leading-none", isActive && "font-semibold")}>{item.title}</span>
                    </Link>
                )
              })}
            </nav>

            {/* Desktop Only: User Info */}
            {user && (
                <div className="hidden md:flex flex-col p-2 space-y-2">
                  <div className="flex justify-center">
                    <NotificationPanel>
                      <Button variant="ghost" size="icon" onMouseEnter={() => setHoveredItem('notification')} onMouseLeave={() => setHoveredItem(null)} className="w-8 h-8 hover:bg-green-100 dark:hover:bg-white/10 relative">
                        <AnimatedIcon animationData={notificationAnimation} size={20} className="text-green-600 dark:text-green-400" play={hoveredItem === 'notification'} />
                        {unreadCount > 0 && (
                            <span className="absolute top-0 right-0 flex h-2.5 w-2.5">
                                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                  </span>
                        )}
                      </Button>
                    </NotificationPanel>
                  </div>
                  <div className="relative user-menu-container">
                    {showUserMenu && (
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 flex flex-col space-y-2 z-50">
                          <div className={`transition-all duration-400 ease-out ${isUserMenuAnimating ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-3 scale-90'}`} style={{ transitionDelay: isUserMenuAnimating ? '0ms' : '0ms' }}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" onClick={() => { toggleTheme(); closeUserMenu(); }} className="w-8 h-8 bg-white dark:bg-gray-800 hover:bg-green-100 dark:hover:bg-white/10 shadow-lg border border-gray-200 dark:border-gray-600 hover:scale-110 transition-all duration-200">
                                  {theme === 'light' ? <MoonIcon className="w-4 h-4 text-green-600 dark:text-green-400" /> : <SunIcon className="w-4 h-4 text-green-600 dark:text-green-400" />}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent side="left" className="text-xs font-normal"><p>{theme === 'light' ? 'Chế độ tối' : 'Chế độ sáng'}</p></TooltipContent>
                            </Tooltip>
                          </div>
                          <div className={`transition-all duration-400 ease-out ${isUserMenuAnimating ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-3 scale-90'}`} style={{ transitionDelay: isUserMenuAnimating ? '80ms' : '0ms' }}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" onClick={() => closeUserMenu()} asChild className="w-8 h-8 bg-white dark:bg-gray-800 hover:bg-green-100 dark:hover:bg-white/10 shadow-lg border border-gray-200 dark:border-gray-600 hover:scale-110 transition-all duration-200">
                                  <Link to="/profile"><UserIcon className="w-4 h-4 text-green-600 dark:text-green-400" /></Link>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent side="left" className="text-xs font-normal"><p>Thông tin cá nhân</p></TooltipContent>
                            </Tooltip>
                          </div>
                          <div className={`transition-all duration-400 ease-out ${isUserMenuAnimating ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-3 scale-90'}`} style={{ transitionDelay: isUserMenuAnimating ? '160ms' : '0ms' }}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" onClick={() => closeUserMenu()} asChild className="w-8 h-8 bg-white dark:bg-gray-800 hover:bg-green-100 dark:hover:bg-white/10 shadow-lg border border-gray-200 dark:border-gray-600 hover:scale-110 transition-all duration-200">
                                  <Link to="/change-password"><KeyIcon className="w-4 h-4 text-green-600 dark:text-green-400" /></Link>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent side="left" className="text-xs font-normal"><p>Đổi mật khẩu</p></TooltipContent>
                            </Tooltip>
                          </div>
                          <div className={`transition-all duration-400 ease-out ${isUserMenuAnimating ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-3 scale-90'}`} style={{ transitionDelay: isUserMenuAnimating ? '240ms' : '0ms' }}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" onClick={() => closeUserMenu()} asChild className="w-8 h-8 bg-white dark:bg-gray-800 hover:bg-green-100 dark:hover:bg-white/10 shadow-lg border border-gray-200 dark:border-gray-600 hover:scale-110 transition-all duration-200">
                                  <Link to="/settings"><SettingsIcon className="w-4 h-4 text-green-600 dark:text-green-400" /></Link>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent side="left" className="text-xs font-normal"><p>Cài đặt</p></TooltipContent>
                            </Tooltip>
                          </div>
                          <div className={`transition-all duration-400 ease-out ${isUserMenuAnimating ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-3 scale-90'}`} style={{ transitionDelay: isUserMenuAnimating ? '320ms' : '0ms' }}>
                            <AlertDialog>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="icon" className="w-8 h-8 bg-white dark:bg-gray-800 hover:bg-red-100 dark:hover:bg-red-800 shadow-lg border border-gray-200 dark:border-gray-600 hover:scale-110 transition-all duration-200">
                                      <LogOutIcon className="w-4 h-4 text-red-600 dark:text-red-400" />
                                    </Button>
                                  </AlertDialogTrigger>
                                </TooltipTrigger>
                                <TooltipContent side="left" className="text-xs font-normal"><p>Đăng xuất</p></TooltipContent>
                              </Tooltip>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Xác nhận đăng xuất</AlertDialogTitle>
                                  <AlertDialogDescription>Bạn có chắc chắn muốn đăng xuất khỏi tài khoản này không?</AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Hủy</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => { handleLogout(); closeUserMenu(); }} className="bg-red-600 hover:bg-red-700 text-white">Đăng xuất</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                    )}
                    <button onClick={handleUserMenuToggle} className={`flex items-center justify-center w-full hover:bg-green-50 dark:hover:bg-white/10 rounded-lg p-2 transition-all duration-200 ${showUserMenu ? 'bg-green-50 dark:bg-white/10 scale-95' : 'hover:scale-105'}`}>
                      <Avatar src={user?.avatarUrl} alt={`${user?.username} avatar`} size="m" className={`w-10 h-10 transition-all duration-200 ${showUserMenu ? 'ring-2 ring-green-500 ring-opacity-50' : 'hover:opacity-80'}`} />
                    </button>
                  </div>
                </div>
            )}
          </div>
        </div>
      </TooltipProvider>
  )
}

export default Sidebar