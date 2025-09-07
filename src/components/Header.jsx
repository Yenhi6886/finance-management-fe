import React from 'react'
import { useAuth } from '../modules/auth/contexts/AuthContext.jsx'
import { useTheme } from '../shared/contexts/ThemeContext.jsx'
import { Button } from './ui/button'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { 
  BellIcon, 
  SunIcon, 
  MoonIcon, 
  UserIcon, 
  SettingsIcon, 
  LogOutIcon,
  KeyIcon
} from 'lucide-react'

const Header = () => {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-semibold">Dashboard</h1>
      </div>

      <div className="flex items-center space-x-4">
        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="w-9 h-9"
        >
          {theme === 'light' ? (
            <MoonIcon className="w-4 h-4" />
          ) : (
            <SunIcon className="w-4 h-4" />
          )}
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="w-9 h-9">
          <BellIcon className="w-4 h-4" />
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                <UserIcon className="w-4 h-4 text-primary-600 dark:text-primary-400" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.username}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem asChild>
              <a href="/profile" className="flex items-center">
                <UserIcon className="mr-2 h-4 w-4" />
                <span>Thông tin cá nhân</span>
              </a>
            </DropdownMenuItem>
            
            <DropdownMenuItem asChild>
              <a href="/change-password" className="flex items-center">
                <KeyIcon className="mr-2 h-4 w-4" />
                <span>Đổi mật khẩu</span>
              </a>
            </DropdownMenuItem>
            
            <DropdownMenuItem asChild>
              <a href="/settings" className="flex items-center">
                <SettingsIcon className="mr-2 h-4 w-4" />
                <span>Cài đặt</span>
              </a>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem onClick={handleLogout}>
              <LogOutIcon className="mr-2 h-4 w-4" />
              <span>Đăng xuất</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

export default Header
