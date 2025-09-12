import { useEffect, useState } from "react";
import api from "../utils/api";

export default function FacilityList() {
    const [facilities, setFacilities] = useState([]);
    const [editFacility, setEditFacility] = useState(null);
    const [editName, setEditName] = useState("");
    const [error, setError] = useState("");
    const token = localStorage.getItem("token");

    useEffect(() => {
        api.get("/facilities").then(res => setFacilities(res.data));
    }, []);

    const handleDelete = async (id) => {
        try {
            await api.delete(`/facilities/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            setFacilities(facilities.filter(f => f.id !== id));
        } catch {
            setError("Failed to delete facility");
        }
    };

    const handleEdit = (facility) => {
        setEditFacility(facility);
        setEditName(facility.name);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.patch(`/facilities/${editFacility.id}`, { name: editName }, { headers: { Authorization: `Bearer ${token}` } });
            setFacilities(facilities.map(f => f.id === editFacility.id ? { ...f, name: editName } : f));
            setEditFacility(null);
            setError("");
        } catch {
            setError("Failed to update facility");
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-10 px-4">
            <h1 className="text-3xl font-extrabold mb-8 text-center text-blue-800">Facilities</h1>

            <ul className="bg-white rounded-2xl shadow-md p-6 space-y-4">
                {facilities.map(f => (
                    <li key={f.id} className="flex items-center justify-between border-b border-gray-200 last:border-none pb-4">
                        <span className="text-lg font-medium text-gray-800">{f.name}</span>
                        <div className="flex space-x-3">
                            <button
                                className="bg-yellow-500 text-white px-4 py-1 rounded-lg shadow hover:bg-yellow-600 transition"
                                onClick={() => handleEdit(f)}
                            >
                                Edit
                            </button>
                            <button
                                className="bg-red-600 text-white px-4 py-1 rounded-lg shadow hover:bg-red-700 transition"
                                onClick={() => handleDelete(f.id)}
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>

            {editFacility && (
                <form
                    onSubmit={handleEditSubmit}
                    className="bg-white p-6 rounded-2xl shadow-md max-w-md mx-auto mt-10 space-y-5"
                >
                    <h2 className="text-2xl font-bold text-blue-900">Edit Facility</h2>
                    {error && <div className="text-red-600 font-semibold">{error}</div>}
                    <input
                        value={editName}
                        onChange={e => setEditName(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                        required
                    />
                    <div className="flex justify-end space-x-4">
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-6 py-2 rounded-2xl font-semibold shadow hover:bg-blue-700 transition"
                        >
                            Update
                        </button>
                        <button
                            type="button"
                            className="bg-gray-400 text-white px-6 py-2 rounded-2xl font-semibold shadow hover:bg-gray-500 transition"
                            onClick={() => setEditFacility(null)}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}
