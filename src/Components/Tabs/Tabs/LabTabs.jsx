import * as React from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { useState, useEffect, useCallback } from "react";
import useAuth from "../../../hooks/useAuth";
import api from "../../utils/requestAPI";
import { toast } from "react-toastify";
import OrderCard from "../../Items/Card/OrderCard";
import OrderHistory from "../../Items/Table/OrderHistory"

export default function LabTabs() {
  const [value, setValue] = useState("1");
  const [orderSuccess, setOrderSuccess] = useState([]);
  const [loading, setLoading] = useState(false);

  const { auth } = useAuth();
  const accountid = auth.user.id;

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get(
        `/Get-All-Order-Success-By-AccounId?accountId=${accountid}`
      );
      const extractedStudio = Array.isArray(response.data) ? response.data : response.data?.$values || [];
      console.log(extractedStudio);
      setOrderSuccess(extractedStudio);
    } catch (error) {
      toast.error("Error fetching orders data: " + error.message);
    } finally {
      setLoading(false);
    }
  }, [accountid]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList
            textColor="secondary"
            indicatorColor="secondary"
            onChange={handleChange}
            aria-label="lab API tabs example"
          >
            <Tab label="Lịch Sử" value="1" />
            <Tab label="Đơn Hàng" value="2" />
          </TabList>
        </Box>
        <TabPanel value="1">
        <OrderHistory/>
        </TabPanel>

        <TabPanel value="2">
          {loading ? (
            <p>Loading...</p>
          ) : orderSuccess.length > 0 ? (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: "20px",
              }}
            >
              {orderSuccess.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </Box>
          ) : (
            <p>No orders found.</p>
          )}
        </TabPanel>
      </TabContext>
    </Box>
  );
}
