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
        <div className="max-w-4xl mx-auto py-10">
            <h1 className="text-2xl font-bold mb-6  text-center text-blue-700">Facilities</h1>
            <ul className="bg-white rounded shadow p-6">
                {facilities.map(f => (
                    <li key={f.id} className="mb-2 flex items-center justify-between">
                        <span>{f.name}</span>
                        <div>
                            <button className="bg-yellow-500 text-white px-2 py-1 rounded mr-2" onClick={() => handleEdit(f)}>Edit</button>
                            <button className="bg-red-600 text-white px-2 py-1 rounded" onClick={() => handleDelete(f.id)}>Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
            {editFacility && (
                <form onSubmit={handleEditSubmit} className="bg-white p-4 rounded shadow max-w-md mx-auto mt-6">
                    <h2 className="text-xl font-bold mb-4">Edit Facility</h2>
                    {error && <div className="text-red-500 mb-2">{error}</div>}
                    <input value={editName} onChange={e => setEditName(e.target.value)} className="w-full mb-2 p-2 border rounded" required />
                    <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mr-2">Update</button>
                    <button type="button" className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500" onClick={() => setEditFacility(null)}>Cancel</button>
                </form>
            )}
        </div>
    );
}