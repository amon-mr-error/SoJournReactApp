import React from "react";
import { Card, Descriptions, Tag, Avatar } from "antd";
import {
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import "antd/dist/reset.css";

const RenterDashboard = ({ user }) => {
  if (!user) return null;
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f2027 0%, #2c5364 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Card
        style={{
          maxWidth: 500,
          margin: "40px auto",
          borderRadius: 16,
          boxShadow: "0 4px 24px rgba(44,83,100,0.10)",
          background: "#fff",
          padding: "2rem",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <Avatar
            size={72}
            icon={<UserOutlined />}
            style={{ background: "#2c5364", marginBottom: 12 }}
          />
          <h2
            style={{
              color: "#2c5364",
              fontWeight: 700,
              marginBottom: 0,
              textAlign: "center",
            }}
          >
            {user.name}
          </h2>
          <Tag color='blue' style={{ marginTop: 8 }}>
            {user.role}
          </Tag>
        </div>
        <Descriptions bordered column={1} size='middle'>
          <Descriptions.Item
            label={
              <span>
                <PhoneOutlined /> Mobile
              </span>
            }
          >
            {user.mobile}
          </Descriptions.Item>
          {user.email && (
            <Descriptions.Item
              label={
                <span>
                  <MailOutlined /> Email
                </span>
              }
            >
              {user.email}
            </Descriptions.Item>
          )}
          {user.address && (
            <Descriptions.Item
              label={
                <span>
                  <HomeOutlined /> Address
                </span>
              }
            >
              {user.address}
            </Descriptions.Item>
          )}
        </Descriptions>
      </Card>
    </div>
  );
};

export default RenterDashboard;
