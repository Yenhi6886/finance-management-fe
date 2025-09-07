import React, { useState, useEffect } from 'react'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { 
  ArrowLeftIcon,
  ShareIcon,
  UsersIcon,
  LinkIcon,
  CopyIcon,
  CheckIcon,
  MailIcon,
  MessageSquareIcon,
  Share2Icon,
  TwitterIcon,
  EyeIcon,
  SettingsIcon,
  ShieldIcon,
  ClockIcon,
  XIcon,
  AlertCircleIcon,
  QrCodeIcon,
  ShieldCheckIcon,
  StarIcon,
  LockIcon
} from 'lucide-react'
import { walletService } from '../services/walletService'

const ShareWallet = () => {
  const [wallets, setWallets] = useState([])
  const [selectedWallet, setSelectedWallet] = useState('')
  const [shareType, setShareType] = useState('view') // view, edit, full
  const [shareMethod, setShareMethod] = useState('link') // link, email, sms
  const [emailList, setEmailList] = useState('')
  const [phoneList, setPhoneList] = useState('')
  const [message, setMessage] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [shareLink, setShareLink] = useState('')
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)
  const [sharedWallets, setSharedWallets] = useState([])
  const [activeTab, setActiveTab] = useState('share') // share, manage

  useEffect(() => {
    fetchWallets()
    fetchSharedWallets()
  }, [])

  const fetchWallets = async () => {
    try {
      const response = await walletService.getWallets()
      // Chỉ lấy các ví có quyền share
      const shareableWallets = response.data.filter(wallet => 
        wallet.permissions.includes('share') || wallet.permissions.includes('full')
      )
      setWallets(shareableWallets)
    } catch (error) {
      console.error('Error fetching wallets:', error)
    }
  }

  const fetchSharedWallets = async () => {
    try {
      const response = await walletService.getSharedWallets()
      setSharedWallets(response.data)
    } catch (error) {
      console.error('Error fetching shared wallets:', error)
    }
  }

  const generateShareLink = () => {
    const wallet = wallets.find(w => w.id === selectedWallet)
    if (!wallet) return ''

    const baseUrl = window.location.origin
    const shareId = `${wallet.id}-${Date.now()}`
    return `${baseUrl}/shared-wallet/${shareId}?type=${shareType}`
  }

  const handleShare = async () => {
    if (!selectedWallet || !shareType) return

    setLoading(true)
    try {
      const shareData = {
        walletId: selectedWallet,
        shareType,
        shareMethod,
        message: message.trim(),
        expiryDate: expiryDate || null,
        recipients: shareMethod === 'email' ? emailList.split(',').map(e => e.trim()) : 
                   shareMethod === 'sms' ? phoneList.split(',').map(p => p.trim()) : []
      }

      const response = await walletService.shareWallet(shareData)
      
      if (shareMethod === 'link') {
        const link = generateShareLink()
        setShareLink(link)
      }

      // Refresh shared wallets list
      fetchSharedWallets()
      
      // Reset form
      setSelectedWallet('')
      setShareType('view')
      setEmailList('')
      setPhoneList('')
      setMessage('')
      setExpiryDate('')
    } catch (error) {
      console.error('Error sharing wallet:', error)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const revokeAccess = async (shareId) => {
    try {
      await walletService.revokeWalletAccess(shareId)
      fetchSharedWallets()
    } catch (error) {
      console.error('Error revoking access:', error)
    }
  }

  const formatCurrency = (amount, currency = 'VND') => {
    const formatted = new Intl.NumberFormat('vi-VN').format(amount)
    return currency === 'USD' ? `$${formatted}` : `${formatted} ₫`
  }

  const getPermissionColor = (type) => {
    const colors = {
      view: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      edit: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      full: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    }
    return colors[type] || colors.view
  }

  const getPermissionLabel = (type) => {
    const labels = {
      view: 'Chỉ xem',
      edit: 'Chỉnh sửa',
      full: 'Toàn quyền'
    }
    return labels[type] || 'Chỉ xem'
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Chia Sẻ Ví
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Chia sẻ ví với người khác và quản lý quyền truy cập
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Button
              onClick={() => window.history.back()}
              variant="ghost"
              size="sm"
              className="h-10 px-4 text-sm font-light bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-800/30 text-green-700 dark:text-green-400 rounded-md border-0"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-1" />
              Quay lại
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('share')}
              className={`py-3 px-1 border-b-2 font-medium text-base ${
                activeTab === 'share'
                  ? 'border-green-500 text-green-600 dark:text-green-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <ShareIcon className="w-5 h-5 mr-2 inline" />
              Chia Sẻ Ví
            </button>
            <button
              onClick={() => setActiveTab('manage')}
              className={`py-3 px-1 border-b-2 font-medium text-base ${
                activeTab === 'manage'
                  ? 'border-green-500 text-green-600 dark:text-green-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <SettingsIcon className="w-5 h-5 mr-2 inline" />
              Quản Lý Chia Sẻ
            </button>
          </nav>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {activeTab === 'share' ? (
            <>
              {/* Share Form Section */}
              <div className="lg:col-span-2">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                  <div className="p-8">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                        <ShareIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
                      </div>
                      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Chia Sẻ Ví</h2>
                    </div>

                    <div className="space-y-6">
                      {/* Wallet Selection */}
                      <div className="space-y-2">
                        <Label htmlFor="walletSelect" className="text-base font-medium">
                          Chọn ví để chia sẻ <span className="text-red-500">*</span>
                        </Label>
                        <select
                          id="walletSelect"
                          value={selectedWallet}
                          onChange={(e) => setSelectedWallet(e.target.value)}
                          className="w-full h-12 px-4 text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          <option value="">Chọn ví</option>
                          {wallets.map(wallet => (
                            <option key={wallet.id} value={wallet.id}>
                              {wallet.name} - {formatCurrency(wallet.balance, wallet.currency)}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Share Type */}
                      <div className="space-y-2">
                        <Label className="text-base font-medium">
                          Loại quyền truy cập <span className="text-red-500">*</span>
                        </Label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {[
                            {
                              type: 'view',
                              icon: EyeIcon,
                              title: 'Chỉ Xem',
                              description: 'Người dùng chỉ có thể xem thông tin ví'
                            },
                            {
                              type: 'edit',
                              icon: SettingsIcon,
                              title: 'Chỉnh Sửa',
                              description: 'Có thể xem và chỉnh sửa thông tin ví'
                            },
                            {
                              type: 'full',
                              icon: ShieldIcon,
                              title: 'Toàn Quyền',
                              description: 'Có thể thực hiện mọi thao tác'
                            }
                          ].map(({ type, icon: Icon, title, description }) => (
                            <div
                              key={type}
                              onClick={() => setShareType(type)}
                              className={`border rounded-lg p-4 cursor-pointer transition-all hover:scale-102 ${
                                shareType === type
                                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                              }`}
                            >
                              <div className="flex items-center space-x-2 mb-3">
                                <div className={`p-2 rounded-lg ${
                                  shareType === type ? 'bg-green-100 dark:bg-green-800' : 'bg-gray-100 dark:bg-gray-700'
                                }`}>
                                  <Icon className={`w-5 h-5 ${
                                    shareType === type ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'
                                  }`} />
                                </div>
                                <span className="font-medium text-gray-900 dark:text-white">
                                  {title}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {description}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Share Method */}
                      <div className="space-y-2">
                        <Label className="text-base font-medium">Phương thức chia sẻ</Label>
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { method: 'link', icon: LinkIcon, title: 'Liên Kết' },
                            { method: 'email', icon: MailIcon, title: 'Email' },
                            { method: 'sms', icon: MessageSquareIcon, title: 'SMS' }
                          ].map(({ method, icon: Icon, title }) => (
                            <Button
                              key={method}
                              variant={shareMethod === method ? 'default' : 'outline'}
                              onClick={() => setShareMethod(method)}
                              className={`h-12 text-sm font-light ${
                                shareMethod === method 
                                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                                  : 'bg-white hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600'
                              } rounded-lg border-0`}
                            >
                              <Icon className="w-4 h-4 mr-2" />
                              {title}
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Recipients */}
                      {shareMethod === 'email' && (
                        <div className="space-y-2">
                          <Label htmlFor="emailList" className="text-base font-medium">
                            Danh sách email <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="emailList"
                            placeholder="email1@example.com, email2@example.com"
                            value={emailList}
                            onChange={(e) => setEmailList(e.target.value)}
                            className="h-12 text-base"
                          />
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Ngăn cách nhiều email bằng dấu phẩy
                          </p>
                        </div>
                      )}

                      {shareMethod === 'sms' && (
                        <div className="space-y-2">
                          <Label htmlFor="phoneList" className="text-base font-medium">
                            Danh sách số điện thoại <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="phoneList"
                            placeholder="0901234567, 0987654321"
                            value={phoneList}
                            onChange={(e) => setPhoneList(e.target.value)}
                            className="h-12 text-base"
                          />
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Ngăn cách nhiều số điện thoại bằng dấu phẩy
                          </p>
                        </div>
                      )}

                      {/* Message */}
                      <div className="space-y-2">
                        <Label htmlFor="message" className="text-base font-medium">Tin nhắn (tùy chọn)</Label>
                        <textarea
                          id="message"
                          placeholder="Thêm tin nhắn cá nhân..."
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          rows={3}
                          className="w-full px-4 py-3 text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                          maxLength={500}
                        />
                        <p className="text-xs text-gray-500">
                          {message.length}/500 ký tự
                        </p>
                      </div>

                      {/* Expiry Date */}
                      <div className="space-y-2">
                        <Label htmlFor="expiryDate" className="text-base font-medium">Ngày hết hạn (tùy chọn)</Label>
                        <Input
                          id="expiryDate"
                          type="datetime-local"
                          value={expiryDate}
                          onChange={(e) => setExpiryDate(e.target.value)}
                          min={new Date().toISOString().slice(0, 16)}
                          className="h-12 text-base"
                        />
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Để trống nếu không muốn đặt thời hạn
                        </p>
                      </div>

                      {/* Share Button */}
                      <div className="pt-6">
                        <Button
                          onClick={handleShare}
                          disabled={!selectedWallet || !shareType || loading}
                          className="w-full h-12 text-base font-light bg-green-600 hover:bg-green-700 text-white rounded-lg border-0"
                        >
                          <ShareIcon className="w-5 h-5 mr-2" />
                          {loading ? 'Đang chia sẻ...' : 'Chia Sẻ Ví'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Share Link Result */}
                {shareLink && (
                  <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="p-8">
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                          <LinkIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Liên Kết Chia Sẻ</h3>
                      </div>

                      <div className="space-y-4">
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <code className="text-sm text-gray-700 dark:text-gray-300 break-all flex-1 mr-3">
                              {shareLink}
                            </code>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(shareLink)}
                              className="h-10 w-10 p-0 bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-800/30"
                            >
                              {copied ? (
                                <CheckIcon className="w-4 h-4 text-green-600" />
                              ) : (
                                <CopyIcon className="w-4 h-4 text-green-600" />
                              )}
                            </Button>
                          </div>
                        </div>

                        {/* Social Share */}
                        <div className="space-y-3">
                          <Label className="text-base font-medium">Chia sẻ qua mạng xã hội</Label>
                          <div className="grid grid-cols-3 gap-3">
                            <Button
                              variant="outline"
                              onClick={() => {
                                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareLink)}`)
                              }}
                              className="h-10 text-sm font-light bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200 rounded-lg"
                            >
                              <Share2Icon className="w-4 h-4 mr-2" />
                              Facebook
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => {
                                const text = `Hãy xem ví của tôi: ${shareLink}`
                                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`)
                              }}
                              className="h-10 text-sm font-light bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200 rounded-lg"
                            >
                              <TwitterIcon className="w-4 h-4 mr-2" />
                              Twitter
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => copyToClipboard(shareLink)}
                              className="h-10 text-sm font-light bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200 rounded-lg"
                            >
                              <QrCodeIcon className="w-4 h-4 mr-2" />
                              QR Code
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Share Tips */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                  <div className="p-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                        <StarIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Mẹo Chia Sẻ</h3>
                    </div>
                    
                    <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-start space-x-2">
                        <ShieldCheckIcon className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <p>Chỉ chia sẻ với những người bạn tin tưởng</p>
                      </div>
                      <div className="flex items-start space-x-2">
                        <ShieldCheckIcon className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <p>Đặt thời hạn cho liên kết để tăng bảo mật</p>
                      </div>
                      <div className="flex items-start space-x-2">
                        <ShieldCheckIcon className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <p>Kiểm tra quyền truy cập thường xuyên</p>
                      </div>
                      <div className="flex items-start space-x-2">
                        <ShieldCheckIcon className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <p>Sử dụng quyền "Chỉ xem" cho hầu hết trường hợp</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Permission Guide */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                  <div className="p-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                        <LockIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Hướng Dẫn Quyền</h3>
                    </div>
                    
                    <div className="space-y-4 text-sm">
                      <div className="border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                        <div className="flex items-center space-x-2 mb-2">
                          <EyeIcon className="w-4 h-4 text-blue-600" />
                          <span className="font-medium text-blue-900 dark:text-blue-100">Chỉ Xem</span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400">
                          Xem số dư, lịch sử giao dịch. Không thể thay đổi gì.
                        </p>
                      </div>
                      
                      <div className="border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                        <div className="flex items-center space-x-2 mb-2">
                          <SettingsIcon className="w-4 h-4 text-yellow-600" />
                          <span className="font-medium text-yellow-900 dark:text-yellow-100">Chỉnh Sửa</span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400">
                          Thêm/sửa ghi chú, phân loại giao dịch. Không thể chuyển tiền.
                        </p>
                      </div>
                      
                      <div className="border border-red-200 dark:border-red-800 rounded-lg p-3">
                        <div className="flex items-center space-x-2 mb-2">
                          <ShieldIcon className="w-4 h-4 text-red-600" />
                          <span className="font-medium text-red-900 dark:text-red-100">Toàn Quyền</span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400">
                          Có thể thực hiện mọi thao tác như chủ ví.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Manage Shared Wallets */
            <div className="lg:col-span-3">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                        <UsersIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Ví Đã Chia Sẻ</h2>
                        <p className="text-gray-600 dark:text-gray-400">Quản lý các ví bạn đã chia sẻ</p>
                      </div>
                    </div>
                    <div className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-4 py-2 rounded-full text-sm font-medium">
                      {sharedWallets.length} ví
                    </div>
                  </div>

                  {sharedWallets.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ShareIcon className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                        Chưa có ví nào được chia sẻ
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Bắt đầu chia sẻ ví với người khác để quản lý tài chính cùng nhau
                      </p>
                      <Button
                        onClick={() => setActiveTab('share')}
                        className="h-12 px-6 text-base font-light bg-green-600 hover:bg-green-700 text-white rounded-lg border-0"
                      >
                        <ShareIcon className="w-5 h-5 mr-2" />
                        Chia Sẻ Ví Đầu Tiên
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {sharedWallets.map(share => (
                        <div key={share.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-4 mb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                                  <span className="text-white font-bold text-lg">{share.wallet.icon}</span>
                                </div>
                                <div>
                                  <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                                    {share.wallet.name}
                                  </h4>
                                  <p className="text-gray-600 dark:text-gray-400">
                                    {formatCurrency(share.wallet.balance, share.wallet.currency)}
                                  </p>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-sm">
                                <div>
                                  <span className="text-gray-600 dark:text-gray-400 font-medium">Quyền truy cập:</span>
                                  <div className="mt-2">
                                    <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getPermissionColor(share.shareType)}`}>
                                      {getPermissionLabel(share.shareType)}
                                    </span>
                                  </div>
                                </div>
                                
                                <div>
                                  <span className="text-gray-600 dark:text-gray-400 font-medium">Chia sẻ với:</span>
                                  <p className="text-gray-900 dark:text-white mt-2">
                                    {share.recipients?.length || 0} người
                                  </p>
                                </div>
                                
                                <div>
                                  <span className="text-gray-600 dark:text-gray-400 font-medium">Ngày tạo:</span>
                                  <p className="text-gray-900 dark:text-white mt-2">
                                    {new Date(share.createdAt).toLocaleDateString('vi-VN')}
                                  </p>
                                </div>

                                <div>
                                  <span className="text-gray-600 dark:text-gray-400 font-medium">Trạng thái:</span>
                                  <p className="text-green-600 dark:text-green-400 mt-2">
                                    Đang hoạt động
                                  </p>
                                </div>
                              </div>

                              {share.expiryDate && (
                                <div className="mt-4 flex items-center text-sm text-orange-600 bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3">
                                  <ClockIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                                  <span>Hết hạn: {new Date(share.expiryDate).toLocaleDateString('vi-VN')}</span>
                                </div>
                              )}

                              {share.recipients && share.recipients.length > 0 && (
                                <div className="mt-4">
                                  <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Người được chia sẻ:</span>
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    {share.recipients.map((recipient, index) => (
                                      <span
                                        key={index}
                                        className="inline-flex px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full"
                                      >
                                        {recipient}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>

                            <div className="flex items-center space-x-3 ml-6">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => copyToClipboard(share.shareLink || generateShareLink())}
                                className="h-10 w-10 p-0 bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-800/30 border-green-200"
                              >
                                <CopyIcon className="w-4 h-4 text-green-600" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => revokeAccess(share.id)}
                                className="h-10 w-10 p-0 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-800/30 border-red-200"
                              >
                                <XIcon className="w-4 h-4 text-red-600" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Security Notice */}
              <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="p-6">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                      <AlertCircleIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-yellow-800 dark:text-yellow-200 mb-3">
                        Lưu ý bảo mật
                      </h4>
                      <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-2">
                        <li className="flex items-start space-x-2">
                          <span className="text-yellow-600 mt-1">•</span>
                          <span>Chỉ chia sẻ ví với những người bạn tin tưởng</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-yellow-600 mt-1">•</span>
                          <span>Thường xuyên kiểm tra và thu hồi quyền truy cập không cần thiết</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-yellow-600 mt-1">•</span>
                          <span>Đặt thời hạn cho các liên kết chia sẻ để tăng tính bảo mật</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-yellow-600 mt-1">•</span>
                          <span>Theo dõi hoạt động của ví được chia sẻ</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ShareWallet
