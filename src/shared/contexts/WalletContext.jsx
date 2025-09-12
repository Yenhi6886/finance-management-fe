import React, { createContext, useState, useEffect, useCallback } from 'react'
import { walletService } from '../../modules/wallets/services/walletService'

export const WalletContext = createContext()

export const WalletProvider = ({ children }) => {
  const [currentWallet, setCurrentWallet] = useState(null)
  const [wallets, setWallets] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchWallets = useCallback(async () => {
    try {
      setLoading(true)
      const response = await walletService.getWallets()
      const walletsData = response.data.data || []
      setWallets(walletsData)
      
      // Nếu chưa có ví hiện tại, chọn ví đầu tiên
      if (!currentWallet && walletsData.length > 0) {
        setCurrentWallet(walletsData[0])
        localStorage.setItem('currentWalletId', walletsData[0].id)
      }
    } catch (error) {
      console.error('Error fetching wallets:', error)
    } finally {
      setLoading(false)
    }
  }, [currentWallet])

  const selectWallet = (wallet) => {
    setCurrentWallet(wallet)
    localStorage.setItem('currentWalletId', wallet.id)
  }

  const getTotalBalance = () => {
    return wallets.reduce((total, wallet) => {
      // Quy đổi tất cả về VND để tính tổng
      const exchangeRate = 25400 // USD to VND
      const balanceInVND = wallet.currency === 'USD' 
        ? wallet.balance * exchangeRate 
        : wallet.balance
      return total + balanceInVND
    }, 0)
  }

  useEffect(() => {
    fetchWallets()
    
    // Khôi phục ví hiện tại từ localStorage
    const savedWalletId = localStorage.getItem('currentWalletId')
    if (savedWalletId) {
      // Sẽ được set sau khi fetch wallets
    }
  }, [fetchWallets])

  useEffect(() => {
    // Set current wallet từ localStorage sau khi có danh sách ví
    const savedWalletId = localStorage.getItem('currentWalletId')
    if (savedWalletId && wallets.length > 0) {
      const savedWallet = wallets.find(w => w.id === savedWalletId)
      if (savedWallet) {
        setCurrentWallet(savedWallet)
      }
    }
  }, [wallets])

  const value = {
    currentWallet,
    wallets,
    loading,
    selectWallet,
    fetchWallets,
    getTotalBalance,
    refreshWallets: fetchWallets
  }

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  )
}
