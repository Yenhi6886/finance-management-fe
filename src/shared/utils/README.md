# Công cụ xác thực dữ liệu (validationUtils)

Module này cung cấp các hàm tiện ích để xác thực dữ liệu đầu vào trong hệ thống quản lý tài chính.

## Tính năng

- **Xác thực số tiền**: Kiểm tra định dạng, phạm vi, số chữ số thập phân
- **Xác thực mô tả**: Kiểm tra độ dài, ký tự đặc biệt, emoji, xuống dòng
- **Xác thực ngày tháng**: Kiểm tra định dạng ngày, giới hạn phạm vi
- **Xác thực danh mục**: Kiểm tra danh mục có tồn tại
- **Xác thực ví**: Kiểm tra sự tồn tại và số dư ví
- **Xác thực mật khẩu**: Kiểm tra độ dài, chữ hoa, chữ thường, số
- **Xác thực email**: Kiểm tra định dạng email hợp lệ
- **Xác thực tên đăng nhập**: Kiểm tra độ dài và ký tự cho phép
- **Xác thực tên**: Kiểm tra tên người dùng
- **Xác thực số điện thoại**: Kiểm tra định dạng số điện thoại
- **Xác thực thời gian thực**: Hỗ trợ xác thực ngay khi nhập liệu
- **Xác thực tổng hợp**: Xác thực toàn bộ form một lần

## Cách sử dụng

### Xác thực cơ bản

```javascript
import { validateAmount, validateDescription, validateDate, validatePassword, isValidEmail, validateUsername } from './validationUtils';

// Xác thực số tiền
const amountResult = validateAmount('100.50', {
  min: 0,
  max: 999999999,
  decimalPlaces: 2,
  allowZero: false
});

if (!amountResult.isValid) {
  console.log('Lỗi:', amountResult.errors[0]);
}

// Xác thực mô tả
const descResult = validateDescription('Đây là một mô tả', {
  maxLength: 500,
  allowSpecialChars: true,
  required: false
});

// Xác thực ngày tháng
const dateResult = validateDate('2024-01-01T10:00', {
  allowFuture: true,
  allowPast: true,
  maxFutureDays: 365,
  maxPastDays: 3650
});

// Xác thực mật khẩu
const passwordErrors = validatePassword('Password123');
if (passwordErrors.length > 0) {
  console.log('Lỗi mật khẩu:', passwordErrors);
}

// Xác thực email
const isEmailValid = isValidEmail('user@example.com');

// Xác thực tên đăng nhập
const usernameErrors = validateUsername('username123');
```

### Xác thực thời gian thực

```javascript
import { validateField } from './validationUtils';

// Sử dụng trong sự kiện nhập liệu
const handleAmountChange = (value) => {
  const validation = validateField('amount', value, {
    min: 0,
    max: 999999999,
    decimalPlaces: 2
  });
  
  if (!validation.isValid) {
    setError('amount', validation.errors[0]);
  } else {
    clearError('amount');
  }
};
```

### Xác thực tổng hợp

```javascript
import { validateTransaction } from './validationUtils';

const formData = {
  amount: '100',
  description: 'Giao dịch thử nghiệm',
  date: '2024-01-01T10:00',
  categoryId: '1',
  walletId: '1',
  type: 'expense'
};

const validation = validateTransaction(formData, {
  categories: [{ id: 1, name: 'Thực phẩm' }],
  wallets: [{ id: 1, name: 'Tiền mặt', balance: 1000 }],
  amountOptions: { min: 0, max: 999999999, decimalPlaces: 2 },
  descriptionOptions: { maxLength: 500 },
  dateOptions: { allowFuture: true, allowPast: true }
});

if (validation.isValid) {
  // Gửi form
  submitForm(validation.validatedData);
} else {
  // Hiển thị lỗi
  setErrors(validation.errors);
}
```

## Tùy chọn xác thực

### Tùy chọn xác thực số tiền (amountOptions)

- `min`: Giá trị tối thiểu (mặc định: 0)
- `max`: Giá trị tối đa (mặc định: 999999999)
- `decimalPlaces`: Số chữ số thập phân (mặc định: 2)
- `allowZero`: Có cho phép giá trị 0 (mặc định: false)

### Tùy chọn xác thực mô tả (descriptionOptions)

- `maxLength`: Độ dài tối đa (mặc định: 500)
- `minLength`: Độ dài tối thiểu (mặc định: 0)
- `allowSpecialChars`: Có cho phép ký tự đặc biệt (mặc định: true)
- `required`: Có bắt buộc (mặc định: false)
- `allowNewLines`: Có cho phép xuống dòng (mặc định: true)
- `allowEmojis`: Có cho phép emoji (mặc định: true)
- `fieldName`: Tên trường hiển thị trong thông báo lỗi (mặc định: 'Ghi chú')

### Tùy chọn xác thực ngày tháng (dateOptions)

- `allowFuture`: Có cho phép ngày tương lai (mặc định: true)
- `allowPast`: Có cho phép ngày quá khứ (mặc định: true)
- `maxFutureDays`: Số ngày tương lai tối đa (mặc định: 365)
- `maxPastDays`: Số ngày quá khứ tối đa (mặc định: 3650)
- `required`: Có bắt buộc (mặc định: true)

## Thông báo lỗi

Tất cả thông báo lỗi đều sử dụng tiếng Việt, bao gồm:

- Liên quan đến số tiền: "Số tiền phải lớn hơn 0", "Số tiền không được âm"
- Liên quan đến mô tả: "Mô tả không được vượt quá 500 ký tự", "Ghi chú chứa ký tự nguy hiểm không được phép", "Ghi chú chứa ký tự lặp lại quá nhiều lần"
- Liên quan đến ngày tháng: "Ngày không hợp lệ", "Không được chọn ngày trong tương lai"
- Liên quan đến danh mục: "Vui lòng chọn danh mục", "Danh mục không tồn tại"
- Liên quan đến ví: "Vui lòng chọn ví", "Số dư ví không đủ"

## Kiểm thử

Chạy kiểm thử:

```bash
npm test validationUtils.test.js
```

Kiểm thử bao phủ tất cả các tình huống của các hàm xác thực, bao gồm đầu vào hợp lệ, không hợp lệ và các trường hợp biên.
