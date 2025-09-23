import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/contexts/AuthContext.jsx';
import { useLanguage } from '../../../shared/contexts/LanguageContext.jsx';
import { useTheme } from '../../../shared/contexts/ThemeContext.jsx';
import { WalletContext } from '../../../shared/contexts/WalletContext.jsx';
import { Avatar } from '../../../components/ui/avatar.jsx';
import { Button } from '../../../components/ui/button.jsx';
import { Card, CardContent } from '../../../components/ui/card.jsx';
import { Badge } from '../../../components/ui/badge.jsx';
import { Switch } from '../../../components/ui/switch.jsx';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../../../components/ui/alert-dialog.jsx';
import {
  UserIcon,
  ShieldCheckIcon,
  MoonIcon,
  SunIcon,
  LogOutIcon,
  ChevronRightIcon,
  SettingsIcon,
  CheckCircle2,
} from 'lucide-react';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { wallets } = useContext(WalletContext);
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const profileSections = [
    {
      title: t('profile.menu.account'),
      items: [
        {
          id: 'profile',
          title: t('profile.menu.accountDesc'),
          subtitle: t('profile.menu.accountDesc'),
          icon: UserIcon,
          href: '/profile/personal-info',
          color: 'text-blue-600',
          bgColor: 'bg-blue-100',
        },
      ],
    },
    {
      title: t('profile.menu.settings'),
      items: [
        {
          id: 'security',
          title: t('profile.menu.security'),
          subtitle: t('profile.menu.securityDesc'),
          icon: ShieldCheckIcon,
          href: '/change-password',
          color: 'text-orange-600',
          bgColor: 'bg-orange-100',
        },
        {
          id: 'appearance',
          title: t('profile.menu.appearance'),
          subtitle: theme === 'light' ? t('profile.menu.appearanceLight') : t('profile.menu.appearanceDark'),
          icon: theme === 'light' ? SunIcon : MoonIcon,
          action: toggleTheme,
          color: theme === 'light' ? 'text-yellow-600' : 'text-indigo-600',
          bgColor: theme === 'light' ? 'bg-yellow-100' : 'bg-indigo-100',
          hasSwitch: true,
        },
        {
          id: 'general',
          title: t('profile.menu.general'),
          subtitle: t('profile.menu.generalDesc'),
          icon: SettingsIcon,
          href: '/settings',
          color: 'text-gray-600',
          bgColor: 'bg-gray-100',
        },
      ],
    },
  ];

  return (
      <div className="min-h-screen bg-background flex flex-col">          
      <div className="relative pt-12 pb-8 px-1 overflow-hidden bg-gradient-to-b from-green-50 via-green-50/50 to-background dark:from-green-900/20 dark:via-green-900/10 dark:to-background">
          <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-green-100/50 to-transparent dark:from-green-900/30" />
          <div className="relative flex flex-col items-center text-center">
            <div className="relative mb-4">
              <Avatar
                  src={user?.avatarUrl}
                  alt={`${user?.username} avatar`}
                  size="xl"
                  className="w-24 h-24 border-4 border-white dark:border-background shadow-lg"
              />
              <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center border-2 border-white dark:border-background">
              </div>
            </div>
            <div className="text-center w-full max-w-xs">
              <div className="flex items-center justify-center gap-2">
                <h2 className="text-2xl font-bold text-foreground truncate">{user?.fullName || user?.username}</h2>
                {user?.isVerified &&
                    <Badge variant="secondary" className="bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground flex-shrink-0">
                      <CheckCircle2 className="w-3 h-3 mr-1"/>
                      Verified
                    </Badge>
                }
              </div>
              <p className="text-muted-foreground text-sm mt-1 truncate">{user?.phone || user?.email}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 -mt-4">
          <div className="space-y-6">
            {profileSections.map((section) => (
                <div key={section.title}>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 px-1">
                    {section.title}
                  </h3>
                  <Card className="overflow-hidden shadow-sm bg-card border-border">
                    <CardContent className="p-0">
                      {section.items.map((item, index) => (
                          <div key={item.id}>
                            {item.hasSwitch ? (
                                <div className="flex items-center p-4 sm:p-6 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                  <div className={`w-10 h-10 ${item.bgColor} dark:bg-white/10 rounded-xl flex items-center justify-center mr-4 flex-shrink-0`}>
                                    <item.icon className={`w-5 h-5 ${item.color} dark:text-gray-300`} />
                                  </div>
                                  <div className="flex-1">
                                    <p className="font-semibold text-base text-foreground">{item.title}</p>
                                    <p className="text-sm text-muted-foreground mt-1">{item.subtitle}</p>
                                  </div>
                                  <Switch
                                      checked={theme === 'dark'}
                                      onCheckedChange={toggleTheme}
                                      className="ml-4"
                                  />
                                </div>
                            ) : (
                                <Link
                                    to={item.href}
                                    className="flex items-center p-4 sm:p-6 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                                >
                                  <div className={`w-10 h-10 ${item.bgColor} dark:bg-white/10 rounded-xl flex items-center justify-center mr-4 flex-shrink-0`}>
                                    <item.icon className={`w-5 h-5 ${item.color} dark:text-gray-300`} />
                                  </div>
                                  <div className="flex-1">
                                    <p className="font-semibold text-base text-foreground">{item.title}</p>
                                    <p className="text-sm text-muted-foreground mt-1">{item.subtitle}</p>
                                  </div>
                                  <ChevronRightIcon className="w-5 h-5 text-gray-400 dark:text-gray-500 ml-4" />
                                </Link>
                            )}
                            {index < section.items.length - 1 && (
                                <div className="h-px bg-gray-100 dark:bg-white/5 mx-6" />
                            )}
                          </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
            ))}

            <Card className="overflow-hidden shadow-sm bg-card border-border">
              <CardContent className="p-0">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button className="w-full flex items-center p-4 sm:p-6 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors text-left">
                      <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                        <LogOutIcon className="w-5 h-5 text-red-600 dark:text-red-400" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-base text-red-600 dark:text-red-400">{t('profile.menu.logout')}</p>
                      </div>
                      <ChevronRightIcon className="w-5 h-5 text-red-400 dark:text-red-500 ml-4" />
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{t('profile.menu.logoutConfirm')}</AlertDialogTitle>
                      <AlertDialogDescription>
                        {t('profile.menu.logoutDesc')}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Hủy</AlertDialogCancel>                      <AlertDialogAction
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        {isLoggingOut ? t('profile.menu.loggingOut') : t('profile.menu.logout')}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>

            <div className="text-center text-xs text-gray-400 dark:text-gray-500 py-6">
              <p>XSpend Finance v1.0.0</p>
              <p>© 2024 XSpend. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
  );
};

export default ProfilePage;