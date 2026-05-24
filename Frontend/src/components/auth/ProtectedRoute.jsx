import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/auth.context';

const ProtectedRoute = ({ allowedRoles = [], children }) => {
  const { auth, appLoading } = useContext(AuthContext);

  if (appLoading) {
    return null;
  }

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(auth?.user?.role)) {
    const fallbackRoute = auth?.user?.role === 'ADMIN' ? '/admin/profile' : '/user/profile';
    return <Navigate to={fallbackRoute} replace />;
  }

  return children;
};

export default ProtectedRoute;