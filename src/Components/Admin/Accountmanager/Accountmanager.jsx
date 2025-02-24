import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import api from '../../utils/requestAPI';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import useAuth from '../../../hooks/useAuth';

const Accountmanager = () => {
  
  const [account, setaccount] = useState([]);
  const DEFAULT_IMAGE = "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg";
  const { auth, setAuth } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
  const handleLogout = () => {
    setAuth({ user: null });
    localStorage.clear();
    navigate("/"); // Chuyển hướng về trang đăng nhập
  };
  useEffect(() => {
    const fetchStudio = async () => {
      const url = `/api/Account/Get-All`; 
      try {
        const response = await api.get(url);
      
        console.log('API data:', response.data);

        const extractedStudio = Array.isArray(response.data) ? response.data : response.data?.$values || [];
        setaccount(extractedStudio);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchStudio();
  }, []); 
  const exportToExcel = () => {
    const data = account.map((item) => ({
      ID: item.id,
      Name: item.userName,
      Email: item.email,
      Address: item.address || "N/A",
      Phone: item.phone || "N/A"
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Accounts");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(dataBlob, "AccountData.xlsx");
  };
  
  const data = [
    {
      id: 1,
      hinh: "public/ec46334718d4ee1a37ca49cd652a194d.jpg",
      customerName: 'Customer1 Studio Owner',
      checkIn: '12 Mar 2021',
      type: 'Small',
      time: '16h-18h',
      price: '$100',
      status: 'Success'
    },
    {
      id: 2,
      hinh: "public/ec46334718d4ee1a37ca49cd652a194d.jpg",
      customerName: 'Customer2 Studio Owner',
      checkIn: '12 Mar 2021',
      type: 'Small',
      time: '18h-20h',
      price: '$100',
      status: 'Success'
    },
  ];

  const totalRevenue = data.reduce((total, item) => {
    const price = parseFloat(item.price.replace('$', ''));
    return total + price;
  }, 0);

  return (
    <div>
      
       <h1 className='admin-title'>Quản Lý Tài Khoản</h1>
      <div className="tabs">
              <Link to="/adminmanager" className={location.pathname === '/adminmanager' ? 'active-tab' : ''}>Studios</Link>
              <Link to="/accountmana" className={location.pathname === '/accountmana' ? 'active-tab' : ''}> Quản lý tài khoản</Link>
              <Link to="/checkstu" className={location.pathname === '/checkstu' ? 'active-tab' : ''}>Duyệt studio</Link>
              <button 
                        className="export-btnn" 
                        onClick={exportToExcel}
                        aria-label="Xuất File Excel"
                      >
                        <img 
                          src="https://cdn-icons-png.flaticon.com/512/732/732220.png" 
                          alt="Excel Icon"
                        />
                      </button>
              <button className="logout-btn" onClick={handleLogout} >Đăng Xuất</button>
              
            </div>
      <table className="custom-table">
        <thead>
          <tr className="table-header">
            <th>ID</th>
            <th>Ảnh</th>
            <th>Tên</th>
            <th>Email</th>
            <th>Địa chỉ</th>
            <th>Số điện thoại</th>
          </tr>
        </thead>
        <tbody>
          {account.map((item) => (
            <tr key={item.id} className="table-row">
              <td>{item.id}</td>
              <td className='anhchuamana'><div className='chuamana'>
                
                
              <td><img src={item.imageUrl || DEFAULT_IMAGE} className='anhmana' alt="Profile" /></td>
                </div></td>
              <td>{item.userName}</td>
              <td>{item.email}</td>
              <td>{item.address}</td>
              <td>{item.phone}</td>
            </tr>
          ))}
        </tbody>
      </table>

     
    </div>
  );
}

export default Accountmanager;