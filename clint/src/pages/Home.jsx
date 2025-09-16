import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div
      className="relative flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: "url('/assets/bg_img.png')",
        backgroundSize: "110%", // zoom to hide white lines
      }}
    >
      {/* Dark overlay for better contrast */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Transparent, blurred container */}
      <div
        className="relative z-10 bg-white/25 backdrop-blur-md p-8 sm:p-12 rounded-3xl shadow-xl max-w-lg w-[90%] text-center"
      >
        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-6 text-white drop-shadow-xl">
          Conference Room Booking
        </h1>

        {/* Subheading */}
        <p className="mb-8 text-gray-200 text-lg sm:text-xl font-light">
          Book your meeting rooms easily and efficiently.
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-5 sm:flex-row sm:justify-center sm:gap-6">
          <button
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full transition font-semibold shadow-lg"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
          <button
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-full transition font-semibold shadow-lg"
            onClick={() => navigate("/register")}
          >
            Register
          </button>
        </div>

        {/* Footer */}
        <div className="mt-10 text-sm text-gray-300 font-light">
          Secure & Reliable Booking System
        </div>
      </div>
    </div>
  );
}
