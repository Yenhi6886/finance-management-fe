import React, { useState, useEffect } from 'react'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { walletService } from '../services/walletService'

const TestWalletShare = () => {
  const [wallets, setWallets] = useState([])
  const [selectedWallet, setSelectedWallet] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  useEffect(() => {
    fetchWallets()
  }, [])

  const fetchWallets = async () => {
    try {
      const response = await walletService.getWallets()
      setWallets(response.data)
    } catch (error) {
      console.error('Error fetching wallets:', error)
    }
  }

  const handleShare = async () => {
    if (!selectedWallet || !email) return

    setLoading(true)
    try {
      const shareData = {
        walletId: parseInt(selectedWallet),
        permissionLevel: 'VIEWER',
        shareMethod: 'email',
        message: message.trim() || null,
        recipients: [email.trim()]
      }

      const response = await walletService.shareWallet(shareData)
      setResult(response)
    } catch (error) {
      console.error('Error sharing wallet:', error)
      setResult({ error: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">测试钱包分享功能</h1>
        
        <div className="space-y-6">
          <div>
            <Label htmlFor="walletSelect">选择钱包</Label>
            <select
              id="walletSelect"
              value={selectedWallet}
              onChange={(e) => setSelectedWallet(e.target.value)}
              className="w-full h-12 px-4 text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">选择钱包</option>
              {wallets.map(wallet => (
                <option key={wallet.id} value={wallet.id}>
                  {wallet.name} - {wallet.balance} {wallet.currencyCode}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="email">邮箱地址</Label>
            <Input
              id="email"
              type="email"
              placeholder="输入邮箱地址"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 text-base"
            />
          </div>

          <div>
            <Label htmlFor="message">消息（可选）</Label>
            <Input
              id="message"
              placeholder="输入分享消息"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="h-12 text-base"
            />
          </div>

          <Button
            onClick={handleShare}
            disabled={!selectedWallet || !email || loading}
            className="w-full h-12 text-base font-light bg-green-600 hover:bg-green-700 text-white rounded-lg border-0"
          >
            {loading ? '分享中...' : '分享钱包'}
          </Button>

          {result && (
            <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">结果：</h3>
              <pre className="text-sm text-gray-700 dark:text-gray-300">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TestWalletShare
