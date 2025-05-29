import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { handleApiError } from "../api";

const AdventureList = () => {
  const [adventures, setAdventures] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    category: "",
    difficulty: "",
    location: "",
    minPrice: "",
    maxPrice: "",
    featured: "",
  });
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchAdventures();
    // eslint-disable-next-line
  }, [filters.page, filters.category, filters.difficulty, filters.location, filters.minPrice, filters.maxPrice, filters.featured]);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/api/adventures/categories/");
      setCategories(Array.isArray(res.data) ? res.data : []);
    } catch {
      setCategories([]);
    }
  };

  const fetchAdventures = async () => {
    setLoading(true);
    setError("");
    try {
      const params = {};
      Object.entries(filters).forEach(([k, v]) => {
        if (v) params[k] = v;
      });
      const res = await api.get("/api/adventures/", { params });
      const data = res.data.adventures || [];
      setAdventures(data);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      setError(handleApiError(err));
      setAdventures([]);
    }
    setLoading(false);
  };

  const handleFilterChange = (e) => {
    setFilters((f) => ({
      ...f,
      [e.target.name]: e.target.value,
      page: 1,
    }));
  };

  return (
    <div className="max-w-5xl mx-auto p-2 sm:p-6">
      <h1 className="text-2xl font-bold mb-4">Explore Adventures</h1>
      <div className="bg-white rounded-xl shadow p-4 mb-4">
        <div className="flex flex-wrap gap-2">
          <select name="category" value={filters.category} onChange={handleFilterChange} className="input w-40">
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
          <select name="difficulty" value={filters.difficulty} onChange={handleFilterChange} className="input w-32">
            <option value="">All Difficulties</option>
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
            <option>Extreme</option>
          </select>
          <input name="location" value={filters.location} onChange={handleFilterChange} placeholder="Location" className="input w-32" />
          <input name="minPrice" value={filters.minPrice} onChange={handleFilterChange} placeholder="Min Price" type="number" className="input w-24" />
          <input name="maxPrice" value={filters.maxPrice} onChange={handleFilterChange} placeholder="Max Price" type="number" className="input w-24" />
          <select name="featured" value={filters.featured} onChange={handleFilterChange} className="input w-28">
            <option value="">All</option>
            <option value="true">Featured</option>
            <option value="false">Not Featured</option>
          </select>
        </div>
      </div>
      {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-2">{error}</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full text-center py-8">Loading...</div>
        ) : adventures.length === 0 ? (
          <div className="col-span-full text-center py-8 text-gray-500">No adventures found.</div>
        ) : (
          adventures.map((adv) => (
            <Link
              to={`/adventure/adventures/${adv._id}`}
              key={adv._id}
              className="block bg-white rounded-lg shadow hover:shadow-lg transition p-4"
            >
              <img
                src={adv.imageUrl}
                alt={adv.name}
                className="w-full h-40 object-cover rounded mb-2"
                style={{ background: "#eee" }}
              />
              <div className="font-bold text-lg">{adv.name}</div>
              <div className="text-gray-600">{adv.location}</div>
              <div className="text-sm text-gray-500">{adv.difficulty} | {adv.duration}</div>
              <div className="text-blue-900 font-semibold mt-1">₹{adv.price}</div>
            </Link>
          ))
        )}
      </div>
      <div className="flex justify-center gap-2 mt-6">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={`px-3 py-1 rounded ${filters.page === i + 1 ? "bg-blue-900 text-white" : "bg-gray-200"}`}
            onClick={() => setFilters((f) => ({ ...f, page: i + 1 }))}
          >
            {i + 1}
          </button>
        ))}
      </div>
      <style>{`
        .input { border: 1px solid #d1d5db; border-radius: 0.5rem; padding: 0.5rem 0.75rem; }
      `}</style>
    </div>
  );
};

export default AdventureList;