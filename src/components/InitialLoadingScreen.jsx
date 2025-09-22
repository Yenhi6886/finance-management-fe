import React, { useEffect } from 'react'
import Lottie from 'lottie-react'
import pagaloadAnimation from '../assets/pagaload.json'

const InitialLoadingScreen = ({ onComplete }) => {
    useEffect(() => {
        // Auto hide after animation completes (about 7 seconds for pagaload.json)
        const timer = setTimeout(() => {
            onComplete()
        }, 7000)

        return () => clearTimeout(timer)
    }, [onComplete])

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background">
            <div className="text-center">
                <div className="w-96 h-96">
                    <Lottie 
                        animationData={pagaloadAnimation}
                        loop={false}
                        autoplay={true}
                        style={{ width: '100%', height: '100%' }}
                    />
                </div>
            </div>
        </div>
    )
}

export default InitialLoadingScreen
