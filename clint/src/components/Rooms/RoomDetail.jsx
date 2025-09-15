import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";


function getUserRole() {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      return JSON.parse(atob(token.split('.')[1])).role;  
    } catch (error) {
        return null;
    }
    
}

export default function RoomDetail() {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [error, setError] = useState("");
  const [facilities, setFacilities] = useState([]);
  const navigate = useNavigate();

const role = getUserRole();

  useEffect(() => {
    api.get(`/rooms/${id}`)
      .then(res => setRoom(res.data))
      .catch(() => setError("Room not found"));
  }, [id]);

  useEffect(() => {
    api.get(`/facilities/room/${id}`).then(res => setFacilities(res.data));
  }, [id]);

  const token = localStorage.getItem("token");

  const handleUnassign = async (facilityId) => {
    try {
      await api.delete(`/facilities/room/${room.id}/${facilityId}`, { headers: { Authorization: `Bearer ${token}` } });
      setFacilities(facilities.filter(f => f.id !== facilityId));
    } catch (err) {
      console.error("Unassign failed", err);
    }
  };

  if (error)
    return <div className="text-center py-16 text-red-600 text-xl font-semibold">{error}</div>;
  if (!room)
    return <div className="text-center py-16 text-blue-600 text-lg font-medium">Loading...</div>;

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <img
          src={room.image_url || "/default-room.jpg"}
          alt={room.name}
          className="w-full h-56 object-cover rounded-lg mb-6"
        />
        <h2 className="text-3xl font-bold mb-3 text-blue-900">{room.name}</h2>
        <p className="mb-2 text-gray-700">{room.location}</p>
        <p className="mb-2 text-gray-700">Capacity: {room.capacity}</p>
        <p className="mb-6 text-gray-600 whitespace-pre-line">{room.description}</p>

        <h3 className="text-xl font-semibold mb-4 text-blue-800">Facilities:</h3>
        {facilities.length === 0 ? (
          <p className="text-gray-500 mb-4">No facilities assigned.</p>
        ) : (
          <ul className="space-y-3 mb-6">
    {facilities.map(f => (
      <li key={f.id} className="flex items-center justify-between border-b border-gray-200 pb-2">
        <span className="text-gray-800">{f.name}</span>
        {role === "admin" && (
          <button
            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
            onClick={() => handleUnassign(f.id)}
            aria-label={`Unassign ${f.name}`}
          >
            Unassign
          </button>
        )}
      </li>
    ))}
  </ul>
        )}

        <button
          onClick={() => navigate(`/bookings/new?room_id=${room.id}`)}
          className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 rounded-lg transition"
        >
          Book This Room
        </button>
      </div>
    </div>
  );
}
