import React, { useEffect, useState } from "react";
import api, { handleApiError } from "../api";

const ProductsPage = ({ user }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState(null);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // For product creation/edit
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
  });

  // Fetch all products
  const fetchProducts = async () => {
    setLoading(true);
    setError(""); setMsg("");
    try {
      const res = await api.get("/api/localmarket/");
      setProducts(res.data);
    } catch (err) {
      setError(handleApiError(err));
    }
    setLoading(false);
  };

  // Fetch categories for product form
  const fetchCategories = async () => {
    try {
      const res = await api.get("/api/categories/");
      setCategories(res.data);
    } catch {}
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Get product by id
  const fetchProduct = async (id) => {
    setError(""); setMsg("");
    try {
      const res = await api.get(`/api/localmarket/${id}`);
      setSelected(res.data);
    } catch (err) {
      setError(handleApiError(err));
    }
  };

  // Create product (vendor/admin)
  const handleCreate = async (e) => {
    e.preventDefault();
    setError(""); setMsg("");
    try {
      await api.post("/api/localmarket/", form);
      setMsg("Product created!");
      setForm({ name: "", description: "", price: "", category: "", stock: "" });
      fetchProducts();
    } catch (err) {
      setError(handleApiError(err));
    }
  };

  // Update product (vendor/admin)
  const handleUpdate = async (e) => {
    e.preventDefault();
    setError(""); setMsg("");
    try {
      await api.put(`/api/localmarket/product/${selected._id || selected.id}`, form);
      setMsg("Product updated!");
      setSelected(null);
      fetchProducts();
    } catch (err) {
      setError(handleApiError(err));
    }
  };

  // Delete product (vendor/admin)
  const handleDelete = async (id) => {
    setError(""); setMsg("");
    try {
      await api.delete(`/api/localmarket/${id}`);
      setMsg("Product deleted!");
      fetchProducts();
    } catch (err) {
      setError(handleApiError(err));
    }
  };

  // Rate product (user)
  const handleRate = async (id, rating) => {
    setError(""); setMsg("");
    try {
      await api.post(`/api/localmarket/product/${id}/rate`, { rating });
      setMsg("Product rated!");
      fetchProducts();
    } catch (err) {
      setError(handleApiError(err));
    }
  };

  // Vendor products
  const fetchVendorProducts = async () => {
    setError(""); setMsg("");
    try {
      const res = await api.get("/api/localmarket/vendor/products");
      setProducts(res.data);
    } catch (err) {
      setError(handleApiError(err));
    }
  };

  // Admin: all vendors' products
  const fetchAdminVendorsProducts = async () => {
    setError(""); setMsg("");
    try {
      const res = await api.get("/api/localmarket/admin/vendors/products");
      setProducts(res.data);
    } catch (err) {
      setError(handleApiError(err));
    }
  };

  // Image endpoints
  const handleDeleteImage = async (filename) => {
    setError(""); setMsg("");
    try {
      await api.delete(`/api/localmarket/image/${filename}`);
      setMsg("Image deleted!");
      fetchProducts();
    } catch (err) {
      setError(handleApiError(err));
    }
  };

  return (
    <div>
      <h2>Products</h2>
      {msg && <div style={{ color: "green" }}>{msg}</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}
      {user.role === "vendor" && (
        <button onClick={fetchVendorProducts}>My Products</button>
      )}
      {user.role === "admin" && (
        <button onClick={fetchAdminVendorsProducts}>All Vendors' Products</button>
      )}
      {(user.role === "vendor" || user.role === "admin") && (
        <form onSubmit={selected ? handleUpdate : handleCreate}>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Name"
            required
          />
          <input
            type="text"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Description"
            required
          />
          <input
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            placeholder="Price"
            required
          />
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id || cat.id} value={cat._id || cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <input
            type="number"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
            placeholder="Stock"
            required
          />
          <button type="submit">{selected ? "Update" : "Create"}</button>
          {selected && <button onClick={() => setSelected(null)}>Cancel</button>}
        </form>
      )}
      <ul>
        {products.map((p) => (
          <li key={p._id || p.id}>
            <b>{p.name}</b> - {p.price}
            <br />
            {p.image && (
              <img
                src={`/api/localmarket/image/${p.image}`}
                alt={p.name}
                width={50}
              />
            )}
            <br />
            {user.role === "user" && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleRate(p._id || p.id, e.target.rating.value);
                }}
                style={{ display: "inline" }}
              >
                <input
                  type="number"
                  name="rating"
                  min={0}
                  max={5}
                  placeholder="Rate"
                  style={{ width: 40 }}
                />
                <button type="submit">Rate</button>
              </form>
            )}
            {(user.role === "vendor" || user.role === "admin") && (
              <>
                <button onClick={() => fetchProduct(p._id || p.id)}>Edit</button>
                <button onClick={() => handleDelete(p._id || p.id)}>Delete</button>
                {p.image && (
                  <button onClick={() => handleDeleteImage(p.image)}>
                    Delete Image
                  </button>
                )}
              </>
            )}
            <button onClick={() => fetchProduct(p._id || p.id)}>Details</button>
          </li>
        ))}
      </ul>
      {selected && (
        <div style={{ marginTop: 16, border: "1px solid #ccc", padding: 12 }}>
          <h3>Product Details</h3>
          <pre>{JSON.stringify(selected, null, 2)}</pre>
          <button onClick={() => setSelected(null)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;