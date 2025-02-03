import React, { useState } from 'react';
import './EditStudio.css';
import { Link, useLocation } from 'react-router-dom';

const EditStudio = () => {
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
        <div id="EditStudio">
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
                        src={formData.img} 
                        alt="Studio Medium"
                        className="studio-image-lo"
                    />
                    <p className="studio-size">Medium <span className="upload-icon">&#x21ba;</span></p>
                </div>

                <div className="studio-details">
                    <h2 className="description-title">Description</h2>
                    <div className="form-group-lo">
                        <label className='group-title'>Name</label>
                        <input
                            type="text"
                            name="name"
                            className='input-edit-stu'
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group-lo">
                        <label className='group-title'>Price</label>
                        <input
                            type="text"
                            name="price"
                             className='input-edit-stu'
                            value={formData.price}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group-lo">
                        <label className='group-title'>Detail</label>
                        <input
                            type="text"
                            name="detail"
                             className='input-edit-stu'
                            value={formData.detail}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group-lo">
                        <label className='group-title'>Address</label>
                        <input
                            type="text"
                            name="address"
                             className='input-edit-stu'
                            value={formData.address}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="action-buttons-lo">
                        <button className="confirm-button" onClick={handleConfirm}>ConFirm</button>
                        <button className="reject-button" onClick={handleReject}>Reject</button>
                    </div>
                </div>
            </div>
        </div>
        </div>
    );
};

export default EditStudio;
