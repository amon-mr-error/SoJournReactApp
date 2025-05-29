import React, { useEffect, useState } from "react";
import api, { handleApiError } from "../api";

const UsersPage = ({ user }) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  const fetchUsers = async () => {
    setError(""); setMsg("");
    try {
      const res = await api.get("/api/users/");
      setUsers(res.data);
    } catch (err) {
      setError(handleApiError(err));
    }
  };

  const fetchUser = async (id) => {
    setError(""); setMsg("");
    try {
      const res = await api.get(`/api/users/${id}`);
      setSelectedUser(res.data);
    } catch (err) {
      setError(handleApiError(err));
    }
  };

  const handleRoleChange = async (id, role) => {
    setError(""); setMsg("");
    try {
      await api.patch(`/api/users/${id}/role`, { role });
      setMsg("Role updated!");
      fetchUsers();
    } catch (err) {
      setError(handleApiError(err));
    }
  };

  const handleDelete = async (id) => {
    setError(""); setMsg("");
    try {
      await api.delete(`/api/users/${id}`);
      setMsg("User deleted!");
      fetchUsers();
    } catch (err) {
      setError(handleApiError(err));
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  return (
    <div className="bg-white rounded-xl shadow-md p-6 md:p-10 max-w-6xl mx-auto">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-6 border-b pb-2">All Users</h2>

      {msg && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{msg}</div>}
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 shadow-sm rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-sm uppercase">
              <th className="py-3 px-5 text-left">Name</th>
              <th className="py-3 px-5 text-left">Mobile</th>
              <th className="py-3 px-5 text-left">Role</th>
              <th className="py-3 px-5 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, index) => (
              <tr key={u._id || u.id} className="border-t border-gray-200 hover:bg-gray-50">
                <td className="py-4 px-5 font-medium text-gray-800 whitespace-nowrap">{u.name}</td>
                <td className="py-4 px-5 text-gray-600 whitespace-nowrap">{u.mobile}</td>
                <td className="py-4 px-5">
                  <select
                    value={u.role}
                    onChange={(e) => handleRoleChange(u._id || u.id, e.target.value)}
                    className="bg-gray-50 border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="user">User</option>
                    <option value="vendor">Vendor</option>
                    <option value="admin">Admin</option>
                    <option value="adventurer">Adventurer</option>
                  </select>
                </td>
                <td className="py-4 px-5">
                  <div className="flex gap-2">
                    <button
                      onClick={() => fetchUser(u._id || u.id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded text-sm shadow-sm"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDelete(u._id || u.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded text-sm shadow-sm"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedUser && (
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-blue-800">User Details</h3>
            <button
              onClick={() => setSelectedUser(null)}
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
            >
              Close
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div><strong>Name:</strong> {selectedUser.name}</div>
            <div><strong>Mobile:</strong> {selectedUser.mobile}</div>
            <div><strong>Role:</strong> {selectedUser.role}</div>
            <div><strong>Verified:</strong> {selectedUser.isVerified ? "Yes" : "No"}</div>
            <div><strong>Address:</strong> {selectedUser.address}</div>
            <div><strong>Created At:</strong> {new Date(selectedUser.createdAt).toLocaleString()}</div>
            <div><strong>Updated At:</strong> {new Date(selectedUser.updatedAt).toLocaleString()}</div>
            <div><strong>OTP:</strong> {selectedUser.otp}</div>
            <div><strong>OTP Expires:</strong> {new Date(selectedUser.otpExpires).toLocaleString()}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;