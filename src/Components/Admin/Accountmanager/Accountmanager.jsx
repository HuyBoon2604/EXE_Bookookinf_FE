import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

import api from '../../utils/requestAPI';

const Accountmanager = () => {
  
  const [account, setaccount] = useState([]);

  useEffect(() => {
    const fetchStudio = async () => {
      const url = `/api/Account/Get-All`; 
      try {
        const response = await api.get(url);
      
        console.log('API data:', response.data);

        const extractedStudio = Array.isArray(response.data) ? response.data : response.data?.$values || [];
        setaccount(extractedStudio);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchStudio();
  }, []); 

  
  const data = [
    {
      id: 1,
      hinh: "public/ec46334718d4ee1a37ca49cd652a194d.jpg",
      customerName: 'Customer1 Studio Owner',
      checkIn: '12 Mar 2021',
      type: 'Small',
      time: '16h-18h',
      price: '$100',
      status: 'Success'
    },
    {
      id: 2,
      hinh: "public/ec46334718d4ee1a37ca49cd652a194d.jpg",
      customerName: 'Customer2 Studio Owner',
      checkIn: '12 Mar 2021',
      type: 'Small',
      time: '18h-20h',
      price: '$100',
      status: 'Success'
    },
  ];

  const totalRevenue = data.reduce((total, item) => {
    const price = parseFloat(item.price.replace('$', ''));
    return total + price;
  }, 0);

  return (
    <div>
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
      <table className="custom-table">
        <thead>
          <tr className="table-header">
            <th>ID</th>
            <th>Ảnh</th>
            <th>Name</th>
            <th>Email</th>
            <th>Address</th>
            <th>Phone</th>
          </tr>
        </thead>
        <tbody>
          {account.map((item) => (
            <tr key={item.id} className="table-row">
              <td>{item.id}</td>
              <td className='anhchuamana'><div className='chuamana'>
                
                
              <img src={item.imageUrl} className='anhmana' alt="" />
                </div></td>
              <td>{item.userName}</td>
              <td>{item.email}</td>
              <td>{item.price}</td>
              <td>{item.phone}</td>
            </tr>
          ))}
        </tbody>
      </table>

     
    </div>
  );
}

export default Accountmanager;