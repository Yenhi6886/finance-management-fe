/**
 * Các hàm công cụ xác thực dữ liệu chung
 */

// Xác thực số tiền với tùy chọn confirm cho số tiền lớn
export const validateAmountWithConfirm = (amount, options = {}) => {
  const {
    min = 0,
    max = 999999999,
    decimalPlaces = 2,
    allowZero = false,
    largeAmountThreshold = 100000000000, // 100 tỉ
    fieldName = 'Số tiền'
  } = options;

  const errors = [];
  let needsConfirmation = false;
  let confirmMessage = '';

  // Kiểm tra có trống không
  if (!amount || amount.toString().trim() === '') {
    errors.push('Số tiền không được để trống');
    return { isValid: false, errors, needsConfirmation: false };
  }

  // Chuyển đổi thành số
  const numAmount = parseFloat(amount);
  
  // Kiểm tra có phải số hợp lệ không
  if (isNaN(numAmount)) {
    errors.push('Số tiền phải là một số hợp lệ');
    return { isValid: false, errors, needsConfirmation: false };
  }

  // Kiểm tra có phải số âm không
  if (numAmount < 0) {
    errors.push('Số tiền không được âm');
  }

  // Kiểm tra giá trị tối thiểu
  if (!allowZero && numAmount <= min) {
    errors.push(`Số tiền phải lớn hơn ${min.toLocaleString('vi-VN')}`);
  } else if (allowZero && numAmount < min) {
    errors.push(`Số tiền không được nhỏ hơn ${min.toLocaleString('vi-VN')}`);
  }

  // Kiểm tra số tiền lớn - thay vì error, sẽ cần confirm
  if (numAmount > largeAmountThreshold) {
    needsConfirmation = true;
    confirmMessage = `${fieldName} của bạn là ${numAmount.toLocaleString('vi-VN')} VND (hơn ${(largeAmountThreshold / 1000000000).toFixed(0)} tỉ). Bạn có chắc chắn muốn tiếp tục?`;
  } else if (numAmount > max) {
    errors.push(`Số tiền không được vượt quá ${max.toLocaleString('vi-VN')}`);
  }

  // Kiểm tra số chữ số thập phân
  const decimalPart = amount.toString().split('.')[1];
  if (decimalPart && decimalPart.length > decimalPlaces) {
    errors.push(`Số tiền chỉ được có tối đa ${decimalPlaces} chữ số thập phân`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    value: numAmount,
    needsConfirmation,
    confirmMessage
  };
};

// Xác thực số tiền (hàm gốc để tương thích ngược)
export const validateAmount = (amount, options = {}) => {
  const {
    min = 0,
    max = 999999999,
    decimalPlaces = 2,
    allowZero = false
  } = options;

  const errors = [];

  // Kiểm tra có trống không
  if (!amount || amount.toString().trim() === '') {
    errors.push('Số tiền không được để trống');
    return { isValid: false, errors };
  }

  // Chuyển đổi thành số
  const numAmount = parseFloat(amount);
  
  // Kiểm tra có phải số hợp lệ không
  if (isNaN(numAmount)) {
    errors.push('Số tiền phải là một số hợp lệ');
    return { isValid: false, errors };
  }

  // Kiểm tra có phải số âm không
  if (numAmount < 0) {
    errors.push('Số tiền không được âm');
  }

  // Kiểm tra giá trị tối thiểu
  if (!allowZero && numAmount <= min) {
    errors.push(`Số tiền phải lớn hơn ${min.toLocaleString('vi-VN')}`);
  } else if (allowZero && numAmount < min) {
    errors.push(`Số tiền không được nhỏ hơn ${min.toLocaleString('vi-VN')}`);
  }

  // Kiểm tra giá trị tối đa
  if (numAmount > max) {
    errors.push(`Số tiền không được vượt quá ${max.toLocaleString('vi-VN')}`);
  }

  // Kiểm tra số chữ số thập phân
  const decimalPart = amount.toString().split('.')[1];
  if (decimalPart && decimalPart.length > decimalPlaces) {
    errors.push(`Số tiền chỉ được có tối đa ${decimalPlaces} chữ số thập phân`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    value: numAmount
  };
};

// Xác thực ghi chú/mô tả
export const validateDescription = (description, options = {}) => {
  const {
    maxLength = 500,
    minLength = 0,
    allowSpecialChars = true,
    required = false,
    allowNewLines = true,
    allowEmojis = true,
    fieldName = 'Ghi chú'
  } = options;

  const errors = [];

  // Kiểm tra có trống không (nếu bắt buộc)
  if (required && (!description || description.trim() === '')) {
    errors.push(`${fieldName} không được để trống`);
    return { isValid: false, errors };
  }

  // Nếu trống và không bắt buộc, thì qua xác thực
  if (!description || description.trim() === '') {
    return { isValid: true, errors: [], value: '' };
  }

  const trimmedDescription = description.trim();

  // Kiểm tra độ dài tối thiểu
  if (trimmedDescription.length < minLength) {
    errors.push(`${fieldName} phải có ít nhất ${minLength} ký tự`);
  }

  // Kiểm tra độ dài tối đa
  if (trimmedDescription.length > maxLength) {
    errors.push(`${fieldName} không được vượt quá ${maxLength} ký tự`);
  }

  // Kiểm tra ký tự đặc biệt nguy hiểm (luôn bị cấm)
  const dangerousChars = /[<>{}[\]\\|`~]/;
  if (dangerousChars.test(trimmedDescription)) {
    errors.push(`${fieldName} chứa ký tự nguy hiểm không được phép`);
  }

  // Kiểm tra ký tự đặc biệt khác (nếu không cho phép)
  if (!allowSpecialChars) {
    const specialCharRegex = /[!@#$%^&*()+=\/]/;
    if (specialCharRegex.test(trimmedDescription)) {
      errors.push(`${fieldName} chứa ký tự đặc biệt không được phép`);
    }
  }

  // Kiểm tra emoji (nếu không cho phép)
  if (!allowEmojis) {
    const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u;
    if (emojiRegex.test(trimmedDescription)) {
      errors.push(`${fieldName} không được chứa emoji`);
    }
  }

  // Kiểm tra xuống dòng (nếu không cho phép)
  if (!allowNewLines && trimmedDescription.includes('\n')) {
    errors.push(`${fieldName} không được chứa xuống dòng`);
  }

  // Kiểm tra có chỉ chứa khoảng trắng không
  if (trimmedDescription.length === 0 && description.length > 0) {
    errors.push(`${fieldName} không được chỉ chứa khoảng trắng`);
  }

  // Kiểm tra ký tự lặp lại quá nhiều
  const repeatedChars = /(.)\1{4,}/;
  if (repeatedChars.test(trimmedDescription)) {
    errors.push(`${fieldName} chứa ký tự lặp lại quá nhiều lần`);
  }

  // Kiểm tra spam (nhiều từ giống nhau)
  const words = trimmedDescription.split(/\s+/);
  const wordCount = {};
  words.forEach(word => {
    if (word.length > 2) {
      wordCount[word.toLowerCase()] = (wordCount[word.toLowerCase()] || 0) + 1;
    }
  });
  
  const maxRepeatedWords = Math.max(...Object.values(wordCount));
  if (maxRepeatedWords > 3) {
    errors.push(`${fieldName} chứa từ lặp lại quá nhiều lần`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    value: trimmedDescription,
    wordCount: words.length,
    charCount: trimmedDescription.length
  };
};

// Xác thực ngày tháng
export const validateDate = (date, options = {}) => {
  const {
    allowFuture = true,
    allowPast = true,
    maxFutureDays = 365,
    maxPastDays = 3650, // 10 năm
    required = true
  } = options;

  const errors = [];

  // Kiểm tra có trống không
  if (required && (!date || date.trim() === '')) {
    errors.push('Ngày không được để trống');
    return { isValid: false, errors };
  }

  if (!date || date.trim() === '') {
    return { isValid: true, errors: [], value: null };
  }

  const dateObj = new Date(date);
  const now = new Date();

  // Kiểm tra có phải ngày hợp lệ không
  if (isNaN(dateObj.getTime())) {
    errors.push('Ngày không hợp lệ');
    return { isValid: false, errors };
  }

  // Kiểm tra ngày tương lai
  if (!allowFuture && dateObj > now) {
    errors.push('Không được chọn ngày trong tương lai');
  }

  // Kiểm tra ngày quá khứ
  if (!allowPast && dateObj < now) {
    errors.push('Không được chọn ngày trong quá khứ');
  }

  // Kiểm tra số ngày tương lai tối đa
  const futureDays = Math.ceil((dateObj - now) / (1000 * 60 * 60 * 24));
  if (futureDays > maxFutureDays) {
    errors.push(`Không được chọn ngày quá ${maxFutureDays} ngày trong tương lai`);
  }

  // Kiểm tra số ngày quá khứ tối đa
  const pastDays = Math.ceil((now - dateObj) / (1000 * 60 * 60 * 24));
  if (pastDays > maxPastDays) {
    errors.push(`Không được chọn ngày quá ${maxPastDays} ngày trong quá khứ`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    value: dateObj
  };
};

// Xác thực danh mục
export const validateCategory = (categoryId, categories = []) => {
  const errors = [];

  // Kiểm tra có trống không
  if (!categoryId || categoryId.toString().trim() === '') {
    errors.push('Vui lòng chọn danh mục');
    return { isValid: false, errors };
  }

  // Kiểm tra danh mục có tồn tại không
  const categoryExists = categories.some(cat => 
    cat.id === parseInt(categoryId) || cat.id === categoryId
  );

  if (!categoryExists) {
    errors.push('Danh mục không tồn tại');
  }

  return {
    isValid: errors.length === 0,
    errors,
    value: parseInt(categoryId)
  };
};

// Xác thực ví
export const validateWallet = (walletId, wallets = [], transactionType = 'expense', amount = 0) => {
  const errors = [];

  // Kiểm tra có trống không
  if (!walletId || walletId.toString().trim() === '') {
    errors.push('Vui lòng chọn ví');
    return { isValid: false, errors };
  }

  // Kiểm tra ví có tồn tại không
  const wallet = wallets.find(w => 
    w.id === parseInt(walletId) || w.id === walletId
  );

  if (!wallet) {
    errors.push('Ví không tồn tại');
    return { isValid: false, errors };
  }

  // Đối với giao dịch chi, kiểm tra số dư
  if (transactionType.toLowerCase() === 'expense' && amount > 0) {
    if (wallet.balance < amount) {
      errors.push(`Số dư ví không đủ. Số dư hiện tại: ${wallet.balance.toLocaleString('vi-VN')}`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    value: parseInt(walletId),
    wallet
  };
};

// Hàm xác thực tổng hợp
export const validateTransaction = (formData, options = {}) => {
  const {
    categories = [],
    wallets = [],
    amountOptions = {},
    descriptionOptions = {},
    dateOptions = {}
  } = options;

  const errors = {};
  let isValid = true;

  // Xác thực số tiền
  const amountValidation = validateAmount(formData.amount, amountOptions);
  if (!amountValidation.isValid) {
    errors.amount = amountValidation.errors[0];
    isValid = false;
  }

  // Xác thực mô tả
  const descriptionValidation = validateDescription(formData.description, descriptionOptions);
  if (!descriptionValidation.isValid) {
    errors.description = descriptionValidation.errors[0];
    isValid = false;
  }

  // Xác thực ngày tháng
  const dateValidation = validateDate(formData.date, dateOptions);
  if (!dateValidation.isValid) {
    errors.date = dateValidation.errors[0];
    isValid = false;
  }

  // Xác thực danh mục
  const categoryValidation = validateCategory(formData.categoryId, categories);
  if (!categoryValidation.isValid) {
    errors.categoryId = categoryValidation.errors[0];
    isValid = false;
  }

  // Xác thực ví
  const walletValidation = validateWallet(
    formData.walletId, 
    wallets, 
    formData.type, 
    amountValidation.value || 0
  );
  if (!walletValidation.isValid) {
    errors.walletId = walletValidation.errors[0];
    isValid = false;
  }

    return {
    isValid,
    errors,
    validatedData: {
      amount: amountValidation.value,
      description: descriptionValidation.value,
      date: dateValidation.value,
      categoryId: categoryValidation.value,
      walletId: walletValidation.value
    }
  };
};

// Xác thực mật khẩu
export const validatePassword = (password) => {
  const errors = [];
  
  if (!password) {
    errors.push('Mật khẩu là bắt buộc');
    return errors;
  }
  
  if (password.length < 6) {
    errors.push('Mật khẩu phải có ít nhất 6 ký tự');
  }
  
  if (password.length > 8) {
    errors.push('Mật khẩu không được vượt quá 8 ký tự');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Mật khẩu phải có ít nhất một chữ hoa');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Mật khẩu phải có ít nhất một chữ thường');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Mật khẩu phải có ít nhất một số');
  }
  
  return errors;
};

// Xác thực email
export const isValidEmail = (email) => {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Xác thực tên đăng nhập
export const validateUsername = (username) => {
  const errors = [];
  
  if (!username) {
    errors.push('Tên đăng nhập là bắt buộc');
    return errors;
  }
  
  if (username.length < 3) {
    errors.push('Tên đăng nhập phải có ít nhất 3 ký tự');
  }
  
  if (username.length > 50) {
    errors.push('Tên đăng nhập không được vượt quá 50 ký tự');
  }
  
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    errors.push('Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới');
  }
  
  return errors;
};

// Xác thực tên
export const validateName = (name, fieldName = 'Tên') => {
  const errors = [];
  
  if (!name || !name.trim()) {
    errors.push(`${fieldName} là bắt buộc`);
    return errors;
  }
  
  if (name.trim().length < 2) {
    errors.push(`${fieldName} phải có ít nhất 2 ký tự`);
  }
  
  if (name.trim().length > 50) {
    errors.push(`${fieldName} không được vượt quá 50 ký tự`);
  }
  
  if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(name.trim())) {
    errors.push(`${fieldName} chỉ được chứa chữ cái và khoảng trắng`);
  }
  
  return errors;
};

// Xác thực số điện thoại
export const validatePhoneNumber = (phoneNumber) => {
  const errors = [];
  
  if (!phoneNumber) {
    return errors; // Số điện thoại là tùy chọn
  }
  
  const phoneRegex = /^[0-9+\-\s()]+$/;
  if (!phoneRegex.test(phoneNumber)) {
    errors.push('Số điện thoại chỉ được chứa số, dấu +, -, khoảng trắng và dấu ngoặc');
  }
  
  const digitsOnly = phoneNumber.replace(/[^0-9]/g, '');
  if (digitsOnly.length < 10 || digitsOnly.length > 15) {
    errors.push('Số điện thoại phải có từ 10 đến 15 chữ số');
  }
  
  return errors;
};

// Hàm xác thực thời gian thực (dùng cho xác thực khi nhập liệu)
export const validateField = (fieldName, value, options = {}) => {
  switch (fieldName) {
    case 'amount':
      return validateAmount(value, options);
    case 'description':
      return validateDescription(value, options);
    case 'date':
      return validateDate(value, options);
    case 'categoryId':
      return validateCategory(value, options.categories || []);
    case 'walletId':
      return validateWallet(value, options.wallets || [], options.transactionType, options.amount);
    case 'password':
      return { isValid: validatePassword(value).length === 0, errors: validatePassword(value), value };
    case 'email':
      return { isValid: isValidEmail(value), errors: isValidEmail(value) ? [] : ['Email không hợp lệ'], value };
    case 'username':
      return { isValid: validateUsername(value).length === 0, errors: validateUsername(value), value };
    case 'firstName':
      return { isValid: validateName(value, 'Tên').length === 0, errors: validateName(value, 'Tên'), value };
    case 'lastName':
      return { isValid: validateName(value, 'Họ').length === 0, errors: validateName(value, 'Họ'), value };
    case 'phoneNumber':
      return { isValid: validatePhoneNumber(value).length === 0, errors: validatePhoneNumber(value), value };
    default:
      return { isValid: true, errors: [], value };
  }
};

// Export object để tương thích với cách import cũ
export const validationUtils = {
  validatePassword,
  isValidEmail,
  validateUsername,
  validateName,
  validatePhoneNumber,
  validateAmount,
  validateDescription,
  validateDate,
  validateCategory,
  validateWallet,
  validateTransaction,
  validateField
};