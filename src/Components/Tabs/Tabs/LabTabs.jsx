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
  const [Capa, Setcapa] = useState([]);
  const [loading, setLoading] = useState(false);

  const { auth } = useAuth();
  const accountid = auth.user.id;

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
        const response = await api.get(`/Get-All-Order-Success-By-AccounId?accountId=${accountid}`);
        const extractedOrders = Array.isArray(response.data) ? response.data : response.data?.$values || [];
        console.log("Orders:", extractedOrders);
        setOrderSuccess(extractedOrders);
    } catch (error) {
        toast.error("Error fetching orders data: " + error.message);
    } finally {
        setLoading(false);
    }
}, [accountid]);

const fetchCapacities = useCallback(async (studioIds) => {
  setLoading(true);
  try {
    const capacityPromises = studioIds.map(async (studioId) => {
      const response = await api.get(`/Get-Capacity-By-StudioId?StudioId=${studioId}`);
    
     
      
      return { studioId, capacity: response.data };
    });

    const capacities = await Promise.all(capacityPromises);
    const capacitiesMap = capacities.reduce((acc, { studioId, capacity }) => {
      acc[studioId] = capacity;
      return acc;
    }, {});

    console.log("Capacities Map:", capacitiesMap);
    Setcapa(capacitiesMap);
  } catch (error) {
    toast.error("Error fetching capacities: " + error.message);
  } finally {
    setLoading(false);
  }
}, []);

useEffect(() => {
  const fetchAllData = async () => {
    await fetchOrders();
  };
  fetchAllData();
}, [fetchOrders]);

useEffect(() => {
  if (orderSuccess.length > 0) {
    const studioIds = orderSuccess
      .map(order => order.booking?.studio?.id || order.studioId)
      .filter((id, index, arr) => id && arr.indexOf(id) === index);
    fetchCapacities(studioIds);
  }
}, [orderSuccess, fetchCapacities]);


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
            {/* <Tab label="Lịch Sử" value="1" /> */}
            <Tab label="Lịch sử đơn Hàng" value="1" />
          </TabList>
        </Box>
        {/* <TabPanel value="1">
        <OrderHistory/>
        </TabPanel>
 */}
        <TabPanel value="1">
          {loading ? (
            <p>Đang tải...</p>
          ) : orderSuccess.length > 0 ? (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: "20px",
              }}
            >
            {orderSuccess.map((order) => {
    const studioId = order.booking?.studio?.id || order.studioId;
    const capacity = Capa?.[studioId] || [];
    console.log("Capacity for studio", studioId, ":", capacity);
   
    return (
      <OrderCard key={order.id} order={order}  capacity={capacity}  />
    );
})}

            </Box>
          ) : (
            <p>Bạn chưa có đơn hàng nào.</p>
          )}
        </TabPanel>
      </TabContext>
    </Box>
  );
}
