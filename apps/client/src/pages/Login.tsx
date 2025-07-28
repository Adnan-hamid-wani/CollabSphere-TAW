import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [touched, setTouched] = useState<{ email: boolean; password: boolean }>({ email: false, password: false });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  const validateEmail = (email: string) => /^\S+@\S+\.\S+$/.test(email);
  const emailError = touched.email && !validateEmail(email);
  const passwordError = touched.password && password.length < 6;

  const handleLogin = async () => {
    if (emailError || passwordError) {
      toast.error("❌ Please fix the errors before logging in.");
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      toast.success("✅ Logged in successfully!");
      navigate('/');
    } catch {
      toast.error("❌ Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-white">
      <div className="bg-white shadow-2xl rounded-2xl px-10 py-10 w-full max-w-md transition-all duration-300">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-8">🔐 CollabSphere Login</h2>

        <div className="flex flex-col gap-4">
          {/* Email Field */}
          <input
            type="email"
            placeholder="Enter your email"
            className={`border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 ${
              emailError ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-400'
            }`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
          />
          {emailError && <span className="text-sm text-red-500">Please enter a valid email address.</span>}

          {/* Password Field */}
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              className={`border rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 ${
                passwordError ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-400'
              }`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
            />
            <span
              className="absolute right-3 top-2.5 text-gray-600 hover:text-black cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div>
          {passwordError && <span className="text-sm text-red-500">Password must be at least 6 characters.</span>}

          {/* Forgot Password Link */}
          <div>
            <span className="text-sm text-gray-500">Forgot your password?</span>
            <span
              className="text-blue-600 hover:underline cursor-pointer ml-1 text-sm"
              onClick={() => navigate('/forgot-password')}
            >
              Reset it here
            </span>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          {/* Register Link */}
          <div className="text-sm text-center text-gray-500 mt-2">
            Don't have an account?
            <span
              className="text-blue-600 hover:underline cursor-pointer ml-1"
              onClick={() => navigate('/register')}
            >
              Register here
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
