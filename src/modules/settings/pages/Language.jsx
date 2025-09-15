import React, { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LanguagesIcon, CheckIcon } from 'lucide-react'

const Language = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('vi')

  useEffect(() => {
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem('app_language') || 'vi'
    setSelectedLanguage(savedLanguage)
  }, [])

  const languages = [
    {
      code: 'vi',
      name: 'Tiếng Việt',
      nativeName: 'Vietnamese',
      flag: '🇻🇳'
    },
    {
      code: 'en',
      name: 'English',
      nativeName: 'English',
      flag: '🇺🇸'
    },
    {
      code: 'ja',
      name: 'Tiếng Nhật',
      nativeName: '日本語',
      flag: '🇯🇵'
    },
    {
      code: 'ko',
      name: 'Tiếng Hàn',
      nativeName: '한국어',
      flag: '🇰🇷'
    }
  ]

  const handleLanguageChange = (languageCode) => {
    setSelectedLanguage(languageCode)
    localStorage.setItem('app_language', languageCode)
    
    const selectedLang = languages.find(lang => lang.code === languageCode)
    toast.success(`Đã chuyển sang ${selectedLang.name}`, {
      description: `Ngôn ngữ hiện tại: ${selectedLang.nativeName}`,
      duration: 2000
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <LanguagesIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h1 className="text-3xl font-bold text-foreground">Cài Đặt Ngôn Ngữ</h1>
            </div>
            <p className="text-muted-foreground">
              Chọn ngôn ngữ hiển thị cho ứng dụng
            </p>
          </div>

          {/* Language Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Chọn Ngôn Ngữ</CardTitle>
              <CardDescription>
                Ngôn ngữ được lưu tự động và áp dụng cho toàn bộ ứng dụng
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {languages.map((language) => (
                  <div
                    key={language.code}
                    onClick={() => handleLanguageChange(language.code)}
                    className={`
                      relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
                      hover:border-primary hover:bg-accent/50
                      ${selectedLanguage === language.code 
                        ? 'border-primary bg-primary/5 ring-2 ring-primary/20' 
                        : 'border-border bg-card'
                      }
                    `}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="text-3xl">{language.flag}</div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-card-foreground">
                          {language.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {language.nativeName}
                        </p>
                      </div>
                      {selectedLanguage === language.code && (
                        <div className="flex-shrink-0">
                          <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                            <CheckIcon className="w-4 h-4 text-primary-foreground" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Thông Tin</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-start space-x-2">
                  <CheckIcon className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <p>Ngôn ngữ được lưu tự động trong trình duyệt</p>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckIcon className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <p>Thay đổi ngôn ngữ sẽ áp dụng ngay lập tức</p>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckIcon className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <p>Hỗ trợ nhiều ngôn ngữ châu Á và châu Âu</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Language