import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
    setShowMenu(false);
  };

  // Get user initial or fallback
  const getUserInitial = () => {
    if (user?.name) return user.name.charAt(0).toUpperCase();
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return "U";
  };

  return (
    <div className="flex justify-between items-center p-4 bg-[#020617] border-b border-gray-700">
      <input
        className="bg-gray-800 px-4 py-2 rounded w-1/3 text-gray-300 placeholder-gray-500"
        placeholder="Search your models..."
      />

      <div className="flex items-center gap-4">
        {user && (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-2 hover:bg-gray-800 px-3 py-2 rounded transition"
            >
              <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-semibold">
                {getUserInitial()}
              </div>
              <div className="flex flex-col items-start">
                <span className="text-sm font-semibold text-white">
                  {user.name || user.email?.split("@")[0]}
                </span>
                <span className="text-xs text-gray-400">{user.email}</span>
              </div>
              <svg
                className={`w-4 h-4 text-gray-400 transition ${
                  showMenu ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg z-50 border border-gray-700">
                <div className="p-3 border-b border-gray-700">
                  <p className="text-sm font-semibold text-white">
                    {user.name || user.email?.split("@")[0]}
                  </p>
                  <p className="text-xs text-gray-400">{user.email}</p>
                </div>

                <div className="py-2">
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      // Could add profile page later
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition"
                  >
                    👤 Profile
                  </button>
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      // Could add settings page later
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition"
                  >
                    ⚙️ Settings
                  </button>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-900/20 border-t border-gray-700 transition"
                >
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;