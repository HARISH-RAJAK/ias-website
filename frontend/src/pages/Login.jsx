import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login({ email, password });
      navigate(from, { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Invalid email or password. Please verify your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  // Quick fill for testing
  const handleQuickDemo = (type) => {
    if (type === "admin") {
      setEmail("admin@sankalpias.in");
      setPassword("Admin@123");
    } else {
      setEmail("aspirant@sankalpias.in");
      setPassword("Student@123");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-2xl shadow-sm border border-gray-200">
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-amber-700 text-white font-serif font-bold text-2xl flex items-center justify-center mx-auto shadow-md">
            सं
          </div>
          <h2 className="mt-4 text-2xl font-bold font-serif text-slate-900 tracking-tight">
            Log in to Sankalp IAS
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Access your tests, Mains evaluation tracker, and study planner
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
            {error}
          </div>
        )}

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="aspirant@upsc.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-600 focus:border-amber-600 outline-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Password
              </label>
              <a href="#" className="text-xs text-amber-700 hover:text-amber-800 font-medium">
                Forgot password?
              </a>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-600 focus:border-amber-600 outline-none"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-amber-700 hover:bg-amber-800 text-white text-sm font-semibold rounded-lg shadow-sm disabled:opacity-50 transition-colors"
            >
              {loading ? "Authenticating..." : "Sign In to Portal"}
            </button>
          </div>
        </form>

        {/* Quick Demo Login Fillers for rapid verification */}
        <div className="border-t border-gray-100 pt-4">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider text-center mb-2">
            Demo Credentials (Quick-Fill)
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo("admin")}
              className="flex-1 py-1.5 px-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs rounded font-medium transition-colors"
            >
              👑 Faculty / Admin
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo("student")}
              className="flex-1 py-1.5 px-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs rounded font-medium transition-colors"
            >
              🎓 UPSC Aspirant
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-gray-600">
          New to Sankalp IAS?{" "}
          <Link to="/register" className="font-semibold text-amber-700 hover:text-amber-800">
            Register for Free
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

