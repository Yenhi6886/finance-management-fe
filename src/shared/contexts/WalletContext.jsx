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

      // Check if current wallet still exists after refresh
      const savedWalletId = localStorage.getItem('currentWalletId')
      if (savedWalletId && walletsData.length > 0) {
        const savedWallet = walletsData.find(w => w.id === savedWalletId)
        if (savedWallet) {
          setCurrentWallet(savedWallet)
        } else {
          // Current wallet was deleted, select the first available wallet
          setCurrentWallet(walletsData[0])
          localStorage.setItem('currentWalletId', walletsData[0].id)
        }
      } else if (!currentWallet && walletsData.length > 0) {
        // No current wallet selected, select the first one
        setCurrentWallet(walletsData[0])
        localStorage.setItem('currentWalletId', walletsData[0].id)
      } else if (walletsData.length === 0) {
        // No wallets available
        setCurrentWallet(null)
        localStorage.removeItem('currentWalletId')
      }
    } catch (error) {
      console.error('Error fetching wallets:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  const selectWallet = (wallet) => {
    setCurrentWallet(wallet)
    localStorage.setItem('currentWalletId', wallet.id)
  }

  const getTotalBalance = () => {
    return wallets.reduce((total, wallet) => {
      const exchangeRate = 25400
      const balanceInVND = wallet.currency === 'USD'
          ? wallet.balance * exchangeRate
          : wallet.balance
      return total + balanceInVND
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