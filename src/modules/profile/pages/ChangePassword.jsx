import React, { useState } from 'react'
import { useAuth } from '../../auth/contexts/AuthContext'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../components/ui/card'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../../../components/ui/alert-dialog'
import { EyeIcon, EyeOffIcon, KeyRound, Trash2 } from 'lucide-react'
import { errorHandler } from '../../../shared/utils/errorHandler'
import { authService } from '../../auth/services/authService.js'
import { useNavigate } from 'react-router-dom'
import { validationUtils } from '../../../shared/utils/validationUtils'

const ChangePassword = () => {
  const { loading, deleteAccount } = useAuth()
  const [changePasswordLoading, setChangePasswordLoading] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('');
  const navigate = useNavigate();
  const CONFIRMATION_PHRASE = 'xóa tài khoản';

  const { changePassword } = authService

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Reset lỗi trước
    const newErrors = {}

    // Validate new password
    const newPasswordErrors = validationUtils.validatePassword(formData.newPassword)
    if (newPasswordErrors.length > 0) {
      newErrors.newPassword = newPasswordErrors[0]
    }

    // Confirm password check
    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp'
    }

    // Nếu có lỗi thì set state và dừng lại
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({}) // clear lỗi cũ
    setChangePasswordLoading(true)

    try {
      await changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      })

      errorHandler.showSuccess('Đổi mật khẩu thành công!')
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' })

      await authService.logout()
      navigate('/login', {
        state: { message: 'Mật khẩu đã được thay đổi. Vui lòng đăng nhập lại.' }
      })
    } catch (error) {
      errorHandler.handleApiError(error, 'Đổi mật khẩu thất bại')
    } finally {
      setChangePasswordLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirmationText.trim() !== CONFIRMATION_PHRASE) return;
    try {
      await deleteAccount();
    } catch (error) {
      console.error("Xóa tài khoản thất bại từ component", error);
    }
  }

  const handleCancelDelete = () => {
    setDeleteConfirmationText('');
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Bảo mật</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Quản lý mật khẩu và các tùy chọn bảo mật tài khoản.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <KeyRound className="w-5 h-5" />
              <span>Đổi mật khẩu</span>
            </CardTitle>
            <CardDescription>
              Nhập mật khẩu hiện tại và mật khẩu mới.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Current Password */}
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type={showPasswords.current ? 'text' : 'password'}
                    placeholder="Nhập mật khẩu hiện tại"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                    onClick={() => togglePasswordVisibility('current')}
                  >
                    {showPasswords.current ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <Label htmlFor="newPassword">Mật khẩu mới</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type={showPasswords.new ? 'text' : 'password'}
                    placeholder="Nhập mật khẩu mới"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                    onClick={() => togglePasswordVisibility('new')}
                  >
                    {showPasswords.new ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPasswords.confirm ? 'text' : 'password'}
                    placeholder="Nhập lại mật khẩu mới"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                    onClick={() => togglePasswordVisibility('confirm')}
                  >
                    {showPasswords.confirm ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={changePasswordLoading || loading}
              >
                {changePasswordLoading ? 'Đang cập nhật...' : 'Đổi mật khẩu'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-destructive">
              <Trash2 className="w-5 h-5" />
              <span>Khu vực nguy hiểm</span>
            </CardTitle>
            <CardDescription>
              Các hành động này không thể được hoàn tác.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-lg flex justify-between items-center">
              <div>
                <h4 className="font-semibold text-destructive">
                  Xóa tài khoản
                </h4>
                <p className="text-sm text-muted-foreground">
                  Xóa vĩnh viễn tài khoản và tất cả dữ liệu.
                </p>
              </div>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm" disabled={loading}>
                    {loading ? 'Đang xóa...' : 'Xóa tài khoản'}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Bạn có chắc chắn muốn xóa tài khoản?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Hành động này không thể hoàn tác. Để xác nhận, vui lòng nhập chính xác cụm từ <strong className="text-destructive dark:text-red-400">{CONFIRMATION_PHRASE}</strong> vào ô bên dưới.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <div className="my-2">
                    <Input
                      id="delete-confirm"
                      placeholder={CONFIRMATION_PHRASE}
                      value={deleteConfirmationText}
                      onChange={(e) => setDeleteConfirmationText(e.target.value)}
                      autoFocus
                    />
                  </div>
                  <AlertDialogFooter>
                    <AlertDialogCancel onClick={handleCancelDelete}>Hủy</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteAccount}
                      disabled={deleteConfirmationText.trim() !== CONFIRMATION_PHRASE || loading}
                      className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Tôi hiểu, xóa tài khoản
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ChangePassword
