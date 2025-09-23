import React, { useState, useEffect, useContext, useMemo, useCallback, useRef } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card.jsx'
import { Button } from '../../../components/ui/button.jsx'
import { walletService } from '../services/walletService.js'
import { useLanguage } from '../../../shared/contexts/LanguageContext.jsx'
import {
  EyeIcon,
  EditIcon,
  ArchiveIcon,
  TrashIcon,
  ArchiveRestoreIcon,
  Loader2,
  ArrowRight,
  CheckCircle2,
  Star,
  MoreHorizontal,
  WalletCards,
  UsersIcon,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '../../../components/ui/dropdown-menu.jsx'
import { useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'sonner'
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
import { WalletContext } from '../../../shared/contexts/WalletContext.jsx'
import { useSettings } from '../../../shared/contexts/SettingsContext.jsx'
import AnimatedIcon from '../../../components/ui/AnimatedIcon.jsx'
import { cn } from '../../../lib/utils.js'
import { IconComponent } from '../../../shared/config/icons.js'
import { formatCurrency } from '../../../shared/utils/formattingUtils.js'
import { useWallet } from '../../../shared/hooks/useWallet.js'

import listIconAnimation from '../../../assets/icons/listicon.json'
import addWalletAnimation from '../../../assets/icons/addwalletgreen.json'
import walletAnimation from '../../../assets/icons/wallet.json'
import transferAnimation from '../../../assets/icons/transfer.json'
import moneyAnimation from '../../../assets/icons/money.json'
import shareAnimation from '../../../assets/icons/share.json'

const SlidingTabs = ({ view, setView, activeCount, archivedCount }) => {
  const { t } = useLanguage()
  
  return (
      <div className="relative w-full max-w-sm mx-auto p-1 flex items-center bg-muted rounded-lg">
        <div
            className="absolute top-1 left-1 h-[calc(100%-8px)] w-[calc(50%-4px)] bg-green-600 rounded-md transition-transform duration-300 ease-in-out"
            style={{ transform: view === 'active' ? 'translateX(0)' : 'translateX(calc(100% + 4px))' }}
        />
        <button
            onClick={() => setView('active')}
            className={`relative z-10 w-1/2 py-1.5 text-sm font-semibold rounded-md transition-colors duration-300 ${view === 'active' ? 'text-white' : 'text-muted-foreground'}`}
        >
          {t('wallets.list.activeWalletsTab', { count: activeCount })}
        </button>
        <button
            onClick={() => setView('archived')}
            className={`relative z-10 w-1/2 py-1.5 text-sm font-semibold rounded-md transition-colors duration-300 ${view === 'archived' ? 'text-white' : 'text-muted-foreground'}`}
        >
          {t('wallets.list.archivedWalletsTab', { count: archivedCount })}
        </button>
      </div>
  )
}

const WalletList = () => {
  const { refreshWallets } = useContext(WalletContext)
  const { currentWallet, selectWallet } = useWallet()
  const { settings, loading: settingsLoading } = useSettings()
  const { t } = useLanguage()

  const [activeWallets, setActiveWallets] = useState([])
  const [archivedWallets, setArchivedWallets] = useState([])
  const [walletsLoading, setWalletsLoading] = useState(true)
  const [isTogglingArchive, setIsTogglingArchive] = useState(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [walletToDelete, setWalletToDelete] = useState(null)
  const [view, setView] = useState('active')
  const [hoveredAction, setHoveredAction] = useState(null)
  const hasShownToastRef = useRef(false)
  const navigate = useNavigate()
  const location = useLocation()
  const walletListRef = useRef(null);

  // Embla carousel setup
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps'
  });
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    return () => emblaApi.off('select', onSelect);
  }, [emblaApi, onSelect]);

  // Generate random soft colors for wallet borders
  const generateSoftColor = (id) => {
    const colors = [
      'border-t-blue-200 bg-blue-50/30 dark:border-t-blue-400 dark:bg-blue-900/10',
      'border-t-green-200 bg-green-50/30 dark:border-t-green-400 dark:bg-green-900/10',
      'border-t-purple-200 bg-purple-50/30 dark:border-t-purple-400 dark:bg-purple-900/10',
      'border-t-pink-200 bg-pink-50/30 dark:border-t-pink-400 dark:bg-pink-900/10',
      'border-t-yellow-200 bg-yellow-50/30 dark:border-t-yellow-400 dark:bg-yellow-900/10',
      'border-t-indigo-200 bg-indigo-50/30 dark:border-t-indigo-400 dark:bg-indigo-900/10',
      'border-t-red-200 bg-red-50/30 dark:border-t-red-400 dark:bg-red-900/10',
      'border-t-teal-200 bg-teal-50/30 dark:border-t-teal-400 dark:bg-teal-900/10',
      'border-t-orange-200 bg-orange-50/30 dark:border-t-orange-400 dark:bg-orange-900/10',
      'border-t-cyan-200 bg-cyan-50/30 dark:border-t-cyan-400 dark:bg-cyan-900/10',
    ];
    return colors[id % colors.length];
  };

  const walletActions = [
    {
      title: t('wallets.list.actions.viewList'),
      description: t('wallets.list.actions.viewListDesc'),
      icon: listIconAnimation,
      action: () => walletListRef.current?.scrollIntoView({ behavior: 'smooth' })
    },
    {
      title: t('wallets.list.actions.addWallet'),
      description: t('wallets.list.actions.addWalletDesc'),
      icon: addWalletAnimation,
      path: '/wallets/add'
    },
    {
      title: t('wallets.list.actions.transferMoney'),
      description: t('wallets.list.actions.transferMoneyDesc'),
      icon: transferAnimation,
      path: '/wallets/transfer'
    },
    {
      title: t('wallets.list.actions.addMoney'),
      description: t('wallets.list.actions.addMoneyDesc'),
      icon: moneyAnimation,
      path: '/wallets/add-money'
    },
    {
      title: t('wallets.list.actions.shareWallet'),
      description: t('wallets.list.actions.shareWalletDesc'),
      icon: shareAnimation,
      path: '/wallets/share'
    }
  ]

  const fetchWalletsData = useCallback(async () => {
    try {
      setWalletsLoading(true)
      const [activeResponse, archivedResponse] = await Promise.all([
        walletService.getWallets(),
        walletService.getArchivedWallets()
      ])
      setActiveWallets(activeResponse.data.data || [])
      setArchivedWallets(archivedResponse.data.data || [])
    } catch (error) {
      console.error('Error fetching wallets:', error)
      toast.error(t('wallets.list.loadError'))
    } finally {
      setWalletsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchWalletsData()
  }, [fetchWalletsData])

  useEffect(() => {
    if (location.state?.message && !hasShownToastRef.current) {
      toast[location.state.type || 'success'](location.state.message)
      hasShownToastRef.current = true
      fetchWalletsData()
      refreshWallets()
      window.history.replaceState({}, document.title)
    }
  }, [location.state, fetchWalletsData, refreshWallets])

  const totalBalance = useMemo(() => {
    return activeWallets.reduce((sum, wallet) => {
      return sum + Number(wallet.balance)
    }, 0)
  }, [activeWallets])

  const handleDeleteClick = (wallet) => {
    if (view === 'archived') {
      toast.info(t('wallets.list.archiveRestoreInfo'))
      return
    }
    setWalletToDelete(wallet)
    setIsDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!walletToDelete) return
    try {
      await walletService.deleteWallet(walletToDelete.id)
      await refreshWallets()
      toast.success(t('wallets.list.deleteSuccess', { walletName: walletToDelete.name }))
      await fetchWalletsData()
    } catch (error) {
      toast.error(error.response?.data?.message || t('wallets.list.deleteError'))
    } finally {
      setIsDeleteDialogOpen(false)
      setWalletToDelete(null)
    }
  }

  const handleArchiveToggle = async (wallet) => {
    setIsTogglingArchive(wallet.id)
    const isArchiving = view === 'active'
    const action = isArchiving ? walletService.archiveWallet : walletService.unarchiveWallet
    const actionKey = isArchiving ? 'archived' : 'restored'

    try {
      await action(wallet.id)
      toast.success(t('wallets.list.archiveSuccess', { 
        walletName: wallet.name, 
        action: t(`wallets.list.archiveActions.${actionKey}`)
      }))
      await fetchWalletsData()
      await refreshWallets()
    } catch (error) {
      toast.error(error.response?.data?.message || t('wallets.list.archiveError', { 
        action: t(`wallets.list.archiveActions.${actionKey}`)
      }))
    } finally {
      setIsTogglingArchive(null)
    }
  }

  const handleSetDefault = async (wallet) => {
    try {
      selectWallet(wallet)
      toast.success(t('wallets.list.setDefaultSuccess', { walletName: wallet.name }))
    } catch (error) {
      toast.error(t('wallets.list.setDefaultError'))
    }
  }

  const walletsToDisplay = view === 'active' ? activeWallets : archivedWallets

  // Chia ví thành các nhóm 9 ví mỗi slide
  const walletSlides = useMemo(() => {
    const slides = [];
    const walletsPerSlide = 9;
    
    for (let i = 0; i < walletsToDisplay.length; i += walletsPerSlide) {
      slides.push(walletsToDisplay.slice(i, i + walletsPerSlide));
    }
    
    return slides;
  }, [walletsToDisplay]);

  const permissionDisplay = {
    VIEW: { text: t('wallets.list.permissions.view'), className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300' },
    EDIT: { text: t('wallets.list.permissions.edit'), className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300' },
    OWNER: { text: t('wallets.list.permissions.owner'), className: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300' }
  }

  if (walletsLoading || settingsLoading) {
    return <div>{t('wallets.list.loading')}</div>
  }

  return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-green-600">{t('wallets.list.title')}</h1>
          <p className="text-muted-foreground mt-1">
            {t('wallets.list.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600">
                  {t('wallets.list.controlPanel')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {walletActions.map((action) => (
                    <div
                        key={action.title}
                        onClick={() => action.path ? navigate(action.path) : action.action()}
                        onMouseEnter={() => setHoveredAction(action.title)}
                        onMouseLeave={() => setHoveredAction(null)}
                        className="flex items-center justify-between p-4 rounded-lg cursor-pointer transition-colors hover:bg-muted"
                    >
                      <div className="flex items-center gap-4">
                        {action.isIconComponent ? <action.icon className="w-10 h-10 text-primary" /> : <AnimatedIcon animationData={action.icon} size={40} play={hoveredAction === action.title} />}
                        <div>
                          <h3 className="font-semibold">{action.title}</h3>
                          <p className="text-sm text-muted-foreground">{action.description}</p>
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-muted-foreground" />
                    </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6 h-full flex flex-col">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-green-600">{t('wallets.list.overview')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">{t('wallets.list.overviewDesc')}</p>
                  <p className="text-3xl font-bold tracking-tight">{formatCurrency(totalBalance, 'VND', settings)}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-green-600 border-green-600 hover:bg-green-50"
                  onClick={() => navigate('/dollar')}
                >
                  {t('wallets.list.exchangeRate')}
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg text-green-600">
                  <WalletCards className="w-5 h-5" />
                  {t('wallets.list.totalWallets')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">{t('wallets.list.activeWallets')}</span>
                    <span className="text-xl font-bold tracking-tight">{activeWallets.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">{t('wallets.list.archivedWallets')}</span>
                    <span className="text-xl font-bold tracking-tight">{archivedWallets.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="flex-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg text-green-600">
                  <Star className="w-5 h-5 text-yellow-500" />
                  {t('wallets.list.tips')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-500 shrink-0" />
                    <span>{t('wallets.list.tip1')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-500 shrink-0" />
                    <span>{t('wallets.list.tip2')}</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        <div ref={walletListRef} className="pt-4 space-y-6">
          <div className="border-b pb-2">
            <h2 className="text-2xl font-bold tracking-tight text-green-600">{t('wallets.list.walletListTitle')}</h2>
          </div>

          <div className="flex justify-center">
            <SlidingTabs
                view={view}
                setView={setView}
                activeCount={activeWallets.length}
                archivedCount={archivedWallets.length}
            />
          </div>

          {walletsToDisplay.length > 0 ? (
            <div className="relative mt-6">
              <div className="embla">
                <div className="embla__viewport" ref={emblaRef}>
                  <div className="embla__container">
                    {walletSlides.map((slideWallets, slideIndex) => (
                      <div key={slideIndex} className="embla__slide">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-1">
                          {slideWallets.map((wallet) => {
                            const isShared = !!wallet.sharedBy;
                            const canEdit = isShared ? ['EDIT', 'OWNER'].includes(wallet.permissionLevel) : true;
                            const isOwner = isShared ? wallet.permissionLevel === 'OWNER' : true;
                            const permissionInfo = permissionDisplay[wallet.permissionLevel];

                            return (
                              <Card key={wallet.id} className={cn(
                                "transition-shadow hover:shadow-lg border-t-4 flex flex-col h-full",
                                generateSoftColor(wallet.id),
                                view === 'archived' && 'opacity-60',
                                currentWallet?.id === wallet.id && 'ring-2 ring-green-500 ring-offset-2'
                              )}>
                                <CardContent className="p-4 flex flex-col h-full">
                                  <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                      <IconComponent name={wallet.icon} className="w-7 h-7" />
                                      <div className="flex items-center gap-2">
                                        <h3 className="font-semibold text-xl">{wallet.name}</h3>
                                        {currentWallet?.id === wallet.id && (
                                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                        )}
                                        {isShared && permissionInfo && (
                                          <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full', permissionInfo.className)}>
                                            {permissionInfo.text}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                                          <MoreHorizontal className="w-4 h-4" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        {view === 'active' && (
                                          <>
                                            <DropdownMenuItem onSelect={() => navigate(`/wallets/${wallet.id}`)}>
                                              <EyeIcon className="mr-2 h-4 w-4" />
                                              <span>{t('wallets.list.actions.viewDetails')}</span>
                                            </DropdownMenuItem>
                                            {canEdit && (
                                              <DropdownMenuItem onSelect={() => navigate(`/wallets/${wallet.id}/edit`)}>
                                                <EditIcon className="mr-2 h-4 w-4" />
                                                <span>{t('wallets.list.actions.editWallet')}</span>
                                              </DropdownMenuItem>
                                            )}
                                            {currentWallet?.id !== wallet.id && (
                                              <DropdownMenuItem onSelect={() => handleSetDefault(wallet)}>
                                                <Star className="mr-2 h-4 w-4 text-yellow-500" />
                                                <span>{t('wallets.list.actions.setDefault')}</span>
                                              </DropdownMenuItem>
                                            )}
                                            <DropdownMenuSeparator />
                                          </>
                                        )}
                                        {isOwner && (
                                          <DropdownMenuItem onSelect={() => handleArchiveToggle(wallet)} disabled={isTogglingArchive === wallet.id}>
                                            {isTogglingArchive === wallet.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (
                                              view === 'archived' ? <ArchiveRestoreIcon className="mr-2 h-4 w-4" /> : <ArchiveIcon className="mr-2 h-4 w-4" />
                                            )}
                                            <span>{view === 'archived' ? t('wallets.list.actions.restore') : t('wallets.list.actions.archive')}</span>
                                          </DropdownMenuItem>
                                        )}
                                        {isOwner && <DropdownMenuSeparator />}
                                        {isOwner && (
                                          <DropdownMenuItem onSelect={() => handleDeleteClick(wallet)} disabled={view === 'archived'} className="text-red-600 focus:text-red-600 focus:bg-red-50">
                                            <TrashIcon className="mr-2 h-4 w-4" />
                                            <span>{t('wallets.list.actions.delete')}</span>
                                          </DropdownMenuItem>
                                        )}
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </div>

                                  <div className="flex-grow space-y-1">
                                    <p className="text-sm text-muted-foreground">{t('wallets.list.balance')}</p>
                                    <p className="text-3xl font-bold tracking-tight">{formatCurrency(wallet.balance, wallet.currency, settings)}</p>
                                  </div>

                                  {isShared && (
                                    <div className="mt-2 pt-2 border-t text-xs text-muted-foreground flex items-center gap-1.5">
                                      <UsersIcon className="w-3 h-3" />
                                      <span>{t('wallets.list.sharedBy', { owner: wallet.sharedBy })}</span>
                                    </div>
                                  )}

                                  {wallet.description && <p className="text-sm text-muted-foreground mt-2 pt-2 border-t italic line-clamp-2">{wallet.description}</p>}
                                </CardContent>
                              </Card>
                            )
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {walletSlides.length > 1 && (
                <>
                  <Button onClick={scrollPrev} disabled={!prevBtnEnabled} variant="outline" size="icon" className="h-9 w-9 rounded-full absolute -left-4 top-1/2 -translate-y-1/2 z-10 opacity-75 hover:opacity-100 disabled:opacity-0 transition-all"><ChevronLeft className="h-4 w-4" /></Button>
                  <Button onClick={scrollNext} disabled={!nextBtnEnabled} variant="outline" size="icon" className="h-9 w-9 rounded-full absolute -right-4 top-1/2 -translate-y-1/2 z-10 opacity-75 hover:opacity-100 disabled:opacity-0 transition-all"><ChevronRight className="h-4 w-4" /></Button>
                </>
              )}
            </div>
          ) : (
              <div className="flex items-center justify-center pt-16">
                <div className="text-center">
                  <AnimatedIcon animationData={walletAnimation} size={64} className="text-muted-foreground/20 mx-auto mb-4" play={true} loop={true}/>
                  <h3 className="text-lg font-semibold mb-2">
                    {view === 'active' ? t('wallets.list.noActiveWallets') : t('wallets.list.noArchivedWallets')}
                  </h3>
                  <p className="text-muted-foreground max-w-xs">
                    {view === 'active' ? t('wallets.list.noActiveWalletsDesc') : t('wallets.list.noArchivedWalletsDesc')}
                  </p>
                </div>
              </div>
          )}
        </div>

        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('wallets.list.deleteConfirm.title')}</AlertDialogTitle>
              <AlertDialogDescription>
                {t('wallets.list.deleteConfirm.description', { walletName: walletToDelete?.name })}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t('wallets.list.deleteConfirm.cancel')}</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700">{t('wallets.list.deleteConfirm.confirm')}</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
  )
}

export default WalletList