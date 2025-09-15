export default function Footer() {
  return (
    <footer className="bg-blue-900 text-white py-6 shadow-inner ">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center md:justify-between text-center md:text-left space-y-3 md:space-y-0">
        <div className="font-semibold text-lg tracking-wide">
          Conference Room Booking App &copy; {new Date().getFullYear()}
        </div>
        <div className="text-sm text-blue-300">
          Made with <span className="text-red-500">&#10084;</span> by Your Muzamil
        </div>
      </div>
    </footer>
  );
}