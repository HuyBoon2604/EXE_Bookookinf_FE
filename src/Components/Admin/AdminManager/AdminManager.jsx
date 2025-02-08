import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './AdminManager.css';
import api from '../../utils/requestAPI';
import { useNavigate } from 'react-router-dom';

const AdminManager = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [Studio, Setstudio] = useState([]);
  const handleViewclick = (id) => {
    navigate(`/revenue/${id}`);
  };
    useEffect(() => {
      const fetchStudio = async () => {
        const url = "api/Studio/Get-All-Studio-With-IsActive-True";
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
   
  const data = [
    {
      id: 1,
      hinh:"public/ec46334718d4ee1a37ca49cd652a194d.jpg",
      customerName: 'Customer1 Studio Owner',
      checkIn: '12 Mar 2021',
      type: 'Small',
      time: '16h-18h',
      price: '$100',
    },
    {
      id: 2,
      hinh:"public/ec46334718d4ee1a37ca49cd652a194d.jpg",
      customerName: 'Customer2 Studio Owner',
      checkIn: '12 Mar 2021',
      type: 'Small',
      time: '18h-20h',
      price: '$100',
    },
  ];

  return (
    <div className="admin-manager">
      <h1 className='admin-title'>Admin Manager</h1>
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
      <div className="studio-list-lo">
        {Studio.map((item) => (
          <div className="studio-item" key={item.id}>
            <div className="studio-info">
              <div className="avatar-lo">
                 <img src={item.imageStudio} alt="" className='hinh-owner' />
              </div>
              <div className="details-lo">
                <h3 className='admin-t'>{item.account.userName}</h3>
                <p className='info-own'>
                  Create Date: {new Date(item.createAt).toLocaleDateString()} &nbsp; | &nbsp; Tên Studio: {item.studioName} &nbsp; |Địa chỉ:{item.studioAddress} &nbsp;
                
                </p>
                <p className='info-own'>{item.pricing}VND</p>
              </div>
            </div>
            <button className="view-detail-btn"  onClick={() => handleViewclick(item.id)}  >Doanh Thu</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminManager;
