import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import { useEffect } from "react";
import { useAuthStore } from "./store/authStore";
import PrivateRoute from "./components/PrivateRoute";
import { Toaster } from "sonner";
import AdminAnalytics from "./pages/AdminAnalytics";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ChatContainer from "./components/ChatApp/ChatContainer";
import { initializeSocket } from "./utils/socket"; // ✅ Import this


const App = () => {
  const loadAuthFromStorage = useAuthStore((s) => s.loadAuthFromStorage);
    const user = useAuthStore((s) => s.user); // ✅ Get user from store


  useEffect(() => {
    loadAuthFromStorage();
  }, []);
  useEffect(() => {
    if (user?.id && user?.role) {
      initializeSocket(); // ✅ Only connect when user is ready
    }
  }, [user]);

  return (
    <BrowserRouter>
      <Toaster richColors position="top-right" className="no-dark-mode"/>

      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin-analytics"
          element={
            <PrivateRoute>
              <AdminAnalytics />
            </PrivateRoute>
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/Error"
          element={
            <div className="flex items-center justify-center h-screen">
              <h1 className="text-4xl font-bold text-red-600">Unauthorized</h1>
              <button
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg"
                onClick={() => window.location.href = '/Error'}
              >
                Dashboard
              </button>
            </div>
          }
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route
          path="*"
          element={
            <div className="flex items-center justify-center h-screen">
              <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
            </div>
          }
        />
        <Route path="/messages/text" element={<ChatContainer />} />

        
      </Routes>
    </BrowserRouter>
  );
};

export default App;
