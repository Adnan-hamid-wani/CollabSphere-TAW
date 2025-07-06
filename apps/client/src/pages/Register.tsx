import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Register = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const register = useAuthStore((s) => s.register);
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!email || !username || !password) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      await register(username, email, password);
      toast.success("🎉 Registered successfully!");
      navigate('/');
    } catch {
      toast.error("Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-white">
      <div className="bg-white/60 backdrop-blur-md shadow-2xl rounded-2xl px-10 py-10 w-full max-w-md border border-green-200 transition-all duration-300">
        <h2 className="text-3xl font-bold text-center text-green-700 mb-8">📝 Create Account</h2>

        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Username"
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email"
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleRegister}
            disabled={loading}
            className="bg-green-600 text-white font-medium py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
          >
            {loading ? "Registering..." : "Register"}
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
