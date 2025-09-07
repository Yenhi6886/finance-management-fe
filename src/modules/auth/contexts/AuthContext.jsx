import React, { createContext, useContext, useEffect, useState } from 'react'
import { authService } from '../services/authService.js'
import { appConfig } from '../../../shared/config/appConfig.js'
import { errorHandler } from '../../../shared/utils/errorHandler.js'
import apiClient from '../../../shared/services/apiService.js'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const clearAuthData = () => {
    localStorage.removeItem(appConfig.auth.tokenKey)
    localStorage.removeItem(appConfig.auth.userKey)
    delete apiClient.defaults.headers.common['Authorization']
    setUser(null)
    setIsAuthenticated(false)
  }

  // HÀM MỚI ĐỂ CẬP NHẬT USER TRONG CONTEXT
  const updateUserContext = (updatedUserData) => {
    setUser(updatedUserData);
    localStorage.setItem(appConfig.auth.userKey, JSON.stringify(updatedUserData));
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem(appConfig.auth.tokenKey)
      if (!token) {
        setLoading(false)
        return
      }
      try {
        const response = await authService.getCurrentUserProfile()
        updateUserContext(response.data.data);
        setIsAuthenticated(true)
      } catch (error) {
        console.error('Auth initialization error:', error)
        clearAuthData()
      } finally {
        setLoading(false)
      }
    }
    initializeAuth()
  }, [])

  const login = async (credentials) => {
    try {
      setLoading(true)
      const response = await authService.login(credentials)
      const { user: userData, token } = response.data.data
      localStorage.setItem(appConfig.auth.tokenKey, token)
      updateUserContext(userData)
      setIsAuthenticated(true)
      errorHandler.showSuccess('Đăng nhập thành công!')
      return response.data
    } catch (error) {
      errorHandler.handleApiError(error, 'Đăng nhập thất bại')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData) => {
    try {
      setLoading(true)
      const response = await authService.register(userData)
      return response.data
    } catch (error) {
      errorHandler.handleApiError(error, 'Đăng ký thất bại')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      if (isAuthenticated) {
        await authService.logout()
      }
    } catch (error) {
      console.error('Logout API error:', error)
    } finally {
      clearAuthData()
      errorHandler.showSuccess('Đăng xuất thành công!')
    }
  }

  const updateProfile = async (profileData) => {
    try {
      setLoading(true)
      const response = await authService.updateProfile(profileData)
      const updatedUser = response.data.data
      updateUserContext(updatedUser)
      errorHandler.showSuccess('Cập nhật thông tin thành công!')
      return updatedUser
    } catch (error) {
      errorHandler.handleApiError(error, 'Cập nhật thông tin thất bại')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const deleteAccount = async () => {
    try {
      setLoading(true)
      await authService.deleteAccount();
      clearAuthData()
      errorHandler.showSuccess('Tài khoản đã được xoá thành công!')
    } catch (error) {
      errorHandler.handleApiError(error, 'Xoá tài khoản thất bại');
      throw error;
    } finally {
      setLoading(false);
    }
  }

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    deleteAccount,
    updateUserContext, // <-- Thêm hàm mới vào value
  }

  return (
      <AuthContext.Provider value={value}>
        {children}
      </AuthContext.Provider>
  )
}