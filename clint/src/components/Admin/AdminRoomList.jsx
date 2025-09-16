import { useEffect, useState } from "react";
import api from "../utils/api";
import RoomForm from "../Rooms/RoomForm";
import { useNavigate } from "react-router-dom";

export default function AdminRoomList() {
  const [rooms, setRooms] = useState([]);
  const [editRoom, setEditRoom] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const token = localStorage.getItem("token");

  const navigate = useNavigate();


  useEffect(() => {
    api.get("/rooms",).then(res => setRooms(res.data));
  }, []);

  const handleDelete = async (id) => {
    await api.delete(`/rooms/${id}`, { headers: { Authorization: `Bearer ${token}` } });
    setRooms(rooms.filter(r => r.id !== id));
  };

  const handleEdit = (room) => {
    setEditRoom(room);
    setShowAdd(false);
  };

  const handleAdd = () => {
    setEditRoom(null);
    setShowAdd(true);
  };

  const handleSuccess = () => {
    api.get("/rooms").then(res => setRooms(res.data));
    setEditRoom(null);
    setShowAdd(false);
  };

  const handleCancel = () => {
    setEditRoom(null);
    setShowAdd(false);
  };

  return (
    <div className="max-w-4xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6 text-center text-blue-700">
        Manage Rooms
      </h1>
          <button
          className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
          onClick={() => navigate("/admin/rooms/new")}
         >
            Add Room
       </button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {rooms.map(room => (
          <div key={room.id} className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-2">{room.name}</h2>
            <p className="mb-2">{room.location}</p>
            <p className="mb-2">Capacity: {room.capacity}</p>
            <button className="bg-yellow-500 text-white px-4 py-2 rounded mr-2"
              onClick={() => navigate(`/admin/rooms/${room.id}/edit`)}>Edit</button>
            <button className="bg-red-600 text-white px-4 py-2 rounded"
              onClick={() => handleDelete(room.id)}>Delete</button>
          </div>
        ))}
      </div>
      {(editRoom || showAdd) && (
        <div className="fixed inset-0 bg-black
           bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full">
            <RoomForm initial={editRoom || {}} onSuccess={handleSuccess} />
            <button className="mt-4 bg-gray-400 text-white px-4 py-2 rounded"
              onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );

}
