import React, { useEffect, useState } from "react";
import { Button, Typography, Space, Card, Steps, Tag, message } from "antd";
import { CheckCircleFilled, HomeOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../utils/requestAPI";

const { Title, Paragraph, Text } = Typography;

const CheckoutSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Hàm lấy params từ URL
  const getQueryParams = () => {
    const query = new URLSearchParams(location.search);
    const status1 = query.get("status");
    const amount = query.get("amount");
    const trancode = query.get("orderCode");
    return { status1,trancode, amount };
  };

  // State lưu giá trị từ query params
  const [status, setStatus] = useState(null);
  const [trancode, setTrancode] = useState(null);
  const [amount, setAmount] = useState(null);

  useEffect(() => {
    const { status, trancode, amount } = getQueryParams();

    setStatus(status);
    setTrancode(trancode);
    setAmount(amount);

    if (trancode && status) {
      const updatePaymentStatus = async () => {
        const url = `/create-payment-link/update-status-2?odercode=${trancode}`;
        console.log("URL being called:", url);

        try {
          const response = await api.get(url);
          console.log("Status updated successfully:", response.data);
          message.success("Cập nhật thanh toán thành công");
        } catch (error) {
          console.error("Error updating payment status:", error);
          message.error("Lỗi khi cập nhật thanh toán");
        }
      };

      updatePaymentStatus();
    }
  }, [location.search]);

  // Nếu chưa có dữ liệu, hiển thị loading
  // if (!trancode || !status || !amount) {
  //   return (
  //     <div style={{ textAlign: "center", padding: "20px" }}>
  //       <p>Đang tải dữ liệu...</p>
  //     </div>
  //   );
  // }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
  };

  // if (!paymentData) return null;

  return (
    <div
      style={{
        minHeight: "50vh",
        background: "linear-gradient(135deg, #6a0dad 0%, #b266ff 100%)",
        padding: "40px 20px",
        width: "100%",
      }}
    >
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        {/* <Steps current={3} items={[{ title: "Chọn gói" }, { title: "Thanh toán" }, { title: "Xác nhận" }]} style={{ marginBottom: "40px" }} /> */}

        <Card style={{ borderRadius: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.1)", border: "none" }}>
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background: "#f6ffed",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "16px",
              }}
            >
              <CheckCircleFilled style={{ fontSize: "40px", color: "#52c41a" }} />
            </div>
            <Title level={2} style={{ color: "#006e61", margin: 0 }}>Thanh toán thành công!</Title>
          </div>

          <Card style={{ background: "#f8fffe", marginBottom: "24px", borderRadius: "12px" }}>
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Text>Mã đơn hàng:</Text>
                <Text strong>{trancode}</Text>
                {/* <Text strong>1234567890</Text> */}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Text>Trạng thái:</Text>
                <Tag color="success">Đã thanh toán</Tag>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Text>Số tiền:</Text>
                <Text strong style={{ color: "#00c0b5", fontSize: "18px" }}>{formatCurrency(amount)}</Text>
                {/* <Text strong style={{ color: "#00c0b5", fontSize: "18px" }}>1000000</Text> */}
              </div>
            </Space>
          </Card>

          {/* <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <Title level={4} style={{ color: "#006e61", marginBottom: "16px" }}>Tài khoản của bạn đã được nâng cấp!</Title>
            <Paragraph style={{ color: "#666" }}>Bạn có thể bắt đầu sử dụng các tính năng Premium ngay bây giờ.</Paragraph>
          </div> */}

          <Space size="middle" style={{ width: "100%", justifyContent: "center" }}>
            <Button type="primary" icon={<HomeOutlined />} onClick={() => navigate("/Home")} style={{ height: "44px", padding: "0 24px", fontSize: "16px", borderRadius: "8px", backgroundColor: "#00c0b5", borderColor: "#00c0b5" }}>
              Về trang chủ
            </Button>
          </Space>
        </Card>
      </div>
    </div>
  );
};

export default CheckoutSuccess;