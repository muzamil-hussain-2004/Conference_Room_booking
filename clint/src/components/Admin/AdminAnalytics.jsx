import { useEffect, useState } from "react";
import api from "../utils/api";

export default function AdminAnalytics() {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        api.get("/bookings/stats", { headers: { Authorization: `Bearer ${token}` } })
            .then(res => setStats(res.data));
    }, []);

    if (!stats) return <div className="text-center py-10 text-blue-600 font-semibold text-lg">Loading stats...</div>;

    return (
        <div className="max-w-3xl mx-auto py-10 px-4 space-y-6">
            <h1 className="text-3xl font-extrabold text-center text-blue-800 mb-8">Booking Analytics</h1>

            <section className="bg-white rounded-2xl shadow-md p-8">
                <h2 className="text-xl font-semibold text-blue-700 mb-4">Total Bookings</h2>
                <p className="text-4xl font-bold text-gray-900">{stats.total}</p>
            </section>

            <section className="bg-white rounded-2xl shadow-md p-8">
                <h2 className="text-xl font-semibold text-blue-700 mb-4">Bookings by Room</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-800">
                    {stats.byRoom.map(room => (
                        <li key={room.name}>
                            <span className="font-semibold">{room.name}</span>: {room.count}
                        </li>
                    ))}
                </ul>
            </section>

            <section className="bg-white rounded-2xl shadow-md p-8">
                <h2 className="text-xl font-semibold text-blue-700 mb-4">Bookings by User</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-800">
                    {stats.byUser.map(user => (
                        <li key={user.email}>
                            <span className="font-semibold">{user.email}</span>: {user.count}
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
}
