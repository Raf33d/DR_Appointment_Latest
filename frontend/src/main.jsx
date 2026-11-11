import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import AppContextProvider from './context/AppContext.jsx'
import axios from 'axios'
import { installMockApi } from '../../demo/mockApi.js'

// Demo builds (VITE_DEMO_MODE=true) answer API calls in the browser, so no backend is needed.
if (import.meta.env.VITE_DEMO_MODE === 'true') installMockApi(axios)
createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <AppContextProvider>
    <App />
  </AppContextProvider>
   
  </BrowserRouter>,
)
