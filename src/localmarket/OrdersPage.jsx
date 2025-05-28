import React, { useEffect, useState } from "react";
import api, { handleApiError } from "../api";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const OrdersPage = ({ user }) => {
  const [orders, setOrders] = useState([]);
  const [selected, setSelected] = useState(null);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch orders based on role
  const fetchOrders = async () => {
    setLoading(true);
    setError(""); setMsg("");
    try {
      let url = "/api/orders/my-orders";
      if (user.role === "vendor") url = "/api/orders/vendor";
      if (user.role === "admin") url = "/api/orders/all";
      const res = await api.get(url);
      setOrders(res.data);
    } catch (err) {
      setError(handleApiError(err));
    }
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, [user]);

  // Update order status (admin/vendor)
  const handleStatus = async (id, status) => {
    setError(""); setMsg("");
    try {
      await api.patch(`/api/orders/${id}/status`, { status });
      setMsg("Order status updated!");
      fetchOrders();
    } catch (err) {
      setError(handleApiError(err));
    }
  };

  // Cancel order (user)
  const handleCancel = async (id) => {
    setError(""); setMsg("");
    try {
      await api.patch(`/api/orders/${id}/cancel`);
      setMsg("Order cancelled!");
      fetchOrders();
    } catch (err) {
      setError(handleApiError(err));
    }
  };

  // Order details modal
  const openDetails = (order) => setSelected(order);
  const closeDetails = () => setSelected(null);

  // Helper to format date
  const formatDate = (date) => date ? new Date(date).toLocaleString() : "";

  return (
    <div className="bg-white rounded-xl shadow p-8 mb-6">
      <h2 className="text-2xl font-bold text-blue-900 mb-4">Orders</h2>
      {msg && <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-2">{msg}</div>}
      {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-2">{error}</div>}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-separate border-spacing-y-2">
          <thead>
            <tr>
              <th className="py-2 px-4 bg-blue-50">Order ID</th>
              {user.role !== "user" && <th className="py-2 px-4 bg-blue-50">Customer</th>}
              <th className="py-2 px-4 bg-blue-50">Status</th>
              <th className="py-2 px-4 bg-blue-50">Total</th>
              <th className="py-2 px-4 bg-blue-50">Payment</th>
              <th className="py-2 px-4 bg-blue-50">Placed At</th>
              <th className="py-2 px-4 bg-blue-50">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id || o.id} className="bg-blue-100 hover:bg-blue-200 rounded">
                <td className="py-2 px-4 font-mono">{o._id || o.id}</td>
                {user.role !== "user" && (
                  <td className="py-2 px-4">
                    <div className="font-semibold">{o.user?.name}</div>
                    <div className="text-xs text-gray-600">{o.user?.mobile}</div>
                  </td>
                )}
                <td className="py-2 px-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${statusColors[o.status] || "bg-gray-100 text-gray-800"}`}>
                    {o.status}
                  </span>
                </td>
                <td className="py-2 px-4 font-semibold text-blue-900">
                  ₹{(o.totalAmount || 0).toLocaleString()}
                </td>
                <td className="py-2 px-4">{o.paymentMethod?.toUpperCase()}</td>
                <td className="py-2 px-4">{formatDate(o.createdAt)}</td>
                <td className="py-2 px-4 flex flex-col gap-1">
                  <button className="bg-gray-300 text-blue-900 px-3 py-1 rounded hover:bg-gray-400" onClick={() => openDetails(o)}>Details</button>
                  {user.role === "user" && o.status !== "cancelled" && (
                    <button className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700" onClick={() => handleCancel(o._id || o.id)}>Cancel</button>
                  )}
                  {(user.role === "admin" || user.role === "vendor") && (
                    <select
                      value={o.status}
                      onChange={(e) => handleStatus(o._id || o.id, e.target.value)}
                      className="rounded border border-gray-300 px-2 py-1 mt-1"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order Details Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-xl w-full relative">
            <button className="absolute top-2 right-2 text-2xl text-gray-500 hover:text-blue-900" onClick={closeDetails}>&times;</button>
            <h3 className="font-bold text-xl text-blue-900 mb-2">Order Details</h3>
            <div className="mb-2">
              <span className="font-semibold">Order ID:</span> <span className="font-mono">{selected._id || selected.id}</span>
            </div>
            <div className="mb-2">
              <span className="font-semibold">Status:</span>{" "}
              <span className={`px-2 py-1 rounded text-xs font-bold ${statusColors[selected.status] || "bg-gray-100 text-gray-800"}`}>
                {selected.status}
              </span>
            </div>
            <div className="mb-2">
              <span className="font-semibold">Placed At:</span> {formatDate(selected.createdAt)}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Payment Method:</span> {selected.paymentMethod?.toUpperCase()}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Shipping Address:</span> {selected.shippingAddress}
            </div>
            {selected.user && (
              <div className="mb-2">
                <span className="font-semibold">Customer:</span> {selected.user.name} ({selected.user.mobile})
              </div>
            )}
            <div className="mb-4">
              <span className="font-semibold">Items:</span>
              <ul className="mt-1">
                {selected.items.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2 mb-1">
                    {item.product?.image && (
                      <img
                        src={item.product.image.startsWith("http") ? item.product.image : `/api/localmarket/image/${item.product.image}`}
                        alt={item.product.name}
                        className="w-10 h-10 rounded object-cover shadow"
                      />
                    )}
                    <span className="font-semibold">{item.product?.name || "Product"}</span>
                    <span className="text-gray-600">x {item.quantity}</span>
                    <span className="text-blue-900 font-semibold">₹{item.price?.toLocaleString()}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="font-bold text-lg text-blue-900 mb-2">
              Total: ₹{(selected.totalAmount || 0).toLocaleString()}
            </div>
            <div className="flex gap-2 mt-4">
              <button className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800" onClick={closeDetails}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;