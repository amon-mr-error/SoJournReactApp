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
    <div>
      <h2>Categories</h2>
      {msg && <div style={{ color: "green" }}>{msg}</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}
      {user.role === "admin" && (
        <form onSubmit={editId ? handleUpdate : handleCreate}>
          <input
            type="text"
            value={editId ? editName : name}
            onChange={(e) => (editId ? setEditName(e.target.value) : setName(e.target.value))}
            placeholder="Name"
            required
          />
          <input
            type="text"
            value={editId ? editDescription : description}
            onChange={(e) =>
              editId ? setEditDescription(e.target.value) : setDescription(e.target.value)
            }
            placeholder="Description"
            required
          />
          <button type="submit">{editId ? "Update" : "Create"}</button>
          {editId && <button onClick={() => setEditId(null)}>Cancel</button>}
        </form>
      )}
      <ul>
        {categories.map((cat) => (
          <li key={cat._id || cat.id}>
            <b>{cat.name}</b>: {cat.description}
            {user.role === "admin" && (
              <>
                <button onClick={() => handleEdit(cat)}>Edit</button>
                <button onClick={() => handleDelete(cat._id || cat.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoriesPage;