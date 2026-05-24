import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/global.css';

import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import RegisterPage from './pages/register.jsx';
import UserPage from './pages/user.jsx';
import AdminPage from './pages/admin.jsx';
import HomePage from './pages/home.jsx';
import LoginPage from './pages/login.jsx';
import ProductDetailPage from './pages/product-detail.jsx';
import { AuthWrapper } from './components/context/auth.context.jsx';
import ProtectedRoute from './components/auth/ProtectedRoute.jsx';
import CategoryPage from './pages/category';
import VerifyOTP from './pages/verify-otp.jsx'; 

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: "user",
        element: <Navigate to="/user/profile" replace />
      },
      {
        path: "user/profile",
        element: <ProtectedRoute allowedRoles={["USER"]}><UserPage /></ProtectedRoute>
      },
      {
        path: "admin",
        element: <Navigate to="/admin/profile" replace />
      },
      {
        path: "admin/profile",
        element: <ProtectedRoute allowedRoles={["ADMIN"]}><AdminPage /></ProtectedRoute>
      },
      {
        path: "products/:id",
        element: <ProtectedRoute allowedRoles={["USER", "ADMIN"]}><ProductDetailPage /></ProtectedRoute>
      },
      {
        path: "category/:categoryId",
        element: <CategoryPage />
      }
    ]
  },
  {
    path: "register",
    element: <RegisterPage />
  },
  {
    path: "login",
    element: <LoginPage />
  },
  
  {
    path: "verify-otp",
    element: <VerifyOTP />
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthWrapper>
      <RouterProvider router={router} />
    </AuthWrapper>
  </React.StrictMode>,
)