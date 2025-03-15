import { toast } from 'react-toastify';
import React from 'react';
import ReactDOM from 'react-dom';
import ConfirmDialog from './ConfirmDialog.jsx';
import './notifications.css';

export const showNotification = (message, type = 'info') => {
  // Chỉ sử dụng style, không ghi đè các cấu hình thời gian và vị trí
  const options = {
    style: {
      background: type === 'success' ? '#28a745' : 
                  type === 'error' ? '#dc3545' : 
                  type === 'warn' ? '#ffc107' : '#007bff',
      color: 'white',
      fontFamily: 'Poppins, sans-serif',
      borderRadius: '10px',
      padding: '15px 25px',
      textAlign: 'center',
      fontSize: '16px',
      fontWeight: '500'
    }
  };

  // Sử dụng đúng hàm toast tương ứng với type
  switch(type) {
    case 'success':
      toast.success(message, options);
      break;
    case 'error':
      toast.error(message, options);
      break;
    case 'warn':
      toast.warn(message, options);
      break;
    default:
      toast.info(message, options);
  }
};

export const showConfirmDialog = (message, onConfirm) => {
  const dialogRoot = document.createElement('div');
  dialogRoot.id = 'confirm-dialog-root';
  document.body.appendChild(dialogRoot);

  const closeDialog = () => {
    // Thêm animation đóng
    ReactDOM.render(
      React.createElement(ConfirmDialog, {
        isOpen: false,
        message: message,
        onConfirm: handleConfirm,
        onCancel: handleCancel
      }),
      dialogRoot
    );
    
    // Đợi animation hoàn thành rồi xóa DOM
    setTimeout(() => {
      ReactDOM.unmountComponentAtNode(dialogRoot);
      document.body.removeChild(dialogRoot);
    }, 300);
  };

  const handleConfirm = () => {
    closeDialog();
    onConfirm();
  };

  const handleCancel = () => {
    closeDialog();
  };

  // Render dialog vào DOM
  ReactDOM.render(
    React.createElement(ConfirmDialog, {
      isOpen: true,
      message: message,
      onConfirm: handleConfirm,
      onCancel: handleCancel
    }),
    dialogRoot
  );
};
