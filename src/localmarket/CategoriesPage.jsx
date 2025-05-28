import React, { useEffect, useState } from "react";
import api, { handleApiError } from "../api";

const CategoriesPage = ({ user }) => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  const fetchCategories = async () => {
    setError(""); setMsg("");
    try {
      const res = await api.get("/api/categories/");
      setCategories(res.data);
    } catch (err) {
      setError(handleApiError(err));
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError(""); setMsg("");
    try {
      await api.post("/api/categories/", { name, description });
      setMsg("Category created!");
      setName(""); setDescription("");
      fetchCategories();
    } catch (err) {
      setError(handleApiError(err));
    }
  };

  const handleEdit = (cat) => {
    setEditId(cat._id || cat.id);
    setEditName(cat.name);
    setEditDescription(cat.description);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError(""); setMsg("");
    try {
      await api.put(`/api/categories/${editId}`, {
        name: editName,
        description: editDescription,
      });
      setMsg("Category updated!");
      setEditId(null);
      fetchCategories();
    } catch (err) {
      setError(handleApiError(err));
    }
  };

  const handleDelete = async (id) => {
    setError(""); setMsg("");
    try {
      await api.delete(`/api/categories/${id}`);
      setMsg("Category deleted!");
      fetchCategories();
    } catch (err) {
      setError(handleApiError(err));
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-8 mb-6">
      <h2 className="text-2xl font-bold text-blue-900 mb-4">Categories</h2>
      {msg && <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-2">{msg}</div>}
      {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-2">{error}</div>}
      {user.role === "admin" && (
        <form onSubmit={editId ? handleUpdate : handleCreate} className="flex gap-2 mb-4">
          <input
            type="text"
            value={editId ? editName : name}
            onChange={(e) => (editId ? setEditName(e.target.value) : setName(e.target.value))}
            placeholder="Name"
            required
            className="rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            value={editId ? editDescription : description}
            onChange={(e) =>
              editId ? setEditDescription(e.target.value) : setDescription(e.target.value)
            }
            placeholder="Description"
            required
            className="rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button type="submit" className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800">{editId ? "Update" : "Create"}</button>
          {editId && <button type="button" className="bg-gray-300 text-blue-900 px-4 py-2 rounded hover:bg-gray-400" onClick={() => setEditId(null)}>Cancel</button>}
        </form>
      )}
      <ul>
        {categories.map((cat) => (
          <li key={cat._id || cat.id} className="flex items-center justify-between bg-blue-50 rounded px-4 py-2 mb-2">
            <span>
              <b>{cat.name}</b>: {cat.description}
            </span>
            {user.role === "admin" && (
              <span>
                <button className="bg-blue-900 text-white px-3 py-1 rounded mr-2 hover:bg-blue-700" onClick={() => handleEdit(cat)}>Edit</button>
                <button className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700" onClick={() => handleDelete(cat._id || cat.id)}>Delete</button>
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoriesPage;