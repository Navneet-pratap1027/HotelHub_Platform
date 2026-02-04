import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' 
import { AuthProvider } from './context/AuthContext'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* AuthProvider hamesha sabse bahar ya BrowserRouter ke bahar hona chahiye */}
    <AuthProvider>
      <BrowserRouter> 
        <App />
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
)