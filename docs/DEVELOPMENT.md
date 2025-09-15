# Finance Management System Documentation

## Hướng dẫn phát triển

### 1. Cấu trúc module

Mỗi module trong dự án được tổ chức theo cấu trúc:

```
module/
├── README.md           # Tài liệu module
├── index.js           # Export chính
├── components/        # Components riêng của module
├── pages/            # Các trang của module
├── services/         # API services
├── contexts/         # React contexts (nếu cần)
└── hooks/           # Custom hooks (nếu cần)
```

### 2. Quy tắc đặt tên

- **Components**: PascalCase (VD: `UserProfile.jsx`)
- **Pages**: PascalCase (VD: `LoginPage.jsx`)
- **Services**: camelCase (VD: `authService.js`)
- **Utilities**: camelCase (VD: `validationUtils.js`)
- **Constants**: UPPER_SNAKE_CASE (VD: `API_ENDPOINTS`)

### 3. Import/Export

- Sử dụng named exports cho utilities và services
- Sử dụng default exports cho components và pages
- Group imports theo thứ tự: React → Third-party → Internal

### 4. State Management

- Sử dụng React Context cho global state
- useState cho local component state
- Tránh prop drilling bằng cách sử dụng contexts

### 5. Error Handling

- Sử dụng try-catch cho async operations
- Hiển thị lỗi thông qua toast notifications
- Log errors cho debugging

### 6. Styling

- Sử dụng Tailwind CSS classes
- Tạo custom classes trong index.css khi cần
- Sử dụng CSS variables cho theme

### 7. API Integration

- Tất cả API calls phải đi qua apiService
- Xử lý authentication tự động
- Implement retry logic cho failed requests

### 8. Testing (Tương lai)

- Unit tests cho utilities
- Integration tests cho API services
- E2E tests cho user flows
