import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { toast } from "react-toastify";
import api from "../../utils/requestAPI"; // Ensure you have the API utility ready

const OrderHistory = ({ accountId }) => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const response = await api.get(
        `https://cldhbe.azurewebsites.net/Get-All-Payment?accountId=${accountId}`
      );
      const data = response.data || [];
      setPayments(data.$values || []);
    } catch (error) {
      toast.error("Error fetching payment data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [accountId]);

  return (
    <Box sx={{ padding: "20px" }}>
      {loading ? (
        <p>Loading...</p>
      ) : payments.length > 0 ? (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="payment history table">
            <TableHead>
              <TableRow>
                <TableCell>Payment ID</TableCell>
                <TableCell align="left">Customer Name</TableCell>
                <TableCell align="center">Date</TableCell>
                <TableCell align="right">Total Amount</TableCell>
                <TableCell align="center">Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {payments.map((payment, index) => (
                <TableRow key={payment.id || index}>
                  <TableCell component="th" scope="row">
                    {payment.id || `PAY${index + 101}`}
                  </TableCell>
                  <TableCell align="left">{payment.customerName || "N/A"}</TableCell>
                  <TableCell align="center">{payment.date || "N/A"}</TableCell>
                  <TableCell align="right">
                    {`$${payment.totalAmount?.toFixed(2) || "0.00"}`}
                  </TableCell>
                  <TableCell align="center">{payment.status || "N/A"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <p>No payments found.</p>
      )}
    </Box>
  );
};

export default OrderHistory;