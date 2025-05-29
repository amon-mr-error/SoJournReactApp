import React, { useEffect, useState } from "react";
import api, { handleApiError } from "../api";
import { useAppContext } from "../AppContext";

const defaultForm = { name: "", description: "" };

const AdventureCategoriesPage = () => {
  const { user } = useAppContext();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(defaultForm);
  const [editId, setEditId] = useState(null);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setError(""); setMsg("");
    try {
      const res = await api.get("/api/adventures/categories/");
      setCategories(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError(handleApiError(err));
      setCategories([]);
    }
  };

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setMsg(""); setLoading(true);
    try {
      if (editId) {
        await api.put(`/api/adventures/categories/${editId}`, form);
        setMsg("Category updated!");
      } else {
        await api.post("/api/adventures/categories/", form);
        setMsg("Category created!");
      }
      setForm(defaultForm);
      setEditId(null);
      fetchCategories();
    } catch (err) {
      setError(handleApiError(err));
    }
    setLoading(false);
  };

  const handleEdit = (cat) => {
    setEditId(cat._id);
    setForm({ name: cat.name, description: cat.description });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    setError(""); setMsg(""); setLoading(true);
    try {
      await api.delete(`/api/adventures/categories/${id}`);
      setMsg("Category deleted!");
      fetchCategories();
    } catch (err) {
      setError(handleApiError(err));
    }
    setLoading(false);
  };

  if (!user || user.role !== "admin") {
    return <div className="p-6 text-red-600">Only admins can manage adventure categories.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-2 sm:p-6">
      <h1 className="text-2xl font-bold mb-4">Adventure Categories</h1>
      {msg && <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-2">{msg}</div>}
      {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-2">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-2 mb-6">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Category Name"
          required
          className="input"
        />
        <input
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          required
          className="input"
        />
        <div className="flex gap-2">
          <button type="submit" className="bg-blue-900 text-white px-6 py-2 rounded" disabled={loading}>
            {loading ? "Saving..." : editId ? "Update Category" : "Create Category"}
          </button>
          {editId && (
            <button type="button" className="bg-gray-300 text-blue-900 px-6 py-2 rounded" onClick={() => { setEditId(null); setForm(defaultForm); }}>
              Cancel
            </button>
          )}
        </div>
      </form>
      <div className="bg-white rounded-xl shadow p-4">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Name</th>
              <th className="p-2">Description</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-4 text-center text-gray-500">No categories found.</td>
              </tr>
            ) : (
              categories.map((cat) => (
                <tr key={cat._id} className="border-t">
                  <td className="p-2">{cat.name}</td>
                  <td className="p-2">{cat.description}</td>
                  <td className="p-2 flex gap-2">
                    <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={() => handleEdit(cat)}>Edit</button>
                    <button className="bg-red-600 text-white px-3 py-1 rounded" onClick={() => handleDelete(cat._id)}>Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <style>{`
        .input { border: 1px solid #d1d5db; border-radius: 0.5rem; padding: 0.5rem 0.75rem; width: 100%; }
      `}</style>
    </div>
  );
};

export default AdventureCategoriesPage;