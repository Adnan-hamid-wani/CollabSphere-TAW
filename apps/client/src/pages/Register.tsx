import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';

const Register = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    confirmPass: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const register = useAuthStore((s) => s.register);
  const navigate = useNavigate();

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password: string) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password);

  const handleValidation = () => {
    const newErrors: any = {};
    if (!validateEmail(email)) newErrors.email = 'Invalid email format';
    if (!validatePassword(password))
      newErrors.password =
        'Password must be 8+ chars with upper, lower, number, and symbol';
    if (password !== confirmPass) newErrors.confirmPass = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!email || !username || !password || !confirmPass) {
      toast.error('Please fill all fields');
      return;
    }

    if (!handleValidation()) {
      toast.error('Fix validation errors');
      return;
    }

    setLoading(true);
    try {
      await register(username, email, password);
      toast.success('🎉 Registered successfully!');
      navigate('/');
    } catch {
      toast.error('Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-white">
      <div className="bg-white/60 backdrop-blur-md shadow-2xl rounded-2xl px-10 py-10 w-full max-w-md border border-green-200 transition-all duration-300">
        <h2 className="text-3xl font-bold text-center text-green-700 mb-8">📝 Create Account</h2>

        <div className="flex flex-col gap-4">
          {/* Username */}
          <input
            type="text"
            placeholder="Username"
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          {/* Email */}
          <div>
            <input
              type="email"
              placeholder="Email"
              className={`border ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              } rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-400`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() =>
                setErrors((prev) => ({
                  ...prev,
                  email: validateEmail(email) ? '' : 'Invalid email format',
                }))
              }
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              className={`border ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              } rounded-lg px-4 py-2 w-full pr-10 focus:outline-none focus:ring-2 focus:ring-green-400`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() =>
                setErrors((prev) => ({
                  ...prev,
                  password: validatePassword(password)
                    ? ''
                    : 'Password must be 8+ chars with upper, lower, number, and symbol',
                }))
              }
            />
            <div
              className="absolute right-3 top-2.5 cursor-pointer text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Confirm Password"
              className={`border ${
                errors.confirmPass ? 'border-red-500' : 'border-gray-300'
              } rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-400`}
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              onBlur={() =>
                setErrors((prev) => ({
                  ...prev,
                  confirmPass:
                    confirmPass === password ? '' : 'Passwords do not match',
                }))
              }
            />
            {errors.confirmPass && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPass}</p>
            )}
          </div>

          {/* Submit */}
          <button
            onClick={handleRegister}
            disabled={loading}
            className="bg-green-600 text-white font-medium py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>

          <div className="text-sm text-center text-gray-500 mt-2">
            Already have an account?
            <span
              className="text-green-600 hover:underline cursor-pointer ml-1"
              onClick={() => navigate('/login')}
            >
              Login here
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
