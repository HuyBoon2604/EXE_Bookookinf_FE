import React, { useState, useEffect } from 'react';
import api from '../../utils/requestAPI';
import './Checkstudio.css';
import { Link, useLocation } from 'react-router-dom';

const Checkstudio = () => {
  
 
   const [Studio, Setstudio] = useState([]);
  useEffect(() => {
    const fetchStudio = async () => {
      const url = "api/Studio/Get-All-Studio-With-IsActive-False";
      try {
        const response = await api.get(url);
        console.log('API raw response:', response);
        console.log('API data:', response.data);
  
      
        const extractedStudio = response.data?.$values || [];
        Setstudio(extractedStudio);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchStudio();
  }, []);

 
  const [loading, setLoading] = useState(false);

 
  const handleApprove = async (studioId) => {
    setLoading(true); 
    try {
      const url = `api/Studio/Update-Status-Request-Studio?studioId=${studioId}`; 
      await api.put(url); 
     
      alert('Đã duyệt studio thành công');
    } catch (error) {
      alert('Không thể duyệt studio');
      console.error('Error approving studio:', error);
    } finally {
      setLoading(false); 
    }
  };

  
  const handleReject = async (studioId) => {
    try {
     
      setTimeout(() => {
        setPendingStudios(pendingStudios.filter(studio => studio.id !== studioId));
        alert('Đã từ chối studio');
      }, 500);
    } catch (error) {
      alert('Không thể từ chối studio');
    }
  };

  return (
    <div className="admin-check-studio">
        <div className="tabs">
        <Link to="/adminmanager" className={location.pathname === '/adminmanager' ? 'active-tab' : ''}>
          Studios
        </Link>
        
        <Link to="/accountmana" className={location.pathname === '/accountmana' ? 'active-tab' : ''}>
          Accounts
        </Link>
        <Link to="/checkstu" className={location.pathname === '/checkstu' ? 'active-tab' : ''}>
          Duyệt studio
        </Link>
      </div>
      <div className="admin-check-studio__header">
        <h1 className="admin-check-studio__title">Danh sách Studio chờ duyệt</h1>
      </div>
      <div className="admin-check-studio__content">
        {loading ? (
          <div className="loading">Đang tải...</div>
        ) : Studio.length === 0 ? (
          <div className="no-data">Không có studio nào đang chờ duyệt</div>
        ) : (
          <table className="studio-table">
            <thead>
              <tr>
                <th>Tên Studio</th>
                <th>Người đăng Studio</th>
                <th>Hình ảnh</th>
                <th>Địa chỉ</th>
                <th>Số điện thoại</th>
                <th>Giá</th>
                <th>Email</th>
                <th>Ngày đăng ký</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {Studio.map((studio) => (
                <tr key={studio.id}>
                  <td>{studio.studioName}</td>
                  <td>{studio.account.userName}</td>
                  <td><img className='hinhstucheck' src={studio.imageStudio} alt="" /></td>
                  <td>{studio.studioAddress}</td>
                  <td>{studio.account?.phone}</td>
                  <td>{studio.pricing}VND</td>
                  <td>{studio.email}</td>
                  <td>{new Date(studio.createAt).toLocaleDateString()}</td>
                  <td className="action-buttons">
                    <button
                      className="approve-btn"
                      onClick={() => handleApprove(studio.id)}
                    >
                      Duyệt
                    </button>
                    <button
                      className="reject-btn"
                      onClick={() => handleReject(studio.id)}
                    >
                      Từ chối
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Checkstudio;