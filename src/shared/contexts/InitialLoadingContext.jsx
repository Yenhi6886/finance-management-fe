import React, { createContext, useContext, useState, useEffect } from 'react'

const InitialLoadingContext = createContext()

export const useInitialLoading = () => {
    const context = useContext(InitialLoadingContext)
    if (!context) {
        throw new Error('useInitialLoading must be used within InitialLoadingProvider')
    }
    return context
}

export const InitialLoadingProvider = ({ children }) => {
    const [hasShownInitialLoading, setHasShownInitialLoading] = useState(false)
    const [isInitialLoading, setIsInitialLoading] = useState(false)

    // Check if user has seen initial loading in current session
    useEffect(() => {
        const shown = sessionStorage.getItem('initial-loading-shown')
        if (shown === 'true') {
            setHasShownInitialLoading(true)
        }
    }, [])

    const showInitialLoading = () => {
        if (!hasShownInitialLoading) {
            setIsInitialLoading(true)
            return true
        }
        return false
    }

    const hideInitialLoading = () => {
        setIsInitialLoading(false)
        setHasShownInitialLoading(true)
        sessionStorage.setItem('initial-loading-shown', 'true')
    }

    const resetInitialLoading = () => {
        setHasShownInitialLoading(false)
        setIsInitialLoading(false)
        sessionStorage.removeItem('initial-loading-shown')
    }

    // Expose reset function globally for logout
    useEffect(() => {
        window.resetInitialLoading = resetInitialLoading
        return () => {
            delete window.resetInitialLoading
        }
    }, [])

    const value = {
        hasShownInitialLoading,
        isInitialLoading,
        showInitialLoading,
        hideInitialLoading,
        resetInitialLoading
    }

    return (
        <InitialLoadingContext.Provider value={value}>
            {children}
        </InitialLoadingContext.Provider>
    )
}
