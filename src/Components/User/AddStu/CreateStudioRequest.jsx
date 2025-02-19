import React, { useState } from 'react';
import api from '../../utils/requestAPI';
import './CreateStudioRequest.css';
import { confirmAlert } from 'react-confirm-alert'; 
import 'react-confirm-alert/src/react-confirm-alert.css'; 
import useAuth from '../../../hooks/useAuth';

const CreateStudioRequest = () => {
  const accountId = "ACc61f6"; 
  const { auth } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const [studioData, setStudioData] = useState({
    pricing: '',
    studioName: '',
    studioAddress: '',
    studioDescription: '',
    studioSizeId: '', // Thêm trường này để lưu ID của kích thước studio
    capacity: '',
    imageStudio: null,
    timeon:'',
    timeoff:'',
    tienichvuivui:'',
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
  
    // Kiểm tra nếu trường là 'pricing'
    if (name === 'pricing') {
      // Kiểm tra giá trị không được âm
      if (value !== '' && Number(value.replace(/[^0-9]/g, '')) < 0) {
        return;
      }
  
      // Loại bỏ tất cả các ký tự không phải số
      const numericValue = value.replace(/[^0-9]/g, '');
  
      // Định dạng giá trị với dấu phẩy
      const formattedValue = new Intl.NumberFormat('vi-VN').format(numericValue);
  
      // Cập nhật state với giá trị số và giá trị đã định dạng
      setStudioData((prev) => ({
        ...prev,
        [name]: numericValue, // Giá trị số để xử lý logic
        [`${name}Formatted`]: formattedValue, // Giá trị đã định dạng để hiển thị
      }));
    } else {
      // Xử lý các trường khác
      setStudioData((prev) => ({ ...prev, [name]: value }));
    }
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

  const ShowConfirmCancel = (e) => {
    e.preventDefault();
    confirmAlert({
      title: <span className="custom-confirm-alert">Tạo Ngay</span>,
      message: <span className='custom-confirm'>Bạn đã kiểm tra đầy đủ thông tin chưa ?</span>,
      buttons: [
        { label: 'Có', onClick: () => handleSubmit(e) },
        { label: 'Kiểm tra lại' },
      ],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    if (!studioData.imageStudio) {
      setError('Vui lòng chọn hình ảnh chính cho studio!');
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('accountId', auth.user.id);
    formData.append('Pricing', studioData.pricing);
    formData.append('StudioName', studioData.studioName);
    formData.append('StudioAddress', studioData.studioAddress);
    formData.append('StudioDescription', studioData.studioDescription);
    formData.append('SizeId', studioData.studioSizeId); 
    formData.append('Quantity', studioData.capacity);
    formData.append('poster', studioData.imageStudio);
    formData.append('TimeOn', studioData.timeon.toString());
    formData.append('TimeOff', studioData.timeoff.toString());
    formData.append('DescriptionAmentites', studioData.tienichvuivui)

    studioData.images.forEach((image, index) => {
      if (image) {
        formData.append(`poster${index + 1}`, image);
      }
    });

    try {
      await api.post(
        `/api/Studio/Create-Request-Studio-With-Image?accountId=${auth.user.id}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      setSuccess('Studio được tạo thành công!');
      setStudioData({
        pricing: '',
        studioName: '',
        studioAddress: '',
        studioDescription: '',
        studioSizeId: '',
        capacity: '',
        timeon:'',
    timeoff:'',
    tienichvuivui:'',
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Đang tạo studio...</p>
          </div>
        </div>
      )}
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
      <input
        type="text" // Sử dụng type="text" để hiển thị giá trị đã định dạng
        name="pricing"
        value={studioData.pricingFormatted || ''}
        onChange={handleInputChange}
        required
      />
      {/* Lưu giá trị số thực tế trong một trường ẩn (nếu cần) */}
      <input type="hidden" name="pricingNumeric" value={studioData.pricing} />
    </div>

          <div className="form-group">
            <label>Địa Chỉ:</label>
            <input type="text" name="studioAddress" value={studioData.studioAddress} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label>Thời gian mở cửa:</label>
            <input type="time" name="timeon" value={studioData.timeon} onChange={handleInputChange} required />
          </div>

          <div className="form-group">
            <label>Thời gian đóng cửa:</label>
            <input type="time" name="timeoff" value={studioData.timeoff} onChange={handleInputChange} required />
          </div>

          <div className="form-group">
            <label>Thông tin mô tả tiện ích:</label>
            <input type="text" name="tienichvuivui" value={studioData.tienichvuivui} onChange={handleInputChange} required />
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
            <label>Loại Phòng:</label>
            <select name="studioSizeId" value={studioData.studioSizeId} onChange={handleInputChange} required>
              <option value="">Chọn loại phòng</option>
              <option value="1">Nhỏ</option>
              <option value="2">Vừa</option>
              <option value="3">Lớn</option>
            </select>
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