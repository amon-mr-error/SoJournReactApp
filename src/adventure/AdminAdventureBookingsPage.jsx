import React, { useEffect, useState } from "react";
import api, { handleApiError } from "../api";
import { useAppContext } from "../AppContext";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const AdminAdventureBookingsPage = () => {
  const { user } = useAppContext();
  const [bookings, setBookings] = useState([]);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: "",
    startDate: "",
    endDate: "",
  });
  const [totalPages, setTotalPages] = useState(1);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBookings();
    // eslint-disable-next-line
  }, [filters.page, filters.status, filters.startDate, filters.endDate]);

  const fetchBookings = async () => {
    setLoading(true);
    setError(""); setMsg("");
    try {
      const params = {};
      Object.entries(filters).forEach(([k, v]) => {
        if (v) params[k] = v;
      });
      const res = await api.get("/api/adventures/orders/admin/all-bookings", { params });
      setBookings(Array.isArray(res.data.bookings) ? res.data.bookings : []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      setError(handleApiError(err));
      setBookings([]);
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

  if (!user || user.role !== "admin") {
    return <div className="p-6 text-red-600">Only admins can view all adventure bookings.</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow p-8 mb-6">
      <h2 className="text-2xl font-bold text-blue-900 mb-4">All Adventure Bookings</h2>
      <div className="flex flex-wrap gap-2 mb-4">
        <select name="status" value={filters.status} onChange={handleFilterChange} className="input w-32">
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <input name="startDate" type="date" value={filters.startDate} onChange={handleFilterChange} className="input w-40" />
        <input name="endDate" type="date" value={filters.endDate} onChange={handleFilterChange} className="input w-40" />
      </div>
      {msg && <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-2">{msg}</div>}
      {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-2">{error}</div>}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-separate border-spacing-y-2">
          <thead>
            <tr>
              <th className="py-2 px-4 bg-blue-50">Booking ID</th>
              <th className="py-2 px-4 bg-blue-50">User</th>
              <th className="py-2 px-4 bg-blue-50">Adventure</th>
              <th className="py-2 px-4 bg-blue-50">Status</th>
              <th className="py-2 px-4 bg-blue-50">Date</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">No bookings found.</td>
              </tr>
            ) : (
              bookings.map((b) => (
                <tr key={b._id} className="bg-blue-100 hover:bg-blue-200 rounded">
                  <td className="py-2 px-4 font-mono">{b._id}</td>
                  <td className="py-2 px-4">{b.user?.name} <br /><span className="text-xs text-gray-600">{b.user?.mobile}</span></td>
                  <td className="py-2 px-4">{b.adventure?.name}</td>
                  <td className="py-2 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${statusColors[b.status] || "bg-gray-100 text-gray-800"}`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="py-2 px-4">{new Date(b.createdAt).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
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

export default AdminAdventureBookingsPage;