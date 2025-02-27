import React, { useState, useEffect, useCallback } from 'react';
import api from '../../utils/requestAPI';
import "./ThuePhongTap.css"; 
import { useNavigate } from 'react-router-dom';


const ThuePhongTap = () => {
    const [Studio, Setstudio] = useState([]);
    const [searchName, setSearchName] = useState('');
    const [searchAddress, setSearchAddress] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);
    const toggleExpand = (id) => {
        setIsExpanded((prev) => ({
          ...prev,
          [id]: !prev[id] 
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
  const formatCurrency = (value) => {
    return value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};
const parseCurrency = (value) => {
  return parseInt(value.replace(/\./g, ""), 10) || 0;
};
const handleMinPriceChange = (e) => {
  const formattedValue = formatCurrency(e.target.value);
  setMinPrice(formattedValue);
};

const handleMaxPriceChange = (e) => {
  const formattedValue = formatCurrency(e.target.value);
  setMaxPrice(formattedValue);
};
 
const filteredStudio = Studio.filter(studio => {
  const matchesName = studio.studioName.toLowerCase().includes(searchName.toLowerCase());
  const matchesAddress = studio.studioAddress.toLowerCase().includes(searchAddress.toLowerCase());
  
  const minPriceNumber = parseCurrency(minPrice);
  const maxPriceNumber = parseCurrency(maxPrice);
  
  const matchesPrice = (minPrice === '' || studio.pricing >= minPriceNumber) && 
                       (maxPrice === '' || studio.pricing <= maxPriceNumber);
  
  return matchesName && matchesAddress && matchesPrice;
});
const totalLocations = filteredStudio.length;
  return (
    <div className="locations-container">
      <h2 className='tieudevuinhuc'>Số lượng Studio ({totalLocations})</h2>
      <div className="search-filter-container">
                <input
                className='locloc'
                    type="text"
                    placeholder="Tìm kiếm theo tên phòng"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                />
                <input
                    type="text"
                     className='locloc'
                    placeholder="Tìm kiếm theo địa chỉ"
                    value={searchAddress}
                    onChange={(e) => setSearchAddress(e.target.value)}
                />
               <input
                className='locloc'
    type="text" 
    placeholder="Giá tối thiểu"
    value={minPrice}
    onChange={handleMinPriceChange}
/>
<input
 className='locloc'
    type="text" 
    placeholder="Giá tối đa"
    value={maxPrice}
    onChange={handleMaxPriceChange}
/>
            </div>
            <div className="locations-grid">
                {filteredStudio.map((location, index) => (
                    <div key={index} className="location-card" onClick={() => handleCardClick(location.id)}>
                        <div className="image-container">
                            <img src={location.imageStudio} alt={location.title} className="location-image" />
                            <div className="pricevui">
                                {new Intl.NumberFormat('vi-VN').format(Number(location.pricing) || 0)} VND / Giờ
                            </div>
                        </div>
                        <h3>{location.studioName}</h3>
                        <p>{location.studioAddress}</p>
                        <p>⭐ 5 (62)</p>
                        <p className='description-vuivui'>{location.studioDescription}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};


export default ThuePhongTap;