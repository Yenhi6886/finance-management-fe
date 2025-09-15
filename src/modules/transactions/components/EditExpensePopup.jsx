import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { errorHandler } from '@/shared/utils/errorHandler';
// import { transactionService } from '../services/transactionService'; // Will be uncommented later

const formSchema = z.object({
  walletId: z.string().min(1, { message: "Vui lòng chọn ví." }),
  amount: z.preprocess(
    (val) => Number(val),
    z.number().min(1, { message: "Số tiền chi phải lớn hơn 0." })
  ),
  categoryId: z.string().min(1, { message: "Vui lòng chọn danh mục." }),
  description: z.string().optional(),
  transactionDate: z.date({
    required_error: "Vui lòng chọn ngày giao dịch.",
  }),
});

const EditExpensePopup = ({ isOpen, onClose, onExpenseUpdated, expenseData }) => {
  const [wallets, setWallets] = useState([]);
  const [categories, setCategories] = useState([]); // Placeholder for categories
  const [loadingWallets, setLoadingWallets] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      walletId: expenseData?.walletId?.toString() || '',
      amount: expenseData?.amount || '',
      categoryId: expenseData?.categoryId?.toString() || '',
      description: expenseData?.description || '',
      transactionDate: expenseData?.transactionDate ? new Date(expenseData.transactionDate) : new Date(),
    },
  });

  const { handleSubmit, register, setValue, control, formState: { errors }, watch, reset } = form;
  const selectedWalletId = watch('walletId');
  const selectedCategoryId = watch('categoryId');
  const transactionDate = watch('transactionDate');

  // Update form defaults when expenseData changes
  useEffect(() => {
    if (expenseData) {
      form.reset({
        walletId: expenseData.walletId?.toString() || '',
        amount: expenseData.amount || '',
        categoryId: expenseData.categoryId?.toString() || '',
        description: expenseData.description || '',
        transactionDate: expenseData.transactionDate ? new Date(expenseData.transactionDate) : new Date(),
      });
    }
  }, [expenseData, form]);

  // Fetch wallets and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingWallets(true);
        // const walletResponse = await transactionService.getWallets(); // Uncomment later
        // if (walletResponse.data.success) {
        //   setWallets(walletResponse.data.data);
        // }

        // Mock data for now
        setWallets([
          { id: 1, name: 'Ví chính', balance: 1000000, currency: 'VND' },
          { id: 2, name: 'Ví tiết kiệm', balance: 5000000, currency: 'VND' },
        ]);
        setCategories([
          { id: 1, name: 'Ăn uống' },
          { id: 2, name: 'Di chuyển', },
          { id: 3, name: 'Giải trí' },
          { id: 4, name: 'Hóa đơn' },
          { id: 5, name: 'Mua sắm' },
        ]);

      } catch (error) {
        errorHandler.handleApiError(error, 'Lỗi khi tải dữ liệu.');
      } finally {
        setLoadingWallets(false);
      }
    };
    fetchData();
  }, []);

  const onSubmit = async (values) => {
    setSubmitting(true);
    try {
      const payload = {
        walletId: parseInt(values.walletId),
        amount: values.amount,
        categoryId: parseInt(values.categoryId),
        description: values.description,
        transactionDate: format(values.transactionDate, 'yyyy-MM-dd\'T\'HH:mm:ss'), // Format for BE
      };
      console.log('Payload for expense update:', payload);
      // const response = await transactionService.updateExpense(expenseData.id, payload); // Uncomment later
      // if (response.data.success) {
      //   errorHandler.showSuccess(response.data.message || 'Cập nhật khoản chi thành công!');
      //   onClose();
      //   if (onExpenseUpdated) onExpenseUpdated();
      // } else {
      //   errorHandler.showError(response.data.message || 'Cập nhật khoản chi thất bại.');
      // }
      errorHandler.showSuccess('Cập nhật khoản chi thành công (mock)!'); // Mock success
      onClose();
      if (onExpenseUpdated) onExpenseUpdated();

    } catch (error) {
      errorHandler.handleApiError(error, 'Đã xảy ra lỗi khi cập nhật khoản chi.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Sửa khoản chi</DialogTitle>
          <DialogDescription>
            Chỉnh sửa thông tin chi tiết cho khoản chi của bạn.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="walletId">Chọn ví</Label>
            <Select onValueChange={(value) => setValue('walletId', value)} value={selectedWalletId}>
              <SelectTrigger id="walletId" className={errors.walletId && "border-red-500"}>
                <SelectValue placeholder="Chọn ví" />
              </SelectTrigger>
              <SelectContent>
                {loadingWallets ? (
                  <SelectItem value="loading" disabled>Đang tải ví...</SelectItem>
                ) : wallets.length === 0 ? (
                  <SelectItem value="no-wallets" disabled>Không có ví nào</SelectItem>
                ) : (
                  wallets.map((wallet) => (
                    <SelectItem key={wallet.id} value={wallet.id.toString()}>
                      {wallet.name} ({wallet.balance} {wallet.currency})
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {errors.walletId && <p className="text-red-500 text-sm">{errors.walletId.message}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="amount">Số tiền chi</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Nhập số tiền"
              {...register('amount')}
              className={errors.amount && "border-red-500"}
            />
            {errors.amount && <p className="text-red-500 text-sm">{errors.amount.message}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="categoryId">Danh mục</Label>
            <Select onValueChange={(value) => setValue('categoryId', value)} value={selectedCategoryId}>
              <SelectTrigger id="categoryId" className={errors.categoryId && "border-red-500"}>
                <SelectValue placeholder="Chọn danh mục" />
              </SelectTrigger>
              <SelectContent>
                {categories.length === 0 ? (
                  <SelectItem value="no-categories" disabled>Không có danh mục nào</SelectItem>
                ) : (
                  categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {errors.categoryId && <p className="text-red-500 text-sm">{errors.categoryId.message}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Mô tả (Tùy chọn)</Label>
            <Textarea
              id="description"
              placeholder="Ghi chú về khoản chi này..."
              {...register('description')}
              rows={3}
            />
            {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="transactionDate">Ngày giao dịch</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !transactionDate && "text-muted-foreground",
                    errors.transactionDate && "border-red-500"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {transactionDate ? format(transactionDate, "PPP") : <span>Chọn ngày</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={transactionDate}
                  onSelect={(date) => setValue('transactionDate', date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors.transactionDate && <p className="text-red-500 text-sm">{errors.transactionDate.message}</p>}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>Hủy</Button>
            <Button type="submit" disabled={submitting || loadingWallets}>
              {submitting ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditExpensePopup;
