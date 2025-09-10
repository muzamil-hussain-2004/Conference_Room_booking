import { useState } from "react";
import api from "../../components/utils/api";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch {
      setError("Invalid credentials");
    }
  };

  return (
    <div
      className="relative flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: "url('/assets/bg_img.png')",
        backgroundSize: "110%", // zoom to hide white lines
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Login Form Container */}
      <form
        onSubmit={handleSubmit}
        className="relative z-10 bg-white/20 backdrop-blur-xl 
                   p-6 sm:p-10 rounded-2xl shadow-lg w-[90%] sm:w-full max-w-md"
      >
        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-center text-white drop-shadow-lg">
          Login
        </h2>

        {/* Error Message */}
        {error && (
          <div className="text-red-400 text-sm text-center mb-4">
            {error}
          </div>
        )}

        {/* Inputs */}
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 px-4 py-2 rounded-lg bg-white/20 backdrop-blur-md 
                     border border-white/30 text-white placeholder-gray-200 
                     focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-6 px-4 py-2 rounded-lg bg-white/20 backdrop-blur-md 
                     border border-white/30 text-white placeholder-gray-200 
                     focus:outline-none focus:ring-2 focus:ring-emerald-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* Login Button */}
        <button
          type="submit"
          className="w-full bg-blue-500/80 hover:bg-blue-600/90 text-white 
                     py-2 rounded-lg transition font-semibold shadow-md"
        >
          Login
        </button>

        {/* Links */}
        <div className="mt-6 text-center flex flex-col gap-2">
          <Link
            to="/register"
            className="text-blue-300 hover:text-blue-400 text-sm"
          >
            Don’t have an account? Register
          </Link>
          <Link
            to="/forgot-password"
            className="text-blue-300 hover:text-blue-400 text-sm"
          >
            Forgot Password?
          </Link>
        </div>
      </form>
    </div>
  );
}
