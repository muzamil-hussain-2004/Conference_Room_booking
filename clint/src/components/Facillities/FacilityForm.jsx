import { useState } from "react";
import api from "../utils/api";

export default function FacilityForm({ onSuccess }) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    const token = localStorage.getItem("token");
    try {
      await api.post("/facilities", { name }, { headers: { Authorization: `Bearer ${token}` } });
      setName("");
      if (onSuccess) onSuccess();
    } catch {
      setError("Failed to add facility. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto bg-white rounded-3xl shadow-lg p-8 space-y-6 mt-15"
    >
      <h2 className="text-2xl font-extrabold text-blue-900">Add Facility</h2>
      {error && <p className="text-red-600 font-medium">{error}</p>}

      <input
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Facility Name"
        required
        className="w-full p-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-800"
      />

      <button
        type="submit"
        className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-4 rounded-3xl transition"
      >
        Add
      </button>
    </form>
  );
}
