import React, { useState } from 'react'
import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../../components/ui/dialog'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select'
import { Switch } from '../../../components/ui/switch'
import { toast } from 'sonner'
import { Download, Mail, FileText, Settings } from 'lucide-react'

const ExportDialog = ({ data, title, type }) => {
  const [exportFormat, setExportFormat] = useState('excel')
  const [loading, setLoading] = useState(false)

  const handleExport = async () => {
    setLoading(true)
    try {
      // TODO: Implement actual export functionality
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate API call
      toast.success(`Đã xuất ${title} thành công!`)
    } catch (error) {
      toast.error('Có lỗi xảy ra khi xuất dữ liệu')
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
          <div>
            <p className="text-sm text-muted-foreground">
              Sẽ xuất {data?.length || 0} bản ghi dữ liệu
            </p>
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

const EmailSettingsDialog = () => {
  const [emailSettings, setEmailSettings] = useState({
    daily: false,
    weekly: false,
    monthly: false,
    email: ''
  })

  const handleSaveSettings = async () => {
    try {
      // TODO: Implement actual email settings save
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Đã lưu cài đặt email thành công!')
    } catch (error) {
      toast.error('Có lỗi xảy ra khi lưu cài đặt')
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
              value={emailSettings.email}
              onChange={(e) => setEmailSettings(prev => ({...prev, email: e.target.value}))}
              placeholder="your@email.com"
            />
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Báo cáo hàng ngày</Label>
              <Switch 
                checked={emailSettings.daily}
                onCheckedChange={(checked) => setEmailSettings(prev => ({...prev, daily: checked}))}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Báo cáo hàng tuần</Label>
              <Switch 
                checked={emailSettings.weekly}
                onCheckedChange={(checked) => setEmailSettings(prev => ({...prev, weekly: checked}))}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Báo cáo hàng tháng</Label>
              <Switch 
                checked={emailSettings.monthly}
                onCheckedChange={(checked) => setEmailSettings(prev => ({...prev, monthly: checked}))}
              />
            </div>
          </div>

          <Button onClick={handleSaveSettings} className="w-full">
            Lưu Cài Đặt
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export { ExportDialog, EmailSettingsDialog }
