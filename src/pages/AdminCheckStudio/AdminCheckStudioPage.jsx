import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminCheckStudioPage.css';

const AdminCheckStudioPage = () => {
  // Data mẫu
  const sampleData = [
    {
      id: 1,
      name: "Sweet Memory Studio",
      address: "123 Nguyễn Văn Linh, Quận 7, TP.HCM",
      phone: "0901234567",
      email: "sweetmemory@gmail.com",
      createdAt: "2024-03-15"
    },
    {
      id: 2,
      name: "Sunshine Studio",
      address: "456 Lê Văn Việt, Quận 9, TP.HCM",
      phone: "0909876543",
      email: "sunshine.studio@gmail.com",
      createdAt: "2024-03-16"
    },
    {
      id: 3,
      name: "Happy Wedding Studio",
      address: "789 Phan Văn Trị, Gò Vấp, TP.HCM",
      phone: "0912345678",
      email: "happywedding@gmail.com",
      createdAt: "2024-03-17"
    },
    {
      id: 4,
      name: "Love Story Studio",
      address: "321 Võ Văn Tần, Quận 3, TP.HCM",
      phone: "0898765432",
      email: "lovestory@gmail.com",
      createdAt: "2024-03-18"
    }
  ];

  const [pendingStudios, setPendingStudios] = useState(sampleData);
  const [loading, setLoading] = useState(false);

  // Xử lý duyệt studio
  const handleApprove = async (studioId) => {
    try {
      // Giả lập API call
      setTimeout(() => {
        setPendingStudios(pendingStudios.filter(studio => studio.id !== studioId));
        alert('Đã duyệt studio thành công');
      }, 500);
    } catch (error) {
      alert('Không thể duyệt studio');
    }
  };

  // Xử lý từ chối studio
  const handleReject = async (studioId) => {
    try {
      // Giả lập API call
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
      <div className="admin-check-studio__header">
        <h1 className="admin-check-studio__title">Danh sách Studio chờ duyệt</h1>
      </div>
      <div className="admin-check-studio__content">
        {loading ? (
          <div className="loading">Đang tải...</div>
        ) : pendingStudios.length === 0 ? (
          <div className="no-data">Không có studio nào đang chờ duyệt</div>
        ) : (
          <table className="studio-table">
            <thead>
              <tr>
                <th>Tên Studio</th>
                <th>Địa chỉ</th>
                <th>Số điện thoại</th>
                <th>Email</th>
                <th>Ngày đăng ký</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {pendingStudios.map((studio) => (
                <tr key={studio.id}>
                  <td>{studio.name}</td>
                  <td>{studio.address}</td>
                  <td>{studio.phone}</td>
                  <td>{studio.email}</td>
                  <td>{new Date(studio.createdAt).toLocaleDateString()}</td>
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

export default AdminCheckStudioPage;
