# LUỒNG TEST TÍNH NĂNG EXPENSE MANAGEMENT

## 🎯 Tổng Quan
Tài liệu này hướng dẫn test các tính năng quản lý chi tiêu đã được implement:

### ✅ Đã Hoàn Thành:
1. **Yêu cầu 21**: Nạp tiền vào ví ✅
2. **Yêu cầu 22**: Thêm khoản chi tiêu ✅  
3. **Yêu cầu 23**: Sửa thông tin khoản chi ✅
4. **Yêu cầu 24**: Xóa khoản chi tiêu ✅

---

## 🚀 Chuẩn Bị Test

### 1. Khởi động ứng dụng
```bash
npm run dev
```
- Server chạy trên: http://localhost:3001
- Đăng nhập với tài khoản test

### 2. Dữ liệu Mock có sẵn
- **3 ví test**: Ví Tiền Mặt, Tài Khoản Ngân Hàng, Ví Đầu Tư
- **10 danh mục chi tiêu**: Ăn uống, Di chuyển, Mua sắm, Giải trí, Hóa đơn, Y tế, Giáo dục, Gia đình, Du lịch, Khác
- **5 giao dịch chi tiêu mẫu**: Đã có sẵn để test tính năng sửa/xóa

---

## 📋 LUỒNG TEST CHI TIẾT

### ✅ TEST CASE 1: Nạp tiền vào ví (Yêu cầu 21)

#### **1.1. Test Navigation đến DepositMoney**
1. Vào **Danh sách ví** (`/wallets`)
2. Click vào một ví bất kỳ để xem chi tiết
3. Trong WalletDetail, tìm button **"Nạp tiền"** 
4. Click button → Chuyển đến trang nạp tiền (`/wallets/:walletId/deposit`)

**✅ Expected**: Hiển thị form nạp tiền với 2 trường: Số tiền + Ghi chú

#### **1.2. Test Form Validation**
1. **Test Empty Amount**:
   - Bỏ trống số tiền → Click "Nạp tiền"
   - ✅ Expected: Hiển thị lỗi "Số tiền phải lớn hơn 0"

2. **Test Minimum Amount**:
   - Nhập số tiền < 1,000 (ví dụ: 500) → Submit
   - ✅ Expected: Hiển thị lỗi "Số tiền tối thiểu là 1,000 ₫"

3. **Test Maximum Amount**:
   - Nhập số tiền > 100,000,000 → Submit  
   - ✅ Expected: Hiển thị lỗi "Số tiền tối đa là 100,000,000 ₫"

4. **Test Valid Input**:
   - Nhập số tiền: 500,000
   - Nhập ghi chú: "Nạp tiền từ ngân hàng"
   - ✅ Expected: Hiển thị preview với số dư mới

#### **1.3. Test Successful Deposit**
1. Nhập dữ liệu hợp lệ và submit
2. ✅ Expected: 
   - Loading spinner hiển thị
   - Sau 1s: Thông báo "Nạp tiền thành công!"
   - Hiển thị số dư mới
   - Toast notification xuất hiện
   - Form reset về trạng thái ban đầu

#### **1.4. Test API Call**
- Kiểm tra Network tab: POST request tới `/api/wallet/{walletId}/deposit`
- Request body: `{ "amount": 500000, "notes": "Nạp tiền từ ngân hàng" }`
- Response: `{ "success": true, "data": { "newBalance": ..., "message": "..." } }`

---

### ✅ TEST CASE 2: Thêm khoản chi tiêu từ Header (Yêu cầu 22)

#### **2.1. Test Quick Access Button**
1. Ở bất kỳ trang nào, tìm button **"Thêm chi tiêu"** trong Header
2. Click button → Popup AddExpense hiển thị
3. ✅ Expected: Modal popup với 5 trường: Ví, Số tiền, Danh mục, Thời gian, Ghi chú

#### **2.2. Test Form Validation**
1. **Test Required Fields**:
   - Bỏ trống các trường bắt buộc → Submit
   - ✅ Expected: Hiển thị lỗi cho từng trường:
     - "Vui lòng chọn ví"
     - "Số tiền phải lớn hơn 0" 
     - "Vui lòng chọn danh mục chi tiêu"
     - "Vui lòng chọn thời gian"

2. **Test Amount Validation**:
   - Số tiền âm → "Số tiền phải lớn hơn 0"
   - Số tiền < 1,000 → "Số tiền tối thiểu là 1,000 ₫"

3. **Test Balance Check**:
   - Chọn ví có số dư thấp
   - Nhập số tiền > số dư ví
   - ✅ Expected: Warning "Số dù không đủ!" trong preview

#### **2.3. Test Successful Expense Creation**
1. **Fill Valid Data**:
   - Ví: "Ví Tiền Mặt"
   - Số tiền: 150,000
   - Danh mục: "🍽️ Ăn uống" 
   - Thời gian: Mặc định hiện tại
   - Ghi chú: "Ăn trưa với đồng nghiệp"

2. **Submit và verify**:
   - ✅ Expected: 
     - Loading state 800ms
     - Success message "Thêm khoản chi thành công!"
     - Toast notification
     - Modal tự đóng sau 2s
     - Số dư ví giảm tương ứng

#### **2.4. Test API Integration**
- API call: POST `/api/expenses`
- Request body:
```json
{
  "walletId": "1",
  "amount": 150000,
  "category": "food", 
  "note": "Ăn trưa với đồng nghiệp",
  "datetime": "2024-09-11T12:30:00"
}
```

---

### ✅ TEST CASE 3: Quản lý danh sách chi tiêu (Yêu cầu 23 & 24)

#### **3.1. Test Navigation**
1. Từ Sidebar → Click **"Chi Tiêu"** → **"Danh Sách Chi Tiêu"**
2. Hoặc trực tiếp vào `/expenses`
3. ✅ Expected: Hiển thị danh sách chi tiêu với filters

#### **3.2. Test Filter Functions**
1. **Search Filter**:
   - Nhập "ăn" trong tìm kiếm
   - ✅ Expected: Chỉ hiển thị khoản chi có từ "ăn" trong ghi chú/danh mục

2. **Wallet Filter**:
   - Chọn "Ví Tiền Mặt" 
   - ✅ Expected: Chỉ hiển thị chi tiêu từ ví đó

3. **Category Filter**:
   - Chọn "Ăn uống"
   - ✅ Expected: Chỉ hiển thị chi tiêu danh mục ăn uống

4. **Date Range Filter**:
   - Chọn từ ngày → đến ngày
   - ✅ Expected: Lọc theo khoảng thời gian

5. **Clear Filters**:
   - Click "Xóa bộ lọc" → Về trạng thái ban đầu

#### **3.3. Test Edit Expense (Yêu cầu 23)**
1. **Open Edit Modal**:
   - Click icon ✏️ trên một khoản chi
   - ✅ Expected: Modal EditExpense hiển thị với dữ liệu cũ

2. **Test Form Pre-fill**:
   - ✅ Expected: Tất cả trường đã được điền sẵn dữ liệu hiện tại
   - Button "Cập nhật" disabled cho đến khi có thay đổi

3. **Test Change Detection**:
   - Thay đổi số tiền từ 150,000 → 200,000
   - ✅ Expected: 
     - Alert "Bạn đã thay đổi thông tin khoản chi"
     - Button "Cập nhật" enabled
     - Preview hiển thị thay đổi

4. **Test Update Success**:
   - Submit form → 
   - ✅ Expected: 
     - API call PUT `/api/expenses/{id}`
     - Success message
     - Modal đóng 
     - Danh sách refresh với dữ liệu mới

#### **3.4. Test Delete Expense (Yêu cầu 24)**
1. **Open Delete Confirmation**:
   - Click icon 🗑️ trên một khoản chi
   - ✅ Expected: Confirmation dialog hiển thị

2. **Test Confirmation Content**:
   - ✅ Expected: Hiển thị tên danh mục, số tiền, tên ví
   - Warning: "Tiền sẽ được hoàn lại vào ví"

3. **Test Delete Success**:
   - Click "Xóa" → 
   - ✅ Expected:
     - API call DELETE `/api/expenses/{id}`  
     - Success toast: "Xóa khoản chi thành công! Tiền đã được hoàn về ví."
     - Item biến mất khỏi danh sách
     - Số dư ví tăng lại

4. **Test Cancel Delete**:
   - Click "Hủy" → Dialog đóng, không có thay đổi

---

## 🎯 TEST SCENARIOS THỰC TẾ

### **Scenario 1: User Journey Hoàn Chỉnh**
1. User đăng nhập
2. Vào `/wallets` → Click vào "Ví Tiền Mặt" 
3. Click "Nạp tiền" → Nạp 1,000,000 VND
4. Vào Header → Click "Thêm chi tiêu"
5. Tạo chi tiêu: 50,000 VND cho "Ăn uống"
6. Vào `/expenses` → Tìm chi tiêu vừa tạo
7. Edit chi tiêu: Tăng lên 80,000 VND
8. Xóa chi tiêu → Verify tiền hoàn về ví

### **Scenario 2: Error Handling**
1. Test với số dư ví = 0 
2. Tạo chi tiêu với số tiền lớn → Verify warning
3. Test network error (offline) → Verify error messages
4. Test với dữ liệu không hợp lệ

### **Scenario 3: UI/UX Testing**
1. Test responsive trên mobile/tablet
2. Test dark/light theme switching
3. Test loading states
4. Test empty states (no expenses)
5. Test form validation real-time

---

## 🐛 COMMON ISSUES & DEBUG

### **Issue 1: Modal không hiển thị**
- Check console errors
- Verify import paths
- Check z-index styling

### **Issue 2: API calls failed**
- Check Network tab
- Verify mock data format
- Check walletService functions

### **Issue 3: Form validation không hoạt động**
- Check useState dependencies
- Verify validation logic
- Check error state management

### **Issue 4: Filter không hoạt động**
- Check useEffect dependencies  
- Verify filter logic
- Check async data loading

---

## ✅ CHECKLIST HOÀN THÀNH

### Tính năng đã test:
- [ ] **Nạp tiền vào ví**: Form, validation, API, success flow
- [ ] **Thêm chi tiêu từ Header**: Quick access, popup, validation
- [ ] **Danh sách chi tiêu**: Display, filters, search
- [ ] **Sửa chi tiêu**: Edit modal, change detection, update
- [ ] **Xóa chi tiêu**: Confirmation, delete, refund

### Integration Testing:
- [ ] Navigation giữa các trang
- [ ] Data consistency giữa components  
- [ ] Error handling cross-component
- [ ] Mobile responsive
- [ ] Theme switching

### Performance Testing:
- [ ] Loading times
- [ ] Memory usage
- [ ] Large dataset handling

---

## 📞 Support

Nếu gặp lỗi trong quá trình test:
1. Check browser console
2. Verify network requests
3. Check component state với React DevTools
4. Restart development server nếu cần

**Server URL**: http://localhost:3001
**Test Account**: Sử dụng tài khoản đã có trong hệ thống
