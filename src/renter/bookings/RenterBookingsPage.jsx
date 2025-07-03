import React, { useEffect, useState } from "react";
import api from "../../api";

const RenterBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const res = await api.get("/api/rentals/bookings");
        setBookings(res.data);
      } catch (err) {
        setError("Failed to fetch bookings");
      }
      setLoading(false);
    };
    fetchBookings();
  }, []);

  if (loading) return <div>Loading bookings...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>My Rental Bookings</h2>
      {bookings.length === 0 ? (
        <div>No bookings found.</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Rental</th>
              <th>Type</th>
              <th>Start</th>
              <th>End</th>
              <th>Status</th>
              <th>Payment</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b._id}>
                <td>{b.rental?.title || "-"}</td>
                <td>{b.bookingType}</td>
                <td>{new Date(b.startDate).toLocaleString()}</td>
                <td>{new Date(b.endDate).toLocaleString()}</td>
                <td>{b.status}</td>
                <td>{b.paymentStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default RenterBookingsPage;
