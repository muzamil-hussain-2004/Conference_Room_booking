import { useState } from "react";
import api from "../utils/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await api.post("/auth/forgot-password", { email });
      setMsg("If user exists, a reset email has been sent.");
      setError("");
    } catch {
      setError("Failed to send reset email.");
      setMsg("");
    }
  };

  return (
    <div
      className="relative flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/assets/bg_img.png')", backgroundSize: "110%" }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Transparent container */}
      <form
        onSubmit={handleSubmit}
        className="relative z-10 bg-white/20 backdrop-blur-xl 
                   p-6 sm:p-10 rounded-2xl shadow-lg 
                   w-[90%] sm:w-full max-w-md"
      >
        <h2 className="text-3xl sm:text-4xl font-extrabold mb-6 text-center text-white drop-shadow-lg">
          Forgot Password
        </h2>

        {/* Success + Error messages */}
        {msg && <div className="text-green-400 mb-4 text-center">{msg}</div>}
        {error && <div className="text-red-400 mb-4 text-center">{error}</div>}

        {/* Input field */}
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full mb-6 px-4 py-2 rounded-lg 
                     bg-white/20 backdrop-blur-md 
                     border border-white/30 text-white 
                     placeholder-gray-200
                     focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />

        {/* Submit button */}
        <button
          className="w-full bg-blue-500/80 hover:bg-blue-600/90 
                     text-white py-2 rounded-lg transition 
                     font-semibold shadow-md"
        >
          Send Reset Link
        </button>
      </form>
    </div>
  );
}
