import { useEffect, useState } from "react";
import api from "../utils/api";
import RoomForm from "../Rooms/RoomForm";

export default function AdminRoomList() {
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState("");
  const [editRoom, setEditRoom] = useState(null);
  const token = localStorage.getItem("token");


  useEffect(() => {
    api.get("/rooms").then(res => setRooms(res.data));
  }, []);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/rooms/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setRooms(rooms.filter(r => r.id !== id));
    } catch (error) {
      setError("Failed to delete room");
    }

  }

  const handleEdit = (room) => {
    setEditRoom(room);
  };

  const handleEditSuccess = () => {
    api.get("/rooms").then(res => setRooms(res.data));
    setEditRoom(null);
  };

  return (
    <div className="max-w-4xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6 text-center text-blue-700">Manage Rooms</h1>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {rooms.map(room => (
          <div key={room.id} className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-2">{room.name}</h2>
            <p className="mb-2">{room.location}</p>
            <p className="mb-2">Capacity: {room.capacity}</p>
            <button
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 mr-2"
              onClick={() => handleEdit(room)}
            >
              Edit
            </button>
            <button
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              onClick={() => handleDelete(room.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
      {editRoom && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full">
            <RoomForm initial={editRoom} onSuccess={handleEditSuccess} />
            <button
              className="mt-4 bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              onClick={() => setEditRoom(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}