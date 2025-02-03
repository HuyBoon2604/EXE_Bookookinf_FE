import React, { useState } from 'react';
// import './EditStudio.css';
import { Link, useLocation } from 'react-router-dom';

const StudioBookingManager = () => {
    const [formData, setFormData] = useState({
        img:"public/0f867cb427035cc0008c7757df861157.jpg",
        name: 'Studio Medium Size',
        price: '100000',
        detail: 'Studio Size Medium For Group 4-6 People',
        address: '123 Nguyen Trai, District 1, HCM City',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleConfirm = () => {
        // Handle confirm logic here (e.g., send data to API)
        console.log('Confirmed:', formData);
    };

    const handleReject = () => {
        // Handle reject logic here
        console.log('Rejected');
    };

    return (
        <div id="StudioBookingManager">
        <div className="edit-studio-container">
            <div className='vuivl'>
 <h1 className="admin-title">Admin Manager</h1>

            <div className="tabs">
  <Link to="/bookingmanager" className={location.pathname === '/bookingmanager' ? 'active-tab' : ''}>
   Bookings
  </Link>
  <Link to="/editstu" className={location.pathname === '/editstu' ? 'active-tab' : ''}>
   EditStudio
  </Link>
            </div>
           
 
</div>

            <div className="content-lo">
                <div className="studio-image-container">
                    <img
                        src={formData.img} // Replace with the actual image URL
                        alt="Studio Medium"
                        className="studio-image-lo"
                    />
                    <p className="studio-size">Medium <span className="upload-icon">&#x21ba;</span></p>
                </div>

                <div className="studio-details">
                    <h2 className="description-title">Booking Slot</h2>
                    <div className='slot-contain'>
                        <div className='image-slot'>
<img src="public/0f867cb427035cc0008c7757df861157.jpg" alt="" className='slot-image'/>
                        </div>
                        <div className='info-slot'>
                            <h3 className='date-slot'>31/10/2024</h3>
                            <span className='des-slot'>Body text for whatever you’d like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story. </span>
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
        </div>
    );
};

export default StudioBookingManager;
