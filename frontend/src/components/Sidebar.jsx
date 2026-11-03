import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = ({ activeTab, setActiveTab }) => {
  const { user } = useAuth();

  const menuItems = [
    { id: "overview", label: "Dashboard Overview", icon: "📊" },
    { id: "prelims", label: "Prelims Quiz Progress", icon: "📝" },
    { id: "mains", label: "Mains Submissions", icon: "✍️" },
    { id: "courses", label: "My Enrolled Courses", icon: "🎓" },
    { id: "saved", label: "Bookmarked Editorials", icon: "🔖" },
    { id: "profile", label: "Aspirant Profile", icon: "👤" },
  ];

  return (
    <aside className="w-full md:w-64 bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
      {/* Student Profile Card */}
      <div className="flex items-center space-x-3 pb-4 mb-4 border-b border-gray-100">
        <div className="w-12 h-12 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
          {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
        </div>
        <div className="overflow-hidden">
          <h3 className="font-semibold text-gray-900 text-sm truncate">{user?.name || "Civil Service Aspirant"}</h3>
          <p className="text-xs text-gray-700 truncate">{user?.email || "aspirant@sankalpias.in"}</p>
          <span className="inline-block mt-1 text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
            {user?.role === "admin" ? "Faculty / Admin" : "UPSC Aspirant"}
          </span>
        </div>
      </div>

      {/* Nav items */}
      <nav className="space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab && setActiveTab(item.id)}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
              activeTab === item.id
                ? "bg-amber-50 text-amber-800 font-semibold border-l-4 border-amber-600"
                : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <span className="text-base">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Quick Links */}
      <div className="mt-8 pt-4 border-t border-gray-100">
        <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2 px-3">
          Daily Routine
        </p>
        <div className="space-y-1">
          <NavLink
            to="/current-affairs"
            className="block text-xs text-gray-700 hover:text-amber-800 hover:bg-gray-50 px-3 py-2 rounded-md transition-colors"
          >
            📰 Read Today's Editorials
          </NavLink>
          <NavLink
            to="/prelims-quiz"
            className="block text-xs text-gray-700 hover:text-amber-800 hover:bg-gray-50 px-3 py-2 rounded-md transition-colors"
          >
            ⏱️ Take Today's Prelims Quiz
          </NavLink>
          <NavLink
            to="/mains-answer-writing"
            className="block text-xs text-gray-700 hover:text-amber-800 hover:bg-gray-50 px-3 py-2 rounded-md transition-colors"
          >
            📝 Submit Mains Daily Answer
          </NavLink>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

