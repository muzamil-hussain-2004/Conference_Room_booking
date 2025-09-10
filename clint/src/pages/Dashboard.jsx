import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserRole } from "../components/Role Protection/auth";

function getUserName() {
  const token = localStorage.getItem("token");
  if (!token) return "User";
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.name || payload.email || "User";
  } catch {
    return "User";
  }
}

export default function Dashboard() {
  const navigate = useNavigate();
  const role = getUserRole();
  const [name, setName] = useState(getUserName());

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    setName(getUserName());
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="bg-white p-10 rounded-lg shadow-lg text-center w-full max-w-xl">
        <h1 className="text-3xl font-bold mb-4 text-blue-700">Welcome to Conference Room Booking</h1>
        <p className="mb-6 text-gray-700">Hello, <span className="font-bold text-blue-600">{name}</span>!</p>
        <div className="flex flex-col gap-4">
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
            onClick={() => navigate("/rooms")}
          >
            View Rooms
          </button>
          <button
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
            onClick={() => navigate("/bookings")}
          >
            My Bookings
          </button>
          <button
            className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition"
            onClick={() => navigate("/calendar")}
          >
            Booking Calendar
          </button>
          {role === "admin" && (
            <>
              <button
                className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition"
                onClick={() => navigate("/admin/users")}
              >
                Manage Users
              </button>
              <button
                className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition"
                onClick={() => navigate("/admin/rooms")}
              >
                Manage Rooms
              </button>
              <button
                className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition"
                onClick={() => navigate("/admin/facilities")}
              >
                Manage Facilities
              </button>
              <button
                className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition"
                onClick={() => navigate("/admin/facilities/new")}
              >
                Add Facility
              </button>
              <button
                className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition"
                onClick={() => navigate("/admin/assign-facility")}
              >
                Assign Facility to Room
              </button>
              <button
                className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition"
                onClick={() => navigate("/admin/analytics")}
              >
                View Stats
              </button>
            </>
          )}
        </div>
        <button
          className="mt-8 text-red-600 hover:underline"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
}