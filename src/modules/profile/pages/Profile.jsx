import React, { useState, useEffect } from 'react'
import { useAuth } from '../../auth/contexts/AuthContext.jsx'
import { Button } from '../../../components/ui/button.jsx'
import { Input } from '../../../components/ui/input.jsx'
import { Label } from '../../../components/ui/label.jsx'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../components/ui/card.jsx'
import { Avatar } from '../../../components/ui/avatar.jsx'
import { CameraIcon, Loader2 } from 'lucide-react'

const Profile = () => {
  // Lấy hàm uploadAvatar từ AuthContext
  const { user, updateProfile, loading, uploadAvatar } = useAuth()

  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phoneNumber: user?.phoneNumber || '',
  })

  const [avatarPreview, setAvatarPreview] = useState(user?.avatarUrl || null)
  const [isUploading, setIsUploading] = useState(false)

  // Đồng bộ avatarPreview khi user.avatarUrl thay đổi
  useEffect(() => {
    setAvatarPreview(user?.avatarUrl || null)
  }, [user?.avatarUrl])

  // Đồng bộ formData khi user thay đổi
  useEffect(() => {
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phoneNumber: user?.phoneNumber || '',
    })
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setAvatarPreview(URL.createObjectURL(file))
    setIsUploading(true)

    try {
      // Sử dụng hàm uploadAvatar từ AuthContext
      await uploadAvatar(file)
      // Avatar đã được cập nhật tự động trong AuthContext
      
    } catch (error) {
      // Khôi phục preview nếu có lỗi
      setAvatarPreview(user?.avatarUrl || null)
    } finally {
      setIsUploading(false)
      e.target.value = null;
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const updateData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      phoneNumber: formData.phoneNumber,
    }
    try {
      await updateProfile(updateData)
    } catch (error) {
      // Error is handled in AuthContext
    }
  }

  const resetForm = () => {
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phoneNumber: user?.phoneNumber || '',
    })
    // avatarPreview sẽ được đồng bộ tự động qua useEffect
  }

  return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Thông tin cá nhân</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Quản lý thông tin tài khoản của bạn
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Ảnh đại diện</CardTitle>
              <CardDescription>
                Nhấp vào ảnh để thay đổi.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center space-y-4">
                <label htmlFor="avatar-upload" className="relative cursor-pointer group">
                  <Avatar 
                    src={avatarPreview}
                    alt={`${user?.username} avatar`}
                    size="2xl"
                    className="border-4 border-gray-200 dark:border-gray-700 group-hover:opacity-75 transition-opacity"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    {isUploading ? (
                        <Loader2 className="w-6 h-6 text-white animate-spin" />
                    ) : (
                        <CameraIcon className="w-6 h-6 text-white" />
                    )}
                  </div>
                </label>
                <input
                    id="avatar-upload"
                    type="file"
                    accept="image/png, image/jpeg"
                    onChange={handleAvatarChange}
                    className="hidden"
                    disabled={isUploading}
                />
                <p className="text-xs text-gray-500 text-center">
                  Hỗ trợ JPG, PNG. Tối đa 5MB.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Thông tin tài khoản</CardTitle>
              <CardDescription>
                Cập nhật các thông tin cá nhân của bạn.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Tên đăng nhập</Label>
                  <Input id="username" type="text" value={user?.username || ''} disabled className="bg-gray-100 dark:bg-gray-800" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={user?.email || ''} disabled className="bg-gray-100 dark:bg-gray-800" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Họ</Label>
                    <Input id="firstName" name="firstName" type="text" placeholder="Nhập họ của bạn" value={formData.firstName} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Tên</Label>
                    <Input id="lastName" name="lastName" type="text" placeholder="Nhập tên của bạn" value={formData.lastName} onChange={handleChange} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Số điện thoại</Label>
                  <Input id="phoneNumber" name="phoneNumber" type="tel" placeholder="Nhập số điện thoại" value={formData.phoneNumber} onChange={handleChange} />
                </div>

                <div className="flex justify-end space-x-4">
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Hủy
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Đang cập nhật...' : 'Cập nhật thông tin'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
  )
}

export default Profile