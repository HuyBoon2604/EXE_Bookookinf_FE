import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthProvider.jsx'
import App from './App.jsx'
import './index.css'
import './i18n';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'sweetalert2/dist/sweetalert2.min.css';
import 'animate.css/animate.min.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <ToastContainer 
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          closeOnClick={true}
          theme="colored"
        />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)
