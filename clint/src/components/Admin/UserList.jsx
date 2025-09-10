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
        <div className="max-w-4xl mx-auto py-10">
            <h1 className="text-2xl font-bold mb-6 text-center text-blue-700">Users</h1>
            <table className="w-full bg-white rounded shadow">
                <thead>
                    <tr>
                        <th className="p-2">Email</th>
                        <th className="p-2">Name</th>
                        <th className="p-2">Role</th>
                        <th className="p-2">Active</th>
                        <th className="p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(u => (
                        <tr key={u.id}>
                            <td className="p-2">{u.email}</td>
                            <td className="p-2">{u.name}</td>
                            <td className="p-2">{u.role}</td>
                            <td className="p-2">{u.is_active ? "Yes" : "No"}</td>
                            <td className="p-2">
                                <button
                                    className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 mr-2"
                                    onClick={() => handleEditClick(u)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                                    onClick={async () => {
                                        const token = localStorage.getItem("token");
                                        await api.patch(`/users/${u.id}/disable`, {}, { headers: { Authorization: `Bearer ${token}` } });
                                        setUsers(users.map(user => user.id === u.id ? { ...user, is_active: false } : user));
                                    }}
                                >
                                    Disable
                                </button>
                                <button
                                    className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 mr-2"
                                    onClick={() => navigate(`/admin/users/${u.id}/bookings`)}
                                >
                                    View Bookings
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {editUser && (
                <form onSubmit={handleEditSubmit} className="bg-white p-6 rounded shadow max-w-lg mx-auto mt-6">
                    <h2 className="text-xl font-bold mb-4">Edit User</h2>
                    {error && <div className="text-red-500 mb-2">{error}</div>}
                    <input name="name" value={editForm.name} onChange={handleEditChange} placeholder="Name" className="w-full mb-2 p-2 border rounded" />
                    <input name="email" value={editForm.email} onChange={handleEditChange} placeholder="Email" className="w-full mb-2 p-2 border rounded" />
                    <select name="role" value={editForm.role} onChange={handleEditChange} className="w-full mb-2 p-2 border rounded">
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mr-2">Update</button>
                    <button type="button" className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500" onClick={() => setEditUser(null)}>Cancel</button>
                </form>
            )}
        </div>
    );
}