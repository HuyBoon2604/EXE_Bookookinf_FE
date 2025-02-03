import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  colors,
} from "@mui/material";

const OrderCard = ({ order }) => {
  // Kiểm tra studio từ order
  const studio = order.booking?.studio || {};

  return (
    <Card key={order.id} sx={{ margin: "16px", padding: "16px" }}>
      {/* Header */}
      <CardHeader
        title={`Order ID: ${order.id}`}
        subheader={`Order Date: ${new Date(order.orderDate).toLocaleString()}`}
      />

      {/* Content */}
      <CardContent>
        {/* Hình Ảnh */}
        <img
          src={studio.imageStudio}
          alt={`Studio of order ${order.id}`}
          style={{
            width: "100%",
            height: "auto",
            borderRadius: "8px",
            marginBottom: "16px",
          }}
        />

        {/* Booking ID */}
        <Typography variant="body2" color="textSecondary" component="p">
          <strong>Booking ID:</strong> {order.bookingId || "N/A"}
        </Typography>

        {/* Pricing */}
        <Typography variant="body2" color="textSecondary" component="p">
          <strong>Pricing:</strong>{" "}
          {studio.pricing ? `${studio.pricing} VND` : "N/A"}
        </Typography>

        {/* Studio Name */}
        <Typography variant="body2" color="textSecondary" component="p">
          <strong>Studio Name:</strong> {studio.studioName || "N/A"}
        </Typography>

        {/* Studio Address */}
        <Typography variant="body2" color="textSecondary" component="p">
          <strong>Studio Address:</strong> {studio.studioAddress || "N/A"}
        </Typography>

        {/* Description */}
        <Typography variant="body2" color="textSecondary" component="p">
          <strong>Description:</strong> {order.description || "N/A"}
        </Typography>

        {/* Capacity */}
        <Typography variant="body2" color="textSecondary" component="p">
          <strong>Capacity:</strong> {studio.capacity || "N/A"}
        </Typography>

        {/* Studio Size */}
        <Typography variant="body2" color="textSecondary" component="p">
          <strong>Studio Size:</strong> {studio.studioSize || "N/A"}
        </Typography>

        {/* Status */}
        <Typography variant="body2" color="textSecondary" component="p">
          <strong>Status:</strong>{" "}
          <span style={{ color: order.status ? "green" : "red" }}>
            {order.status ? "Success" : "N/A"}
          </span>
        </Typography>
      </CardContent>
    </Card>
  );
};

export default OrderCard;