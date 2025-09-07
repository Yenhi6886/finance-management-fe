# Finance Management System

Hệ thống quản lý tài chính cá nhân được xây dựng với React, Tailwind CSS, và shadcn/ui.

## 🚀 Tính năng chính

### Sprint 1 - Quản lý tài khoản

- ✅ **Đăng ký tài khoản**: Tạo tài khoản với username và password (6-8 ký tự)
- ✅ **Đăng nhập**: Xác thực bằng username/password
- ✅ **Đăng nhập mạng xã hội**: Hỗ trợ Google, Facebook, GitHub
- ✅ **Đăng xuất**: Thoát khỏi hệ thống an toàn
- ✅ **Quên mật khẩu**: Lấy lại mật khẩu qua email
- ✅ **Kích hoạt tài khoản**: Xác thực email sau đăng ký
- ✅ **Đổi mật khẩu**: Cập nhật mật khẩu hiện tại
- ✅ **Xóa tài khoản**: Xóa tài khoản và toàn bộ dữ liệu
- ✅ **Cập nhật profile**: Thay đổi ảnh đại diện và thông tin cá nhân

## 🛠️ Công nghệ sử dụng

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Routing**: React Router DOM
- **Form Handling**: React Hook Form + Zod
- **HTTP Client**: Axios
- **State Management**: React Context
- **Icons**: Lucide React
- **Notifications**: Sonner

## 📁 Cấu trúc dự án

```
src/
├── components/           # UI components tái sử dụng
│   ├── ui/              # shadcn/ui components
│   ├── DashboardLayout.jsx
│   ├── Header.jsx
│   ├── Sidebar.jsx
│   └── ProtectedRoute.jsx
├── modules/             # Chia theo chức năng
│   ├── auth/           # Module xác thực
│   ├── dashboard/      # Module dashboard
│   ├── profile/        # Module thông tin cá nhân
│   └── error/          # Module xử lý lỗi
├── shared/             # Utilities dùng chung
│   ├── config/         # Cấu hình ứng dụng
│   ├── contexts/       # React contexts
│   ├── services/       # API services
│   └── utils/          # Utility functions
└── lib/                # Libraries và utils
```

## 🎨 Theme và Design

- **Color Scheme**: Màu xanh chủ đạo phù hợp với tài chính
- **Dark Mode**: Hỗ trợ chế độ sáng/tối
- **Responsive**: Tối ưu cho mobile và desktop
- **Typography**: Inter font family

## ⚙️ Cài đặt và chạy dự án

### Prerequisites

- Node.js >= 16
- npm hoặc yarn

### Installation

1. Clone repository:

```bash
git clone <repository-url>
cd FINANCE_FE
```

2. Cài đặt dependencies:

```bash
npm install
```

3. Tạo file environment variables:

```bash
cp .env.example .env
```

4. Cấu hình environment variables:

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_FACEBOOK_APP_ID=your_facebook_app_id
VITE_GITHUB_CLIENT_ID=your_github_client_id
```

5. Chạy development server:

```bash
npm run dev
```

6. Mở trình duyệt tại `http://localhost:3000`

### Build for production

```bash
npm run build
```

## 🔧 Scripts có sẵn

- `npm run dev` - Chạy development server
- `npm run build` - Build production
- `npm run preview` - Preview production build
- `npm run lint` - Chạy ESLint

## 📝 API Integration

Dự án được thiết kế để tích hợp với REST API. Các endpoint cần thiết:

### Authentication

- `POST /auth/login` - Đăng nhập
- `POST /auth/register` - Đăng ký
- `POST /auth/logout` - Đăng xuất
- `POST /auth/forgot-password` - Quên mật khẩu
- `POST /auth/activate` - Kích hoạt tài khoản
- `POST /auth/change-password` - Đổi mật khẩu
- `DELETE /auth/account` - Xóa tài khoản
- `PATCH /auth/profile` - Cập nhật profile

### Social Auth

- `POST /auth/google` - Đăng nhập Google
- `POST /auth/facebook` - Đăng nhập Facebook
- `POST /auth/github` - Đăng nhập GitHub

### Dashboard

- `GET /dashboard/stats` - Thống kê tổng quan
- `GET /dashboard/recent-transactions` - Giao dịch gần đây

## 🔒 Security Features

- JWT Token Authentication
- Refresh Token Rotation
- Password Validation (6-8 characters)
- CSRF Protection Ready
- Input Sanitization
- File Upload Validation

## 📱 Responsive Design

- Mobile First Approach
- Tablet Optimization
- Desktop Enhancement
- Touch-friendly Interface

## 🎯 Roadmap

### Sprint 2 (Upcoming)

- Quản lý giao dịch thu/chi
- Phân loại theo danh mục
- Báo cáo tài chính
- Quản lý ví tiền

### Sprint 3 (Future)

- Lập ngân sách
- Mục tiêu tiết kiệm
- Thông báo và nhắc nhở
- Export dữ liệu

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📧 Contact

- Email: support@financeapp.com
- Project Link: [https://github.com/username/FINANCE_FE](https://github.com/username/FINANCE_FE)
