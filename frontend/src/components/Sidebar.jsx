import { useState } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Dashboard");

  const menu = [
    { name: "Dashboard", icon: "📊" },
    { name: "My Models", icon: "🎯" },
    { name: "Viewer", icon: "👁️" },
    { name: "Saved States", icon: "💾" },
    { name: "Profile", icon: "👤" },
  ];

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
    // Add navigation logic here
    // navigate(`/${tabName.toLowerCase().replace(" ", "-")}`);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="w-64 h-screen bg-[#020617] p-5 flex flex-col border-r border-gray-700">
      {/* Logo */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">
          <span className="text-purple-500">3D</span>Verse
        </h1>
        <p className="text-xs text-gray-400 mt-1">Asset Manager</p>
      </div>

      {/* Menu Items */}
      <nav className="flex-1">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-3">
          Main
        </p>
        <div className="space-y-2">
          {menu.map((item) => (
            <button
              key={item.name}
              onClick={() => handleTabClick(item.name)}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 ${
                activeTab === item.name
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-600/50"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium">{item.name}</span>
              {activeTab === item.name && (
                <span className="ml-auto">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              )}
            </button>
          ))}
        </div>
      </nav>

      {/* Divider */}
      <div className="my-6 border-t border-gray-700"></div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="w-full bg-red-600/20 hover:bg-red-600/30 text-red-400 hover:text-red-300 py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 border border-red-600/30 hover:border-red-500"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          />
        </svg>
        <span className="font-semibold">Logout</span>
      </button>

      {/* Footer Info */}
      <div className="mt-4 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
        <p className="text-xs text-gray-400 text-center">
          © 2026 3DVerse
          <br />
          v1.0.0
        </p>
      </div>
    </div>
  );
};

export default Sidebar;