import { Link, useNavigate } from "react-router-dom";

export default function Navbar({ role }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-blue-800 text-white px-6 py-4 flex justify-between items-center shadow-md sticky top-0 z-50">
      {/* Left side: Logo and main navigation links */}
      <div className="flex items-center space-x-8">
        <Link to="/" className="font-extrabold text-2xl hover:text-blue-300 transition">
          RoomBooking
        </Link>
        <Link to="/rooms" className="hover:text-blue-300 transition font-medium">
          Rooms
        </Link>
        <Link to="/calendar" className="hover:text-blue-300 transition font-medium">
          Calendar
        </Link>
        {role === "admin" && (
          <>
            <Link to="/admin/rooms" className="hover:text-blue-300 transition font-medium">
              Manage Rooms
            </Link>
            <Link to="/admin/analytics" className="hover:text-blue-300 transition font-medium">
              Stats
            </Link>
            <Link to="/admin/bookings" className="hover:text-blue-300 transition font-medium">
              All Bookings
            </Link>
            <Link to="/admin/users" className="hover:text-blue-300 transition font-medium">
              Users
            </Link>
          </>
        )}
      </div>

      {/* Right side: Profile and logout */}
      <div className="flex items-center space-x-6">
        <Link to="/profile" className="hover:text-blue-300 transition font-medium">
          Profile
        </Link>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 transition text-white px-4 py-2 rounded-md font-semibold shadow-sm"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
