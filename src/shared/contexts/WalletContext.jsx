import React, { createContext, useState, useEffect, useCallback, useContext } from 'react'
import { walletService } from '../../modules/wallets/services/walletService'
import { useAuth } from '../../modules/auth/contexts/AuthContext'

export const WalletContext = createContext()

export const WalletProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [currentWallet, setCurrentWallet] = useState(null)
  const [wallets, setWallets] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchWallets = useCallback(async () => {
    if (!isAuthenticated) {
      setLoading(false);
      setWallets([]);
      setCurrentWallet(null);
      return;
    }
    
    setLoading(true)
    try {
      // Lấy cả ví của user và ví được chia sẻ
      const [myWalletsResponse, sharedWalletsResponse] = await Promise.all([
        walletService.getWallets(),
        walletService.getWalletsSharedWithMe()
      ])
      
      const myWallets = myWalletsResponse.data.data || []
      const sharedWallets = sharedWalletsResponse.data.data || []
      
      // Kết hợp cả hai danh sách
      const allWallets = [...myWallets, ...sharedWallets]
      setWallets(allWallets)

      const savedWalletId = localStorage.getItem('currentWalletId')
      if (savedWalletId && allWallets.length > 0) {
        const savedWallet = allWallets.find(w => w.id.toString() === savedWalletId)
        if (savedWallet) {
          setCurrentWallet(savedWallet)
        } else {
          setCurrentWallet(allWallets[0])
          localStorage.setItem('currentWalletId', allWallets[0].id.toString())
        }
      } else if (allWallets.length > 0) {
        setCurrentWallet(allWallets[0]);
        localStorage.setItem('currentWalletId', allWallets[0].id.toString());
      } else {
        setCurrentWallet(null)
        localStorage.removeItem('currentWalletId')
      }
    } catch (error) {
      console.error('Error fetching wallets:', error)
      setCurrentWallet(null)
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated])

  const selectWallet = (wallet) => {
    setCurrentWallet(wallet)
    if (wallet && wallet.id) {
      localStorage.setItem('currentWalletId', wallet.id.toString())
    } else {
      localStorage.removeItem('currentWalletId')
    }
  }

  const getTotalBalance = () => {
    return wallets.reduce((total, wallet) => {
      return total + wallet.balance
    }, 0)
  }

  useEffect(() => {
    // Fetch wallets khi isAuthenticated thay đổi
    fetchWallets()
  }, [fetchWallets])

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

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};