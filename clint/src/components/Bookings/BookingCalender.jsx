import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import api from "../utils/api";

function getUserId() {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.id;
    } catch {
        return null;
    }
}

export default function BookingCalendar() {
    const [bookings, setBookings] = useState([]);
    const [date, setDate] = useState(new Date());
    const userId = getUserId();

    useEffect(() => {
        const token = localStorage.getItem("token");
        api.get("/bookings", { headers: { Authorization: `Bearer ${token}` } })
            .then(res => setBookings(res.data.filter(b => b.status !== "cancelled" && b.user_id === userId)));
    }, [userId]);

    // Get bookings for selected date
    const bookingsForDate = bookings.filter(b => {
        const start = new Date(b.start_time);
        return (
            start.getFullYear() === date.getFullYear() &&
            start.getMonth() === date.getMonth() &&
            start.getDate() === date.getDate()
        );
    });

    return (
        <div className="max-w-2xl mx-auto py-10">
            <h1 className="text-2xl font-bold mb-6 text-center text-blue-700">Booking Calendar</h1>
            <Calendar
                onChange={setDate}
                value={date}
                className="mx-auto mb-6"
            />
            <div className="bg-white rounded shadow p-6">
                <h2 className="text-lg font-semibold mb-2">Bookings for {date.toDateString()}:</h2>
                {bookingsForDate.length === 0 ? (
                    <p className="text-gray-500">No bookings for this date.</p>
                ) : (
                    <ul>
                        {bookingsForDate.map(b => (
                            <li key={b.id} className="mb-2">
                                <span className="font-bold">{b.room_name || b.room_id}</span> — {new Date(b.start_time).toLocaleTimeString()} to {new Date(b.end_time).toLocaleTimeString()}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
