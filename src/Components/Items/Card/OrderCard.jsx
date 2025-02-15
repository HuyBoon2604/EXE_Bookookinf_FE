import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  colors,
} from "@mui/material";

const OrderCard = ({ order, capacity }) => {
  
  const studio = order.booking?.studio || {};
  // console.log("Received capacity:", capacity);
  // console.log("Received capacity:", capacity.quantity);
  return (
    <Card key={order.id} sx={{ margin: "16px", padding: "16px" }}>
      {/* Header */}
      <CardHeader
        title={`Mã Đặt Hàng: ${order.id}`}
        subheader={`Ngày Đặt: ${new Date(order.orderDate).toLocaleString()}`}
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
          {/* <strong>Booking ID:</strong> {order.bookingId || "N/A"} */}
        </Typography>

        {/* Pricing */}
        <Typography variant="body2" color="textSecondary" component="p">
          <strong>Giá:</strong>{" "}
          {studio.pricing ? `${studio.pricing} VND` : "N/A"}
        </Typography>

        {/* Studio Name */}
        <Typography variant="body2" color="textSecondary" component="p">
          <strong>Tên studio:</strong> {studio.studioName || "N/A"}
        </Typography>

        {/* Studio Address */}
        <Typography variant="body2" color="textSecondary" component="p">
          <strong>Địa chỉ studio:</strong> {studio.studioAddress || "N/A"}
        </Typography>

        {/* Description */}
        <Typography variant="body2" color="textSecondary" component="p">
          <strong>Mô tả Studio:</strong> {order.description || "N/A"}
        </Typography>

        {/* Capacity */}
        <Typography variant="body2" color="textSecondary" component="p">
  <strong>Sức chứa:</strong>
  {capacity.quantity}
</Typography>


        {/* Studio Size */}
        <Typography variant="body2" color="textSecondary" component="p">
          <strong>Kích thước studio:</strong> {capacity.size?.sizeDescription || "N/A"}
        </Typography>

        {/* Status */}
        <Typography variant="body2" color="textSecondary" component="p">
          <strong>Trạng thái:</strong>{" "}
          <span style={{ color: order.status ? "green" : "red" }}>
            {order.status ? "Thành công" : "N/A"}
          </span>
        </Typography>
      </CardContent>
    </Card>
  );
};

export default OrderCard;