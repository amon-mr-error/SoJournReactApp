import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api, { handleApiError } from "../api";
import { useAppContext } from "../AppContext";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const AdventureBookingsPage = () => {
  const { user } = useAppContext();
  const { adventureId } = useParams();
  const [bookings, setBookings] = useState([]);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBookings();
    // eslint-disable-next-line
  }, [adventureId]);

  const fetchBookings = async () => {
    setError(""); setMsg("");
    try {
      const res = await api.get(`/api/adventures/orders/adventure/${adventureId}/bookings`);
      setBookings(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError(handleApiError(err));
      setBookings([]);
    }
  };

  const handleStatus = async (bookingId, status) => {
    setError(""); setMsg("");
    try {
      await api.put(`/api/adventures/orders/${bookingId}/status`, { status });
      setMsg("Booking status updated!");
      fetchBookings();
    } catch (err) {
      setError(handleApiError(err));
    }
  };

  if (!user || user.role !== "adventurer") {
    return <div className="p-6 text-red-600">Only adventurers can view bookings for their adventures.</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow p-8 mb-6">
      <h2 className="text-2xl font-bold text-blue-900 mb-4">Bookings for Adventure</h2>
      {msg && <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-2">{msg}</div>}
      {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-2">{error}</div>}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-separate border-spacing-y-2">
          <thead>
            <tr>
              <th className="py-2 px-4 bg-blue-50">Booking ID</th>
              <th className="py-2 px-4 bg-blue-50">User</th>
              <th className="py-2 px-4 bg-blue-50">Status</th>
              <th className="py-2 px-4 bg-blue-50">Date</th>
              <th className="py-2 px-4 bg-blue-50">Actions</th>
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
                  <td className="py-2 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${statusColors[b.status] || "bg-gray-100 text-gray-800"}`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="py-2 px-4">{new Date(b.createdAt).toLocaleString()}</td>
                  <td className="py-2 px-4">
                    <select
                      value={b.status}
                      onChange={e => handleStatus(b._id, e.target.value)}
                      className="rounded border border-gray-300 px-2 py-1"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdventureBookingsPage;