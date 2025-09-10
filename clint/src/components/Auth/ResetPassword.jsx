import { useState } from "react";
import api from "../../components/utils/api";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await api.post("/auth/reset-password", { token, newPassword });
      setMsg("Password reset successful.");
      setError("");
      setTimeout(() => navigate("/login"), 2000);
    } catch {
      setError("Failed to reset password");
      setMsg("");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">Reset Password</h2>
        {msg && <div className="text-green-500 mb-4">{msg}</div>}
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <input
          type="password"
          placeholder="New Password"
          className="w-full mb-6 p-2 border rounded focus:outline-blue-500"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          required
        />
        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
          Reset Password
        </button>
      </form>
    </div>
  );
}