import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import api from "../utils/api";
import "react-calendar/dist/Calendar.css"; // import default styles

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
            .then(res => setBookings(res.data))
            .catch(() => setBookings([])); // reset on failure
    }, [selectedRoom, date]);

    return (
        <div className="max-w-3xl mx-auto py-10 px-4">
            <h1 className="text-3xl font-extrabold mb-8 text-center text-blue-800">Booking Calendar</h1>

            <select
                value={selectedRoom}
                onChange={e => setSelectedRoom(e.target.value)}
                className="mb-6 px-4 py-3 w-full rounded-xl border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
                <option value="">All Rooms</option>
                {rooms.map(r => (
                    <option key={r.id} value={r.id}>
                        {r.name}
                    </option>
                ))}
            </select>

            <Calendar
                onChange={setDate}
                value={date}
                className="mx-auto mb-8 rounded-xl shadow-lg calendar-custom"
            />

            <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4 text-blue-700">
                    Bookings for {date.toDateString()}
                </h2>
                {bookings.length === 0 ? (
                    <p className="text-gray-500 text-center">No bookings for this date.</p>
                ) : (
                    <ul className="space-y-3">
                        {bookings.map(b => (
                            <li
                                key={b.id}
                                className="p-3 rounded-xl bg-blue-50 flex justify-between items-center shadow"
                            >
                                <span className="font-semibold text-blue-900">{b.room_name}</span>
                                <span className="text-gray-700 text-sm">
                                    {new Date(b.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} to {new Date(b.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <style>
                {`
                    /* Custom react-calendar styling overrides */
                    .calendar-custom {
                        border-radius: 1rem;
                        box-shadow: 0 10px 15px rgba(59,130,246,0.1);
                    }
                    .react-calendar__tile--active {
                        background: #2563eb !important; /* Tailwind blue-600 */
                        color: white !important;
                        border-radius: 0.75rem !important;
                    }
                    .react-calendar__tile:hover {
                        background: #3b82f6 !important; /* Tailwind blue-500 */
                        color: white !important;
                        border-radius: 0.75rem !important;
                    }
                `}
            </style>
        </div>
    );
}
