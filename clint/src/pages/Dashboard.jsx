import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserRole } from "../components/Role Protection/auth";
import { FiHome, FiClipboard, FiClock, FiCalendar, FiUsers, FiBox, FiSettings, FiPlusCircle, FiLayers, FiBarChart2 } from "react-icons/fi";

function getUserName() {
  const token = localStorage.getItem("token");
  if (!token) return "User";
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.name || payload.email || "User";
  } catch {
    return "User";
  }
}

function ActionCard({ name, path, bgGradient, icon, onNavigate }) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onNavigate(path)}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onNavigate(path)}
      className={`cursor-pointer rounded-lg shadow-md p-8 flex flex-col items-center text-white transition-transform transform hover:scale-105 hover:shadow-lg select-none ${bgGradient}`}
    >
      {icon}
      <h2 className="mt-4 text-xl font-semibold">{name}</h2>
      <p className="mt-1 text-sm italic opacity-75">Click to open {name}</p>
    </div>
  );
}

const userCards = [
  { name: "View Rooms", path: "/rooms", bgGradient: "bg-gradient-to-br from-blue-500 to-blue-700", icon: <FiHome className="w-12 h-12 text-white opacity-80" /> },
  { name: "My Bookings", path: "/bookings", bgGradient: "bg-gradient-to-br from-blue-600 to-blue-800", icon: <FiClipboard className="w-12 h-12 text-white opacity-80" /> },
  { name: "Booking History", path: "/users/me/audit-logs", bgGradient: "bg-gradient-to-br from-blue-400 to-blue-600", icon: <FiClock className="w-12 h-12 text-white opacity-80" /> },
  { name: "Booking Calendar", path: "/calendar", bgGradient: "bg-gradient-to-br from-blue-600 to-blue-800", icon: <FiCalendar className="w-12 h-12 text-white opacity-80" /> },
];

const adminCards = [
  { name: "Manage Users", path: "/admin/users", icon: <FiUsers className="w-12 h-12 text-white opacity-70" /> },
  { name: "Manage Rooms", path: "/admin/rooms", icon: <FiBox className="w-12 h-12 text-white opacity-70" /> },
  { name: "Manage Facilities", path: "/admin/facilities", icon: <FiSettings className="w-12 h-12 text-white opacity-70" /> },
  { name: "Add Facility", path: "/admin/facilities/new", icon: <FiPlusCircle className="w-12 h-12 text-white opacity-70" /> },
  { name: "Assign Facility to Room", path: "/admin/assign-facility", icon: <FiLayers className="w-12 h-12 text-white opacity-70" /> },
  { name: "View Stats", path: "/admin/analytics", icon: <FiBarChart2 className="w-12 h-12 text-white opacity-70" /> },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const role = getUserRole();
  const [name, setName] = useState(getUserName());

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      setName(getUserName());
    }
  }, [navigate]);

  // const handleLogout = () => {
  //   localStorage.removeItem("token");
  //   navigate("/login");
  // };

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "3rem 1.5rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "#e0f0ff",
        backgroundImage: `
          radial-gradient(circle at 20% 15%, rgba(59,130,246,0.35), transparent 25%),
          radial-gradient(circle at 80% 75%, rgba(37,99,235,0.3), transparent 35%),
          linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)
        `,
        backgroundBlendMode: "overlay",
        color: "#1e3a8a",
      }}
    >
      <section className="max-w-6xl w-full bg-white rounded-2xl shadow-lg p-12 text-center">
        <h1 className="text-4xl font-extrabold mb-6 text-blue-800">Welcome to Conference Room Booking</h1>
        <p className="text-lg mb-12 text-blue-700">
          Hello, <span className="font-semibold text-blue-900">{name}</span>! What would you like to do today?
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {userCards.map(({ name, path, bgGradient, icon }) => (
            <ActionCard key={path} name={name} path={path} bgGradient={bgGradient} icon={icon} onNavigate={navigate} />
          ))}
        </div>

        {role === "admin" && (
          <>
            <h2 className="text-3xl font-bold mb-8 text-blue-800">Admin Controls</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {adminCards.map(({ name, path, icon }) => (
                <ActionCard
                  key={path}
                  name={name}
                  path={path}
                  bgGradient="bg-gradient-to-br from-blue-700 to-blue-900"
                  icon={icon}
                  onNavigate={navigate}
                />
              ))}
            </div>
          </>
        )}

        {/* <button
          onClick={handleLogout}
          className="mt-16 px-10 py-3 bg-blue-900 rounded-full font-semibold text-white shadow-lg hover:bg-blue-800 transition"
        >
          Logout
        </button> */}
      </section>
    </main>
  );
}
