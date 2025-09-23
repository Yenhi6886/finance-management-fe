import React, { useState, useEffect, useContext, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card.jsx'
import { Button } from '../../../components/ui/button.jsx'
import { walletService } from '../services/walletService.js'
import {
  ArrowLeft,
  Edit,
  Share2,
  PlusCircle,
  TrendingUp,
  TrendingDown,
  Trash2,
  CalendarDays,
  Filter,
  Download,
  Archive,
  ArchiveRestore,
  Info,
  MoreVertical,
  ArrowUpCircle,
  ArrowDownCircle,
  FileText,
  Loader2,
  ChevronLeft,
  ChevronRight,
  BarChart,
  PieChart,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '../../../components/ui/dropdown-menu.jsx'
import { toast } from 'sonner'
import { WalletContext } from '../../../shared/contexts/WalletContext.jsx'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '../../../components/ui/alert-dialog.jsx'
import { Alert, AlertDescription, AlertTitle } from '../../../components/ui/alert.jsx'
import { cn } from '../../../lib/utils.js'
import { IconComponent } from '../../../shared/config/icons.js'
import { useSettings } from '../../../shared/contexts/SettingsContext.jsx'
import { formatCurrency, formatDate } from '../../../shared/utils/formattingUtils.js'
import BalanceTrendChart from '../components/BalanceTrendChart.jsx'
import ExpenseByCategoryChart from '../components/ExpenseByCategoryChart.jsx'
import { useLanguage } from '../../../shared/contexts/LanguageContext.jsx'

const WalletDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { refreshWallets } = useContext(WalletContext)
  const { t } = useLanguage()
  const [walletDetails, setWalletDetails] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  const [loading, setLoading] = useState(true)
  const [transactionsLoading, setTransactionsLoading] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const { settings } = useSettings()

  const fetchWalletData = useCallback(async () => {
    try {
      const response = await walletService.getWalletDetails(id)
      setWalletDetails(response.data.data)
    } catch (error) {
      toast.error(error.response?.data?.message || t('wallets.detail.loadError'))
      navigate('/wallets')
    }
  }, [id, navigate, t])

  const fetchTransactions = useCallback(async (currentPage) => {
    setTransactionsLoading(true)
    try {
      const params = { page: currentPage, size: 5, sort: 'date,desc' }
      const response = await walletService.getWalletTransactions(id, params)
      setTransactions(response.data.data.content || [])
      setTotalPages(response.data.data.totalPages)
    } catch (error) {
      toast.error(t('wallets.detail.loadTransactionsError'))
    } finally {
      setTransactionsLoading(false)
    }
  }, [id, t])

  useEffect(() => {
    setLoading(true)
    Promise.all([
      fetchWalletData(),
      fetchTransactions(page)
    ]).finally(() => setLoading(false))
  }, [fetchWalletData, fetchTransactions, page])


  const handleConfirmDelete = async () => {
    if (!walletDetails?.wallet) return
    try {
      await walletService.deleteWallet(walletDetails.wallet.id)
      await refreshWallets()
      navigate('/wallets', {
        state: { message: t('wallets.detail.deleteSuccess', { walletName: walletDetails.wallet.name }), type: 'success' }
      })
    } catch (error) {
      toast.error(error.response?.data?.message || t('wallets.detail.deleteError'))
      setIsDeleteDialogOpen(false)
    }
  }

  const handleArchiveToggle = async () => {
    if (!walletDetails?.wallet) return
    const isArchiving = !walletDetails.wallet.isArchived
    const action = isArchiving ? walletService.archiveWallet : walletService.unarchiveWallet
    const actionKey = isArchiving ? 'archived' : 'restored'
    try {
      const response = await action(walletDetails.wallet.id)
      setWalletDetails(prevDetails => ({
        ...prevDetails,
        wallet: response.data.data
      }))
      toast.success(t('wallets.detail.archiveSuccess', { 
        walletName: walletDetails.wallet.name, 
        action: t(`wallets.detail.archiveActions.${actionKey}`)
      }))
      refreshWallets()
    } catch (error) {
      toast.error(error.response?.data?.message || t('wallets.detail.archiveError', { 
        action: t(`wallets.detail.archiveActions.${actionKey}`)
      }))
    }
  }

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage)
    }
  }

  if (loading) {
    return <div className="flex h-full items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>
  }

  if (!walletDetails?.wallet) {
    return <div>{t('wallets.detail.notFound')}</div>
  }

  const { wallet, monthlyIncome, monthlyExpense, netChange, balanceHistory, expenseByCategory } = walletDetails

  return (
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-md shrink-0" onClick={() => navigate('/wallets')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3">
              <IconComponent name={wallet.icon} className="w-8 h-8"/>
              <h1 className="text-3xl font-bold tracking-tight text-green-600">{wallet.name}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {!wallet.isArchived && (
                <Button onClick={() => navigate('/wallets/add-money', { state: { walletId: id } })} className="rounded-md">
                  <PlusCircle className="w-4 h-4 mr-2" /> {t('wallets.detail.addMoney')}
                </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-md">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {!wallet.isArchived && (
                    <>
                      <DropdownMenuItem onSelect={() => navigate(`/wallets/${id}/edit`)}>
                        <Edit className="mr-2 h-4 w-4" /> {t('wallets.detail.editWallet')}
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => navigate('/wallets/share', { state: { walletId: id } })}>
                        <Share2 className="mr-2 h-4 w-4" /> {t('wallets.detail.shareWallet')}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                )}
                <DropdownMenuItem onSelect={handleArchiveToggle}>
                  {wallet.isArchived ? <ArchiveRestore className="mr-2 h-4 w-4" /> : <Archive className="mr-2 h-4 w-4" />}
                  {wallet.isArchived ? t('wallets.detail.restoreWallet') : t('wallets.detail.archiveWallet')}
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setIsDeleteDialogOpen(true)} className="text-red-600 focus:text-red-600 focus:bg-red-50">
                  <Trash2 className="mr-2 h-4 w-4" /> {t('wallets.detail.deleteWallet')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {wallet.isArchived && (
            <Alert variant="default" className="bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-700">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertTitle className="text-blue-800 dark:text-blue-300">{t('wallets.detail.archivedTitle')}</AlertTitle>
              <AlertDescription className="text-blue-700 dark:text-blue-400">
                {t('wallets.detail.archivedDescription')}
              </AlertDescription>
            </Alert>
        )}

        <div className={cn("grid grid-cols-1 lg:grid-cols-2 gap-6", wallet.isArchived && 'opacity-60 pointer-events-none')}>
          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white flex flex-col justify-between p-6">
            <div>
              <p className="text-green-100 text-sm">{t('wallets.detail.currentBalance')}</p>
              <p className="text-4xl font-bold tracking-tight">{formatCurrency(wallet.balance, wallet.currency, settings)}</p>
              <p className="text-green-200 text-sm mt-2 italic">{wallet.description || t('wallets.detail.noDescription')}</p>
            </div>
          </Card>
          <div className="grid grid-cols-1 grid-rows-3 gap-4">
            <Card className="flex items-center p-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg mr-4"><TrendingUp className="w-6 h-6 text-green-600" /></div>
              <div>
                <p className="text-muted-foreground text-sm">{t('wallets.detail.monthlyIncome')}</p>
                <p className="text-xl font-bold text-green-600">{formatCurrency(monthlyIncome, wallet.currency, settings)}</p>
              </div>
            </Card>
            <Card className="flex items-center p-4">
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg mr-4"><TrendingDown className="w-6 h-6 text-red-600" /></div>
              <div>
                <p className="text-muted-foreground text-sm">{t('wallets.detail.monthlyExpense')}</p>
                <p className="text-xl font-bold text-red-600">{formatCurrency(monthlyExpense, wallet.currency, settings)}</p>
              </div>
            </Card>
            <Card className="flex items-center p-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-4"><CalendarDays className="w-6 h-6 text-blue-600" /></div>
              <div>
                <p className="text-muted-foreground text-sm">{t('wallets.detail.netChange')}</p>
                <p className={cn("text-xl font-bold", netChange >= 0 ? 'text-green-600' : 'text-red-600')}>
                  {netChange >= 0 ? '+' : ''}{formatCurrency(netChange, wallet.currency, settings)}
                </p>
              </div>
            </Card>
          </div>
        </div>

        <div className={cn("grid grid-cols-1 lg:grid-cols-2 gap-6", wallet.isArchived && 'opacity-60 pointer-events-none')}>
          <Card>
            <CardHeader><CardTitle>{t('wallets.detail.balanceTrend')}</CardTitle></CardHeader>
            <CardContent>
              {balanceHistory && balanceHistory.length > 0 ? (
                  <BalanceTrendChart data={balanceHistory} currency={wallet.currency} />
              ) : (
                  <div className="h-64 flex flex-col items-center justify-center text-center text-muted-foreground">
                    <BarChart className="w-12 h-12 mb-2"/>
                    <p>{t('wallets.detail.noChartData')}</p>
                  </div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>{t('wallets.detail.expenseByCategory')}</CardTitle></CardHeader>
            <CardContent>
              {expenseByCategory && expenseByCategory.length > 0 ? (
                  <ExpenseByCategoryChart
                      data={expenseByCategory}
                      currency={wallet.currency}
                      totalExpense={monthlyExpense}
                  />
              ) : (
                  <div className="h-64 flex flex-col items-center justify-center text-center text-muted-foreground">
                    <PieChart className="w-12 h-12 mb-2"/>
                    <p>{t('wallets.detail.noCategoryData')}</p>
                  </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className={cn(wallet.isArchived && 'opacity-60 pointer-events-none')}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{t('wallets.detail.transactionHistory')}</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={wallet.isArchived}><Filter className="w-4 h-4 mr-2"/>{t('wallets.detail.filterButton')}</Button>
              <Button variant="outline" size="sm" disabled={wallet.isArchived}><Download className="w-4 h-4 mr-2"/>{t('wallets.detail.exportButton')}</Button>
            </div>
          </CardHeader>
          <CardContent>
            {transactionsLoading ? (
                <div className="text-center py-16"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground mx-auto" /></div>
            ) : transactions.length > 0 ? (
                <>
                  <div className="divide-y">
                    {transactions.map((tx) => (
                        <div key={tx.id} className="flex items-center justify-between py-4">
                          <div className="flex items-center gap-4">
                            {tx.type === 'INCOME' ? <ArrowUpCircle className="w-8 h-8 text-green-500" /> : <ArrowDownCircle className="w-8 h-8 text-red-500" />}
                            <div>
                              <p className="font-semibold">{tx.description}</p>
                              <p className="text-sm text-muted-foreground">{tx.category || t('wallets.detail.uncategorized')} • {formatDate(tx.date, settings)}</p>
                            </div>
                          </div>
                          <p className={cn("text-lg font-bold", tx.type === 'INCOME' ? 'text-green-600' : 'text-red-600')}>
                            {tx.type === 'INCOME' ? '+' : '-'}{formatCurrency(tx.amount, wallet.currency, settings)}
                          </p>
                        </div>
                    ))}
                  </div>
                  {totalPages > 1 && (
                      <div className="flex items-center justify-center pt-6 space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handlePageChange(page - 1)} disabled={page === 0}>
                          <ChevronLeft className="h-4 w-4" />
                          <span>{t('wallets.detail.pagination.previous')}</span>
                        </Button>
                        <span className="text-sm font-medium">
                          {t('wallets.detail.pagination.pageOf', { current: page + 1, total: totalPages })}
                        </span>
                        <Button variant="outline" size="sm" onClick={() => handlePageChange(page + 1)} disabled={page === totalPages - 1}>
                          <span>{t('wallets.detail.pagination.next')}</span>
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                  )}
                </>
            ) : (
                <div className="text-center py-16">
                  <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground">{t('wallets.detail.noTransactions')}</p>
                </div>
            )}
          </CardContent>
        </Card>

        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('wallets.list.deleteConfirm.title')}</AlertDialogTitle>
              <AlertDialogDescription>{t('wallets.list.deleteConfirm.description', { walletName: wallet?.name })}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700">{t('common.delete')}</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
  )
}

export default WalletDetail