# 💰 Finance Management System - Frontend

> Hệ thống quản lý tài chính cá nhân hiện đại với giao diện đẹp mắt và tính năng đầy đủ

## 📋 Mục lục

- [Tổng quan](#-tổng-quan)
- [Tech Stack](#️-tech-stack)
- [Kiến trúc hệ thống](#️-kiến-trúc-hệ-thống)
- [Cấu trúc thư mục](#-cấu-trúc-thư-mục)
- [Cài đặt và chạy dự án](#-cài-đặt-và-chạy-dự-án)
- [Chi tiết các module](#-chi-tiết-các-module)
- [Workflow và luồng hoạt động](#-workflow-và-luồng-hoạt-động)
- [API Integration](#-api-integration)
- [Tính năng chính](#-tính-năng-chính)
- [Contributing](#-contributing)

## 🎯 Tổng quan

Finance Management System là ứng dụng web quản lý tài chính cá nhân được xây dựng với React và các công nghệ hiện đại. Hệ thống cung cấp đầy đủ các tính năng quản lý ví, giao dịch, báo cáo và phân tích tài chính.

### ✨ Đặc điểm nổi bật

- 🎨 **UI/UX hiện đại** với Dark/Light mode
- 📱 **Responsive Design** tương thích mọi thiết bị
- 🔐 **Bảo mật cao** với JWT Authentication & OAuth2
- ⚡ **Hiệu suất tối ưu** với React 18 & Vite
- 📊 **Visualization** với Chart.js
- 🎭 **Accessible** với Radix UI primitives
- 🌍 **Đa ngôn ngữ** hỗ trợ tiếng Việt

## 🛠️ Tech Stack

### Core Technologies

```json
{
  "Frontend Framework": "React 18.2.0",
  "Build Tool": "Vite 4.4.5",
  "Language": "JavaScript (ES2022)",
  "Package Manager": "npm/yarn"
}
```

### UI & Styling

```json
{
  "CSS Framework": "Tailwind CSS 3.3.3",
  "UI Components": "Radix UI Primitives",
  "Icons": "Lucide React 0.263.1",
  "Animations": "tailwindcss-animate 1.0.6",
  "Typography": "Inter Font (Google Fonts)",
  "Toast Notifications": "Sonner 1.0.3"
}
```

### State Management & Forms

```json
{
  "State Management": "React Context API",
  "Form Handling": "React Hook Form 7.45.4",
  "Form Validation": "Zod 3.22.2 (NOT Yup/Formik)",
  "Form Resolvers": "@hookform/resolvers 3.3.1"
}
```

### Data Visualization

```json
{
  "Charts Library": "Chart.js 4.5.0",
  "React Integration": "react-chartjs-2 5.3.0",
  "Animation Library": "Lottie React 2.4.1"
}
```

### Routing & HTTP

```json
{
  "Router": "React Router DOM 6.15.0",
  "HTTP Client": "Axios 1.5.0",
  "Date Manipulation": "date-fns 2.30.0"
}
```

### Development Tools

```json
{
  "Linting": "ESLint 8.45.0",
  "CSS Processing": "PostCSS 8.4.29 + Autoprefixer 10.4.15",
  "Dev Server": "Vite Dev Server",
  "Hot Reload": "Vite HMR"
}
```

### Utility Libraries

```json
{
  "Class Management": "clsx 2.0.0 + tailwind-merge 1.14.0",
  "Component Variants": "class-variance-authority 0.7.0",
  "Path Resolution": "Vite Alias (@/ -> ./src/)"
}
```

## 🏗️ Kiến trúc hệ thống

### Architecture Pattern: **Module-based Architecture**

```
┌─────────────────────────────────────────────────────────┐
│                     PRESENTATION LAYER                  │
├─────────────────────────────────────────────────────────┤
│  Pages (Login, Dashboard, Wallets...)                  │
│  Components (UI, Charts, Layout...)                    │
│  Contexts (Auth, Wallet, Theme...)                     │
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│                      BUSINESS LAYER                     │
├─────────────────────────────────────────────────────────┤
│  Services (API calls, Business logic...)               │
│  Utils (Validation, Error handling...)                 │
│  Configs (App settings, Constants...)                  │
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│                        DATA LAYER                       │
├─────────────────────────────────────────────────────────┤
│  HTTP Client (Axios interceptors...)                   │
│  Local Storage (Token, User data...)                   │
│  External APIs (Backend REST API...)                   │
└─────────────────────────────────────────────────────────┘
```

## 📁 Cấu trúc thư mục

```
finance-management-fe/
├── public/                          # Static assets
│   └── vite.svg                     # App icon
│
├── src/                             # Source code
│   ├── components/                  # Shared components
│   │   ├── ui/                      # Radix UI components
│   │   │   ├── alert-dialog.jsx     # Modal confirmations
│   │   │   ├── avatar.jsx           # User avatars
│   │   │   ├── button.jsx           # Custom buttons
│   │   │   ├── card.jsx             # Card containers
│   │   │   ├── dialog.jsx           # Modal dialogs
│   │   │   ├── dropdown-menu.jsx    # Dropdown menus
│   │   │   ├── input.jsx            # Form inputs
│   │   │   ├── label.jsx            # Form labels
│   │   │   └── select.jsx           # Select dropdowns
│   │   ├── charts/                  # Chart components
│   │   │   └── ChartComponents.jsx  # Line, Bar, Pie, Doughnut charts
│   │   ├── DashboardLayout.jsx      # Main layout wrapper
│   │   ├── Header.jsx               # Top navigation bar
│   │   ├── Loading.jsx              # Loading indicators
│   │   ├── ProtectedRoute.jsx       # Route protection HOC
│   │   └── Sidebar.jsx              # Side navigation menu
│   │
│   ├── lib/                         # Utility libraries
│   │   └── utils.js                 # Helper functions (cn, clsx...)
│   │
│   ├── modules/                     # Feature modules
│   │   ├── auth/                    # Authentication module
│   │   │   ├── contexts/
│   │   │   │   └── AuthContext.jsx  # Auth state management
│   │   │   ├── pages/
│   │   │   │   ├── ActivateAccount.jsx    # Account activation
│   │   │   │   ├── ForgotPassword.jsx     # Password reset request
│   │   │   │   ├── Login.jsx              # Login page
│   │   │   │   ├── oauth-callback.jsx     # OAuth callback handler
│   │   │   │   ├── Register.jsx           # Registration page
│   │   │   │   └── ResetPassword.jsx      # Password reset form
│   │   │   ├── services/
│   │   │   │   └── authService.js   # Auth API calls
│   │   │   └── index.js            # Module exports
│   │   │
│   │   ├── dashboard/              # Dashboard module
│   │   │   ├── pages/
│   │   │   │   └── Dashboard.jsx   # Main dashboard page
│   │   │   ├── services/
│   │   │   │   └── dashboardService.js  # Dashboard API calls
│   │   │   └── index.js           # Module exports
│   │   │
│   │   ├── profile/               # User profile module
│   │   │   ├── pages/
│   │   │   │   ├── ChangePassword.jsx   # Password change form
│   │   │   │   └── Profile.jsx          # Profile management
│   │   │   └── index.js          # Module exports
│   │   │
│   │   ├── wallets/              # Wallet management module
│   │   │   ├── components/
│   │   │   │   └── AddWalletModal.jsx   # Quick add wallet modal
│   │   │   ├── pages/
│   │   │   │   ├── AddMoney.jsx         # Add money to wallet
│   │   │   │   ├── AddWallet.jsx        # Create new wallet
│   │   │   │   ├── EditWallet.jsx       # Edit wallet details
│   │   │   │   ├── ShareWallet.jsx      # Share wallet with others
│   │   │   │   ├── TransferMoney.jsx    # Transfer between wallets
│   │   │   │   ├── WalletDetail.jsx     # Wallet detail view
│   │   │   │   └── WalletList.jsx       # List all wallets
│   │   │   ├── services/
│   │   │   │   └── walletService.js     # Wallet API calls
│   │   │   ├── README.md         # Module documentation
│   │   │   └── index.js          # Module exports
│   │   │
│   │   ├── error/                # Error handling module
│   │   │   └── ErrorPage.jsx     # 404/Error page
│   │   │
│   │   ├── reports/              # Reports module (future)
│   │   │   └── README.md         # Module placeholder
│   │   │
│   │   └── transactions/         # Transactions module (future)
│   │       └── README.md         # Module placeholder
│   │
│   ├── shared/                   # Shared utilities
│   │   ├── config/
│   │   │   └── appConfig.js      # App-wide configuration
│   │   ├── contexts/
│   │   │   ├── ThemeContext.jsx  # Dark/Light theme management
│   │   │   └── WalletContext.jsx # Global wallet state
│   │   ├── services/
│   │   │   └── apiService.js     # HTTP client configuration
│   │   └── utils/
│   │       ├── errorHandler.js   # Error handling utilities
│   │       └── validationUtils.js # Form validation helpers
│   │
│   ├── debug/                    # Debug utilities
│   │   └── testWalletValidation.js # Validation testing
│   │
│   ├── App.jsx                   # Root component
│   ├── main.jsx                  # Application entry point
│   └── index.css                 # Global styles + Tailwind directives
│
├── .env.example                  # Environment variables template
├── .gitignore                   # Git ignore rules
├── eslint.config.js             # ESLint configuration
├── index.html                   # HTML entry point
├── package.json                 # Project dependencies & scripts
├── package-lock.json           # Dependency lock file
├── postcss.config.js           # PostCSS configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── vite.config.js              # Vite build configuration
└── README.md                   # This file
```

## 🚀 Cài đặt và chạy dự án

### Yêu cầu hệ thống

- Node.js >= 16.0.0
- npm >= 8.0.0 hoặc yarn >= 1.22.0

### Cài đặt

```bash
# Clone repository
git clone <repository-url>
cd finance-management-fe

# Cài đặt dependencies
npm install
# hoặc
yarn install

# Copy và cấu hình environment variables
cp .env.example .env
# Chỉnh sửa file .env với thông tin phù hợp

# Chạy development server
npm run dev
# hoặc
yarn dev
```

### Scripts có sẵn

```bash
npm run dev      # Chạy development server (port 3000)
npm run build    # Build production
npm run preview  # Preview production build
npm run lint     # Chạy ESLint
```

## 📦 Chi tiết các module

### 🔐 Auth Module (`src/modules/auth/`)

**Chức năng:** Quản lý xác thực và phân quyền người dùng

**Components chính:**

- `AuthContext.jsx`: Context quản lý state authentication global
- `Login.jsx`: Form đăng nhập với hỗ trợ OAuth2 (Google, Facebook, GitHub)
- `Register.jsx`: Form đăng ký tài khoản với validation
- `ForgotPassword.jsx`: Quên mật khẩu với countdown resend
- `ResetPassword.jsx`: Đặt lại mật khẩu từ email token
- `ActivateAccount.jsx`: Kích hoạt tài khoản từ email
- `oauth-callback.jsx`: Xử lý callback từ OAuth providers

**Luồng hoạt động:**

1. User truy cập `/login` → Hiển thị form đăng nhập
2. Submit credentials → `authService.login()` → Lưu JWT token
3. `AuthContext` cập nhật state → Redirect to `/dashboard`
4. Mọi request đều attach JWT token qua Axios interceptors
5. Token expire → Auto refresh hoặc redirect về login

### 📊 Dashboard Module (`src/modules/dashboard/`)

**Chức năng:** Trang chủ với tổng quan tài chính

**Components:**

- `Dashboard.jsx`: Trang dashboard chính với cards thống kê, biểu đồ, giao dịch gần đây

**Features:**

- Cards hiển thị tổng thu nhập, chi tiêu, số dư
- Biểu đồ Line/Bar cho trend theo tháng
- Biểu đồ Pie/Doughnut cho phân loại chi tiêu
- Danh sách giao dịch gần đây
- Quick actions (Thêm ví, nạp tiền...)

### 💰 Wallets Module (`src/modules/wallets/`)

**Chức năng:** Quản lý ví tiền và giao dịch

**Components chính:**

1. **WalletList.jsx** - Danh sách ví

   - Grid view với wallet cards
   - Toggle Active/Archived wallets
   - Actions: View, Edit, Archive, Delete
   - Toast notifications với duplicate prevention

2. **AddWallet.jsx** - Tạo ví mới

   - Form với validation (tên, icon, currency, balance, mô tả)
   - Preview card realtime
   - Validation: 10 digits max, format display

3. **EditWallet.jsx** - Chỉnh sửa ví

   - Similar form như AddWallet nhưng pre-filled
   - Balance format với thousand separators

4. **WalletDetail.jsx** - Chi tiết ví

   - Overview cards (balance, income, expense)
   - Transaction history
   - Quick actions panel
   - Archive/Delete với confirmation

5. **AddMoney.jsx** - Nạp tiền vào ví

   - Select wallet dropdown
   - Amount input với quick amounts
   - Payment methods selection
   - Category classification

6. **TransferMoney.jsx** - Chuyển tiền giữa ví

   - From/To wallet selectors với swap functionality
   - Transfer fee calculation
   - Confirmation modal với summary

7. **ShareWallet.jsx** - Chia sẻ ví
   - Permission levels (View, Edit, Full)
   - Expiry date settings
   - Share link generation

### 👤 Profile Module (`src/modules/profile/`)

**Chức năng:** Quản lý thông tin cá nhân

**Components:**

- `Profile.jsx`: Cập nhật thông tin profile
- `ChangePassword.jsx`: Đổi mật khẩu với validation

### 🎨 Shared Components (`src/components/`)

**Layout Components:**

- `DashboardLayout.jsx`: Main app layout với Sidebar + Header
- `Header.jsx`: Top bar với theme toggle, notifications, user menu
- `Sidebar.jsx`: Navigation menu với collapse/expand

**UI Components:** (Based on Radix UI)

- `button.jsx`: Styled buttons với variants (primary, secondary, ghost...)
- `card.jsx`: Container components
- `input.jsx`: Form inputs với error states
- `dialog.jsx`: Modal dialogs
- `dropdown-menu.jsx`: Context menus

**Chart Components:**

- `ChartComponents.jsx`: LineChart, BarChart, PieChart, DoughnutChart wrapper

### 🔧 Shared Services & Utils (`src/shared/`)

**Configuration:**

- `appConfig.js`: App-wide settings (API base URL, auth config, pagination...)

**Contexts:**

- `ThemeContext.jsx`: Dark/Light mode state management
- `WalletContext.jsx`: Global wallet state với current wallet selection

**Services:**

- `apiService.js`: Axios instance với interceptors cho auth headers

**Utilities:**

- `errorHandler.js`: Centralized error handling với user-friendly messages
- `validationUtils.js`: Form validation helpers (email, password, phone...)

## 🧪 Validation Strategy

**Lưu ý quan trọng:** Dự án **KHÔNG sử dụng Yup/Formik** như thường thấy. Thay vào đó sử dụng:

### Validation Stack

1. **Zod 3.22.2**: Schema validation (TypeScript-first)
2. **React Hook Form 7.45.4**: Form state management
3. **@hookform/resolvers**: Zod integration với RHF
4. **Custom validationUtils.js**: Additional validation helpers

### Validation Approach

```javascript
// Example validation in AddWallet.jsx
const validateField = (field, value) => {
  switch (field) {
    case "name":
      if (!value.trim()) return "Tên ví là bắt buộc";
      if (value.length > 100) return "Tên ví không được quá 100 ký tự";
      break;
    case "balance":
      if (value.replace(/\D/g, "").length > 10) {
        return "Số tiền không được vượt quá 10 chữ số";
      }
      break;
  }
  return null;
};
```

## ✨ Tính năng chính

### 🔐 Authentication & Authorization

- [x] JWT-based authentication
- [x] OAuth2 login (Google, Facebook, GitHub)
- [x] Password reset via email
- [x] Account activation
- [x] Protected routes
- [x] Auto token refresh

### 💰 Wallet Management

- [x] Create/Edit/Delete wallets
- [x] Archive/Restore wallets
- [x] Multi-currency support (VND, USD)
- [x] Wallet sharing with permissions
- [x] Icon selection và customization

### 💸 Transaction Management

- [x] Add money to wallets
- [x] Transfer between wallets
- [x] Transaction history
- [x] Category classification
- [x] Transfer fees calculation

### 📊 Dashboard & Analytics

- [x] Financial overview cards
- [x] Interactive charts (Line, Bar, Pie, Doughnut)
- [x] Recent transactions
- [x] Monthly statistics
- [x] Spending categories breakdown

### 🎨 UI/UX Features

- [x] Dark/Light mode toggle
- [x] Responsive design
- [x] Toast notifications
- [x] Loading states
- [x] Error boundaries
- [x] Accessible components
- [x] Smooth animations

### 🛠️ Developer Experience

- [x] Hot Module Replacement (HMR)
- [x] ESLint integration
- [x] Path aliases (@/ → ./src/)
- [x] Environment configuration
- [x] Error boundary
- [x] Code splitting

---

**Built with ❤️ using React + Vite + Tailwind CSS**

_Finance Management System - Making personal finance management simple and beautiful._
