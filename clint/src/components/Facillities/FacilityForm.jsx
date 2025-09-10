import { useState } from "react";
import api from "../utils/api";

export default function FacilityForm({ onSucess }) {
const [name, setName] = useState("");
const [error, setError] = useState("");

const handleSubmit = async e => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
        await api.post("/facilities", { name }, { headers: { Authorization: `Bearer ${token}`}});
        setName("");
        if (onSucess) onSucess();
    } catch (error) {
        setError("Failed to add facility");
    }
};

return (
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">Add Facility</h2>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Facility Name" className="w-full mb-2 p-2 border rounded" required />
     <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Add</button>
     </form>
   );

}
