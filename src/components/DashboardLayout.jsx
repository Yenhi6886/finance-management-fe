import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import WalletPanel from './WalletPanel'

const DashboardLayout = () => {
    const [isWalletPanelOpen, setWalletPanelOpen] = useState(false);

    const toggleWalletPanel = () => {
        setWalletPanelOpen(prev => !prev);
    };

    return (
        <div className="flex flex-col md:flex-row h-screen bg-background overflow-hidden">
            <Sidebar onToggleWalletPanel={toggleWalletPanel} />

            <div className="flex flex-1 overflow-y-auto md:overflow-hidden">
                <WalletPanel isOpen={isWalletPanelOpen} onClose={() => setWalletPanelOpen(false)} />
                <main className="flex-1 overflow-x-hidden md:h-full md:overflow-y-auto">
                    <div className="container mx-auto px-6 py-8">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    )
}

export default DashboardLayout