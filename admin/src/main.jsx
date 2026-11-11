import {StrictMode}from 'react'
import { createRoot } from 'react-dom/client'
import './index.css';
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import AdminContextProvider from './context/AdminContext.jsx'
import DoctorContextProvider from './context/DoctorContext.jsx'

import AppContextProvider from './context/AppContext.jsx'
import axios from 'axios'
import { installMockApi } from '../../demo/mockApi.js'

// Demo builds (VITE_DEMO_MODE=true) answer API calls in the browser, so no backend is needed.
if (import.meta.env.VITE_DEMO_MODE === 'true') installMockApi(axios)

createRoot(document.getElementById('root')).render(
  <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '') || '/'}>
    <AdminContextProvider>
      <DoctorContextProvider>
        <AppContextProvider>
          <App />
        </AppContextProvider>
      </DoctorContextProvider>
    </AdminContextProvider>
  </BrowserRouter>,
)
