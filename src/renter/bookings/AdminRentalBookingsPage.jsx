import React, { useEffect, useState } from "react";
import api from "../../api";
import {
  Table,
  Tag,
  Select,
  message,
  Spin,
  Tooltip,
  Button,
  Input,
} from "antd";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";
import "antd/dist/antd.css";

const statusColors = {
  pending: "orange",
  confirmed: "blue",
  completed: "green",
  cancelled: "red",
};

const paymentColors = {
  pending: "orange",
  paid: "green",
  refunded: "blue",
};

const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const AdminRentalBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState("");
  const [search, setSearch] = useState("");

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/rentals/admin/all-bookings");
      setBookings(res.data);
    } catch (err) {
      message.error("Failed to fetch bookings");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusChange = async (bookingId, newStatus) => {
    setUpdating(bookingId);
    try {
      await api.put(`/api/rentals/bookings/${bookingId}/status`, {
        status: newStatus,
      });
      message.success("Status updated");
      fetchBookings();
    } catch (err) {
      message.error("Failed to update status");
    }
    setUpdating("");
  };

  const filteredBookings = bookings.filter(
    (b) =>
      b.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      b.rental?.title?.toLowerCase().includes(search.toLowerCase()) ||
      b.status?.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      title: "User",
      dataIndex: ["user", "name"],
      key: "user",
      render: (text, record) => (
        <Tooltip title={record.user?.email}>{text}</Tooltip>
      ),
      sorter: (a, b) => (a.user?.name || "").localeCompare(b.user?.name || ""),
    },
    {
      title: "Rental",
      dataIndex: ["rental", "title"],
      key: "rental",
      render: (text, record) => (
        <Tooltip title={record.rental?.id}>{text}</Tooltip>
      ),
      sorter: (a, b) =>
        (a.rental?.title || "").localeCompare(b.rental?.title || ""),
    },
    {
      title: "Type",
      dataIndex: "bookingType",
      key: "type",
      render: (type) => <Tag color='geekblue'>{type}</Tag>,
      filters: [
        { text: "Hourly", value: "hourly" },
        { text: "Daily", value: "daily" },
      ],
      onFilter: (value, record) => record.bookingType === value,
    },
    {
      title: "Start",
      dataIndex: "startDate",
      key: "start",
      render: (date) => new Date(date).toLocaleString(),
      sorter: (a, b) => new Date(a.startDate) - new Date(b.startDate),
    },
    {
      title: "End",
      dataIndex: "endDate",
      key: "end",
      render: (date) => new Date(date).toLocaleString(),
      sorter: (a, b) => new Date(a.endDate) - new Date(b.endDate),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status, record) => (
        <Select
          value={status}
          style={{ width: 120 }}
          onChange={(val) => handleStatusChange(record.id, val)}
          disabled={
            updating === record.id ||
            status === "completed" ||
            status === "cancelled"
          }
        >
          {statusOptions
            .filter((opt) => opt.value !== status)
            .map((opt) => (
              <Select.Option key={opt.value} value={opt.value}>
                {opt.label}
              </Select.Option>
            ))}
        </Select>
      ),
      filters: statusOptions.map((opt) => ({
        text: opt.label,
        value: opt.value,
      })),
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Payment",
      dataIndex: "paymentStatus",
      key: "payment",
      render: (status) => (
        <Tag color={paymentColors[status] || "default"}>{status}</Tag>
      ),
      filters: [
        { text: "Pending", value: "pending" },
        { text: "Paid", value: "paid" },
        { text: "Refunded", value: "refunded" },
      ],
      onFilter: (value, record) => record.paymentStatus === value,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (updating === record.id ? <Spin /> : null),
    },
  ];

  return (
    <div
      style={{
        padding: 32,
        background: "#fff",
        borderRadius: 16,
        boxShadow: "0 8px 32px rgba(44,83,100,0.18)",
        maxWidth: 1400,
        margin: "40px auto",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <h2
          style={{ fontWeight: 700, fontSize: 32, color: "#2c5364", margin: 0 }}
        >
          All Rental Bookings
        </h2>
        <div style={{ display: "flex", gap: 12 }}>
          <Input
            placeholder='Search by user, rental, or status'
            prefix={<SearchOutlined />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 260, borderRadius: 8 }}
            allowClear
          />
          <Button icon={<ReloadOutlined />} onClick={fetchBookings} />
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={filteredBookings}
        rowKey='id'
        loading={loading}
        bordered
        pagination={{ pageSize: 10 }}
        style={{ background: "#fff" }}
        size='middle'
      />
    </div>
  );
};

export default AdminRentalBookingsPage;
