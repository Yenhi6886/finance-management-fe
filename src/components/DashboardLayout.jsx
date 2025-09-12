import React, { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import AddWalletModal from '../modules/wallets/components/AddWalletModal'

const DashboardLayout = () => {
    const [isAddWalletModalOpen, setAddWalletModalOpen] = useState(false);
    const location = useLocation();

    const handleSuccess = () => {
        // Tạm thời chỉ thông báo, có thể thay bằng logic fetch lại data
        console.log('Wallet created successfully, you might want to refresh data here.');
        // Ví dụ: window.location.reload(); hoặc gọi một hàm fetch data từ context
    };

    return (
        <>
            <div className="flex h-screen bg-background">
                <Sidebar />

                <div className="flex-1 flex flex-col overflow-hidden">
                    <Header onAddWalletClick={() => setAddWalletModalOpen(true)} />

                    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background">
                        <div className="container mx-auto px-6 py-8">
                            <Outlet />
                        </div>
                    </main>
                </div>
            </div>
            <AddWalletModal
                isOpen={isAddWalletModalOpen}
                onClose={() => setAddWalletModalOpen(false)}
                onSuccess={handleSuccess}
            />
        </>
    )
}

export default DashboardLayout