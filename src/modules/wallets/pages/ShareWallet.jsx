import React, { useState, useEffect } from 'react'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card'
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
  LockIcon,
  TrashIcon,
  EditIcon,
  UserIcon,
  CrownIcon
} from 'lucide-react'
import { walletService } from '../services/walletService'
import { toast } from 'sonner'

const ShareWallet = () => {
  const [wallets, setWallets] = useState([])
  const [selectedWallet, setSelectedWallet] = useState('')
  const [shareType, setShareType] = useState('viewer') // viewer, editor, owner
  const [shareMethod, setShareMethod] = useState('email') // link, email, sms
  const [emailList, setEmailList] = useState('')
  const [phoneList, setPhoneList] = useState('')
  const [message, setMessage] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [shareLink, setShareLink] = useState('')
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)
  const [sharedWallets, setSharedWallets] = useState([])
  const [sharedWithMe, setSharedWithMe] = useState([])
  const [activeTab, setActiveTab] = useState('share') // share, manage, received
  const [emailError, setEmailError] = useState('')
  const [isRevoking, setIsRevoking] = useState(null)
  const [debugInfo, setDebugInfo] = useState(null)

  useEffect(() => {
    fetchWallets()
    fetchSharedWallets()
    fetchSharedWithMe()
  }, [])

  const fetchWallets = async () => {
    try {
      const response = await walletService.getWallets()
      setWallets(response.data.data || [])
    } catch (error) {
      console.error('Error fetching wallets:', error)
      toast.error('Không thể tải danh sách ví')
    }
  }

  const fetchSharedWallets = async () => {
    try {
      const response = await walletService.getSharedWalletsByMe()
      setSharedWallets(response.data.data || [])
    } catch (error) {
      console.error('Error fetching shared wallets:', error)
      toast.error('Không thể tải danh sách ví đã chia sẻ')
    }
  }

  const fetchSharedWithMe = async () => {
    try {
      const response = await walletService.getSharedWallets()
      setSharedWithMe(response.data.data || [])
    } catch (error) {
      console.error('Error fetching shared with me:', error)
      toast.error('Không thể tải danh sách ví được chia sẻ')
    }
  }

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email.trim())
  }

  const validateEmailList = (emailString) => {
    if (!emailString.trim()) return { isValid: false, error: 'Vui lòng nhập email người nhận' }
    
    const email = emailString.trim()
    if (!validateEmail(email)) {
      return { isValid: false, error: 'Email không hợp lệ' }
    }
    
    return { isValid: true, emails: [email] }
  }

  const generateShareLink = () => {
    const wallet = wallets.find(w => w.id === selectedWallet)
    if (!wallet) return ''

    const baseUrl = window.location.origin
    const shareId = `${wallet.id}-${Date.now()}`
    return `${baseUrl}/shared-wallet/${shareId}?type=${shareType}`
  }

  // Map frontend permission to backend permission
  const mapPermissionToBackend = (frontendPermission) => {
    const mapping = {
      'viewer': 'VIEW',
      'editor': 'EDIT', 
      'owner': 'ADMIN'
    }
    return mapping[frontendPermission] || 'VIEW'
  }

  const handleShare = async () => {
    if (!selectedWallet || !shareType) {
      toast.error('Vui lòng chọn ví và loại quyền truy cập')
      return
    }

    // For now, only support email sharing as per backend API
    if (shareMethod !== 'email') {
      toast.error('Hiện tại chỉ hỗ trợ chia sẻ qua email')
      return
    }

    // Validate email
    const emailValidation = validateEmailList(emailList)
    if (!emailValidation.isValid) {
      setEmailError(emailValidation.error)
      toast.error(emailValidation.error)
      return
    }
    setEmailError('')

    // Backend only supports single email, so we'll share with the first email
    const firstEmail = emailValidation.emails[0]
    
    setLoading(true)
    try {
      const shareData = {
        walletId: parseInt(selectedWallet),
        email: firstEmail,
        permissionLevel: mapPermissionToBackend(shareType),
        message: message.trim() || null
      }

      console.log('Sending share data:', shareData) // Debug log
      const response = await walletService.shareWallet(shareData)
      console.log('Share response:', response) // Debug log
      
      // Check if response is successful
      if (!response || !response.data) {
        throw new Error('Không nhận được phản hồi từ máy chủ')
      }
      
      // Refresh shared wallets list
      await fetchSharedWallets()
      
      // Reset form
      setSelectedWallet('')
      setShareType('viewer')
      setEmailList('')
      setMessage('')
      setExpiryDate('')
      setEmailError('')
      
      toast.success('Chia sẻ ví thành công!')
    } catch (error) {
      console.error('Error sharing wallet:', error)
      
      // Set debug info for development
      setDebugInfo({
        error: error.message,
        status: error.response?.status,
        data: error.response?.data,
        request: error.request
      })
      
      // Detailed error handling
      let errorMessage = 'Có lỗi xảy ra khi chia sẻ ví'
      
      if (error.response) {
        // Server responded with error status
        const status = error.response.status
        const data = error.response.data
        
        if (status === 400) {
          errorMessage = data?.message || 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin.'
        } else if (status === 401) {
          errorMessage = 'Bạn cần đăng nhập để thực hiện thao tác này.'
        } else if (status === 403) {
          errorMessage = 'Bạn không có quyền chia sẻ ví này.'
        } else if (status === 404) {
          errorMessage = 'Không tìm thấy ví được chọn.'
        } else if (status === 500) {
          errorMessage = 'Lỗi máy chủ. Vui lòng thử lại sau.'
        } else {
          errorMessage = data?.message || `Lỗi ${status}: ${data?.error || 'Không xác định'}`
        }
      } else if (error.request) {
        // Network error
        errorMessage = 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.'
      } else {
        // Other error
        errorMessage = error.message || 'Có lỗi không xác định xảy ra.'
      }
      
      toast.error(errorMessage)
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
    setIsRevoking(shareId)
    try {
      await walletService.revokeWalletAccess(shareId)
      await fetchSharedWallets()
      toast.success('Đã thu hồi quyền truy cập thành công')
    } catch (error) {
      console.error('Error revoking access:', error)
      toast.error('Có lỗi xảy ra khi thu hồi quyền truy cập')
    } finally {
      setIsRevoking(null)
    }
  }

  const updatePermission = async (shareId, newPermission) => {
    try {
      await walletService.updateSharePermission(shareId, newPermission)
      await fetchSharedWallets()
      toast.success('Cập nhật quyền truy cập thành công')
    } catch (error) {
      console.error('Error updating permission:', error)
      toast.error('Có lỗi xảy ra khi cập nhật quyền truy cập')
    }
  }

  const formatCurrency = (amount, currency = 'VND') => {
    const formatted = new Intl.NumberFormat('vi-VN').format(amount)
    return currency === 'USD' ? `$${formatted}` : `${formatted} ₫`
  }

  const getPermissionColor = (type) => {
    const colors = {
      VIEW: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      EDIT: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      ADMIN: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      viewer: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      editor: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      owner: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    }
    return colors[type] || colors.VIEW
  }

  const getPermissionLabel = (type) => {
    const labels = {
      VIEW: 'Người xem',
      EDIT: 'Chỉnh sửa',
      ADMIN: 'Chủ sở hữu',
      viewer: 'Người xem',
      editor: 'Chỉnh sửa',
      owner: 'Chủ sở hữu'
    }
    return labels[type] || 'Người xem'
  }

  const getPermissionIcon = (type) => {
    if (type === 'ADMIN' || type === 'owner') return CrownIcon
    if (type === 'EDIT' || type === 'editor') return SettingsIcon
    return EyeIcon
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
              Ví Đã Chia Sẻ ({sharedWallets.length})
            </button>
            <button
              onClick={() => setActiveTab('received')}
              className={`py-3 px-1 border-b-2 font-medium text-base ${
                activeTab === 'received'
                  ? 'border-green-500 text-green-600 dark:text-green-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <UserIcon className="w-5 h-5 mr-2 inline" />
              Ví Được Chia Sẻ ({sharedWithMe.length})
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
                              type: 'viewer',
                              icon: EyeIcon,
                              title: 'Người Xem',
                              description: 'Chỉ có thể xem thông tin ví và lịch sử giao dịch',
                              color: 'blue'
                            },
                            {
                              type: 'editor',
                              icon: SettingsIcon,
                              title: 'Chỉnh Sửa',
                              description: 'Thêm/sửa ghi chú, phân loại giao dịch. Không thể chuyển tiền',
                              color: 'yellow'
                            },
                            {
                              type: 'owner',
                              icon: CrownIcon,
                              title: 'Chủ Sở Hữu',
                              description: 'Có thể thực hiện mọi thao tác như chủ ví',
                              color: 'red'
                            }
                          ].map(({ type, icon: Icon, title, description, color }) => (
                            <div
                              key={type}
                              onClick={() => setShareType(type)}
                              className={`border rounded-lg p-4 cursor-pointer transition-all hover:scale-102 ${
                                shareType === type
                                  ? color === 'blue'
                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                    : color === 'yellow'
                                    ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                                    : 'border-red-500 bg-red-50 dark:bg-red-900/20'
                                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                              }`}
                            >
                              <div className="flex items-center space-x-3 mb-3">
                                <div className={`p-3 rounded-lg ${
                                  shareType === type 
                                    ? color === 'blue'
                                      ? 'bg-blue-100 dark:bg-blue-800'
                                      : color === 'yellow'
                                      ? 'bg-yellow-100 dark:bg-yellow-800'
                                      : 'bg-red-100 dark:bg-red-800'
                                    : 'bg-gray-100 dark:bg-gray-700'
                                }`}>
                                  <Icon className={`w-6 h-6 ${
                                    shareType === type 
                                      ? color === 'blue'
                                        ? 'text-blue-600 dark:text-blue-400'
                                        : color === 'yellow'
                                        ? 'text-yellow-600 dark:text-yellow-400'
                                        : 'text-red-600 dark:text-red-400'
                                      : 'text-gray-600 dark:text-gray-400'
                                  }`} />
                                </div>
                                <div>
                                  <span className="font-semibold text-gray-900 dark:text-white text-lg">
                                    {title}
                                  </span>
                                  {shareType === type && (
                                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ml-2 ${
                                      color === 'blue' 
                                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                        : color === 'yellow'
                                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                    }`}>
                                      Đã chọn
                                    </div>
                                  )}
                                </div>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {description}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Share Method - Only Email for now */}
                      <div className="space-y-2">
                        <Label className="text-base font-medium">Phương thức chia sẻ</Label>
                        <div className="flex items-center space-x-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <MailIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          <span className="text-blue-800 dark:text-blue-200 font-medium">Email</span>
                          <span className="text-sm text-blue-600 dark:text-blue-400">(Phương thức duy nhất hiện tại)</span>
                        </div>
                      </div>

                      {/* Email Recipient */}
                      <div className="space-y-2">
                        <Label htmlFor="emailList" className="text-base font-medium">
                          Email người nhận <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="emailList"
                          placeholder="user@example.com"
                          value={emailList}
                          onChange={(e) => {
                            setEmailList(e.target.value)
                            setEmailError('')
                          }}
                          className={`h-12 text-base ${emailError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                        />
                        {emailError && (
                          <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
                            <AlertCircleIcon className="w-4 h-4 mr-1" />
                            {emailError}
                          </p>
                        )}
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Nhập email của người bạn muốn chia sẻ ví. Hiện tại chỉ hỗ trợ một email mỗi lần.
                        </p>
                      </div>


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
                          disabled={!selectedWallet || !shareType || loading || !emailList.trim()}
                          className="w-full h-12 text-base font-light bg-green-600 hover:bg-green-700 text-white rounded-lg border-0 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loading ? (
                            <>
                              <div className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Đang chia sẻ...
                            </>
                          ) : (
                            <>
                              <ShareIcon className="w-5 h-5 mr-2" />
                              Chia Sẻ Ví
                            </>
                          )}
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

              {/* Debug Panel - Only show in development */}
              {debugInfo && process.env.NODE_ENV === 'development' && (
                <div className="mt-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-red-800 dark:text-red-200 mb-2">Debug Information:</h4>
                  <pre className="text-xs text-red-700 dark:text-red-300 whitespace-pre-wrap">
                    {JSON.stringify(debugInfo, null, 2)}
                  </pre>
                  <Button
                    onClick={() => setDebugInfo(null)}
                    variant="outline"
                    size="sm"
                    className="mt-2 text-red-600 border-red-300 hover:bg-red-100"
                  >
                    Đóng Debug
                  </Button>
                </div>
              )}
            </>
          ) : activeTab === 'manage' ? (
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
                      {sharedWallets.map(share => {
                        const PermissionIcon = getPermissionIcon(share.permissionLevel || share.permission || share.shareType)
                        return (
                          <Card key={share.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-6">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-4 mb-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                                      <span className="text-white font-bold text-lg">{share.wallet?.icon || '💰'}</span>
                                    </div>
                                    <div>
                                      <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                                        {share.wallet?.name || share.walletName || 'Ví không xác định'}
                                      </h4>
                                      <p className="text-gray-600 dark:text-gray-400">
                                        {formatCurrency(share.wallet?.balance || 0, share.wallet?.currency || 'VND')}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-sm">
                                    <div>
                                      <span className="text-gray-600 dark:text-gray-400 font-medium">Quyền truy cập:</span>
                                      <div className="mt-2">
                                        <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${getPermissionColor(share.permissionLevel || share.permission || share.shareType)}`}>
                                          <PermissionIcon className="w-3 h-3 mr-1" />
                                          {getPermissionLabel(share.permissionLevel || share.permission || share.shareType)}
                                        </span>
                                      </div>
                                    </div>
                                    
                                    <div>
                                      <span className="text-gray-600 dark:text-gray-400 font-medium">Chia sẻ với:</span>
                                      <p className="text-gray-900 dark:text-white mt-2">
                                        {share.sharedWithName || 'Không xác định'}
                                      </p>
                                    </div>
                                    
                                    <div>
                                      <span className="text-gray-600 dark:text-gray-400 font-medium">Ngày tạo:</span>
                                      <p className="text-gray-900 dark:text-white mt-2">
                                        {new Date(share.createdAt || share.created_at).toLocaleDateString('vi-VN')}
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

                                  {share.sharedWithEmail && (
                                    <div className="mt-4">
                                      <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Người được chia sẻ:</span>
                                      <div className="flex flex-wrap gap-2 mt-2">
                                        <span className="inline-flex items-center px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">
                                          <UserIcon className="w-3 h-3 mr-1" />
                                          {share.sharedWithName || share.sharedWithEmail}
                                        </span>
                                      </div>
                                    </div>
                                  )}
                                </div>

                                <div className="flex items-center space-x-2 ml-6">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => copyToClipboard(share.shareLink || generateShareLink())}
                                    className="h-10 w-10 p-0 bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-800/30 border-green-200"
                                    title="Sao chép liên kết"
                                  >
                                    <CopyIcon className="w-4 h-4 text-green-600" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => revokeAccess(share.id)}
                                    disabled={isRevoking === share.id}
                                    className="h-10 w-10 p-0 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-800/30 border-red-200 disabled:opacity-50"
                                    title="Thu hồi quyền truy cập"
                                  >
                                    {isRevoking === share.id ? (
                                      <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                      <TrashIcon className="w-4 h-4 text-red-600" />
                                    )}
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )
                      })}
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
          ) : (
            /* Received Shared Wallets */
            <div className="lg:col-span-3">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                        <UserIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Ví Được Chia Sẻ</h2>
                        <p className="text-gray-600 dark:text-gray-400">Các ví được chia sẻ với bạn</p>
                      </div>
                    </div>
                    <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-4 py-2 rounded-full text-sm font-medium">
                      {sharedWithMe.length} ví
                    </div>
                  </div>

                  {sharedWithMe.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                        <UserIcon className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                        Chưa có ví nào được chia sẻ với bạn
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Khi ai đó chia sẻ ví với bạn, nó sẽ xuất hiện ở đây
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {sharedWithMe.map(share => {
                        const PermissionIcon = getPermissionIcon(share.permission || share.shareType)
                        return (
                          <Card key={share.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-6">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-4 mb-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                                      <span className="text-white font-bold text-lg">{share.wallet?.icon || '💰'}</span>
                                    </div>
                                    <div>
                                      <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                                        {share.wallet?.name || 'Ví không xác định'}
                                      </h4>
                                      <p className="text-gray-600 dark:text-gray-400">
                                        {formatCurrency(share.wallet?.balance || 0, share.wallet?.currency || 'VND')}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                                    <div>
                                      <span className="text-gray-600 dark:text-gray-400 font-medium">Quyền của bạn:</span>
                                      <div className="mt-2">
                                        <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${getPermissionColor(share.permission || share.shareType)}`}>
                                          <PermissionIcon className="w-3 h-3 mr-1" />
                                          {getPermissionLabel(share.permission || share.shareType)}
                                        </span>
                                      </div>
                                    </div>
                                    
                                    <div>
                                      <span className="text-gray-600 dark:text-gray-400 font-medium">Chia sẻ bởi:</span>
                                      <p className="text-gray-900 dark:text-white mt-2">
                                        {share.sharedBy?.name || share.sharedBy?.email || 'Không xác định'}
                                      </p>
                                    </div>
                                    
                                    <div>
                                      <span className="text-gray-600 dark:text-gray-400 font-medium">Ngày nhận:</span>
                                      <p className="text-gray-900 dark:text-white mt-2">
                                        {new Date(share.createdAt || share.created_at).toLocaleDateString('vi-VN')}
                                      </p>
                                    </div>
                                  </div>

                                  {share.expiryDate && (
                                    <div className="mt-4 flex items-center text-sm text-orange-600 bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3">
                                      <ClockIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                                      <span>Hết hạn: {new Date(share.expiryDate).toLocaleDateString('vi-VN')}</span>
                                    </div>
                                  )}

                                  {share.message && (
                                    <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                      <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Tin nhắn:</span>
                                      <p className="text-sm text-gray-900 dark:text-white mt-1">{share.message}</p>
                                    </div>
                                  )}
                                </div>

                                <div className="flex items-center space-x-2 ml-6">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => window.open(`/wallets/${share.wallet?.id}`, '_blank')}
                                    className="h-10 px-4 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-800/30 border-blue-200 text-blue-700 dark:text-blue-400"
                                    title="Xem chi tiết ví"
                                  >
                                    <EyeIcon className="w-4 h-4 mr-1" />
                                    Xem
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  )}
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
