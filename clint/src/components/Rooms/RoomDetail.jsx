import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function RoomDetail() {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [error, setError] = useState("");
  const [facilities, setFacilities] = useState([]);
  const navigate = useNavigate();

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
    await api.delete(`/facilities/room/${room.id}/${facilityId}`, { headers: { Authorization: `Bearer ${token}` } });
    setFacilities(facilities.filter(f => f.id !== facilityId));
  };

  if (error) return <div className="text-center py-10">{error}</div>;
  if (!room) return <div className="text-center py-10">Loading..</div>;


  return (
    <div className="max-w-xl mx-auto py-10">
      <div className="bg-white rounded-lg shadow p-6">
        <img src={room.image_url} alt={room.name} className="w-full h-48 object-cover rounded mb-4" />
        <h2 className="text-2xl font-bold mb-2">{room.name}</h2>
        <p className="mb-2">{room.location}</p>
        <p className="mb-2">Capacity: {room.capacity}</p>
        <p className="mb-2">{room.description}</p>
        <h3 className="font-bold mt-4 mb-2">Facilities:</h3>
        <ul>
          {facilities.map(f => (
            <li key={f.name} className="flex items-center justify-between">
              <span>{f.name}</span>
              {token && (
                <button
                  className="bg-red-600 text-white px-2 py-1 rounded ml-2"
                  onClick={() => handleUnassign(f.id)}
                >
                  Unassign
                </button>
              )}
            </li>
          ))}
        </ul>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mt-4"
          onClick={() => navigate(`/bookings/new?room_id=${room.id}`)}
        >
          Book This Room
        </button>
      </div>
    </div>
  );

}