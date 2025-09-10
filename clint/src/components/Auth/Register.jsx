import { useState } from "react";
import api from "../../components/utils/api";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({ email: "", password: "", name: "", role: "user" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await api.post("/auth/register", form);
      navigate("/");
    } catch {
      setError("Registration failed");
    }
  };

  return (
    <div
      className="relative flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/assets/register.png')" }}
    >
      {/* Overlay (send it to the back) */}
      <div className="absolute inset-0 bg-black/40 z-0"></div>

      {/* Form (always above overlay) */}
      <form
        onSubmit={handleSubmit}
        className="relative z-10 bg-white/30 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-md"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-white drop-shadow-lg">
          Register
        </h2>

        {error && <div className="text-red-400 font-medium mb-4">{error}</div>}

        <input
          name="name"
          type="text"
          placeholder="Name"
          className="w-full mb-4 p-3 border rounded-xl bg-white/20 placeholder-gray-200 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-3 border rounded-xl bg-white/20 placeholder-gray-200 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full mb-6 p-3 border rounded-xl bg-white/20 placeholder-gray-200 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={form.password}
          onChange={handleChange}
          required
        />

        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full mb-6 p-3 border rounded-xl bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="user" className="text-black">User</option>
          <option value="admin" className="text-black">Admin</option>
        </select>

        <button className="w-full bg-blue-600/80 hover:bg-blue-700/90 text-white py-3 rounded-xl font-semibold shadow-lg transition">
          Register
        </button>

        <div className="mt-4 text-center">
          <Link to="/login" className="text-blue-300 hover:underline">
            Already have an account?
          </Link>
        </div>
      </form>
    </div>
  );
}
