import { FaBook, FaBrain, FaChartLine, FaUser, FaHome, FaPlayCircle, FaChalkboardTeacher } from "react-icons/fa";
import { MdQuiz } from "react-icons/md";
import { useNavigate, useLocation } from "react-router-dom";

const ITEMS = [
  { label: "Dashboard", icon: FaHome, path: "/dashboard" },
  { label: "Learn", icon: FaBook, path: "/learn" },
  { label: "Video Tutorials", icon: FaPlayCircle, path: "/video-tutorials" },
  { label: "AI Tutor", icon: FaBrain, path: "/chat" },
  { label: "Mock Interview", icon: FaChalkboardTeacher, path: "/interview" },
  { label: "Quiz", icon: MdQuiz, path: "/quiz" },
  { label: "Progress", icon: FaChartLine, path: "/progress" },
  { label: "Profile", icon: FaUser, path: "/profile" },
];

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="w-64 md:w-72 bg-white h-[calc(100vh-72px)] shadow-lg p-6 sticky top-[72px] hidden md:block">
      <h2 className="text-xl font-bold mb-8 text-gray-800">Menu</h2>

      <ul className="space-y-2">
        {ITEMS.map(({ label, icon: Icon, path }) => {
          const active = location.pathname === path;
          return (
            <li
              key={path}
              onClick={() => navigate(path)}
              className={`flex items-center gap-3 cursor-pointer rounded-xl px-4 py-3 font-medium transition-colors
                ${
                  active
                    ? "bg-indigo-600 text-white shadow-md"
                    : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
                }`}
            >
              <Icon />
              {label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Sidebar;
