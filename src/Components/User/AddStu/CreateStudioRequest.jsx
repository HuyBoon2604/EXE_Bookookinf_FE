import React, { useState } from 'react';
import api from '../../utils/requestAPI';
import './CreateStudioRequest.css';
import { confirmAlert } from 'react-confirm-alert'; 
import 'react-confirm-alert/src/react-confirm-alert.css'; 
import useAuth from '../../../hooks/useAuth';

const CreateStudioRequest = () => {
  const accountId = "ACc61f6"; 
  const { auth } = useAuth();

  const [studioData, setStudioData] = useState({
    pricing: '',
    studioName: '',
    studioAddress: '',
    studioDescription: '',
    studioSize: '',
    capacity: '',
    imageStudio: null,
    images: Array(5).fill(null),
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [imagePreviews, setImagePreviews] = useState({
    imageStudio: null,
    images: Array(5).fill(null),
  });

 
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStudioData((prev) => ({ ...prev, [name]: value }));
  };

 
  const handleImageUpload = (e, key, index = null) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (index === null) {
        setStudioData((prev) => ({ ...prev, [key]: file }));
        setImagePreviews((prev) => ({ ...prev, [key]: reader.result }));
      } else {
        const newImages = [...studioData.images];
        newImages[index] = file;
        setStudioData((prev) => ({ ...prev, images: newImages }));

        const newPreviews = [...imagePreviews.images];
        newPreviews[index] = reader.result;
        setImagePreviews((prev) => ({ ...prev, images: newPreviews }));
      }
    };
    reader.readAsDataURL(file);
  };

  // Xác nhận hủy đơn
  const ShowConfirmCancel = (e) => {
    e.preventDefault();
    confirmAlert({
      title: 'Tạo Ngay',
      message: 'Bạn đã kiểm tra lại kỹ các thông tin chưa?',
      buttons: [
        { label: 'Có', onClick: () => handleSubmit(e) },
        { label: 'Kiểm tra lại' },
      ],
    });
  };

  // Xử lý gửi dữ liệu
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!studioData.imageStudio) {
      setError('Vui lòng chọn hình ảnh chính cho studio!');
      return;
    }

    const formData = new FormData();
    formData.append('accountId', auth.user.id);
    formData.append('Pricing', studioData.pricing);
    formData.append('StudioName', studioData.studioName);
    formData.append('StudioAddress', studioData.studioAddress);
    formData.append('StudioDescription', studioData.studioDescription);
    formData.append('StudioSize', studioData.studioSize);
    formData.append('Capacity', studioData.capacity);
    formData.append('poster', studioData.imageStudio);

    studioData.images.forEach((image, index) => {
      if (image) {
        formData.append(`poster${index + 1}`, image);
      }
    });

    try {
      await api.post(
        `https://localhost:7199/api/Studio/Create-Request-Studio-With-Image?accountId=${auth.user.id}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      setSuccess('Studio được tạo thành công!');
      setStudioData({
        pricing: '',
        studioName: '',
        studioAddress: '',
        studioDescription: '',
        studioSize: '',
        capacity: '',
        imageStudio: null,
        images: Array(5).fill(null),
      });

      setImagePreviews({
        imageStudio: null,
        images: Array(5).fill(null),
      });
    } catch (error) {
      setError('Có lỗi xảy ra khi tạo studio. Vui lòng thử lại!');
      console.error('Lỗi tạo studio:', error);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="create-studio-container">
        <h2>Tạo Studio Mới</h2>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={ShowConfirmCancel} className="studio-form">
          <div className="form-group">
            <label>Tên Studio:</label>
            <input type="text" name="studioName" value={studioData.studioName} onChange={handleInputChange} required />
          </div>

          <div className="form-group">
            <label>Giá (VNĐ):</label>
            <input type="number" name="pricing" value={studioData.pricing} onChange={handleInputChange} required />
          </div>

          <div className="form-group">
            <label>Địa Chỉ:</label>
            <input type="text" name="studioAddress" value={studioData.studioAddress} onChange={handleInputChange} required />
          </div>

          <div className="form-group">
            <label>Mô Tả:</label>
            <textarea name="studioDescription" value={studioData.studioDescription} onChange={handleInputChange} required />
          </div>

          <div className="form-group">
            <label>Hình Ảnh Chính:</label>
            <input type="file" onChange={(e) => handleImageUpload(e, 'imageStudio')} accept="image/*" required />
            {imagePreviews.imageStudio && <img src={imagePreviews.imageStudio} alt="Preview" className="image-preview" />}
          </div>

          <div className="image-grid">
            {studioData.images.map((_, index) => (
              <div className="form-group" key={index}>
                <label>Hình Ảnh {index + 1}:</label>
                <input type="file" onChange={(e) => handleImageUpload(e, 'images', index)} accept="image/*" />
                {imagePreviews.images[index] && <img src={imagePreviews.images[index]} alt={`Preview ${index + 1}`} className="image-preview" />}
              </div>
            ))}
          </div>

          <div className="form-group">
            <label>Kích Thước Studio:</label>
            <input type="text" name="studioSize" value={studioData.studioSize} onChange={handleInputChange} required />
          </div>

          <div className="form-group">
            <label>Sức Chứa:</label>
            <input type="text" name="capacity" value={studioData.capacity} onChange={handleInputChange} required />
          </div>

          <button type="submit" className="submit-btn">Tạo Studio</button>
        </form>
      </div>
    </div>
  );
};

export default CreateStudioRequest;
