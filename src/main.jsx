import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import SplashScreen from './components/SplashScreen.jsx'

const Root = () => {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const bootstrap = async () => {
      // Potentially load user/session/theme or preload assets here
      await new Promise(r => setTimeout(r, 600))
      if (window.__finishSplash) window.__finishSplash()
      setReady(true)
    }
    bootstrap()
  }, [])

  return (
    <React.StrictMode>
      {!ready && <SplashScreen onDone={() => {}} />}
      {ready && <App />}
    </React.StrictMode>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<Root />)
