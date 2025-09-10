import { useState } from "react";
import api from "../utils/api";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function BookingForm() {

    const [searchParams] = useSearchParams();
    const room_id = searchParams.get("room_id");
    const [start, setStart] = useState("");
    const [end, setEnd] = useState("");
    const [msg, setMsg] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();


    const checkAvailability = async () => {
        try {
            const res = await api.get(`/bookings/availability?id=${room_id}&start_time=${start}&end_time=${end}`);
                return res.data.available;
        } catch (error) {
            return false;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const available = await checkAvailability();
        if (!available) {
            setError("Room is not available for the selected time.");
            setMsg("");
            return;
        }
        try {
            const token = localStorage.getItem("token");
            await api.post("/bookings", 
                { room_id, start_time: start, end_time: end },
                { headers: {Authorization: `Bearer ${token}`} }
            );
            setMsg("Booking successful!");
            setError("");
            setTimeout(() => navigate("/bookings"), 1500);
         } catch (err) {
            setError("Booking failed or room unavailable.");
            setMsg("");
         }
   }

   return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow mt-6">
        <h3 className="font-bold mb-2">Book this room</h3>
        {msg && <div className="text-green-500 mb-2">{msg}</div>}
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <input
            type="datetime-local"
            value={start}
            onChange={e => setStart(e.target.value)}
            className="mb-2 p-2 border rounded w-full"
            required
        />
        <input
           type="datetime-local"
           value={end}
           onChange = {e => setEnd(e.target.value)}
           className = "mb-4 p-2 border rounded w-full"
           required
       />
           <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Book Now</button>
        </form>
       );
    }