import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import { AuthProvider } from './modules/auth/contexts/AuthContext'
import { ThemeProvider } from './shared/contexts/ThemeContext'
import { WalletProvider } from './shared/contexts/WalletContext'
import { SettingsProvider } from './shared/contexts/SettingsContext'
import { NotificationProvider } from './shared/contexts/NotificationContext'
import ProtectedRoute from './components/ProtectedRoute'
import DashboardLayout from './components/DashboardLayout'
// Auth pages
import Login from './modules/auth/pages/Login'
import Register from './modules/auth/pages/Register'
import ForgotPassword from './modules/auth/pages/ForgotPassword'
import ResetPassword from './modules/auth/pages/ResetPassword'
import ActivateAccount from './modules/auth/pages/ActivateAccount'

// Main pages
import Dashboard from './modules/dashboard/pages/Dashboard'
import Profile from './modules/profile/pages/Profile'
import ChangePassword from './modules/profile/pages/ChangePassword'
import { Reports } from './modules/reports'
import { Transactions } from './modules/transactions'
import { Settings } from './modules/settings'

// Wallet pages
import {
  WalletList,
  WalletDetail,
  AddWallet,
  EditWallet,
  TransferMoney,
  ShareWallet,
  AddMoney
} from './modules/wallets'

// New Currency Page
import CurrencyPage from './modules/currency/pages/CurrencyPage'

// Error page
import ErrorPage from './modules/error/ErrorPage'
import OAuthCallback from './modules/auth/pages/oauth-callback'

function App() {
  return (
      <ThemeProvider>
        <AuthProvider>
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

                      {/* Protected routes */}
                      <Route path="/" element={
                        <ProtectedRoute>
                          <DashboardLayout />
                        </ProtectedRoute>
                      }>
                        <Route index element={<Navigate to="/dashboard" replace />} />
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="profile" element={<Profile />} />
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
        </AuthProvider>
      </ThemeProvider>
  )
}

export default App