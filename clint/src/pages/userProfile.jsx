import { useEffect, useState } from "react";
import { FaUser, FaEnvelope, FaUserTag, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import api from "../components/utils/api";

export default function UserProfile() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    api
      .get("/users/me", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        setProfile(res.data);
      })
      .catch(() => setError("Failed to load profile"));
  }, []);

  if (error) return <div className="text-red-600 text-center mt-10">{error}</div>;
  if (!profile) return <div className="text-center mt-10 text-gray-500">Loading...</div>;

  return (
    <div
      className="max-w-md mx-auto mt-12 p-8 rounded-xl shadow-lg bg-white"
      style={{
        background:
          "linear-gradient(135deg, #fffdfdff 0%, #bfcfdbff 100%)",
        padding: "2rem",
      }}
    >
      <h2 className="text-3xl font-bold mb-6 border-b border-gray-300 pb-2 text-center text-blue-700">
        My Profile
      </h2>

      <div className="space-y-6 text-lg text-gray-700">
        <div className="flex items-center space-x-4">
          <FaUser className="text-blue-500" size={24} />
          <span className="font-medium">{profile.name}</span>
        </div>
        <div className="flex items-center space-x-4">
          <FaEnvelope className="text-green-500" size={24} />
          <span className="break-words">{profile.email}</span>
        </div>
        <div className="flex items-center space-x-4">
          <FaUserTag className="text-purple-500" size={24} />
          <span className="capitalize">{profile.role}</span>
        </div>
        <div className="flex items-center space-x-4">
          {profile.is_active ? (
            <FaCheckCircle className="text-green-500" size={24} />
          ) : (
            <FaTimesCircle className="text-red-500" size={24} />
          )}
          <span className={profile.is_active ? "text-green-500" : "text-red-500"}>
            {profile.is_active ? "Active" : "Disabled"}
          </span>
        </div>
      </div>
    </div>
  );
}
