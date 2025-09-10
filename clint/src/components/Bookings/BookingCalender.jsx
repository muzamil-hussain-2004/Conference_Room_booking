import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import api from "../utils/api";

export default function BookingCalendar() {
    const [bookings, setBookings] = useState([]);
    const [date, setDate] = useState(new Date());
    const [rooms, setRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState("");

    useEffect(() => {
        api.get("/rooms").then(res => setRooms(res.data));
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("token");
        let params = [];
        if (selectedRoom) params.push(`room_id=${selectedRoom}`);
        if (date) params.push(`date=${date.toISOString().split("T")[0]}`);
        api.get(`/bookings/calendar?${params.join("&")}`, { headers: { Authorization: `Bearer ${token}` } })
            .then(res => setBookings(res.data));
    }, [selectedRoom, date]);

    return (
        <div className="max-w-2xl mx-auto py-10">
            <h1 className="text-2xl font-bold mb-6 text-center text-blue-700">Booking Calendar</h1>
            <select value={selectedRoom} onChange={e => setSelectedRoom(e.target.value)} className="mb-4 p-2 border rounded w-full">
                <option value="">All Rooms</option>
                {rooms.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
            <Calendar onChange={setDate} value={date} className="mx-auto mb-6" />
            <div className="bg-white rounded shadow p-6">
                <h2 className="text-lg font-semibold mb-2">Bookings for {date.toDateString()}:</h2>
                {bookings.length === 0 ? (
                    <p className="text-gray-500">No bookings for this date.</p>
                ) : (
                    <ul>
                            {bookings.map(b => (
                            <li key={b.id} className="mb-2">
                                <span className="font-bold">{b.room_name}</span> — {new Date(b.start_time).toLocaleTimeString()} to {new Date(b.end_time).toLocaleTimeString()}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
