import { useState } from "react";
import api from "../utils/api";

export default function RoomForm({ initial = {}, onSuccess }) {
    const [form, setForm] = useState({
        name: initial.name || "",
        location: initial.location || "",
        capacity: initial.capacity || "",
        description: initial.description || "",
        image_url: initial.image_url || ""
    });
    const [error, setError] = useState("");

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        try {
            if (initial.id) {
                await api.patch(`/rooms/${initial.id}`, form, { headers: { Authorization: `Bearer ${token}` } });
            } else {
                await api.post("/rooms", form, { headers: { Authorization: `Bearer ${token}` } });
            }
            if (onSuccess) onSuccess();
        } catch (err) {
            setError("Failed to save room");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow max-w-lg mx-auto">
            <h2 className="text-xl font-bold mb-4">{initial.id ? "Edit Room" : "Add Room"}</h2>
            {error && <div className="text-red-500 mb-2">{error}</div>}
            <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="w-full mb-2 p-2 border rounded" required />
            <input name="location" value={form.location} onChange={handleChange} placeholder="Location" className="w-full mb-2 p-2 border rounded" required />
            <input name="capacity" value={form.capacity} onChange={handleChange} type="number" placeholder="Capacity" className="w-full mb-2 p-2 border rounded" required />
            <input name="image_url" value={form.image_url} onChange={handleChange} placeholder="Image URL" className="w-full mb-2 p-2 border rounded" />
            <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="w-full mb-2 p-2 border rounded" />
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">{initial.id ? "Update" : "Add"}</button>
        </form>
    );
}

