import React, { useEffect, useState } from 'react';
import './notifications.css';

const ConfirmDialog = ({ isOpen, message, onConfirm, onCancel }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // Thêm class vào body để ngăn scroll
      document.body.style.overflow = 'hidden';
    } else {
      // Thêm animation khi đóng
      const timer = setTimeout(() => {
        setIsVisible(false);
        document.body.style.overflow = '';
      }, 300);
      return () => clearTimeout(timer);
    }
    
    // Cleanup khi unmount
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isVisible) return null;

  return (
    <div id='ConfirmDialog'>
    <div className={`confirm-dialog-overlay ${isOpen ? 'open' : 'closing'}`}>
      <div className="confirm-dialog">
        <div className="confirm-dialog-icon">
          <span>?</span>
        </div>
        <h2 className="confirm-dialog-title">Xác nhận</h2>
        <div className="confirm-dialog-message">{message}</div>
        <div className="confirm-dialog-actions">
          <button 
            className="confirm-dialog-cancel" 
            onClick={onCancel}
          >
            Hủy bỏ
          </button>
          <button 
            className="confirm-dialog-confirm" 
            onClick={onConfirm}
          >
            Đồng ý
          </button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default ConfirmDialog; 