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
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Transparent container */}
      <div className="relative z-10 bg-white/20 backdrop-blur-xl 
                      p-6 sm:p-10 rounded-2xl shadow-lg text-center 
                      w-[90%] sm:w-full max-w-xl">
        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-4 text-white drop-shadow-lg">
          Conference Room Booking
        </h1>

        {/* Subheading */}
        <p className="mb-6 text-gray-200 text-base sm:text-lg">
          Book your meeting rooms easily and efficiently.
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-4">
          <button
            className="w-full bg-blue-500/80 hover:bg-blue-600/90 
                       text-white px-6 py-2 rounded-lg transition 
                       font-semibold shadow-md"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
          <button
            className="w-full bg-emerald-500/80 hover:bg-emerald-600/90 
                       text-white px-6 py-2 rounded-lg transition 
                       font-semibold shadow-md"
            onClick={() => navigate("/register")}
          >
            Register
          </button>
        </div>

        {/* Footer text */}
        <div className="mt-6 text-sm text-gray-200">
          Secure & Reliable Booking System
        </div>
      </div>
    </div>
  );
}