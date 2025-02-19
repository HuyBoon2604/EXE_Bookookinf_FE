import React, { useState,useCallback,useEffect } from "react";
import { FaCheckCircle, FaShareAlt } from "react-icons/fa";
import { useParams,useNavigate } from 'react-router-dom';
import api from '../../utils/requestAPI';
import "./UserProfile.css";

const UserProfile = () => {
const { accountid } = useParams();
const [user, setuser] = useState([]);
  const  fetchuser = async () =>{
try{
  const response = await api.get(
    `/api/Account/get-by-id?accountId=${accountid}`
  );

  console.log("API response:", response.data);
  const data = response.data;

  setuser(data);
  // console.log(user.imageUrl);


}
catch (error) {
  console.error('Error fetching data:', error);
}




  }
  useEffect(() => {
    fetchuser(); 
  }, []);

  const handleShare = () => {
    const profileURL = window.location.href; 
    navigator.clipboard.writeText(profileURL)
      .then(() => {
        alert("Profile link copied to clipboard!");
      })
      .catch((error) => {
        console.error("Failed to copy link:", error);
      });
  };

  return (
    <div id="UserProfile">
    <div className="user-profile-container">
      <div className="profile-header">
        <img
          className="profile-picture"
          src={user.imageUrl}
          alt="User"
        />
        <div className="user-details">
          <h1 className="user-name">{user.userName}</h1>
          <p className="join-date">{user.dateOfBirth}</p>
        </div>
      </div>
      <div className="profileverichua">
      <div className="verification-status">
        <h3 className="veri-title">Đã Xác Minh</h3>
        <p className="verification-email">
          <FaCheckCircle className="verification-icon" /> Email
        </p>
      </div>
      <div className="bio-chua">
        <p className="bio">
        Cảm ơn vì đã ghé qua! Tôi rất vui mừng được trở thành một phần của cộng đồng Colordanhub.
      </p>
      <button className="share-profile-button" onClick={handleShare}>
  <FaShareAlt className="share-icon" /> Chia sẻ 
</button>

      </div>
      
      </div>
      </div>
    </div>
  );
};

export default UserProfile;
