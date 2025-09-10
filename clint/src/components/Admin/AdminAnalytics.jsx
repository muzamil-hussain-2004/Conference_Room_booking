import { useEffect, useState } from "react";
import api from "../utils/api";

export default function AdminAnalytics() {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        api.get("/bookings/stats", { headers: { Authorization: `Bearer ${token}`}})
            .then(res => setStats(res.data));
    },[]);


    if (!stats) return <div className="text-center py-10">Loading stats...</div>;
     
    return (
        <div className="max-w-3xl mx-auto py-10">
            <h1 className="text-2xl font-bold mb-6 text-center text-blue-700">Booking Analytics</h1>
            <div className="bg-white rounded shadow p-6 mb-6">
                <h2 className="text-lg font-semibold mb-2">Total Bookings: {stats.total}</h2>
            </div>
            <div className="bg-white rounded shadow p-6 mb-6">
                <h2 className="text-lg font-semibold mb-2">Bookings by Room</h2>
                <ul>
                    {stats.byRoom.map(r => (
                        <li key={r.name}>{r.name}: {r.count}</li>
                    ))}
                </ul>
            </div>
                <div className="bg-white rounded shadow p-6">
                    <h2 className="text-lg font-semibold mb-2">
                    Bookings by User
                    </h2>
                    <ul>
                        {stats.byUser.map(u => (
                         <li key={u.email}>{u.email}: {u.count}</li>
                        ))}
                    </ul>
                </div>

        </div>
    );

}