import React, { useState, useEffect } from 'react'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Card } from '../../../components/ui/card'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../../../components/ui/alert-dialog'
import { 
  PlusIcon,
  EditIcon,
  TrashIcon,
  FilterIcon,
  SearchIcon,
  CalendarIcon,
  DollarSignIcon,
  LoaderIcon
} from 'lucide-react'
import { walletService } from '../services/walletService'
import { toast } from 'sonner'
import AddExpense from './AddExpense'
import EditExpense from './EditExpense'

const ExpenseList = () => {
  const [expenses, setExpenses] = useState([])
  const [wallets, setWallets] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    walletId: '',
    category: '',
    startDate: '',
    endDate: '',
    search: ''
  })
  
  // Modals
  const [showAddExpense, setShowAddExpense] = useState(false)
  const [showEditExpense, setShowEditExpense] = useState(false)
  const [selectedExpense, setSelectedExpense] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    fetchInitialData()
  }, [])

  useEffect(() => {
    const fetchExpensesData = async () => {
      try {
        setLoading(true)
        const response = await walletService.getExpenses(filters)
        if (response.success) {
          let filteredExpenses = response.data
          
          // Apply search filter
          if (filters.search) {
            filteredExpenses = filteredExpenses.filter(expense =>
              expense.note?.toLowerCase().includes(filters.search.toLowerCase()) ||
              expense.categoryName?.toLowerCase().includes(filters.search.toLowerCase()) ||
              expense.walletName?.toLowerCase().includes(filters.search.toLowerCase())
            )
          }
          
          setExpenses(filteredExpenses)
        }
      } catch (error) {
        console.error('Error fetching expenses:', error)
        toast.error('Có lỗi khi tải danh sách chi tiêu')
      } finally {
        setLoading(false)
      }
    }
    
    fetchExpensesData()
  }, [filters])

  const fetchExpenses = async () => {
    try {
      setLoading(true)
      const response = await walletService.getExpenses(filters)
      if (response.success) {
        let filteredExpenses = response.data
        
        // Apply search filter
        if (filters.search) {
          filteredExpenses = filteredExpenses.filter(expense =>
            expense.note?.toLowerCase().includes(filters.search.toLowerCase()) ||
            expense.categoryName?.toLowerCase().includes(filters.search.toLowerCase()) ||
            expense.walletName?.toLowerCase().includes(filters.search.toLowerCase())
          )
        }
        
        setExpenses(filteredExpenses)
      }
    } catch (error) {
      console.error('Error fetching expenses:', error)
      toast.error('Có lỗi khi tải danh sách chi tiêu')
    } finally {
      setLoading(false)
    }
  }

  const fetchInitialData = async () => {
    try {
      const [walletsResponse, categoriesResponse] = await Promise.all([
        walletService.getWallets(),
        walletService.getExpenseCategories()
      ])
      
      setWallets(walletsResponse.data)
      setCategories(categoriesResponse.data)
    } catch (error) {
      console.error('Error fetching initial data:', error)
      toast.error('Có lỗi khi tải dữ liệu')
    }
  }

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleAddExpenseSuccess = () => {
    fetchExpenses() // Refresh list
    setShowAddExpense(false)
  }

  const handleEditExpense = (expense) => {
    setSelectedExpense(expense)
    setShowEditExpense(true)
  }

  const handleEditExpenseSuccess = () => {
    fetchExpenses() // Refresh list
    setShowEditExpense(false)
    setSelectedExpense(null)
  }

  const handleDeleteExpense = async (expenseId) => {
    setIsDeleting(true)
    try {
      const response = await walletService.deleteExpense(expenseId)
      if (response.success) {
        toast.success(response.message)
        fetchExpenses() // Refresh list
      } else {
        toast.error(response.message)
      }
    } catch (error) {
      console.error('Error deleting expense:', error)
      toast.error('Có lỗi khi xóa khoản chi')
    } finally {
      setIsDeleting(false)
    }
  }

  const clearFilters = () => {
    setFilters({
      walletId: '',
      category: '',
      startDate: '',
      endDate: '',
      search: ''
    })
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND' 
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getCategoryById = (categoryId) => {
    return categories.find(cat => cat.id === categoryId)
  }

  const totalExpense = expenses.reduce((sum, expense) => sum + expense.amount, 0)

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Danh sách chi tiêu</h1>
          <p className="text-muted-foreground">
            Quản lý và theo dõi chi tiêu của bạn
          </p>
        </div>
        <Button
          onClick={() => setShowAddExpense(true)}
          className="flex items-center gap-2"
        >
          <PlusIcon className="w-4 h-4" />
          Thêm chi tiêu
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <FilterIcon className="w-4 h-4" />
          <h3 className="font-medium">Bộ lọc</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="space-y-2">
            <Label htmlFor="search" className="text-sm">Tìm kiếm</Label>
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Tìm kiếm..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Wallet Filter */}
          <div className="space-y-2">
            <Label htmlFor="walletFilter" className="text-sm">Ví</Label>
            <select
              id="walletFilter"
              value={filters.walletId}
              onChange={(e) => handleFilterChange('walletId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Tất cả ví</option>
              {wallets.map((wallet) => (
                <option key={wallet.id} value={wallet.id}>
                  {wallet.icon} {wallet.name}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <Label htmlFor="categoryFilter" className="text-sm">Danh mục</Label>
            <select
              id="categoryFilter"
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Tất cả danh mục</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Start Date */}
          <div className="space-y-2">
            <Label htmlFor="startDate" className="text-sm">Từ ngày</Label>
            <Input
              id="startDate"
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
            />
          </div>

          {/* End Date */}
          <div className="space-y-2">
            <Label htmlFor="endDate" className="text-sm">Đến ngày</Label>
            <Input
              id="endDate"
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-between items-center mt-4 pt-4 border-t">
          <Button
            variant="outline"
            onClick={clearFilters}
            className="text-sm"
          >
            Xóa bộ lọc
          </Button>
          <div className="text-sm text-muted-foreground">
            Tìm thấy {expenses.length} khoản chi • Tổng: {formatCurrency(totalExpense)}
          </div>
        </div>
      </Card>

      {/* Expense List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <LoaderIcon className="w-8 h-8 animate-spin" />
        </div>
      ) : expenses.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <DollarSignIcon className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium mb-2">Chưa có khoản chi nào</h3>
          <p className="text-muted-foreground mb-4">
            Bắt đầu ghi lại chi tiêu của bạn
          </p>
          <Button onClick={() => setShowAddExpense(true)}>
            <PlusIcon className="w-4 h-4 mr-2" />
            Thêm chi tiêu đầu tiên
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {expenses.map((expense) => {
            const category = getCategoryById(expense.category)
            return (
              <Card key={expense.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                      <span className="text-xl">{category?.icon || '💸'}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{category?.name || expense.categoryName}</h3>
                        <span className="text-sm text-muted-foreground">
                          • {expense.walletName}
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-red-600 mb-2">
                        -{formatCurrency(expense.amount)}
                      </p>
                      {expense.note && (
                        <p className="text-muted-foreground text-sm mb-2">
                          {expense.note}
                        </p>
                      )}
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <CalendarIcon className="w-3 h-3" />
                        {formatDate(expense.datetime)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditExpense(expense)}
                      className="h-8 px-3"
                    >
                      <EditIcon className="w-3 h-3" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 px-3 text-red-600 hover:text-red-700"
                        >
                          <TrashIcon className="w-3 h-3" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                          <AlertDialogDescription>
                            Bạn có chắc chắn muốn xóa khoản chi &ldquo;{category?.name}&rdquo; 
                            với số tiền {formatCurrency(expense.amount)}?
                            <br /><br />
                            Tiền sẽ được hoàn lại vào ví &ldquo;{expense.walletName}&rdquo;.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Hủy</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteExpense(expense.id)}
                            disabled={isDeleting}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            {isDeleting ? (
                              <>
                                <LoaderIcon className="w-4 h-4 animate-spin mr-2" />
                                Đang xóa...
                              </>
                            ) : (
                              'Xóa'
                            )}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {/* Modals */}
      <AddExpense
        isOpen={showAddExpense}
        onClose={() => setShowAddExpense(false)}
        onSuccess={handleAddExpenseSuccess}
      />

      {selectedExpense && (
        <EditExpense
          isOpen={showEditExpense}
          expense={selectedExpense}
          onClose={() => {
            setShowEditExpense(false)
            setSelectedExpense(null)
          }}
          onSuccess={handleEditExpenseSuccess}
        />
      )}
    </div>
  )
}

export default ExpenseList
