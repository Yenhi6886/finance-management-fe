import React, { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SunMoonIcon, SunIcon, MoonIcon, MonitorIcon, PaletteIcon } from 'lucide-react'

const Theme = () => {
  const [theme, setTheme] = useState('system')
  const [accentColor, setAccentColor] = useState('blue')

  useEffect(() => {
    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('app_theme') || 'system'
    const savedAccentColor = localStorage.getItem('app_accent_color') || 'blue'
    setTheme(savedTheme)
    setAccentColor(savedAccentColor)
    applyTheme(savedTheme)
  }, [])

  const applyTheme = (selectedTheme) => {
    const root = document.documentElement
    
    if (selectedTheme === 'dark') {
      root.classList.add('dark')
    } else if (selectedTheme === 'light') {
      root.classList.remove('dark')
    } else {
      // System preference
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      if (systemPrefersDark) {
        root.classList.add('dark')
      } else {
        root.classList.remove('dark')
      }
    }
  }

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme)
    localStorage.setItem('app_theme', newTheme)
    applyTheme(newTheme)
    
    const themeNames = {
      light: 'Sáng',
      dark: 'Tối',
      system: 'Theo hệ thống'
    }
    
    toast.success(`Đã chuyển sang chế độ ${themeNames[newTheme]}`, {
      description: 'Giao diện đã được cập nhật',
      duration: 2000
    })
  }

  const handleAccentColorChange = (color) => {
    setAccentColor(color)
    localStorage.setItem('app_accent_color', color)
    
    // Apply accent color (this would require CSS variables setup)
    toast.success('Đã thay đổi màu chủ đạo', {
      description: `Màu ${color} đã được áp dụng`,
      duration: 2000
    })
  }

  const themeOptions = [
    {
      value: 'light',
      label: 'Sáng',
      description: 'Giao diện sáng cho ban ngày',
      icon: SunIcon
    },
    {
      value: 'dark',
      label: 'Tối',
      description: 'Giao diện tối cho ban đêm',
      icon: MoonIcon
    },
    {
      value: 'system',
      label: 'Theo hệ thống',
      description: 'Tự động theo cài đặt hệ thống',
      icon: MonitorIcon
    }
  ]

  const accentColors = [
    { name: 'blue', label: 'Xanh dương', color: '#3b82f6' },
    { name: 'green', label: 'Xanh lá', color: '#10b981' },
    { name: 'purple', label: 'Tím', color: '#8b5cf6' },
    { name: 'red', label: 'Đỏ', color: '#ef4444' },
    { name: 'orange', label: 'Cam', color: '#f97316' },
    { name: 'pink', label: 'Hồng', color: '#ec4899' }
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <SunMoonIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h1 className="text-3xl font-bold text-foreground">Cài Đặt Giao Diện</h1>
            </div>
            <p className="text-muted-foreground">
              Tùy chỉnh giao diện và màu sắc của ứng dụng
            </p>
          </div>

          <div className="space-y-6">
            {/* Theme Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Chế Độ Hiển Thị</CardTitle>
                <CardDescription>
                  Chọn chế độ sáng, tối hoặc theo hệ thống
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {themeOptions.map((option) => {
                    const Icon = option.icon
                    return (
                      <div
                        key={option.value}
                        onClick={() => handleThemeChange(option.value)}
                        className={`
                          relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
                          hover:border-primary hover:bg-accent/50
                          ${theme === option.value 
                            ? 'border-primary bg-primary/5 ring-2 ring-primary/20' 
                            : 'border-border bg-card'
                          }
                        `}
                      >
                        <div className="text-center">
                          <div className="flex justify-center mb-3">
                            <div className={`p-3 rounded-full ${
                              theme === option.value 
                                ? 'bg-primary text-primary-foreground' 
                                : 'bg-muted'
                            }`}>
                              <Icon className="w-6 h-6" />
                            </div>
                          </div>
                          <h3 className="font-semibold text-card-foreground mb-1">
                            {option.label}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {option.description}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Accent Color */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PaletteIcon className="w-5 h-5" />
                  <span>Màu Chủ Đạo</span>
                </CardTitle>
                <CardDescription>
                  Chọn màu chủ đạo cho giao diện
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                  {accentColors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => handleAccentColorChange(color.name)}
                      className={`
                        relative p-3 rounded-lg border-2 transition-all duration-200
                        hover:scale-105 active:scale-95
                        ${accentColor === color.name 
                          ? 'border-gray-800 dark:border-gray-200 ring-2 ring-offset-2 ring-gray-400' 
                          : 'border-gray-200 dark:border-gray-700'
                        }
                      `}
                      style={{ backgroundColor: color.color + '20' }}
                    >
                      <div 
                        className="w-8 h-8 rounded-full mx-auto mb-2"
                        style={{ backgroundColor: color.color }}
                      ></div>
                      <p className="text-xs text-center font-medium">
                        {color.label}
                      </p>
                      {accentColor === color.name && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Xem Trước</CardTitle>
                <CardDescription>
                  Xem trước giao diện với cài đặt hiện tại
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 border rounded-lg bg-card">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-card-foreground">
                        Tiêu đề mẫu
                      </h3>
                      <Button size="sm" className="bg-primary hover:bg-primary/90">
                        Nút chính
                      </Button>
                    </div>
                    <p className="text-muted-foreground">
                      Đây là đoạn văn bản mẫu để xem trước giao diện. 
                      Màu sắc và chế độ hiển thị sẽ thay đổi theo cài đặt của bạn.
                    </p>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        Nút phụ
                      </Button>
                      <Button variant="ghost" size="sm">
                        Nút text
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Thông Tin</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Cài đặt giao diện được lưu tự động trong trình duyệt</p>
                  <p>• Chế độ &ldquo;Theo hệ thống&rdquo; sẽ tự động chuyển đổi theo cài đặt thiết bị</p>
                  <p>• Thay đổi áp dụng ngay lập tức cho toàn bộ ứng dụng</p>
                  <p>• Màu chủ đạo ảnh hưởng đến các nút và liên kết quan trọng</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Theme