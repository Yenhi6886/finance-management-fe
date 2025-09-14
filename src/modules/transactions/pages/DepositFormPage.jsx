import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { transactionService } from '../services/transactionService'; // Import service
import { errorHandler } from '@/shared/utils/errorHandler'; // Import error handler
import { useAuth } from '@/modules/auth/contexts/AuthContext'; // Assuming useAuth might be needed for user info

const DepositFormPage = () => {
  const [amount, setAmount] = useState('');
  const [selectedWallet, setSelectedWallet] = useState('');
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth(); // Example of using auth context if needed

  useEffect(() => {
    const fetchWallets = async () => {
      try {
        setLoading(true);
        const response = await transactionService.getWallets(); // Using mocked service
        if (response.data.success) {
          setWallets(response.data.data);
          if (response.data.data.length > 0) {
            setSelectedWallet(response.data.data[0].id.toString()); // Select first wallet by default
          }
        } else {
          errorHandler.showError(response.data.message || 'Không thể tải danh sách ví.');
        }
      } catch (error) {
        errorHandler.handleApiError(error, 'Lỗi khi tải danh sách ví.');
      } finally {
        setLoading(false);
      }
    };
    fetchWallets();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    // Basic validation (more comprehensive validation in Part 3)
    if (!amount || parseFloat(amount) <= 0) {
      errorHandler.showError('Số tiền nạp phải lớn hơn 0.');
      return;
    }
    if (!selectedWallet) {
      errorHandler.showError('Vui lòng chọn ví.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        walletId: parseInt(selectedWallet),
        amount: parseFloat(amount),
      };
      const response = await transactionService.deposit(payload); // Using mocked service
      if (response.data.success) {
        errorHandler.showSuccess(response.data.message || 'Nạp tiền thành công!');
        setAmount(''); // Clear form
        // Optionally refresh wallet list or update balance in context
      } else {
        errorHandler.showError(response.data.message || 'Nạp tiền thất bại.');
      }
    } catch (error) {
      errorHandler.handleApiError(error, 'Đã xảy ra lỗi trong quá trình nạp tiền.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="text-center">Nạp tiền vào ví</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="wallet">Chọn ví</Label>
                <Select onValueChange={setSelectedWallet} value={selectedWallet}>
                  <SelectTrigger id="wallet">
                    <SelectValue placeholder="Chọn ví" />
                  </SelectTrigger>
                  <SelectContent>
                    {wallets.map((wallet) => (
                      <SelectItem key={wallet.id} value={wallet.id.toString()}>
                        {wallet.name} ({wallet.balance} {wallet.currency})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="amount">Số tiền nạp</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Nhập số tiền"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={handleSubmit} className="w-full">Nạp tiền</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default DepositFormPage;
