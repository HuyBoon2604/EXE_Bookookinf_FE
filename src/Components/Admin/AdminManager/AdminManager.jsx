import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../../utils/requestAPI';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import './AdminManager.css';

const AdminManager = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [Studio, Setstudio] = useState([]);

  useEffect(() => {
    const fetchStudio = async () => {
      const url = "api/Studio/Get-All-Studio-With-IsActive-True";
      try {
        const response = await api.get(url);
        console.log('API data:', response.data);
        
        const extractedStudio = Array.isArray(response.data) ? response.data : response.data?.$values || [];
        Setstudio(extractedStudio);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchStudio();
  }, []);

  const handleViewclick = (id) => {
    navigate(`/revenue/${id}`);
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      Studio.map(({ id, studioName, studioAddress, pricing, createAt, account }) => ({
        ID: id,
        'Tên Studio': studioName,
        'Địa chỉ': studioAddress,
        'Giá': `${pricing} VND`,
        'Ngày tạo': new Date(createAt).toLocaleDateString(),
        // 'Chủ Studio': account?.userName || 'N/A'
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Studio Data');
    
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const excelFile = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(excelFile, 'Studio_List.xlsx');
  };

  return (
    <div className="admin-manager">
      <h1 className='admin-title'>Admin</h1>
      <div className="tabs">
        <Link to="/adminmanager" className={location.pathname === '/adminmanager' ? 'active-tab' : ''}>Studios</Link>
        <Link to="/accountmana" className={location.pathname === '/accountmana' ? 'active-tab' : ''}>Accounts</Link>
        <Link to="/checkstu" className={location.pathname === '/checkstu' ? 'active-tab' : ''}>Duyệt studio</Link>
      </div>

      <button className="export-btn" onClick={exportToExcel}>Xuất Excel</button>

      <div className="studio-list-lo">
        {Studio.map((item) => (
          <div className="studio-item" key={item.id}>
            <div className="studio-info">
              <div className="avatar-lo">
                <img src={item.imageStudio} alt="" className='hinh-owner' />
              </div>
              <div className="details-lo">
                <h3 className='admin-t'>{item.account?.userName}</h3>
                <p className='info-own'>
                  Ngày tạo: {new Date(item.createAt).toLocaleDateString()} | Studio: {item.studioName} | Địa chỉ: {item.studioAddress}
                </p>
                <p className='info-own'>{item.pricing} VND</p>
              </div>
            </div>
            <button className="view-detail-btn" onClick={() => handleViewclick(item.id)}>Doanh Thu</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminManager;
