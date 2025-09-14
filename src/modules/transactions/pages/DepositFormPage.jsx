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

  const handleSubmit = (e) => {
    e.preventDefault();
    // This part will be implemented in Part 2/3
    errorHandler.showInfo('Chức năng nạp tiền sẽ được xử lý ở Part tiếp theo.');
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
