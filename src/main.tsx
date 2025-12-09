import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './App.css'
import { AppContextProvider } from './AppContext.tsx'
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppContextProvider>
    <App />
    </AppContextProvider>
  </StrictMode>,
)
