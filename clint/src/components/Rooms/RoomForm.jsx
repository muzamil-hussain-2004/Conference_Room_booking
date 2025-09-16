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
    const [file, setFile] = useState(null);
    const [error, setError] = useState("");

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleFileChange = e => setFile(e.target.files[0]);

    const handleSubmit = async e => {
        e.preventDefault();
        setError(""); // reset error
        const token = localStorage.getItem("token");
        const data = new FormData();
        data.append("name", form.name);
        data.append("location", form.location);
        data.append("capacity", form.capacity);
        data.append("description", form.description);
        if (form.image_url) data.append("image_url", form.image_url);
        if (file) data.append("image", file);

        try {
            if (initial.id) {
                await api.patch(`/rooms/${initial.id}`, data, {
                    headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" }
                });
            } else {
                await api.post("/rooms", data, {
                    headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" }
                });
            }
            if (onSuccess) onSuccess();
        } catch (err) {
            setError("Failed to save room. Please try again.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg max-w-md mx-auto mt-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 text-blue-800">{initial.id ? "Edit Room" : "Add Room"}</h2>
            {error && <div className="mb-4 text-red-500 font-medium">{error}</div>}

            <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Name"
                required
                className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Location"
                required
                className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
                name="capacity"
                value={form.capacity}
                onChange={handleChange}
                type="number"
                min="0"
                placeholder="Capacity"
                required
                className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Description"
                rows={4}
                className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />

            <label className="block mb-2 font-semibold text-blue-700">Room Image (Upload JPG/PNG or paste URL):</label>

            <input
                type="file"
                accept="image/png, image/jpeg"
                onChange={handleFileChange}
                className="mb-3 w-full border border-gray-300 rounded-lg p-2 cursor-pointer"
            />

            <input
                name="image_url"
                value={form.image_url}
                onChange={handleChange}
                placeholder="Or paste image URL"
                className="w-full mb-6 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
            >
              {initial.id ? "Update Room" : "Add Room"}
            </button>
        </form>
    );
}
