import React, { useState } from 'react';
import './Studio.css'; // Thay vì import styles từ file CSS module, sử dụng file CSS thông thường

function CustomerCard({ name, checkInDate, price, type, time }) {
  return (
    <div className="customerList">
      <div className="customerInfo">
      <div className="placeholder">
          <img src="https://via.placeholder.com/40" alt="icon" />
        </div>
        <div className="customerDetails">
          <div className="customerName">{name}</div>
          <div className="checkInDate">
            <span className="checkInLabel">Check In: </span>
            {checkInDate}
          </div>
          <div className="price">$ {price}</div>
        </div>
        <div className="studioType">
          {/* Type: <span>{type}</span> */}
          <span className="typeLabel">Type</span>: {type}
        </div>
        <div className="timeSlot">
          <span className="timeLabel">Time</span>: {time}
        </div>
      </div>
      <button 
        className="contactButton"
        aria-label={`Contact ${name}`}
      >
        Contact Customer
      </button>
    </div>
  );
}

export default function Studio() {
  const [activeNav, setActiveNav] = useState('Order'); // Trạng thái cho Nav

  const customerData = [
    {
      name: 'Customer1',
      checkInDate: '12 Mar 2021',
      price: '100',
      type: 'Small',
      time: '16h-18h'
    },
    {
      name: 'Customer2',
      checkInDate: '12 Mar 2021',
      price: '100',
      type: 'Small',
      time: '18h-20h'
    }
  ];

  // Hàm thay đổi mục nav khi nhấn
  const handleNavClick = (navItem) => {
    setActiveNav(navItem);
  };

  return (
    <div id="Studio">
      <div className="studioManager">
        <div className="mainContent">
          <h1 className="heading">My Studio Manager</h1>
          <div className="contentWrapper">
             <nav className="navigationSection" aria-label="Main navigation">
              <div 
                className={`navItem ${activeNav === 'Order' ? 'active' : ''}`} 
                onClick={() => handleNavClick('Order')}
              >
                Order
                {activeNav === 'Order' && <div className="divider" role="separator" />}
              </div>
              <div 
                className={`navItem ${activeNav === 'Revenue' ? 'active' : ''}`} 
                onClick={() => handleNavClick('Revenue')}
              >
                Revenue
                {activeNav === 'Revenue' && <div className="divider" role="separator" />}
              </div>
              <div 
                className={`navItem ${activeNav === 'Edit Studio' ? 'active' : ''}`} 
                onClick={() => handleNavClick('Edit Studio')}
              >
                Edit Studio
                {activeNav === 'Edit Studio' && <div className="divider" role="separator" />}
              </div>
            </nav>
            <section className="mainSection">
              {/* <div className="navigationMenu">
                <div>{activeNav}</div> 
              </div> */}

              {/* Hiển thị nội dung tùy thuộc vào mục Nav đang chọn */}
              {activeNav === 'Order' && customerData.map((customer, index) => (
                <CustomerCard
                  key={`customer-${index}`}
                  name={customer.name}
                  checkInDate={customer.checkInDate}
                  price={customer.price}
                  type={customer.type}
                  time={customer.time}
                />
              ))}

              {activeNav === 'Revenue' && (
                <div>Revenue Content</div> // Thêm nội dung cho Revenue
              )}

              {activeNav === 'Edit Studio' && (
                <div>Edit Studio Content</div> // Thêm nội dung cho Edit Studio
              )}
            </section>
          </div>
        </div>
        <footer className="footer" role="contentinfo" />
      </div>
    </div>
  );
}
