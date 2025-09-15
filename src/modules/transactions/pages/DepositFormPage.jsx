import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { transactionService } from '../services/transactionService'; // Import service
import { errorHandler } from '@/shared/utils/errorHandler'; // Import error handler
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const formSchema = z.object({
  walletId: z.string().min(1, { message: "Vui lòng chọn ví." }),
  amount: z.preprocess(
    (val) => Number(val), // Convert to number first
    z.number().min(1, { message: "Số tiền nạp phải lớn hơn 0." })
  ),
  description: z.string().optional(),
});

const DepositFormPage = () => {
  const [wallets, setWallets] = useState([]);
  const [loadingWallets, setLoadingWallets] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      walletId: '',
      amount: '',
      description: '',
    },
  });

  const { handleSubmit, register, setValue, formState: { errors }, watch } = form;
  const selectedWalletId = watch('walletId');

  useEffect(() => {
    const fetchWallets = async () => {
      try {
        setLoadingWallets(true);
        const response = await transactionService.getWallets(); // Using mocked service
        if (response.data.success) {
          setWallets(response.data.data);
          if (response.data.data.length > 0) {
            setValue('walletId', response.data.data[0].id.toString()); // Select first wallet by default
          } else {
            errorHandler.showInfo('Bạn chưa có ví nào. Vui lòng tạo ví mới trước khi nạp tiền.');
          }
        } else {
          errorHandler.showError(response.data.message || 'Không thể tải danh sách ví.');
        }
      } catch (error) {
        errorHandler.handleApiError(error, 'Lỗi khi tải danh sách ví.');
      } finally {
        setLoadingWallets(false);
      }
    };
    fetchWallets();
  }, [setValue]);

  const onSubmit = async (values) => {
    setSubmitting(true);
    try {
      const payload = {
        walletId: parseInt(values.walletId),
        amount: values.amount,
        description: values.description,
      };
      const response = await transactionService.deposit(payload); // Using mocked service
      if (response.data.success) {
        errorHandler.showSuccess(response.data.message || 'Nạp tiền thành công!');
        form.reset(); // Clear form after successful submission
        // Optionally refresh wallet list or update balance in context
      } else {
        errorHandler.showError(response.data.message || 'Nạp tiền thất bại.');
      }
    } catch (error) {
      errorHandler.handleApiError(error, 'Đã xảy ra lỗi trong quá trình nạp tiền.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="text-center">Nạp tiền vào ví</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="wallet">Chọn ví</Label>
                <Select onValueChange={(value) => setValue('walletId', value)} value={selectedWalletId}>
                  <SelectTrigger id="wallet" className={errors.walletId && "border-red-500"}>
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
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="amount">Số tiền nạp</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Nhập số tiền"
                  {...register('amount')}
                  className={errors.amount && "border-red-500"}
                />
                {errors.amount && <p className="text-red-500 text-sm">{errors.amount.message}</p>}
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="description">Mô tả (Tùy chọn)</Label>
                <textarea
                  id="description"
                  placeholder="Ghi chú về khoản nạp tiền này..."
                  {...register('description')}
                  rows={3}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
                {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
              </div>
            </div>
            <CardFooter className="flex justify-center p-0 pt-4">
              <Button type="submit" className="w-full" disabled={submitting || loadingWallets}>
                {submitting ? 'Đang nạp...' : 'Nạp tiền'}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default DepositFormPage;
