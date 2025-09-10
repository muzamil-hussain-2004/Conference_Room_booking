import { useEffect, useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

export default function Roomlist() {
  const [rooms, setRooms] = useState([]);
  const [search, setSearch] = useState("");
  const [capacity, setCapacity] = useState("");
  const [facility, setFacility] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/rooms").then(res => setRooms(res.data));
  }, []);

  const handleSearch = async () => {
    try {
      let params = [];
      if (search) params.push(`name=${encodeURIComponent(search)}`);
      if (capacity) params.push(`capacity=${encodeURIComponent(capacity)}`);
      if (facility) params.push(`facility=${encodeURIComponent(facility)}`);

      const endpoint = params.length
        ? `/rooms/search?${params.join("&")}`
        : `/rooms`; // fallback: fetch all rooms if no filters

      const res = await api.get(endpoint);
      setRooms(res.data);
    } catch (error) {
      console.error("Search failed:", error);
      // You could show a message to the user too
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">Conference Rooms</h1>
      <div className="mb-6 flex gap-2">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Room Name"
          className="p-2 border rounded w-full"
        />
        <input
          type="number"
          value={capacity}
          onChange={e => setCapacity(e.target.value)}
          placeholder="Min Capacity"
          className="p-2 border rounded w-full"
        />
        <input
          type="text"
          value={facility}
          onChange={e => setFacility(e.target.value)}
          placeholder="Facility"
          className="p-2 border rounded w-full"
        />
        <button onClick={handleSearch} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Search</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {rooms.map(room => (
          <div key={room.id} className="bg-white rounded-lg shadow p-6">
            <img src={room.image_url} alt={room.name} className="w-full h-40 object-cover rounded mb-4" />
            <h2 className="text-xl font-semibold mb-2">{room.name}</h2>
            <p className="mb-2">{room.location}</p>
            <p className="mb-2">Capacity: {room.capacity}</p>
            <button
              className="text-blue-600 hover:underline"
              onClick={() => navigate(`/rooms/${room.id}`)}
            >
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}