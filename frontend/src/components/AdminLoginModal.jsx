import { useState } from "react";
import { motion } from "framer-motion";
import { HiLockClosed, HiMail, HiKey, HiUser, HiSparkles, HiArrowRight } from "react-icons/hi";
import { useAuth } from "../context/AuthContext";

const AdminLoginModal = () => {
  const { login, register } = useAuth();
  const [isSignup, setIsSignup] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("sunnykumar6207058974@gmail.com");
  const [password, setPassword] = useState("sunny123456");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSignup && !name.trim()) {
      setError("Please enter your full name for signup.");
      return;
    }

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    setError("");

    let result;
    if (isSignup) {
      result = await register(name, email, password, "admin");
    } else {
      result = await login(email, password);
    }

    setLoading(false);

    if (!result.success) {
      setError(result.error || `${isSignup ? "Registration" : "Authentication"} failed. Please check your details.`);
    }
  };

  const handleFillDemo = () => {
    setIsSignup(false);
    setEmail("sunnykumar6207058974@gmail.com");
    setPassword("sunny123456");
  };

  return (
    <div className="min-h-screen bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 py-20 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
      >
        {/* Top Glow Bar */}
        <div className="h-2 w-full bg-gradient-to-r from-cyan-500 via-teal-400 to-purple-600 absolute top-0 left-0" />

        {/* Signup / Login Toggle Tabs */}
        <div className="flex bg-slate-100 dark:bg-slate-950 p-1.5 rounded-2xl mb-8 border border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => { setIsSignup(false); setError(""); }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
              !isSignup
                ? "bg-white dark:bg-slate-900 text-cyan-600 dark:text-cyan-400 shadow-md"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Login Portal
          </button>
          <button
            type="button"
            onClick={() => { setIsSignup(true); setError(""); }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
              isSignup
                ? "bg-white dark:bg-slate-900 text-cyan-600 dark:text-cyan-400 shadow-md"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            New Admin Signup
          </button>
        </div>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center mx-auto mb-4 border border-cyan-500/20 text-3xl shadow-lg shadow-cyan-500/20">
            <HiLockClosed />
          </div>

          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {isSignup ? "Create Admin Account" : "Admin Portal Access"}
          </h2>

          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
            {isSignup
              ? "Register a new JWT-authenticated Admin account"
              : "Sign in to manage projects, contact messages, and analytics dashboard"}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-semibold text-center">
            {error}
          </div>
        )}

        {/* Login / Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <HiUser className="absolute left-4 top-3.5 text-slate-400 text-lg" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Sunny Kumar"
                  className="w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white pl-12 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 focus:border-cyan-500 text-sm outline-none transition"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <HiMail className="absolute left-4 top-3.5 text-slate-400 text-lg" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sunnykumar6207058974@gmail.com"
                className="w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white pl-12 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 focus:border-cyan-500 text-sm outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Password (Min 6 chars)
            </label>
            <div className="relative">
              <HiKey className="absolute left-4 top-3.5 text-slate-400 text-lg" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white pl-12 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 focus:border-cyan-500 text-sm outline-none transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-slate-950 font-bold py-3.5 rounded-xl text-sm transition duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20 disabled:opacity-50 mt-2"
          >
            <span>
              {loading
                ? isSignup
                  ? "Registering..."
                  : "Authenticating..."
                : isSignup
                ? "Create Admin Account & Log In"
                : "Login to Admin Dashboard"}
            </span>
            <HiArrowRight className="text-lg" />
          </button>
        </form>

        {/* Demo Credentials Quick Fill Box */}
        {!isSignup && (
          <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800 text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
              Demo Admin Credentials Pre-filled:
            </p>
            <button
              type="button"
              onClick={handleFillDemo}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-slate-200 dark:border-slate-700 font-semibold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <HiSparkles />
              <span>Use Admin Credentials (sunnykumar6207058974@gmail.com)</span>
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AdminLoginModal;
