import React, { useState, useEffect } from 'react';
import api from '../../utils/requestAPI';
import './Checkstudio.css';
import { Link, useLocation } from 'react-router-dom';

const Checkstudio = () => {
  
  const [Studio, Setstudio] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showRejectPopup, setShowRejectPopup] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [selectedStudioId, setSelectedStudioId] = useState(null);

  useEffect(() => {
    const fetchStudio = async () => {
      const url = "api/Studio/Get-All-Studio-With-IsActive-False";
      try {
        const response = await api.get(url);
  
        const extractedStudio = response.data?.$values || [];
        Setstudio(extractedStudio);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchStudio();
  }, []);

  const handleApprove = async (studioId) => {
    setLoading(true); 
    try {
      const url = `api/Studio/Update-Status-Request-Studio?studioId=${studioId}`; 
      await api.put(url); 
      
      // Remove the approved studio from the list
      Setstudio(Studio.filter(studio => studio.id !== studioId));

      alert('Đã duyệt studio thành công');
    } catch (error) {
      alert('Không thể duyệt studio');
      console.error('Error approving studio:', error);
    } finally {
      setLoading(false); 
    }
  };

  const handleReject = async (studioId) => {
    setSelectedStudioId(studioId);
    setShowRejectPopup(true);
  };

  const handleConfirmReject = async () => {
    try {
      const url = 'api/Studio/Reject-Studio-Requets';
      const data = {
        studioId: selectedStudioId,
        message: rejectReason
      };
      
      console.log('Sending data:', data);
      
      const response = await api.post(url, data);
      console.log('Response:', response);
      
      setShowRejectPopup(false);
      setRejectReason('');
      alert('Đã từ chối studio thành công');
      
      // Reload the page after successful rejection
      window.location.reload();
      
    } catch (error) {
      console.log('Error data:', error.response?.data);
      alert('Không thể từ chối studio');
      console.error('Error rejecting studio:', error);
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
              <tr className='dautau'>
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
                  <td>{studio.userName}</td>
                  <td><img className='hinhstucheck' src={studio.imageStudio} alt="" /></td>
                  <td>{studio.studioAddress}</td>
                  <td>{studio.phone}</td>
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
      
      {showRejectPopup && (
        <div className="reject-popup-overlay">
          <div className="reject-popup">
            <h3>Lý do từ chối</h3>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Nhập lý do từ chối..."
              rows="4"
            />
            <div className="reject-popup-buttons">
              <button onClick={handleConfirmReject}>Gửi</button>
              <button onClick={() => {
                setShowRejectPopup(false);
                setRejectReason('');
              }}>Hủy</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkstudio;