import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../features/auth/authSlice";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
    const dispatch = useDispatch();
    const { user, loading, error } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user, navigate]);

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (form.email && form.password) {
            dispatch(login(form));
        }
    };

    return (
        <div className="flex h-screen justify-center items-center bg-gradient-to-br from-[#0f172a] to-[#1a1f3a]">
            <form
                onSubmit={handleSubmit}
                className="bg-gray-800 p-8 rounded-lg w-96 shadow-2xl border border-gray-700"
            >
                <h2 className="mb-2 text-3xl font-bold text-white">Login</h2>
                <p className="text-gray-400 mb-6 text-sm">Welcome back to your workspace</p>

                {error && (
                    <div className="bg-red-900/30 border border-red-500 text-red-300 px-4 py-3 rounded mb-4 text-sm">
                        {error}
                    </div>
                )}

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
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed w-full py-3 rounded font-semibold text-white transition"
                >
                    {loading ? "Logging in..." : "Login"}
                </button>

                <p className="text-center text-gray-400 text-sm mt-4">
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-purple-400 hover:text-purple-300">
                        Sign up
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default Login;