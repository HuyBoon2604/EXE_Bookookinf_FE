import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import api from "../../utils/requestAPI";
import { Button, Typography, Space, Card, Tag } from "antd";
import { CloseCircleFilled, HomeOutlined } from "@ant-design/icons";
import "./CheckoutError.css";
const { Title, Text } = Typography;

const CheckoutError = () => {
  const navigate = useNavigate();
  const location = useLocation();
 

  const getQueryparams = () => {
    const query = new URLSearchParams(location.search);
    const status1 = query.get("status");
    const amount = query.get("amount");
    const trancode = query.get("orderCode");
    return { status1,trancode, amount };
  };

  const [status1, setStatus1] = useState(null);
  const [trancode, settrancode] = useState(null);
  const [amount, setAmount] = useState(null);

  useEffect(() => {
    const { status1 } = getQueryparams();
    const {trancode} = getQueryparams();
    const {amount} = getQueryparams();
    settrancode(trancode)
    setStatus1(status1);
    setAmount(amount);
    if (trancode && status1 && amount) {
      const fetchCancel = async () => {
       
        const url = `/create-payment-link/update-status?odercode=${trancode}&status=${status1}`;
        console.log('URL being called:', url);

        try {
         
          const response = await api.get(url);
          console.log("Status updated successfully:", response.data);
        } catch (error) {
          console.error("Error updating payment status:", error);
        }
      };

      fetchCancel();
    }
  }, [ location.search]);

  const handleRetry = () => {
    navigate("/Home");
  };

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
        <Card style={{ borderRadius: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.1)", border: "none" }}>
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background: "#fff1f0",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "16px",
              }}
            >
              <CloseCircleFilled style={{ fontSize: "40px", color: "#ff4d4f" }} />
            </div>
            <Title level={2} style={{ color: "#8b0000", margin: 0 }}>Thanh toán thất bại!</Title>
          </div>

          <Card style={{ background: "#fff5f5", marginBottom: "24px", borderRadius: "12px" }}>
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Text>Mã đơn hàng:</Text>
                <Text strong>{trancode}</Text>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Text>Trạng thái:</Text>
                <Tag color="error">Thất bại</Tag>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Text>Số tiền:</Text>
                <Text strong>{amount}</Text>
                {/* <Text strong style={{ color: "#ff4d4f", fontSize: "18px" }}>1000000</Text> */}
              </div>
            </Space>
          </Card>

          <Space size="middle" style={{ width: "100%", justifyContent: "center" }}>
            <Button 
              type="primary" 
              icon={<HomeOutlined />} 
              onClick={() => navigate("/Home")} 
              style={{
                height: "44px", 
                padding: "0 24px", 
                fontSize: "16px", 
                borderRadius: "8px", 
                backgroundColor: "#ff4d4f", 
                borderColor: "#ff4d4f"
              }}
            >
              Về trang chủ
            </Button>
          </Space>
        </Card>
      </div>
    </div>
  );
};

export default CheckoutError;