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
      const response = await walletService.getWallets()
      const walletsData = response.data.data || []
      setWallets(walletsData)

      const savedWalletId = localStorage.getItem('currentWalletId')
      if (savedWalletId && walletsData.length > 0) {
        const savedWallet = walletsData.find(w => w.id.toString() === savedWalletId)
        if (savedWallet) {
          setCurrentWallet(savedWallet)
        } else {
          setCurrentWallet(walletsData[0])
          localStorage.setItem('currentWalletId', walletsData[0].id)
        }
      } else if (walletsData.length > 0) {
        const currentWalletFromState = currentWallet;
        if (!currentWalletFromState) {
          setCurrentWallet(walletsData[0]);
          localStorage.setItem('currentWalletId', walletsData[0].id);
        }
      } else if (walletsData.length === 0) {
        setCurrentWallet(null)
        localStorage.removeItem('currentWalletId')
      }
    } catch (error) {
      console.error('Error fetching wallets:', error)
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated])

  const selectWallet = (wallet) => {
    setCurrentWallet(wallet)
    localStorage.setItem('currentWalletId', wallet.id)
  }

  const getTotalBalance = () => {
    return wallets.reduce((total, wallet) => {
      return total + wallet.balance
    }, 0)
  }

  useEffect(() => {
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