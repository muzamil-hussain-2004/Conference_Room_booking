import { useEffect, useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

export default function BookingList() {
    const [bookings, setBookings] = useState([]);
    const [editBooking, setEditBooking] = useState(null);
    const [start, setStart] = useState("");
    const [end, setEnd] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        api.get("/bookings", { headers: { Authorization: `Bearer ${token}` } })
            .then(res => setBookings(res.data.filter(b => b.status !== "cancelled")));
    }, []);

    const refreshBookings = () => {
        const token = localStorage.getItem("token");
        api.get("/bookings", { headers: { Authorization: `Bearer ${token}` } })
            .then(res => setBookings(res.data.filter(b => b.status !== "cancelled")));
    };

    const handleCancel = async (id) => {
        const token = localStorage.getItem("token");
        await api.delete(`/bookings/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        refreshBookings();
    };

    const handleEdit = (booking) => {
        setEditBooking(booking);
        setStart(booking.start_time.slice(0, 16)); // format for datetime-local
        setEnd(booking.end_time.slice(0, 16));
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        try {
            await api.patch(`/bookings/${editBooking.id}`,
                { start_time: start, end_time: end },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setEditBooking(null);
            setError("");
            refreshBookings();
        } catch {
            setError("Failed to update booking.");
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-10">
            <h1 className="text-2xl font-bold mb-6 text-center text-blue-700">My Bookings</h1>
            <ul>
                {bookings.length === 0 ? (
                    <li className="text-gray-500 text-center py-8">No active bookings found.</li>
                ) : (
                    bookings.map(b => (
                        <li key={b.id} className="mb-4 bg-white rounded shadow p-4 flex flex-col md:flex-row md:items-center md:justify-between">
                            <div>
                                <span className="font-bold text-blue-700">{b.room_name || b.room_id}</span>
                                <span className="ml-2 text-gray-600">{new Date(b.start_time).toLocaleString()} - {new Date(b.end_time).toLocaleString()}</span>
                                <span className={`ml-4 px-2 py-1 rounded text-xs ${b.status === "confirmed" ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-700"}`}>
                                    {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                                </span>
                            </div>
                            <div className="mt-2 md:mt-0">
                                <button className="bg-yellow-500 text-white px-2 py-1 rounded mr-2" onClick={() => handleEdit(b)}>Edit</button>
                                <button className="bg-red-600 text-white px-2 py-1 rounded" onClick={() => handleCancel(b.id)}>Cancel</button>
                            </div>
                        </li>
                    ))
                )}
            </ul>
            {editBooking && (
                <form onSubmit={handleEditSubmit} className="bg-white p-4 rounded shadow mt-6">
                    <h2 className="text-xl font-bold mb-4">Edit Booking</h2>
                    {error && <div className="text-red-500 mb-2">{error}</div>}
                    <input type="datetime-local" value={start} onChange={e => setStart(e.target.value)} className="mb-2 p-2 border rounded w-full" required />
                    <input type="datetime-local" value={end} onChange={e => setEnd(e.target.value)} className="mb-2 p-2 border rounded w-full" required />
                    <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mr-2">Update</button>
                    <button type="button" className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500" onClick={() => setEditBooking(null)}>Cancel</button>
                </form>
            )}
        </div>
    );
}