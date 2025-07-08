import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import { useEffect } from "react";
import { useAuthStore } from "./store/authStore";
import PrivateRoute from "./components/PrivateRoute";
import { Toaster } from "sonner";
import AdminAnalytics from "./pages/AdminAnalytics";

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
        
      </Routes>
    </BrowserRouter>
  );
};

export default App;
