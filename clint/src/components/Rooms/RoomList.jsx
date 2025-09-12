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
        : `/rooms`;

      const res = await api.get(endpoint);
      setRooms(res.data);
    } catch (error) {
      console.error("Search failed:", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold mb-8 text-blue-800 text-center">Conference Rooms</h1>

      {/* Search Inputs */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Room Name"
          className="flex-1 p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="number"
          value={capacity}
          onChange={e => setCapacity(e.target.value)}
          placeholder="Min Capacity"
          min={0}
          className="flex-1 p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          value={facility}
          onChange={e => setFacility(e.target.value)}
          placeholder="Facility"
          className="flex-1 p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold transition"
        >
          Search
        </button>
      </div>

      {/* Room Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {rooms.length === 0 ? (
          <p className="text-center text-gray-600 col-span-full">No rooms found.</p>
        ) : (
          rooms.map(room => (
            <div
              key={room.id}
              className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
              onClick={() => navigate(`/rooms/${room.id}`)}
              role="button"
              tabIndex={0}
              onKeyDown={e => {
                if (e.key === "Enter" || e.key === " ") {
                  navigate(`/rooms/${room.id}`);
                }
              }}
            >
              <img
                src={room.image_url || "/default-room.jpg"}
                alt={room.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h2 className="text-2xl font-semibold mb-2 text-blue-800">{room.name}</h2>
                <p className="mb-2 text-gray-700">{room.location}</p>
                <p className="mb-4 text-gray-600">Capacity: {room.capacity}</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/rooms/${room.id}`);
                  }}
                  className="text-blue-600 hover:underline font-semibold"
                >
                  View Details
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
