import React, { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { BadgeDollarSignIcon, RefreshCwIcon, TrendingUpIcon } from 'lucide-react'
import { settingsService } from '@/modules/settings/service/settingsService'


const ExchangeRate = () => {
  const [usdRate, setUsdRate] = useState(null)
  const [loading, setLoading] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [newRate, setNewRate] = useState('')

  // Fetch USD exchange rate on component mount
  useEffect(() => {
    fetchUsdRate()
  }, [])

  const fetchUsdRate = async () => {
    setLoading(true)
    try {
      const response = await settingsService.getUsdExchangeRate()
      setUsdRate(response.data.data)
      toast.success('Đã tải tỷ giá USD mới nhất')
    } catch (error) {
      console.error('Error fetching USD rate:', error)
      toast.error('Không thể tải tỷ giá USD', {
        description: 'Vui lòng thử lại sau'
      })
      // Fallback to default rate if API fails
      setUsdRate({ 
        currency: 'USD', 
        rateToVND: 25400, 
        lastUpdated: new Date().toISOString() 
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateRate = async () => {
    if (!newRate || isNaN(newRate) || parseFloat(newRate) <= 0) {
      toast.error('Vui lòng nhập tỷ giá hợp lệ')
      return
    }

    setUpdating(true)
    try {
      const updateData = {
        currency: 'USD',
        rateToVND: parseFloat(newRate)
      }

      await settingsService.updateUsdExchangeRate(updateData)
      
      // Update local state
      setUsdRate(prev => ({
        ...prev,
        rateToVND: parseFloat(newRate),
        lastUpdated: new Date().toISOString()
      }))

      setNewRate('')
      
      toast.success('Cập nhật tỷ giá thành công', {
        description: `USD/VND: ${parseFloat(newRate).toLocaleString('vi-VN')}`,
        duration: 3000
      })
    } catch (error) {
      console.error('Error updating USD rate:', error)
      toast.error('Không thể cập nhật tỷ giá', {
        description: error.response?.data?.message || 'Vui lòng thử lại sau'
      })
    } finally {
      setUpdating(false)
    }
  }

  const formatNumber = (number) => {
    return new Intl.NumberFormat('vi-VN').format(number)
  }

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN')
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                    <BadgeDollarSignIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h1 className="text-3xl font-bold text-foreground">Tỷ Giá USD/VND</h1>
                </div>
                <p className="text-muted-foreground">
                  Quản lý tỷ giá chuyển đổi USD sang VND
                </p>
              </div>
              <Button 
                onClick={fetchUsdRate}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <RefreshCwIcon className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Làm mới
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Current USD Rate */}
            <Card>
              <CardHeader>
                <CardTitle>Tỷ Giá Hiện Tại</CardTitle>
                <CardDescription>
                  Tỷ giá USD/VND từ hệ thống
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <RefreshCwIcon className="w-8 h-8 animate-spin text-muted-foreground" />
                  </div>
                ) : usdRate ? (
                  <div className="space-y-4">
                    <div className="p-6 border rounded-lg bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-lg text-card-foreground">USD/VND</h3>
                        <div className="flex items-center space-x-1 text-green-600">
                          <TrendingUpIcon className="w-4 h-4" />
                        </div>
                      </div>
                      <div className="text-3xl font-bold text-primary mb-2">
                        {formatNumber(usdRate.rateToVND)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Cập nhật lần cuối: {formatDateTime(usdRate.lastUpdated)}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    Không thể tải tỷ giá USD
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Update Rate */}
            <Card>
              <CardHeader>
                <CardTitle>Cập Nhật Tỷ Giá</CardTitle>
                <CardDescription>
                  Thiết lập tỷ giá USD/VND mới
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="new-rate">Tỷ giá mới (VND)</Label>
                  <Input
                    id="new-rate"
                    type="number"
                    placeholder="Nhập tỷ giá USD/VND..."
                    value={newRate}
                    onChange={(e) => setNewRate(e.target.value)}
                    className="mt-1"
                    min="0"
                    step="0.01"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Ví dụ: 25400 (1 USD = 25,400 VND)
                  </p>
                </div>
                
                <Button 
                  onClick={handleUpdateRate}
                  disabled={updating || !newRate}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {updating ? (
                    <>
                      <RefreshCwIcon className="w-4 h-4 mr-2 animate-spin" />
                      Đang cập nhật...
                    </>
                  ) : (
                    <>
                      <BadgeDollarSignIcon className="w-4 h-4 mr-2" />
                      Cập Nhật Tỷ Giá
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Info */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Thông Tin</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• Tỷ giá được sử dụng cho tất cả các tính toán trong hệ thống</p>
                <p>• Thay đổi tỷ giá sẽ ảnh hưởng đến tất cả giao dịch mới</p>
                <p>• Tỷ giá phải lớn hơn 0 và được lưu với độ chính xác 8 chữ số thập phân</p>
                <p>• Dữ liệu được đồng bộ với backend API</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default ExchangeRate