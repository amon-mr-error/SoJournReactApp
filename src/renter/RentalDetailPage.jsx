import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import {
  Descriptions,
  Tag,
  Spin,
  message,
  Card,
  Image,
  Row,
  Col,
  Divider,
  Typography,
} from "antd";
const { Title, Text } = Typography;

const RentalDetailPage = () => {
  const { id } = useParams();
  const [rental, setRental] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRental = async () => {
      setLoading(true);
      try {
        // Try /api/rentals/:id first
        let res = await api.get(`/api/rentals/${id}`);
        if (!res.data || res.data.message === "Rental not found") {
          // Try /api/rentals/renter/rentals and find by id
          const allMine = await api.get("/api/rentals/renter/rentals");
          const found = allMine.data.find((r) => r.id === id || r._id === id);
          setRental(found || null);
        } else {
          setRental(res.data);
        }
      } catch (err) {
        message.error("Failed to fetch rental details");
        setRental(null);
      }
      setLoading(false);
    };
    fetchRental();
  }, [id]);

  if (loading)
    return <Spin style={{ display: "block", margin: "80px auto" }} />;
  if (!rental) return <div>No rental found.</div>;

  return (
    <Card
      style={{
        maxWidth: 900,
        margin: "40px auto",
        borderRadius: 18,
        boxShadow: "0 8px 32px rgba(44,83,100,0.13)",
        background: "#fff",
        padding: 0,
      }}
      bodyStyle={{ padding: 0 }}
    >
      <Row gutter={[0, 0]} style={{ minHeight: 320 }}>
        <Col
          xs={24}
          md={10}
          style={{
            background: "#f7fafc",
            borderTopLeftRadius: 18,
            borderBottomLeftRadius: 18,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 32,
          }}
        >
          {rental.imageUrl ? (
            <Image
              src={rental.imageUrl}
              alt={rental.title}
              style={{
                borderRadius: 12,
                maxHeight: 400,
                maxWidth: "100%",
                width: "100%",
                height: "auto",
                objectFit: "cover",
                boxShadow: "0 4px 24px rgba(44,83,100,0.10)",
              }}
              preview={false}
            />
          ) : (
            <div
              style={{
                width: 260,
                height: 180,
                background: "#e0e0e0",
                borderRadius: 12,
              }}
            />
          )}
        </Col>
        <Col xs={24} md={14} style={{ padding: 32 }}>
          <Title
            level={2}
            style={{
              color: "#2c5364",
              fontWeight: 700,
              marginBottom: 8,
            }}
          >
            {rental.title}
          </Title>
          <Text type='secondary' style={{ fontSize: 16 }}>
            {rental.category?.name} • {rental.rentalType}
          </Text>
          <Divider style={{ margin: "16px 0" }} />
          <Descriptions
            column={1}
            size='middle'
            bordered={false}
            labelStyle={{
              fontWeight: 600,
              color: "#2c5364",
            }}
          >
            <Descriptions.Item label='Location'>
              {rental.location}
            </Descriptions.Item>
            <Descriptions.Item label='Description'>
              {rental.description}
            </Descriptions.Item>
            <Descriptions.Item label='Features'>
              {rental.features?.join(", ")}
            </Descriptions.Item>
            <Descriptions.Item label='Price'>
              ₹{rental.pricing?.dailyRate}/day, ₹{rental.pricing?.hourlyRate}/hr
            </Descriptions.Item>
            <Descriptions.Item label='Seats'>{rental.seats}</Descriptions.Item>
            <Descriptions.Item label='Color'>{rental.color}</Descriptions.Item>
            <Descriptions.Item label='Year'>{rental.year}</Descriptions.Item>
            <Descriptions.Item label='Make/Model'>
              {rental.make} / {rental.model}
            </Descriptions.Item>
            <Descriptions.Item label='Transmission'>
              {rental.transmission}
            </Descriptions.Item>
            <Descriptions.Item label='Fuel Type'>
              {rental.fuelType}
            </Descriptions.Item>
            <Descriptions.Item label='Mileage'>
              {rental.mileage} km
            </Descriptions.Item>
            <Descriptions.Item label='License Plate'>
              {rental.licensePlate}
            </Descriptions.Item>
            <Descriptions.Item label='Insurance'>
              {rental.insurance?.provider} (Policy:{" "}
              {rental.insurance?.policyNumber})
            </Descriptions.Item>
            <Descriptions.Item label='Status'>
              {rental.isListed ? (
                <Tag color='green'>Listed</Tag>
              ) : (
                <Tag color='red'>Unlisted</Tag>
              )}
            </Descriptions.Item>
            <Descriptions.Item label='Average Rating'>
              {rental.averageRating ? rental.averageRating.toFixed(2) : "-"}
            </Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>
    </Card>
  );
};

export default RentalDetailPage;
