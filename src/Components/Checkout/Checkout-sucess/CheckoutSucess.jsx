import React, { useEffect, useState } from "react";
import "./CheckoutSucess.css";
import { useNavigate,useLocation } from "react-router-dom";
import api from "../../utils/requestAPI";

const CheckoutSucess = () => {
  const navigate = useNavigate();
  const location = useLocation();
 

  const getQueryparams = () => {
    const query = new URLSearchParams(location.search);
    // const status1 = query.get("status");
    const trancode = query.get("orderCode");
    return { trancode  };
  };

  // const [status1, setStatus1] = useState(null);
  const [trancode, settrancode] = useState(null);

  useEffect(() => {
    // const { status1 } = getQueryparams();
    const {trancode} = getQueryparams();
    settrancode(trancode)
    // setStatus1(status1);

    if (trancode) {
      const fetchCancel = async () => {
       
        const url = `/create-payment-link/update-status-2?odercode=${trancode}`;
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

  const Back = () => {
    navigate("/Home");
  };

  return (
    <div id="checksuccess" className="success-container">
      <div className="success-box">
            <div className="check-icon">
              <span>✔️</span>
            </div>
            <h2>Bạn Đã Thanh</h2>
            <h2>Toán Thành Công</h2>
            <div className="transaction-info">
              {/* <p><strong>Transaction ID:</strong> {trancode}</p> */}
              {/* <p><strong>Transaction Time:</strong> {transactionTime}</p> */}
            </div>
            {/* Back to Home Button */}
            <button className="back-to-home-btn" onClick={Back}>
              Quay Lại Trang Chủ
            </button>
      </div>
    </div>
  );
};

export default CheckoutSucess;
