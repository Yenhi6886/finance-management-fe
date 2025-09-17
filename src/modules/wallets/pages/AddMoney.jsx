import React, { useState, useEffect } from 'react'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../../components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../../../components/ui/alert-dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select'
import {
  ArrowLeftIcon,
  PlusIcon,
  DollarSignIcon,
  CreditCardIcon,
  BanknoteIcon,
  CheckCircleIcon,
  StarIcon,
  ReceiptIcon,
  RefreshCwIcon as TransferIcon,
  Loader2
} from 'lucide-react'
import { walletService } from '../services/walletService'
import { useSettings } from '../../../shared/contexts/SettingsContext'
import { formatCurrency, formatDate } from '../../../shared/utils/formattingUtils.js'
import { toast } from 'sonner'
import { IconComponent } from '../../../shared/config/icons'
import { useWallet } from '../../../shared/hooks/useWallet'

const AddMoney = () => {
  const { currentWallet } = useWallet();
  const [wallets, setWallets] = useState([])
  const [selectedWallet, setSelectedWallet] = useState('')
  const [selectedCurrency, setSelectedCurrency] = useState('')
  const [amount, setAmount] = useState('')
  const [addMethod, setAddMethod] = useState('Ngân hàng')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [recentTransactions, setRecentTransactions] = useState([])
  const { settings } = useSettings()
  const walletIdToCurrency = Object.fromEntries((wallets || []).map(w => [String(w.id), w.currency]))

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [successData, setSuccessData] = useState({ amount: 0, walletName: '', currency: '' })

  const fetchData = async () => {
    try {
      setSelectedWallet(currentWallet ? String(currentWallet.id) : '');
      const [walletRes, transRes] = await Promise.all([
        walletService.getWallets(),
        walletService.getTransactions({ type: 'INCOME', limit: 5 })
      ]);
      const activeWallets = (walletRes.data.data || []).filter(wallet => !wallet.archived);
      setWallets(activeWallets);
      setRecentTransactions(transRes.data.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Không thể tải dữ liệu cần thiết.');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const validateForm = () => {
    const newErrors = {}
    if (!selectedCurrency) {
      newErrors.selectedCurrency = 'Vui lòng chọn loại tiền tệ'
    }
    if (!selectedWallet) {
      newErrors.selectedWallet = 'Vui lòng chọn ví'
    }
    if (!amount || parseFloat(amount) <= 0) {
      newErrors.amount = `Số tiền phai lớn hơn ${formatCurrency(0, 'VND', settings)}`
    } else if (parseFloat(amount) < 1000) {
      newErrors.amount = `Số tiền tối thiểu là ${formatCurrency(1000, 'VND', settings)}`
    } else if (parseFloat(amount) > 100000000) {
      newErrors.amount = `Số tiền tối đa là ${formatCurrency(100000000, 'VND', settings)}`
    }
    if (!addMethod) {
      newErrors.addMethod = 'Vui lòng chọn phương thức nạp tiền'
    }
    const wallet = wallets.find(w => w.id.toString() === selectedWallet)
    if (wallet && selectedCurrency && wallet.currency !== selectedCurrency) {
      newErrors.selectedWallet = 'Ví không khớp với loại tiền tệ đã chọn'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleOpenConfirm = () => {
    if (validateForm()) {
      setIsConfirmModalOpen(true);
    }
  };

  const resetForm = () => {
    setSelectedWallet('');
    setAmount('');
    setNote('');
    setAddMethod('Ngân hàng');
    setErrors({});
  };

  const handleAddMoney = async () => {
    setIsConfirmModalOpen(false);
    setLoading(true);
    try {
      const transactionData = {
        amount: parseFloat(amount),
        method: addMethod,
        description: note.trim() || `Nạp tiền qua ${addMethod}`,
      };

      await walletService.addMoney(selectedWallet, transactionData)

      const selectedWalletObj = wallets.find(w => w.id.toString() === selectedWallet)
      setSuccessData({
        amount: parseFloat(amount),
        walletName: selectedWalletObj?.name || '',
        currency: selectedWalletObj?.currency || selectedCurrency || 'VND'
      });

      setIsSuccessModalOpen(true);
      resetForm();
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi nạp tiền');
    } finally {
      setLoading(false);
    }
  }

  const filteredWallets = wallets.filter(w => !selectedCurrency || w.currency === selectedCurrency);

  return (
      <>
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Nạp Tiền</h1>
              <p className="text-muted-foreground mt-2">Thêm tiền vào ví của bạn</p>
            </div>
            <div className="mt-4 sm:mt-0">
              <Button onClick={() => window.history.back()} variant="ghost" size="sm" className="h-10 px-4 text-sm font-light bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-800/30 text-green-600 dark:text-green-400 rounded-sm border-0">
                <ArrowLeftIcon className="w-4 h-4 mr-1" /> Quay lại
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-card rounded-lg shadow-lg border border-border">
                <div className="p-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <h2 className="text-2xl font-semibold text-foreground">Thông Tin Nạp Tiền</h2>
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="walletSelect">Chọn ví <span className="text-red-500">*</span></Label>
                      <Select onValueChange={(v) => {
                        setSelectedWallet(v)
                        if (!selectedCurrency) {
                          const w = wallets.find(w => w.id.toString() === v)
                          if (w?.currency) setSelectedCurrency(w.currency)
                        }
                      }} value={selectedWallet}>
                        <SelectTrigger className={`w-full h-12 ${errors.selectedWallet ? 'border-red-500' : 'border-border'}`}>
                          <SelectValue placeholder="Chọn ví để nạp tiền">
                            {selectedWallet && wallets.find(w => w.id.toString() === selectedWallet) && (
                                <div className="flex items-center space-x-2">
                                  <IconComponent name={wallets.find(w => w.id.toString() === selectedWallet).icon} className="w-4 h-4" />
                                  <span>{wallets.find(w => w.id.toString() === selectedWallet).name} - {formatCurrency(wallets.find(w => w.id.toString() === selectedWallet).balance, wallets.find(w => w.id.toString() === selectedWallet).currency, settings)}</span>
                                </div>
                            )}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {filteredWallets.length > 0 ? (
                              filteredWallets.map(w => (
                                  <SelectItem key={w.id} value={w.id.toString()}>
                                    <div className="flex items-center space-x-2">
                                      <IconComponent name={w.icon} className="w-4 h-4" />
                                      <span>{w.name} - {formatCurrency(w.balance, w.currency, settings)}</span>
                                    </div>
                                  </SelectItem>
                              ))
                          ) : (
                              selectedCurrency && (
                                  <SelectItem value="no-wallet" disabled>
                                    Không có ví tiền tệ này
                                  </SelectItem>
                              )
                          )}
                        </SelectContent>
                      </Select>
                      {errors.selectedWallet && <p className="text-sm text-red-500">{errors.selectedWallet}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label>Chọn loại tiền tệ <span className="text-red-500">*</span></Label>
                      <Select value={selectedCurrency} onValueChange={(v) => { setSelectedCurrency(v); setSelectedWallet('') }}>
                        <SelectTrigger className={`w-full h-12 ${errors.selectedCurrency ? 'border-red-500' : 'border-border'}`}>
                          <SelectValue placeholder="Chọn loại tiền tệ" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="VND">Việt Nam Đồng (₫)</SelectItem>
                          <SelectItem value="USD">US Dollar ($)</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.selectedCurrency && <p className="text-sm text-red-500">{errors.selectedCurrency}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="amount">Số tiền <span className="text-red-500">*</span></Label>
                      <div className="relative">
                        <Input id="amount" type="number" placeholder="Nhập số tiền" value={amount} onChange={(e) => setAmount(e.target.value)} className={`h-12 ${selectedCurrency === 'USD' ? 'pl-12 pr-4' : 'pl-4 pr-12'} ${errors.amount ? 'border-red-500' : ''}`} min="1000" max="100000" step="1000" />
                        {selectedCurrency === 'USD' ? (
                            <DollarSignIcon className="w-5 h-5 text-muted-foreground absolute left-4 top-1/2 transform -translate-y-1/2" />
                        ) : (
                            <span className="text-muted-foreground absolute right-4 top-1/2 -translate-y-1/2">₫</span>
                        )}
                      </div>
                      {errors.amount && <p className="text-sm text-red-500">{errors.amount}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label>Số tiền nhanh</Label>
                      <div className="grid grid-cols-4 gap-3">
                        {[100000, 500000, 1000000, 5000000].map(quickAmount => (
                            <Button key={quickAmount} variant="ghost" size="sm" onClick={() => setAmount(quickAmount.toString())} className="h-10 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg">
                              {formatCurrency(quickAmount, selectedCurrency || 'VND', settings)}
                            </Button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="note">Ghi chú</Label>
                      <textarea id="note" placeholder="Ghi chú về giao dịch này..." value={note} onChange={(e) => setNote(e.target.value)} rows={3} className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground resize-none" />
                    </div>
                    <div className="pt-6">
                      <Button onClick={handleOpenConfirm} disabled={loading} className="w-full h-12 bg-green-600 hover:bg-green-700 text-white rounded-lg">
                        {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Đang xử lý...</> : 'Nạp Tiền'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-card rounded-lg shadow-lg border border-border">
                <div className="p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                      <ReceiptIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-card-foreground">Giao Dịch Gần Đây</h3>
                  </div>
                  {recentTransactions.length > 0 ? (
                      <div className="space-y-3">
                        {recentTransactions.map(t => (
                            <div key={t.id} className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center">
                                  <PlusIcon className="w-4 h-4 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                  <p className="font-medium text-card-foreground text-sm" title={t.description}>{t.description.length > 25 ? `${t.description.substring(0, 25)}...` : t.description}</p>
                                  <p className="text-xs text-muted-foreground">{formatDate(t.date, settings)}</p>
                                </div>
                              </div>
                              <span className="font-bold text-green-600 dark:text-green-400 text-sm">+{formatCurrency(t.amount, t.currency || walletIdToCurrency?.[String(t.walletId)] || 'VND', settings)}</span>
                            </div>
                        ))}
                      </div>
                  ) : (
                      <div className="text-center py-4">
                        <ReceiptIcon className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Chưa có giao dịch nào</p>
                      </div>
                  )}
                </div>
              </div>
              <div className="bg-card rounded-lg shadow-lg border border-border">
                <div className="p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-yellow-100 dark:bg-yellow-900/50 rounded-lg">
                      <StarIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-card-foreground">Mẹo Hữu Ích</h3>
                  </div>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <div className="flex items-start space-x-2">
                      <CheckCircleIcon className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <p>Sử dụng ghi chú để theo dõi nguồn gốc của tiền.</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircleIcon className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <p>Kiểm tra kỹ thông tin ví và số tiền trước khi xác nhận.</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircleIcon className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <p>Thường xuyên kiểm tra lịch sử giao dịch để quản lý tài chính tốt hơn.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <AlertDialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Xác nhận Nạp Tiền</AlertDialogTitle>
              <AlertDialogDescription asChild>
                <div className="pt-2 text-sm">
                  <p className="mb-4">Vui lòng kiểm tra lại thông tin nạp tiền trước khi xác nhận.</p>
                  <div className="space-y-3 rounded-md border bg-muted/50 p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Nạp vào ví:</span>
                      <div className="flex items-center space-x-2">
                        <IconComponent name={wallets.find(w => w.id.toString() === selectedWallet)?.icon} className="w-4 h-4" />
                        <span className="font-semibold text-foreground">{wallets.find(w => w.id.toString() === selectedWallet)?.name}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Số tiền:</span>
                      <span className="font-bold text-lg text-green-600">{formatCurrency(parseFloat(amount || 0), (wallets.find(w => w.id.toString() === selectedWallet)?.currency) || selectedCurrency || 'VND', settings)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Phương thức:</span>
                      <span className="font-semibold text-foreground">{addMethod}</span>
                    </div>
                    {note.trim() && (
                        <div className="flex justify-between items-start pt-2 border-t">
                          <span className="text-muted-foreground">Ghi chú:</span>
                          <span className="font-semibold text-foreground text-right pl-4">{note}</span>
                        </div>
                    )}
                  </div>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Hủy</AlertDialogCancel>
              <AlertDialogAction onClick={handleAddMoney}>Xác nhận</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Dialog open={isSuccessModalOpen} onOpenChange={setIsSuccessModalOpen}>
          <DialogContent>
            <DialogHeader>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
                <CheckCircleIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
              </div>
              <DialogTitle className="text-center">Nạp Tiền Thành Công!</DialogTitle>
              <DialogDescription className="text-center">
                Đã nạp thành công {formatCurrency(successData.amount, successData.currency || 'VND', settings)} vào ví {successData.walletName}.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={() => setIsSuccessModalOpen(false)} className="w-full">Đóng</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
  )
}

export default AddMoney