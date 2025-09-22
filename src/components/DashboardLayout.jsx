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
        <div className="flex h-screen flex-col md:flex-row bg-background">
            <Sidebar onToggleWalletPanel={toggleWalletPanel} />

            <div className="flex-1 flex overflow-hidden">
                <WalletPanel isOpen={isWalletPanelOpen} onClose={() => setWalletPanelOpen(false)} />
                <main className="flex-1 overflow-y-auto">
                    <div className="container mx-auto px-6 py-8">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    )
}

export default DashboardLayout