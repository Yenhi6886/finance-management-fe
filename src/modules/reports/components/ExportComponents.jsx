import React, { useEffect, useState } from 'react'
import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../../components/ui/dialog'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select'
import { Switch } from '../../../components/ui/switch'
import { toast } from 'sonner'
import { Download, Mail, FileText, Settings, Send } from 'lucide-react'
import exportService from '../services/exportService'
import emailService from '../services/emailService'

const ExportDialog = ({ buildReportRequest, title }) => {
  const [exportFormat, setExportFormat] = useState('excel')
  const [loading, setLoading] = useState(false)

  const handleExport = async () => {
    setLoading(true)
    try {
      const request = buildReportRequest?.()
      if (!request) throw new Error('Thiếu tham số thời gian để xuất báo cáo')
      if (exportFormat === 'excel') {
        await exportService.exportExcel(request)
      } else {
        await exportService.exportPdf(request)
      }
      toast.success(`Đã xuất ${title} thành công!`)
    } catch (error) {
      console.error(error)
      toast.error(error?.response?.data || 'Có lỗi xảy ra khi xuất dữ liệu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Xuất File
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Xuất {title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Định dạng file</Label>
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
            {loading ? 'Đang xuất...' : `Xuất ${exportFormat.toUpperCase()}`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

const EmailSettingsDialog = ({ defaultTime = { hour: 8, minute: 0 } }) => {
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
            targetEmail: data?.targetEmail || '',
            dailyEnabled: !!data?.dailyEnabled,
            weeklyEnabled: !!data?.weeklyEnabled,
            monthlyEnabled: !!data?.monthlyEnabled,
            sendHour: data?.sendHour ?? defaultTime.hour,
            sendMinute: data?.sendMinute ?? defaultTime.minute,
            weeklyDayOfWeek: data?.weeklyDayOfWeek ?? 1,
            monthlyDayOfMonth: data?.monthlyDayOfMonth ?? 1,
          }))
        }
      } catch (e) {
        console.warn('Không thể tải cài đặt email', e)
      }
    }
    load()
  }, [])

  const handleSaveSettings = async () => {
    setLoading(true)
    try {
      await emailService.saveSettings(emailSettings)
      toast.success('Đã lưu cài đặt email thành công!')
    } catch (error) {
      console.error(error)
      toast.error('Có lỗi xảy ra khi lưu cài đặt')
    } finally {
      setLoading(false)
    }
  }

  const handleSendNow = async () => {
    setLoading(true)
    try {
      // gửi ngay: cần startDate/endDate từ UI cao hơn; 此处简化，默认 gửi hôm qua
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
      toast.success('Đã gửi email báo cáo ngay lập tức!')
    } catch (error) {
      console.error(error)
      toast.error('Gửi email thất bại')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Settings className="w-4 h-4 mr-2" />
          Cài Đặt Email
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Cài Đặt Báo Cáo Email</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Email nhận báo cáo</Label>
            <Input 
              type="email" 
              value={emailSettings.targetEmail}
              onChange={(e) => setEmailSettings(prev => ({...prev, targetEmail: e.target.value}))}
              placeholder="your@email.com"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Giờ gửi</Label>
              <Input
                type="number"
                min={0}
                max={23}
                value={emailSettings.sendHour}
                onChange={(e) => setEmailSettings(prev => ({...prev, sendHour: Number(e.target.value)}))}
              />
            </div>
            <div>
              <Label>Phút gửi</Label>
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
              <Label>Báo cáo hàng ngày</Label>
              <Switch 
                checked={emailSettings.dailyEnabled}
                onCheckedChange={(checked) => setEmailSettings(prev => ({...prev, dailyEnabled: checked}))}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Báo cáo hàng tuần</Label>
              <Switch 
                checked={emailSettings.weeklyEnabled}
                onCheckedChange={(checked) => setEmailSettings(prev => ({...prev, weeklyEnabled: checked}))}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Báo cáo hàng tháng</Label>
              <Switch 
                checked={emailSettings.monthlyEnabled}
                onCheckedChange={(checked) => setEmailSettings(prev => ({...prev, monthlyEnabled: checked}))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Thứ (1-7)</Label>
              <Input
                type="number"
                min={1}
                max={7}
                value={emailSettings.weeklyDayOfWeek}
                onChange={(e) => setEmailSettings(prev => ({...prev, weeklyDayOfWeek: Number(e.target.value)}))}
              />
            </div>
            <div>
              <Label>Ngày trong tháng (1-31)</Label>
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
            <Button onClick={handleSaveSettings} disabled={loading}>Lưu Cài Đặt</Button>
            <Button variant="secondary" onClick={handleSendNow} disabled={loading}>
              <Send className="w-4 h-4 mr-2" /> Gửi Ngay
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export { ExportDialog, EmailSettingsDialog }
