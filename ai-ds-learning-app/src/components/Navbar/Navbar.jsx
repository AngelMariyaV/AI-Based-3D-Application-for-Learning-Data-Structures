import { FaSignOutAlt, FaCubes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://127.0.0.1:5000";

function Navbar({ user }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav className="bg-indigo-900 text-white flex justify-between items-center px-6 md:px-10 py-4 shadow-lg sticky top-0 z-30">
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => navigate("/dashboard")}
      >
        <FaCubes className="text-2xl text-indigo-300" />
        <h1 className="text-xl md:text-2xl font-bold tracking-tight">
         DSVerse AI
        </h1>
      </div>

      {user && (
        <div className="flex items-center gap-4">
          <img
            src={
              user.profileImage
                ? `${API_BASE}/uploads/${user.profileImage}`
                : `https://ui-avatars.com/api/?background=6366f1&color=fff&name=${encodeURIComponent(
                    user.name || "U"
                  )}`
            }
            alt="Profile"
            className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border-2 border-white cursor-pointer"
            onClick={() => navigate("/profile")}
          />

          <div className="hidden sm:block text-right">
            <h3 className="font-semibold leading-tight">{user.name}</h3>
            <p className="text-xs text-gray-300">{user.email}</p>
          </div>

          
        </div>
      )}
    </nav>
  );
}

export default Navbar;
