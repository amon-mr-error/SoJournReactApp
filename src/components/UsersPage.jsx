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
    <div>
      <h2>All Users</h2>
      {msg && <div style={{ color: "green" }}>{msg}</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}
      <table>
        <thead>
          <tr>
            <th>Name</th><th>Mobile</th><th>Role</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id || u.id}>
              <td>{u.name}</td>
              <td>{u.mobile}</td>
              <td>
                <select
                  value={u.role}
                  onChange={(e) => handleRoleChange(u._id || u.id, e.target.value)}
                >
                  <option value="user">User</option>
                  <option value="vendor">Vendor</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td>
                <button onClick={() => fetchUser(u._id || u.id)}>View</button>
                <button onClick={() => handleDelete(u._id || u.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedUser && (
        <div style={{ marginTop: 16, border: "1px solid #ccc", padding: 12 }}>
          <h3>User Details</h3>
          <pre>{JSON.stringify(selectedUser, null, 2)}</pre>
          <button onClick={() => setSelectedUser(null)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default UsersPage;