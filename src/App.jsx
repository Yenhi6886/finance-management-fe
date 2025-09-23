import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import { AuthProvider } from './modules/auth/contexts/AuthContext.jsx'
import { ThemeProvider } from './shared/contexts/ThemeContext.jsx'
import { WalletProvider } from './shared/contexts/WalletContext.jsx'
import { SettingsProvider } from './shared/contexts/SettingsContext.jsx'
import { NotificationProvider } from './shared/contexts/NotificationContext.jsx'
import { InitialLoadingProvider } from './shared/contexts/InitialLoadingContext.jsx'
import { LanguageProvider } from './shared/contexts/LanguageContext.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import DashboardLayout from './components/DashboardLayout.jsx'
// Auth pages
import Login from './modules/auth/pages/Login.jsx'
import Register from './modules/auth/pages/Register.jsx'
import ForgotPassword from './modules/auth/pages/ForgotPassword.jsx'
import ResetPassword from './modules/auth/pages/ResetPassword.jsx'
import ActivateAccount from './modules/auth/pages/ActivateAccount.jsx'

// Main pages
import Dashboard from './modules/dashboard/pages/Dashboard.jsx'
import Profile from './modules/profile/pages/Profile.jsx'
import { ProfilePage } from './modules/profile/index.js'
import ChangePassword from './modules/profile/pages/ChangePassword.jsx'
import { Reports } from './modules/reports/index.js'
import { Transactions } from './modules/transactions/index.js'
import { Settings } from './modules/settings/index.js'

// Wallet pages
import {
  WalletList,
  WalletDetail,
  AddWallet,
  EditWallet,
  TransferMoney,
  ShareWallet,
  AddMoney,
  AcceptInvitation
} from './modules/wallets/index.js'

// New Currency Page
import CurrencyPage from './modules/currency/pages/CurrencyPage.jsx'

// Error page
import ErrorPage from './modules/error/ErrorPage.jsx'
import OAuthCallback from './modules/auth/pages/oauth-callback.jsx'

function App() {
  return (
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <InitialLoadingProvider>
              <SettingsProvider>
              <WalletProvider>
                <NotificationProvider>
                  <Router>
                    <div className="min-h-screen bg-background text-foreground">
                      <Routes>
                        {/* Public routes */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/oauth-callback" element={<OAuthCallback/>} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/reset-password" element={<ResetPassword />} />
                        <Route path="/activate" element={<ActivateAccount />} />
                        <Route path="/accept-invitation" element={<AcceptInvitation />} />

                        {/* Protected routes */}
                        <Route path="/" element={
                          <ProtectedRoute>
                            <DashboardLayout />
                          </ProtectedRoute>
                        }>
                          <Route index element={<Navigate to="/dashboard" replace />} />
                          <Route path="dashboard" element={<Dashboard />} />
                          <Route path="profile" element={<ProfilePage />} />
                          <Route path="profile/personal-info" element={<Profile />} />
                          <Route path="change-password" element={<ChangePassword />} />
                          <Route path="settings" element={<Settings />} />
                          <Route path="reports" element={<Reports />} />
                          <Route path="transactions" element={<Transactions />} />

                          {/* New Currency Route */}
                          <Route path="dollar" element={<CurrencyPage />} />

                          {/* Wallet routes */}
                          <Route path="wallets" element={<WalletList />} />
                          <Route path="wallets/add" element={<AddWallet />} />
                          <Route path="wallets/add-money" element={<AddMoney />} />
                          <Route path="wallets/transfer" element={<TransferMoney />} />
                          <Route path="wallets/share" element={<ShareWallet />} />
                          <Route path="wallets/:id" element={<WalletDetail />} />
                          <Route path="wallets/:id/edit" element={<EditWallet />} />
                        </Route>

                        {/* Error route */}
                        <Route path="*" element={<ErrorPage />} />
                      </Routes>

                      <Toaster
                          position="top-right"
                          toastOptions={{
                            duration: 2500,
                            style: {
                              background: 'hsl(var(--card))',
                              color: 'hsl(var(--card-foreground))',
                              border: '1px solid hsl(var(--border))',
                            },
                          }}
                      />
                    </div>
                  </Router>
                </NotificationProvider>
              </WalletProvider>
            </SettingsProvider>
          </InitialLoadingProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
}

export default App