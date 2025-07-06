import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import { useEffect } from 'react';
import { useAuthStore } from './store/authStore';
import PrivateRoute from './components/PrivateRoute';
import { Toaster } from 'sonner';
const App = () => {
    const loadAuthFromStorage = useAuthStore((s) => s.loadAuthFromStorage);


  useEffect(() => {
    loadAuthFromStorage();
  }, []);

  return (
    <BrowserRouter>
          <Toaster richColors position="top-right" />

      <Routes>
<Route
  path="/"
  element={
    <PrivateRoute>
      <Dashboard />
    </PrivateRoute>
  }
/>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
