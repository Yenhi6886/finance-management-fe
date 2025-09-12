import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../modules/auth/contexts/AuthContext.jsx'
import { cn } from '../lib/utils.js'
import { 
  LayoutDashboardIcon, 
  UserIcon, 
  CreditCardIcon,
  WalletIcon,
  TrendingUpIcon,
  SettingsIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  PlusIcon,
  ArrowRightLeftIcon,
  ShareIcon,
  DollarSignIcon,
  ListIcon,
  EditIcon
} from 'lucide-react'

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false)
  const [expandedMenus, setExpandedMenus] = useState({ wallets: false })
  const location = useLocation()
  const { user } = useAuth()

  const toggleMenu = (menuKey) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuKey]: !prev[menuKey]
    }))
  }

  const menuItems = [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboardIcon,
    },
    {
      title: 'Thu Chi',
      href: '/transactions',
      icon: CreditCardIcon,
    },
    {
      title: 'Ví Tiền',
      href: '/wallets',
      icon: WalletIcon,
      hasSubmenu: true,
      submenu: [
        {
          title: 'Danh Sách Ví',
          href: '/wallets',
          icon: ListIcon,
        },
        {
          title: 'Thêm Ví Mới',
          href: '/wallets/add',
          icon: PlusIcon,
        },
        {
          title: 'Nạp Tiền',
          href: '/wallets/add-money',
          icon: DollarSignIcon,
        },
        {
          title: 'Chuyển Tiền',
          href: '/wallets/transfer',
          icon: ArrowRightLeftIcon,
        },
        {
          title: 'Chia Sẻ Ví',
          href: '/wallets/share',
          icon: ShareIcon,
        }
      ]
    },
    {
      title: 'Báo Cáo',
      href: '/reports',
      icon: TrendingUpIcon,
    },
    {
      title: 'Thông Tin Cá Nhân',
      href: '/profile',
      icon: UserIcon,
    },
    {
      title: 'Cài Đặt',
      href: '/settings',
      icon: SettingsIcon,
    },
  ]

  return (
    <div className={cn(
      "bg-card border-r border-border transition-all duration-300 ease-in-out",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-border">
          {!collapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <WalletIcon className="w-5 h-5 text-white" />
              </div>
              <span className="font-medium text-lg">X Spend</span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg hover:bg-accent transition-colors"
          >
            {collapsed ? (
              <ChevronRightIcon className="w-4 h-4" />
            ) : (
              <ChevronLeftIcon className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.href || 
              (item.submenu && item.submenu.some(sub => location.pathname === sub.href))
            const isExpanded = expandedMenus[item.title.toLowerCase().replace(' ', '')]
            
            return (
              <div key={item.href}>
                {/* Main menu item */}
                {item.hasSubmenu ? (
                  <button
                    onClick={() => toggleMenu(item.title.toLowerCase().replace(' ', ''))}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200",
                      "hover:scale-102 active:scale-98",
                      isActive 
                        ? "bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300" 
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                      collapsed && "justify-center"
                    )}
                    title={collapsed ? item.title : undefined}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      {!collapsed && <span className="font-normal">{item.title}</span>}
                    </div>
                    {!collapsed && (
                      <ChevronDownIcon 
                        className={cn(
                          "w-4 h-4 transition-transform duration-300 ease-in-out",
                          isExpanded && "rotate-180"
                        )} 
                      />
                    )}
                  </button>
                ) : (
                  <Link
                    to={item.href}
                    className={cn(
                      "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
                      isActive 
                        ? "bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300" 
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                      collapsed && "justify-center"
                    )}
                    title={collapsed ? item.title : undefined}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {!collapsed && <span className="font-normal">{item.title}</span>}
                  </Link>
                )}

                {/* Submenu items */}
                {item.hasSubmenu && !collapsed && (
                  <div 
                    className={cn(
                      "overflow-hidden transition-all duration-300 ease-in-out",
                      isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    )}
                  >
                    <div className="ml-6 mt-2 space-y-1 pb-2">
                      {item.submenu.map((subItem, index) => {
                        const SubIcon = subItem.icon
                        const isSubActive = location.pathname === subItem.href
                        
                        return (
                          <Link
                            key={subItem.href}
                            to={subItem.href}
                            className={cn(
                              "flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 text-sm transform",
                              "hover:translate-x-1",
                              isSubActive 
                                ? "bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-400 border-l-2 border-primary-600" 
                                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                              isExpanded && "animate-in slide-in-from-left-2 duration-300"
                            )}
                            style={{
                              animationDelay: isExpanded ? `${index * 50}ms` : '0ms'
                            }}
                          >
                            <SubIcon className="w-4 h-4 flex-shrink-0" />
                            <span>{subItem.title}</span>
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        {/* User info */}
        {!collapsed && user && (
          <div className="p-4 border-t border-border">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                <UserIcon className="w-4 h-4 text-primary-600 dark:text-primary-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-normal truncate">{user.username}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Sidebar
