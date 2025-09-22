import React from 'react'
import { useWallet } from '../shared/hooks/useWallet'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Button } from './ui/button'
import { WalletIcon, CheckIcon, ChevronDownIcon } from 'lucide-react'
import { IconComponent } from '../shared/config/icons'

const WalletSelector = () => {
  const { currentWallet, wallets, selectWallet, loading, getTotalBalance } = useWallet()

  const formatCurrency = (amount) => {
    if (typeof amount !== 'number') {
      amount = parseFloat(amount) || 0
    }
    return `${amount.toLocaleString('vi-VN')} ₫`
  }

  if (loading || !currentWallet) {
    return (
      <div className="flex items-center space-x-2 px-3 py-2 bg-muted rounded-md">
        <WalletIcon className="w-4 h-4 text-muted-foreground animate-pulse" />
        <span className="text-sm text-muted-foreground">Đang tải...</span>
      </div>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center space-x-2 min-w-[200px] justify-between">
          <div className="flex items-center space-x-2">
            <IconComponent name={currentWallet.icon} className="w-5 h-5" />
            <div className="text-left">
              <div className="text-sm font-medium">{currentWallet.name}</div>
              <div className="text-xs text-muted-foreground">
                {formatCurrency(currentWallet.balance)}
              </div>
            </div>
          </div>
          <ChevronDownIcon className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-80" align="start">
        <DropdownMenuLabel>
          <div className="flex items-center justify-between">
            <span>Chọn Ví</span>
            <div className="text-xs text-muted-foreground">
              Tổng: {formatCurrency(getTotalBalance())}
            </div>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />

        <div className="max-h-60 overflow-y-auto">
          {wallets.map((wallet) => (
            <DropdownMenuItem
              key={wallet.id}
              onClick={() => selectWallet(wallet)}
              className="flex items-center justify-between p-3 cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <IconComponent name={wallet.icon} className="w-5 h-5" />
                <div>
                  <div className="font-medium">{wallet.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {formatCurrency(wallet.balance)}
                  </div>
                  {wallet.description && (
                    <div className="text-xs text-muted-foreground truncate max-w-[150px]">
                      {wallet.description}
                    </div>
                  )}
                </div>
              </div>
              
              {currentWallet.id === wallet.id && (
                <CheckIcon className="w-4 h-4 text-primary" />
              )}
            </DropdownMenuItem>
          ))}
        </div>

        <DropdownMenuSeparator />
        
        <DropdownMenuItem asChild>
          <a href="/wallets" className="flex items-center space-x-2 p-3">
            <WalletIcon className="w-4 h-4" />
            <span>Quản lý ví</span>
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default WalletSelector