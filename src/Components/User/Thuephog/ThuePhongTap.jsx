import React, { useState, useEffect, useCallback } from 'react';
import api from '../../utils/requestAPI';
import "./ThuePhongTap.css"; 
import { useNavigate } from 'react-router-dom';


const ThuePhongTap = () => {
    const [Studio, Setstudio] = useState([]);
    const [isExpanded, setIsExpanded] = useState(false);
    const toggleExpand = (id) => {
        setIsExpanded((prev) => ({
          ...prev,
          [id]: !prev[id] // Đảo trạng thái của card có id tương ứng
        }));
      };
  
useEffect(() => {
    const fetchStudio = async () => {
      const url = "api/Studio/Get-All-Studio-With-IsActive-True";
      try {
        const response = await api.get(url);
        console.log('API raw response:', response);
        console.log('API data:', response.data);

       
        const extractedStudio = Array.isArray(response.data) ? response.data : response.data?.$values || [];
        
        Setstudio(extractedStudio);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchStudio();
}, []);
const handleCardClick = (id) => {
    navigate(`/StudioInfor/${id}`);
    
  };
  const navigate = useNavigate();
  const totalLocations = Studio.length;
  return (
    <div className="locations-container">
      <h2 className='tieudevuinhuc'>Số lượng Studio ({totalLocations})</h2>
      <div className="locations-grid">
        {Studio.map((location, index) => (
          <div key={index} className="location-card" onClick={() => handleCardClick(location.id)}>
            <div className="image-container">
    <img src={location.imageStudio} alt={location.title} className="location-image" onClick={() => handleCardClick(location.id)} />
    <div className="pricevui">
    {new Intl.NumberFormat('vi-VN').format(Number(location.pricing) || 0)} VND / Giờ
              </div>
  </div>
            
            <h3>{location.studioName}</h3>
            <p>{location.studioAddress}</p>
            <p>⭐ 5 (62)</p>
           <p className='description-vuivui'>{location.studioDescription}</p>
            {/* <p className={`description-vuivui ${isExpanded[location.id] ? 'expanded' : ''}`}>
  {location.studioDescription
    ? (isExpanded[location.id] 
        ? location.studioDescription 
        : location.studioDescription.slice(0, 100) + "...")
    : "Không có mô tả"}
</p>


{location.studioDescription && (
  <button onClick={() => toggleExpand(location.id)} className="read-more-btn">
    {isExpanded[location.id] ? "Hạn chế" : "Xem Thêm"}
  </button>
)} */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThuePhongTap;