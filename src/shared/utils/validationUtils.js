// Validation utility functions
export const validationUtils = {
  // Email validation
  isValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },

  // Password validation
  validatePassword: (password) => {
    const errors = []
    
    if (!password) {
      errors.push('Mật khẩu là bắt buộc')
      return errors
    }
    
    if (password.length < 6) {
      errors.push('Mật khẩu phải có ít nhất 6 ký tự')
    }
    
    if (password.length > 8) {
      errors.push('Mật khẩu không được quá 8 ký tự')
    }
    
    return errors
  },

  // Username validation
  validateUsername: (username) => {
    const errors = []
    
    if (!username) {
      errors.push('Tên đăng nhập là bắt buộc')
      return errors
    }
    
    if (username.length < 3) {
      errors.push('Tên đăng nhập phải có ít nhất 3 ký tự')
    }
    
    if (username.length > 50) {
      errors.push('Tên đăng nhập không được quá 50 ký tự')
    }
    
    // Only allow alphanumeric and underscore
    const usernameRegex = /^[a-zA-Z0-9_]+$/
    if (!usernameRegex.test(username)) {
      errors.push('Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới')
    }
    
    return errors
  },

  // Phone validation
  validatePhone: (phone) => {
    const errors = []
    
    if (!phone) {
      return errors // Phone is optional
    }
    
    // Vietnamese phone number regex
    const phoneRegex = /^(\+84|84|0)[3|5|7|8|9][0-9]{8}$/
    if (!phoneRegex.test(phone)) {
      errors.push('Số điện thoại không hợp lệ')
    }
    
    return errors
  },

  // File validation
  validateFile: (file, maxSize = 5 * 1024 * 1024, allowedTypes = ['image/jpeg', 'image/png', 'image/webp']) => {
    const errors = []
    
    if (!file) {
      return errors
    }
    
    if (file.size > maxSize) {
      errors.push(`Kích thước file không được vượt quá ${formatFileSize(maxSize)}`)
    }
    
    if (!allowedTypes.includes(file.type)) {
      errors.push('Định dạng file không được hỗ trợ')
    }
    
    return errors
  },

  // Remove validation errors for a field
  clearFieldErrors: (errors, fieldName) => {
    const newErrors = { ...errors }
    delete newErrors[fieldName]
    return newErrors
  },

  // Set validation error for a field
  setFieldError: (errors, fieldName, message) => {
    return {
      ...errors,
      [fieldName]: { message }
    }
  },
}

// Format file size helper
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
