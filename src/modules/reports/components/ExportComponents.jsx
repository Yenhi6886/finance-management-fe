import React, { useEffect, useState } from 'react'
import { Button } from '../../../components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card.jsx'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../../components/ui/dialog.jsx'
import { Input } from '../../../components/ui/input.jsx'
import { Label } from '../../../components/ui/label.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select.jsx'
import { Switch } from '../../../components/ui/switch.jsx'
import { toast } from 'sonner'
import { Download, Mail, FileText, Settings, Send, Loader2 } from 'lucide-react'
import { useAuth } from '../../auth/contexts/AuthContext.jsx'
import exportService from '../services/exportService.js'
import emailService from '../services/emailService.js'
import { useLanguage } from '../../../shared/contexts/LanguageContext.jsx'

const ExportDialog = ({ buildReportRequest, title }) => {
  const { t } = useLanguage()
  const [exportFormat, setExportFormat] = useState('excel')
  const [loading, setLoading] = useState(false)

  const handleExport = async () => {
    setLoading(true)
    try {
      const request = buildReportRequest?.()
      if (!request) throw new Error(t('reports.export.errors.missingParams'))
      if (exportFormat === 'excel') {
        await exportService.exportExcel(request)
      } else {
        await exportService.exportPdf(request)
      }
      toast.success(t('reports.export.success', { title }))
    } catch (error) {
      console.error(error)
      toast.error(error?.response?.data || t('reports.export.errors.exportFailed'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          {t('reports.export.exportFile')}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('reports.export.exportTitle', { title })}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>{t('reports.export.fileFormat')}</Label>
            <Select value={exportFormat} onValueChange={setExportFormat}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="excel">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4" />
                    <span>Excel (.xlsx)</span>
                  </div>
                </SelectItem>
                <SelectItem value="pdf">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4" />
                    <span>PDF (.pdf)</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button 
            onClick={handleExport} 
            disabled={loading}
            className="w-full"
          >
            {loading ? t('reports.export.exporting') : t('reports.export.exportFormat', { format: exportFormat.toUpperCase() })}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

const EmailSettingsDialog = ({ defaultTime = { hour: 8, minute: 0 } }) => {
  const { user } = useAuth() // Get current user info
  const { t } = useLanguage()
  const [emailSettings, setEmailSettings] = useState({
    targetEmail: '',
    dailyEnabled: false,
    weeklyEnabled: false,
    monthlyEnabled: false,
    sendHour: defaultTime.hour,
    sendMinute: defaultTime.minute,
    weeklyDayOfWeek: 1,
    monthlyDayOfMonth: 1,
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await emailService.getSettings()
        if (res?.data) {
          const data = res.data
          setEmailSettings(prev => ({
            ...prev,
            targetEmail: data?.targetEmail || user?.email || '',
            dailyEnabled: !!data?.dailyEnabled,
            weeklyEnabled: !!data?.weeklyEnabled,
            monthlyEnabled: !!data?.monthlyEnabled,
            sendHour: data?.sendHour ?? defaultTime.hour,
            sendMinute: data?.sendMinute ?? defaultTime.minute,
            weeklyDayOfWeek: data?.weeklyDayOfWeek ?? 1,
            monthlyDayOfMonth: data?.monthlyDayOfMonth ?? 1,
          }))
        } else {
          // If no settings yet, use user email as default
          setEmailSettings(prev => ({
            ...prev,
            targetEmail: user?.email || '',
          }))
        }
      } catch (e) {
        console.warn(t('reports.email.warnings.loadSettingsFailed'), e)
        // If error, still use user email as default
        setEmailSettings(prev => ({
          ...prev,
          targetEmail: user?.email || '',
        }))
      }
    }
    load()
  }, [user?.email, defaultTime.hour, defaultTime.minute])

  const handleSaveSettings = async () => {
    // Check email if entered
    if (emailSettings.targetEmail && emailSettings.targetEmail.trim() !== '') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(emailSettings.targetEmail.trim())) {
        toast.error(t('reports.email.errors.invalidEmail'))
        return
      }
    }

    setLoading(true)
    try {
      await emailService.saveSettings(emailSettings)
      toast.success(t('reports.email.success.settingsSaved'))
    } catch (error) {
      console.error(error)
      toast.error(t('reports.email.errors.saveFailed'))
    } finally {
      setLoading(false)
    }
  }

  const handleSendNow = async () => {
    // Check email before sending
    if (!emailSettings.targetEmail || emailSettings.targetEmail.trim() === '') {
      toast.error(t('reports.email.errors.emailRequired'))
      return
    }

    // Check email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(emailSettings.targetEmail.trim())) {
      toast.error(t('reports.email.errors.invalidEmailFormat'))
      return
    }

    setLoading(true)
    try {
      // Send now: need startDate/endDate from higher UI; here simplified, default to yesterday
      const now = new Date()
      const start = new Date(now)
      start.setDate(now.getDate() - 1)
      start.setHours(0,0,0,0)
      const end = new Date(now)
      end.setDate(now.getDate() - 1)
      end.setHours(23,59,59,999)

      const reportRequest = {
        startDate: start.toISOString().slice(0,19),
        endDate: end.toISOString().slice(0,19)
      }
      await emailService.sendNow(reportRequest)
      toast.success(t('reports.email.success.emailSent'))
    } catch (error) {
      console.error(error)
      toast.error(t('reports.email.errors.sendFailed'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Settings className="w-4 h-4 mr-2" />
          {t('reports.email.emailSettings')}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t('reports.email.emailReportSettings')}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>{t('reports.email.targetEmail')}</Label>
            <Input 
              type="email" 
              value={emailSettings.targetEmail}
              onChange={(e) => setEmailSettings(prev => ({...prev, targetEmail: e.target.value}))}
              placeholder="your@email.com"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>{t('reports.email.sendHour')}</Label>
              <Input
                type="number"
                min={0}
                max={23}
                value={emailSettings.sendHour}
                onChange={(e) => setEmailSettings(prev => ({...prev, sendHour: Number(e.target.value)}))}
              />
            </div>
            <div>
              <Label>{t('reports.email.sendMinute')}</Label>
              <Input
                type="number"
                min={0}
                max={59}
                value={emailSettings.sendMinute}
                onChange={(e) => setEmailSettings(prev => ({...prev, sendMinute: Number(e.target.value)}))}
              />
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>{t('reports.email.dailyReport')}</Label>
              <Switch 
                checked={emailSettings.dailyEnabled}
                onCheckedChange={(checked) => setEmailSettings(prev => ({...prev, dailyEnabled: checked}))}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>{t('reports.email.weeklyReport')}</Label>
              <Switch 
                checked={emailSettings.weeklyEnabled}
                onCheckedChange={(checked) => setEmailSettings(prev => ({...prev, weeklyEnabled: checked}))}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>{t('reports.email.monthlyReport')}</Label>
              <Switch 
                checked={emailSettings.monthlyEnabled}
                onCheckedChange={(checked) => setEmailSettings(prev => ({...prev, monthlyEnabled: checked}))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>{t('reports.email.weekDay')}</Label>
              <Input
                type="number"
                min={1}
                max={7}
                value={emailSettings.weeklyDayOfWeek}
                onChange={(e) => setEmailSettings(prev => ({...prev, weeklyDayOfWeek: Number(e.target.value)}))}
              />
            </div>
            <div>
              <Label>{t('reports.email.monthDay')}</Label>
              <Input
                type="number"
                min={1}
                max={31}
                value={emailSettings.monthlyDayOfMonth}
                onChange={(e) => setEmailSettings(prev => ({...prev, monthlyDayOfMonth: Number(e.target.value)}))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <Button onClick={handleSaveSettings} disabled={loading}>
              {loading ? t('reports.email.saving') : t('reports.email.saveSettings')}
            </Button>
            <Button variant="secondary" onClick={handleSendNow} disabled={loading}>
              {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Send className="w-4 h-4 mr-2" />
              )}
              {loading ? t('reports.email.sending') : t('reports.email.sendNow')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export { ExportDialog, EmailSettingsDialog }
