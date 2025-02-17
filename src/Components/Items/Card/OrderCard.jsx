import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  colors,
  CardActions,
  Button,
  Box,
  Rating,
} from "@mui/material";

const OrderCard = ({ order, capacity, onReviewClick }) => {
  
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
  <strong>Sức chứa: </strong>
  {capacity.quantity} Người
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

        {/* Add Review Display */}
        {order.review && (
          <Box sx={{ mt: 2, borderTop: '1px solid #e0e0e0', pt: 2 }}>
            <Typography variant="body2" color="textSecondary" component="p">
              <strong>Đánh giá của bạn:</strong>
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, my: 1 }}>
              <Rating value={order.review.rating} readOnly size="small" />
              <Typography variant="body2" color="textSecondary">
                ({order.review.rating}/5)
              </Typography>
            </Box>
            {order.review.comment && (
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                "{order.review.comment}"
              </Typography>
            )}
          </Box>
        )}
      </CardContent>
      <CardActions>
        <Button 
          variant="contained" 
          onClick={onReviewClick}
          sx={{ 
            mt: 1,
            bgcolor: '#5e35b1',
            '&:hover': {
              bgcolor: '#4527a0',
            },
            textTransform: 'none',
            fontWeight: 500,
            px: 3,
            py: 1,
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(94, 53, 177, 0.25)',
            '&:active': {
              transform: 'scale(0.98)'
            }
          }}
        >
          {order.review ? 'Chỉnh sửa đánh giá' : 'Đánh giá'}
        </Button>
      </CardActions>
    </Card>
  );
};

export default OrderCard;