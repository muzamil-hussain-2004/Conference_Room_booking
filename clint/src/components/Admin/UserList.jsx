import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [editForm, setEditForm] = useState({ email: "", name: "", role: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    api.get("/users", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setUsers(res.data));
  }, []);

  const handleEditClick = (user) => {
    setEditUser(user);
    setEditForm({ email: user.email, name: user.name, role: user.role });
  };

  const handleEditChange = e => setEditForm({ ...editForm, [e.target.name]: e.target.value });

  const handleEditSubmit = async e => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      await api.patch(`/users/${editUser.id}`, editForm, { headers: { Authorization: `Bearer ${token}` } });
      setUsers(users.map(u => u.id === editUser.id ? { ...u, ...editForm } : u));
      setEditUser(null);
      setError("");
    } catch {
      setError("Failed to update user");
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold mb-8 text-center text-blue-700">Users</h1>
      
      <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 bg-white">
          <thead className="bg-gray-50">
            <tr>
              {["Email", "Name", "Role", "Active", "Actions"].map((header) => (
                <th
                  key={header}
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider select-none"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-3 whitespace-nowrap text-gray-700">{u.email}</td>
                <td className="px-4 py-3 whitespace-nowrap text-gray-700">{u.name}</td>
                <td className="px-4 py-3 whitespace-nowrap text-gray-700 capitalize">{u.role}</td>
                <td className="px-4 py-3 whitespace-nowrap text-gray-700">{u.is_active ? "Yes" : "No"}</td>
                <td className="px-4 py-3 whitespace-nowrap space-x-2 text-gray-700">
                  <button
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md text-sm transition"
                    onClick={() => handleEditClick(u)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm transition"
                    onClick={async () => {
                      const token = localStorage.getItem("token");
                      await api.patch(`/users/${u.id}/disable`, {}, { headers: { Authorization: `Bearer ${token}` } });
                      setUsers(users.map(user => user.id === u.id ? { ...user, is_active: false } : user));
                    }}
                  >
                    Disable
                  </button>
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm transition"
                    onClick={() => navigate(`/admin/users/${u.id}/bookings`)}
                  >
                    View Bookings
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editUser && (
        <form
          onSubmit={handleEditSubmit}
          className="bg-white p-6 rounded-lg shadow max-w-lg mx-auto mt-10"
        >
          <h2 className="text-xl font-semibold mb-4 border-b border-gray-200 pb-2">Edit User</h2>
          {error && <div className="text-red-600 mb-4">{error}</div>}
          <input
            name="name"
            value={editForm.name}
            onChange={handleEditChange}
            placeholder="Name"
            className="w-full mb-3 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            name="email"
            value={editForm.email}
            onChange={handleEditChange}
            placeholder="Email"
            type="email"
            className="w-full mb-3 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            name="role"
            value={editForm.role}
            onChange={handleEditChange}
            className="w-full mb-4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <div className="flex justify-end space-x-3">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md transition"
            >
              Update
            </button>
            <button
              type="button"
              className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-5 py-2 rounded-md transition"
              onClick={() => setEditUser(null)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
