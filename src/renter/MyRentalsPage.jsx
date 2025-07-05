import React, { useEffect, useState } from "react";
import api from "../api";
import { Table, Tag, message } from "antd";
import { Link } from "react-router-dom";

const MyRentalsPage = ({ user }) => {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRentals = async () => {
      setLoading(true);
      try {
        let res;
        if (user.role === "admin") {
          res = await api.get("/api/rentals"); // all rentals for admin
        } else {
          res = await api.get("/api/rentals/my"); // only my rentals for renter
        }
        setRentals(res.data);
      } catch (err) {
        message.error("Failed to fetch rentals");
      }
      setLoading(false);
    };
    fetchRentals();
  }, [user]);

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text, record) => (
        <Link to={`/renter/my-rentals/${record.id || record._id}`}>{text}</Link>
      ),
    },
    {
      title: "Type",
      dataIndex: "rentalType",
      key: "rentalType",
      render: (t) => <Tag>{t}</Tag>,
    },
    { title: "Location", dataIndex: "location", key: "location" },
    {
      title: "Price",
      dataIndex: ["pricing", "dailyRate"],
      key: "price",
      render: (v, r) =>
        r.pricing?.dailyRate ? `₹${r.pricing.dailyRate}/day` : "-",
    },
    {
      title: "Status",
      dataIndex: "isListed",
      key: "isListed",
      render: (v) =>
        v ? <Tag color='green'>Listed</Tag> : <Tag color='red'>Unlisted</Tag>,
    },
  ];

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 4px 24px rgba(44,83,100,0.10)",
        padding: 32,
        maxWidth: 1200,
        margin: "32px auto",
      }}
    >
      <h2
        style={{
          fontWeight: 700,
          fontSize: 28,
          marginBottom: 24,
          color: "#2c5364",
        }}
      >
        {user.role === "admin" ? "All Rentals" : "My Rentals"}
      </h2>
      <Table
        columns={columns}
        dataSource={rentals}
        rowKey='id'
        loading={loading}
        bordered
        pagination={{ pageSize: 10 }}
        style={{ background: "#fff" }}
      />
    </div>
  );
};

export default MyRentalsPage;
