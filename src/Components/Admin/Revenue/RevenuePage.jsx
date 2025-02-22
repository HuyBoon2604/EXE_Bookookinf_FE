import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./RevenuePage.css";
import api from "../../utils/requestAPI";
import * as XLSX from "xlsx";

const RevenuePage = () => {
  const { id } = useParams();
  const [studio, setStudio] = useState([]);
  const [users, setUsers] = useState({});

  useEffect(() => {
    const fetchStudio = async () => {
      try {
        const response = await api.get(`/Get-All-Order-Success-By-StudioId?studioId=${id}`);
        console.log("API data:", response.data);
        const extractedStudio = Array.isArray(response.data) ? response.data : response.data?.$values || [];
        setStudio(extractedStudio);
      } catch (error) {
        console.error("Error fetching studio data:", error);
      }
    };

    fetchStudio();
  }, [id]);

  useEffect(() => {
    const fetchUsers = async () => {
      const uniqueAccountIds = [...new Set(studio.map(item => item.booking?.accountId).filter(Boolean))];

      const userRequests = uniqueAccountIds.map(async (accountId) => {
        try {
          const response = await api.get(`/api/Account/get-by-id?accountId=${accountId}`);
          console.log("API data:", response.data);
          return { accountId, userData: response.data };
        } catch (error) {
          console.error(`Error fetching user ${accountId}:`, error);
          return null;
        }
      });

      const userData = await Promise.all(userRequests);
      const userMap = userData.reduce((acc, item) => {
        if (item) acc[item.accountId] = item.userData;
        return acc;
      }, {});

      setUsers(userMap);
    };

    if (studio.length > 0) {
      fetchUsers();
    }
  }, [studio]);

  const totalRevenue = studio.reduce((total, item) => {
    const priceValue = item.booking?.totalPrice;
    const price = typeof priceValue === "string"
      ? parseFloat(priceValue.replace(/[^0-9.]/g, ""))
      : typeof priceValue === "number"
      ? priceValue
      : 0;

    return total + (isNaN(price) ? 0 : price);
  }, 0);

  // 🟢 Hàm xuất Excel
  const exportToExcel = () => {
    const data = studio.map((item) => ({
      ID: item.id,
      "Customer Name": users[item.booking?.accountId]?.userName || "N/A",
      "Account Email": users[item.booking?.accountId]?.email || "N/A",
      Date: new Date(item.orderDate).toLocaleDateString(),
      Price: item.booking?.totalPrice,
      Status: item.status ? "Success" : "Failed",
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Revenue Data");
    XLSX.writeFile(workbook, "RevenueReport.xlsx");
  };
  const formattedPrice = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
      .format(totalRevenue)
      .replace('₫', 'VND')
      .trim();
  return (
    <div>
      <button className="export-btn" onClick={exportToExcel}>
      Xuất File Excel
      </button>

      <table className="custom-table">
        <thead>
          <tr className="table-header">
            <th>ID</th>
            <th>Tên khách hàng</th>
            <th>Tài Khoản Email</th>
            <th>Ngày đặt</th>
            <th>Giá </th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {studio.map((item) => (
            <tr key={item.id} className="table-row">
              <td>{item.id}</td>
              <td>{users[item.booking?.accountId]?.userName || "N/A"}</td>
              <td>{users[item.booking?.accountId]?.email || "N/A"}</td>
              <td>{new Date(item.orderDate).toLocaleDateString()}</td>
              <td>
  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
    .format(item.booking?.totalPrice || 0)
    .replace("₫", " VND")}
</td>
              <td className="status-vui">
                <div className="status-reven">
                  {item.status ? "Thành công" : "Thất bại"}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="total-revenue">
        <strong>Total Revenue: {formattedPrice} </strong>
      </div>
    </div>
  );
};

export default RevenuePage;
