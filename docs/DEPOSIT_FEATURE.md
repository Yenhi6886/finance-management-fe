# Tính năng Nạp tiền vào Ví

## Tổng quan

Tính năng nạp tiền cho phép người dùng thêm tiền vào ví của mình một cách dễ dàng và an toàn.

## Các tính năng chính

### 1. Giao diện nạp tiền

- **Route**: `/wallets/:walletId/deposit`
- **Component**: `DepositMoney.jsx`
- **Truy cập**: Từ nút "Nạp tiền" trong trang chi tiết ví (`WalletDetail`)

### 2. Form nhập liệu

- **Số tiền**:
  - Trường bắt buộc
  - Tối thiểu: 1,000 ₫
  - Tối đa: 100,000,000 ₫
  - Có preset amounts cho việc chọn nhanh (50k, 100k, 200k, 500k, 1M, 2M)
- **Ghi chú**:
  - Tùy chọn
  - Tối đa 255 ký tự

### 3. API Integration

- **Endpoint**: `POST /api/wallet/{walletId}/deposit`
- **Request Body**:
  ```json
  {
    "amount": 100000,
    "notes": "Nạp tiền từ ngân hàng"
  }
  ```
- **Response Success (200)**:
  ```json
  {
    "success": true,
    "message": "Nạp tiền thành công!",
    "data": {
      "newBalance": 1100000,
      "note": "Nạp tiền từ ngân hàng",
      "message": "Nạp tiền thành công!",
      "transactionId": "TXN1731338460123",
      "timestamp": "2024-11-11T12:30:00.000Z",
      "amount": 100000
    }
  }
  ```
- **Response Error (400)**:
  ```json
  {
    "success": false,
    "message": "Số tiền phải lớn hơn 0"
  }
  ```

### 4. UX Features

- **Preset Amount Buttons**: 6 nút cho các mức tiền phổ biến
- **Live Preview**: Hiển thị số dư sau khi nạp
- **Toast Notifications**: Thông báo thành công/thất bại
- **Auto Clear**: Thông báo thành công tự động ẩn sau 5 giây
- **Loading States**: Hiển thị trạng thái đang xử lý
- **Form Validation**: Kiểm tra dữ liệu trước khi submit

### 5. Error Handling

- **Client-side validation**: Kiểm tra số tiền, độ dài ghi chú
- **Server-side validation**: API validation với thông báo lỗi rõ ràng
- **Network errors**: Xử lý lỗi mạng và timeout
- **User feedback**: Hiển thị lỗi qua alerts và toast

## Luồng hoạt động

1. **Truy cập**: User click "Nạp tiền" từ WalletDetail
2. **Form**: Hiển thị form với thông tin ví hiện tại
3. **Input**: User nhập số tiền và ghi chú (hoặc chọn preset)
4. **Preview**: Hiển thị preview số dư sau nạp
5. **Validate**: Kiểm tra dữ liệu client-side
6. **Submit**: Gửi request đến API
7. **Process**: Server xử lý và trả kết quả
8. **Update**: Cập nhật UI với số dư mới
9. **Feedback**: Hiển thị thông báo cho user

## Files thay đổi

### Tạo mới:

- `src/modules/wallets/pages/DepositMoney.jsx` - Component chính
- `docs/DEPOSIT_FEATURE.md` - Documentation

### Cập nhật:

- `src/modules/wallets/services/walletService.js` - Thêm `depositMoney` API
- `src/modules/wallets/index.js` - Export DepositMoney component
- `src/App.jsx` - Thêm route `/wallets/:walletId/deposit`
- `src/modules/wallets/pages/WalletDetail.jsx` - Cập nhật navigation

## Cách sử dụng

1. Vào trang danh sách ví (`/wallets`)
2. Click vào một ví để xem chi tiết
3. Click nút "Nạp tiền"
4. Nhập số tiền hoặc chọn preset amount
5. Thêm ghi chú (tùy chọn)
6. Click "Nạp tiền" để xử lý
7. Xem thông báo và số dư được cập nhật

## Testing

Để test tính năng:

1. Start development server: `npm run dev`
2. Login vào hệ thống
3. Vào `/wallets` và chọn một ví
4. Test các scenario:
   - Nạp với preset amounts
   - Nạp với số tiền tùy chỉnh
   - Test validation (số âm, quá lớn, etc.)
   - Test với/không ghi chú
   - Test error cases

## Future Enhancements

- [ ] Thêm payment methods (bank transfer, card, etc.)
- [ ] Transaction history cho deposits
- [ ] Recurring deposits
- [ ] Multiple currency support
- [ ] Receipt generation
- [ ] Confirmation dialogs
- [ ] Batch deposits
