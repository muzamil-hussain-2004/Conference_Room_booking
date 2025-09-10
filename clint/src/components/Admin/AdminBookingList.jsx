import { useEffect, useState } from "react";
import api from "../utils/api";

export default function AdminBookingList() {
    const [bookings, setBookings] = useState([]);
    useEffect(() => {
        const token = localStorage.getItem("token");
        api.get("/bookings/all", { headers: { Authorization: `Bearer ${token}` } })
            .then(res => setBookings(res.data));
    }, []);

    return (
        <div className="max-w-4xl mx-auto py-10">
            <h1 className="text-2xl font-bold mb-6 text-center text-blue-700">All Bookings</h1>
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
