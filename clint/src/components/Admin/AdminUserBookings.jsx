import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/api";

export default function AdminUserBookings() {
    const { id } = useParams();
    const [bookings, setBookings] = useState([]);
    useEffect(() => {
        const token = localStorage.getItem("token");
        api.get(`/users/${id}/bookings`, { headers: { Authorization: `Bearer ${token}`}})
        .then(res => setBookings(res.data));
    },[id]);

    return (
        <div className="max-w-4xl mx-auto py-10">
            <h1 className="text-2xl font-bold mb-6 text-center text-blue-700">
                User Bookings
            </h1>
            <div className="grid grid-cols-1 gap-6">
                {bookings.map(b => (
                    <div key={b.id} className="bg-white rounded shadow p-6">
                        <h2 className="text-xl font-semibold mb-2">{b.room_name}</h2>
                        <p className="mb-2">Start: {new Date(b.start_time).toLocaleString()}</p>
                        <p className="mb-2">End: {new Date(b.end_time).toLocaleString()}</p>
                        <p className="mb-2">Status: {b.status}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};
