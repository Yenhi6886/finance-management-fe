import React, { useState } from 'react'
import { useAuth } from '../../auth/contexts/AuthContext.jsx'
import { useLanguage } from '../../../shared/contexts/LanguageContext.jsx'
import { Button } from '../../../components/ui/button.jsx'
import { Input } from '../../../components/ui/input.jsx'
import { Label } from '../../../components/ui/label.jsx'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../components/ui/card.jsx'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../../../components/ui/alert-dialog.jsx'
import { EyeIcon, EyeOffIcon, KeyRound, Trash2 } from 'lucide-react'
import { errorHandler } from '../../../shared/utils/errorHandler.js'
import { authService } from '../../auth/services/authService.js'
import { useNavigate } from 'react-router-dom'
import { validationUtils } from '../../../shared/utils/validationUtils.js'

const ChangePassword = () => {
  const { loading, deleteAccount } = useAuth()
  const { t } = useLanguage()
  const [changePasswordLoading, setChangePasswordLoading] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('');
  const navigate = useNavigate();
  const CONFIRMATION_PHRASE = t('profile.changePassword.deleteConfirm.placeholder');

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
      newErrors.confirmPassword = t('profile.changePassword.validationErrors.passwordMismatch')
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

      errorHandler.showSuccess(t('profile.changePassword.successMessage'))
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' })

      await authService.logout()
      navigate('/login', {
        state: { message: t('profile.changePassword.successMessage') }
      })
    } catch (error) {
      errorHandler.handleApiError(error, t('profile.changePassword.updateError'))
    } finally {
      setChangePasswordLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirmationText.trim() !== CONFIRMATION_PHRASE) return;
    try {
      await deleteAccount();
    } catch (error) {
      console.error(t('profile.changePassword.deleteAccountError'), error);
    }
  }

  const handleCancelDelete = () => {
    setDeleteConfirmationText('');
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('profile.changePassword.title')}</h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t('profile.changePassword.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <KeyRound className="w-5 h-5" />
              <span>{t('profile.changePassword.changePasswordTitle')}</span>
            </CardTitle>
            <CardDescription>
              {t('profile.changePassword.changePasswordDesc')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Current Password */}
              <div className="space-y-2">
                <Label htmlFor="currentPassword">{t('profile.changePassword.currentPassword')}</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type={showPasswords.current ? 'text' : 'password'}
                    placeholder={t('profile.changePassword.currentPasswordPlaceholder')}
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
                <Label htmlFor="newPassword">{t('profile.changePassword.newPassword')}</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type={showPasswords.new ? 'text' : 'password'}
                    placeholder={t('profile.changePassword.newPasswordPlaceholder')}
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
                <Label htmlFor="confirmPassword">{t('profile.changePassword.confirmPassword')}</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPasswords.confirm ? 'text' : 'password'}
                    placeholder={t('profile.changePassword.confirmPasswordPlaceholder')}
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
                {changePasswordLoading ? t('profile.changePassword.updating') : t('profile.changePassword.updateButton')}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-destructive">
              <Trash2 className="w-5 h-5" />
              <span>{t('profile.changePassword.dangerZone')}</span>
            </CardTitle>
            <CardDescription>
              {t('profile.changePassword.dangerZoneDesc')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-lg flex justify-between items-center">
              <div>
                <h4 className="font-semibold text-destructive">
                  {t('profile.changePassword.deleteAccount')}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {t('profile.changePassword.deleteAccountDesc')}
                </p>
              </div>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm" disabled={loading}>
                    {loading ? t('profile.changePassword.deleting') : t('profile.changePassword.deleteButton')}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{t('profile.changePassword.deleteConfirm.title')}</AlertDialogTitle>
                    <AlertDialogDescription>
                      {t('profile.changePassword.deleteConfirm.description', { phrase: CONFIRMATION_PHRASE })}
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
                    <AlertDialogCancel onClick={handleCancelDelete}>{t('common.cancel')}</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteAccount}
                      disabled={deleteConfirmationText.trim() !== CONFIRMATION_PHRASE || loading}
                      className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {t('profile.changePassword.deleteConfirm.confirm')}
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
