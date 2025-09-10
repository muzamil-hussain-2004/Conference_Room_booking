import { useEffect, useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

export default function BookingList() {
    const [bookings, setBookings] = useState([]);
    const navigate = useNavigate();

    const fetchBookings = async () => {
        const token = localStorage.getItem("token");
        const res = await api.get("/bookings", { headers: { Authorization: `Bearer ${token}` } });
        setBookings(res.data);
    }

    useEffect(() => {
        const token = localStorage.getItem("token");
        api.get("/bookings", { headers: { Authorization: `Bearer ${token}` } })
            .then(res => setBookings(res.data));
    }, []);

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleCancel = async (id) => {
        const token = localStorage.getItem("token");
        await api.delete(`/bookings/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        setBookings(bookings.filter(b => b.id !== id));
        fetchBookings();
    };

    return (
        <div className="max-w-4xl mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">My Bookings</h1>
            <div className="grid grid-cols-1 gap-6">
                {bookings
                    .filter(b => b.status !== "cancelled") // Only show non-cancelled bookings
                    .map(b => (
                        <div key={b.id} className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-xl font-semibold mb-2">{b.room_name || b.room_id}</h2>
                            <p className="mb-2">Start: {new Date(b.start_time).toLocaleString()}</p>
                            <p className="mb-2">End: {new Date(b.end_time).toLocaleString()}</p>
                            <p className="mb-2">Status: {b.status}</p>
                            <button
                                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 mt-2"
                                onClick={() => handleCancel(b.id)}
                            >
                                Cancel Booking
                            </button>
                        </div>
                    ))}
            </div>
        </div>
    );
}