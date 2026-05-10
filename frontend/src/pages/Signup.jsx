import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../features/auth/authSlice";
import { useNavigate, Link } from "react-router-dom";

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error, status, success } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [localError, setLocalError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalError("");

    if (!form.name.trim()) {
      setLocalError("Please enter your name");
      return;
    }
    if (!form.email.trim()) {
      setLocalError("Please enter your email");
      return;
    }
    if (form.password.length < 6) {
      setLocalError("Password must be at least 6 characters");
      return;
    }

    dispatch(register(form));
  };

  return (
    <div className="flex h-screen justify-center items-center bg-gradient-to-br from-[#0f172a] to-[#1a1f3a]">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-8 rounded-lg w-96 shadow-2xl border border-gray-700"
      >
        <h2 className="mb-2 text-3xl font-bold text-white">Create Account</h2>
        <p className="text-gray-400 mb-6 text-sm">Join to start managing your assets</p>

        {success && status && (
          <div className="bg-green-900/30 border border-green-500 text-green-300 px-4 py-3 rounded mb-4 text-sm">
            ✅ Account created successfully! Status: <span className="text-green-400">{status}</span>
          </div>
        )}

        {(error || localError) && status && (
          <div className="bg-red-900/30 border border-red-500 text-red-300 px-4 py-3 rounded mb-4 text-sm">
            ❌ {error || localError} (Status: <span className="text-yellow-400">{status}</span>)
          </div>
        )}

        <div className="mb-4">
          <label className="text-gray-300 text-sm font-semibold block mb-2">Full Name</label>
          <input
            type="text"
            placeholder="John Doe"
            className="w-full mb-1 p-3 bg-gray-700 text-white rounded border border-gray-600 focus:border-purple-500 focus:outline-none transition"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>

        <div className="mb-4">
          <label className="text-gray-300 text-sm font-semibold block mb-2">Email</label>
          <input
            type="email"
            placeholder="your@email.com"
            className="w-full mb-1 p-3 bg-gray-700 text-white rounded border border-gray-600 focus:border-purple-500 focus:outline-none transition"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </div>

        <div className="mb-6">
          <label className="text-gray-300 text-sm font-semibold block mb-2">Password</label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full mb-1 p-3 bg-gray-700 text-white rounded border border-gray-600 focus:border-purple-500 focus:outline-none transition"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <p className="text-xs text-gray-400 mt-1">At least 6 characters</p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed w-full py-3 rounded font-semibold text-white transition"
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>

        <p className="text-center text-gray-400 text-sm mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-purple-400 hover:text-purple-300">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;