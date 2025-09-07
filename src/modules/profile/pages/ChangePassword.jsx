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

const ChangePassword = () => {
  // LẤY HÀM deleteAccount từ CONTEXT
  const { loading, deleteAccount } = useAuth()
  const [changePasswordLoading, setChangePasswordLoading] = useState(false);

  // Vẫn sử dụng authService cho changePassword vì nó không cần quản lý state toàn cục
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

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setChangePasswordLoading(true);
    try {
      await changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      })
      errorHandler.showSuccess('Đổi mật khẩu thành công!');
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      errorHandler.handleApiError(error, 'Đổi mật khẩu thất bại');
    } finally {
      setChangePasswordLoading(false);
    }
  }

  // SỬ DỤNG HÀM deleteAccount TỪ CONTEXT
  const handleDeleteAccount = async () => {
    try {
      await deleteAccount();
      // AuthContext sẽ tự động xử lý việc clear data và chuyển hướng
      // nên chúng ta không cần làm gì thêm ở đây.
    } catch (error) {
      // AuthContext cũng đã xử lý việc hiển thị lỗi
      console.error("Xóa tài khoản thất bại từ component", error);
    }
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
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
                  <div className="relative">
                    <Input
                        id="currentPassword"
                        name="currentPassword"
                        type={showPasswords.current ? 'text' : 'password'}
                        placeholder="••••••••"
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

                <div className="space-y-2">
                  <Label htmlFor="newPassword">Mật khẩu mới</Label>
                  <div className="relative">
                    <Input
                        id="newPassword"
                        name="newPassword"
                        type={showPasswords.new ? 'text' : 'password'}
                        placeholder="••••••••"
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
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
                  <div className="relative">
                    <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showPasswords.confirm ? 'text' : 'password'}
                        placeholder="••••••••"
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
                      <AlertDialogTitle>Bạn có chắc chắn không?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Hành động này không thể hoàn tác. Việc này sẽ xóa vĩnh viễn tài khoản của bạn và xóa dữ liệu của bạn khỏi máy chủ của chúng tôi.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Hủy</AlertDialogCancel>
                      <AlertDialogAction
                          onClick={handleDeleteAccount}
                          className="bg-red-600 hover:bg-red-700"
                      >
                        Tiếp tục
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