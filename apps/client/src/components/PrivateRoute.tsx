// src/components/PrivateRoute.tsx
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { user, authInitialized } = useAuthStore();

  if (!authInitialized) return null; // wait for Zustand to load
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

export default PrivateRoute;
