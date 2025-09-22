import { toast } from 'sonner'

// Error handling utility functions
export const errorHandler = {
  // Handle API errors
  handleApiError: (error, customMessage = null) => {
    console.error('API Error:', error)
    
    let message = customMessage || 'Đã xảy ra lỗi không mong muốn'
    
    if (error.response) {
      // Server responded with error status
      const status = error.response.status
      const data = error.response.data
      
      switch (status) {
        case 400:
          message = data.message || 'Dữ liệu không hợp lệ'
          break
        case 401:
          message = 'Phiên đăng nhập đã hết hạn'
          break
        case 403:
          message = 'Bạn không có quyền thực hiện hành động này'
          break
        case 404:
          message = 'Không tìm thấy tài nguyên'
          break
        case 422:
          // Validation errors
          if (data.errors) {
            const validationErrors = Object.values(data.errors).flat()
            message = validationErrors.join(', ')
          } else {
            message = data.message || 'Dữ liệu không hợp lệ'
          }
          break
        case 429:
          message = 'Quá nhiều yêu cầu, vui lòng thử lại sau'
          break
        case 500:
          message = 'Lỗi máy chủ nội bộ'
          break
        default:
          message = data.message || `Lỗi ${status}`
      }
    } else if (error.request) {
      // Network error
      message = 'Không thể kết nối đến máy chủ'
    }
    
    toast.error(message)
    return message
  },

  // Handle form validation errors
  handleValidationErrors: (errors) => {
    const errorMessages = []
    
    Object.keys(errors).forEach(field => {
      const error = errors[field]
      if (error && error.message) {
        errorMessages.push(error.message)
      }
    })
    
    if (errorMessages.length > 0) {
      toast.error(errorMessages.join(', '))
    }
    
    return errorMessages
  },

  // Show success message
  showSuccess: (message) => {
    toast.success(message)
  },

  // Show info message
  showInfo: (message) => {
    toast.info(message)
  },

  // Show warning message
  showWarning: (message) => {
    toast.warning(message)
  },

  // Log error for debugging
  logError: (error, context = '') => {
    const errorInfo = {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    }
    
    console.error('Error logged:', errorInfo)
    
    // In production, you might want to send this to a logging service
    if (import.meta.env.PROD) {
      // Send to logging service
      // logToService(errorInfo)
    }
  },
}
