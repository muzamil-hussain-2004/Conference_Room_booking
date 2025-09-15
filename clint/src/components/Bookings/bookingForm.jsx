import { useState } from "react";
import api from "../utils/api";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function BookingForm({ onSuccess }) {
  const [searchParams] = useSearchParams();
  const room_id = searchParams.get("room_id");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const checkAvailability = async (start, end) => {
    try {
      const res = await api.get(
        `/bookings/availability?id=${room_id}&start_time=${start}&end_time=${end}`
      );
      return res.data.available;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!date || !startTime || !endTime) {
      setError("Please select date, start and end time.");
      setMsg("");
      return;
    }

    const start = new Date(`${date}T${startTime}`);
    const end = new Date(`${date}T${endTime}`);

    if (start >= end) {
      setError("End time must be after start time.");
      setMsg("");
      return;
    }

    const startISO = start.toISOString();
    const endISO = end.toISOString();

    const available = await checkAvailability(startISO, endISO);
    if (!available) {
      setError("Room is not available for the selected time.");
      setMsg("");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await api.post(
        "/bookings",
        { room_id, start_time: startISO, end_time: endISO },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMsg("Booking successful!");
      setError("");
      setTimeout(() => {
        if (onSuccess) onSuccess();
        navigate("/bookings");
      }, 1500);
    } catch {
      setError("Booking failed or room unavailable.");
      setMsg("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      <h3 className="text-xl font-bold mb-6 text-center">Book This Room</h3>
      {msg && <div className="text-green-600 mb-4 text-center">{msg}</div>}
      {error && <div className="text-red-600 mb-4 text-center">{error}</div>}

      <label className="block mb-1 font-semibold" htmlFor="date">
        Date
      </label>
      <input
        type="date"
        id="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="mb-4 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />

      <label className="block mb-1 font-semibold" htmlFor="startTime">
        Start Time
      </label>
      <input
        type="time"
        id="startTime"
        value={startTime}
        onChange={(e) => setStartTime(e.target.value)}
        className="mb-4 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />

      <label className="block mb-1 font-semibold" htmlFor="endTime">
        End Time
      </label>
      <input
        type="time"
        id="endTime"
        value={endTime}
        onChange={(e) => setEndTime(e.target.value)}
        className="mb-6 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
      >
        Book Now
      </button>
    </form>
  );
}
