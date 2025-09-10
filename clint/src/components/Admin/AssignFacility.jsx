import { useEffect, useState } from "react";
import api from "../utils/api";

export default function AssignFacility() {
    const [rooms, setRooms] = useState([]);
    const [facilities, setFacilities] = useState([]);
    const [roomId, setRoomId] = useState("");
    const [facilityId, setFacilityId] = useState("");
    const [msg, setMsg] = useState("");
    const [error, setError] = useState("");
    const token = localStorage.getItem("token");

    useEffect(() => {
        api.get("/rooms").then(res => setRooms(res.data));
        api.get("/facilities").then(res => setFacilities(res.data));
    }, []);

    const handleAssign = async (e) => {
        e.preventDefault();
        try {
            await api.post("/facilities/assign", { room_id: roomId, facility_id: facilityId }, { headers: { Authorization: `Bearer ${token}` } });
            setMsg("Facility assigned!");
            setError("");
        } catch {
            setError("Failed to assign facility");
            setMsg("");
        }
    };

    return (
        <form onSubmit={handleAssign} className="bg-white p-6 rounded shadow max-w-lg mx-auto mt-6">
            <h2 className="text-xl font-bold mb-4">Assign Facility to Room</h2>
            {msg && <div className="text-green-500 mb-2">{msg}</div>}
            {error && <div className="text-red-500 mb-2">{error}</div>}
            <select value={roomId} onChange={e => setRoomId(e.target.value)} className="w-full mb-2 p-2 border rounded" required>
                <option value="">Select Room</option>
                {rooms.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
            <select value={facilityId} onChange={e => setFacilityId(e.target.value)} className="w-full mb-2 p-2 border rounded" required>
                <option value="">Select Facility</option>
                {facilities.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
            </select>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Assign</button>
        </form>
    );
}