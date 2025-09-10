import { useState, useEffect } from "react";
import api from "../utils/api";

export default function AdminBookingList() {
    const [bookings, setBookings] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [users, setUsers] = useState([]);
    const [roomId, setRoomId] = useState("");
    const [userId, setUserId] = useState("");
    const [date, setDate] = useState("");


    useEffect(() => {
        const token = localStorage.getItem("token");
        api.get("/rooms").then(res => setRooms(res.data));
        api.get("/users", { headers: { Authorization: `Bearer ${token}` } }).then(res => setUsers(res.data));
        fetchBookings();
    }, []);

    const fetchBookings = () => {
        const token = localStorage.getItem("token");
        let params = [];
        if (roomId) params.push(`room_id=${roomId}`);
        if (userId) params.push(`user_id=${userId}`);
        if (date) params.push(`date=${date}`);
        api.get(`/bookings/all?${params.join("&")}`,
            { headers: { Authorization: `Bearer ${token}` } }).then(res => setBookings(res.data));
    };
    return (
        <div className="max-w-4xl mx-auto py-10">
            <h1 className="text-2xl font-bold mb-6 text-center text-blue-700">All Bookings</h1>
            <div className="flex gap-4 mb-4">
                <select value={roomId} onChange={e => setRoomId(e.target.value)} className="p-2 border rounded">
                    <option value="">All Rooms</option>
                    {rooms.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
                <select value={userId} onChange={e => setUserId(e.target.value)} className="p-2 border rounded">
                    <option value="">All Users</option>
                    {users.map(u => <option key={u.id} value={u.id}>{u.email}</option>)}
                </select>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} className="p-2 border rounded" />
                <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={fetchBookings}>Filter</button>
            </div>
            <div className="grid grid-cols-1 gap-6">
                {bookings.map(b => (
                    <div key={b.id} className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold mb-2">{b.room_name}</h2>
                        <p className="mb-2">User: {b.email}</p>
                        <p className="mb-2">Start: {new Date(b.start_time).toLocaleString()}</p>
                        <p className="mb-2">End: {new Date(b.end_time).toLocaleString()}</p>
                        <p className="mb-2">Status: {b.status}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}