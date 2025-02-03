import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './RevenuePage.css';
import api from '../../utils/requestAPI';

const RevenuePage = () => {
  const { id } = useParams();
  const [studio, setStudio] = useState([]);

  useEffect(() => {
    const fetchStudio = async () => {
      const url = `/Get-All-Order-Success-By-StudioId?studioId=${id}`; 
      try {
        const response = await api.get(url);
      
        console.log('API data:', response.data);

        const extractedStudio = response.data?.$values || [];
        setStudio(extractedStudio);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchStudio();
  }, [id]); 

  
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
      <table className="custom-table">
        <thead>
          <tr className="table-header">
            <th>ID</th>
            <th>Name</th>
            <th>Date</th>
            <th>Price</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id} className="table-row">
              <td>{item.id}</td>
              <td>{item.customerName}</td>
              <td>{item.checkIn}</td>
              <td>{item.price}</td>
              <td className='status-vui'>
                <div className='status-reven'>{item.status}</div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="total-revenue">
        <strong>Total Revenue: ${totalRevenue.toFixed(2)}</strong>
      </div>
    </div>
  );
}

export default RevenuePage;