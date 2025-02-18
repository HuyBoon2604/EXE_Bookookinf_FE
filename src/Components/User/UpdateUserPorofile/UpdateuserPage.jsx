import React, { useState, useEffect, useCallback } from 'react';
import './UpdateuserPage.css';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../utils/requestAPI';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import useAuth from '../../../hooks/useAuth';
import { Navigation, Pagination } from "swiper/modules";
import { useNavigate } from 'react-router-dom';
const UpdateuserPage = () => {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const [Fname, setFName] = useState('');
  const [Sname, setSName] = useState('');
  const [phone, setphone] = useState('');
  const [Email, setEmail] = useState('');
  const [dateofbirth, setdateofbirth] = useState('');
  const [Account, setAccount] = useState('');
  const [avatar, setavatar] = useState('');
  const [avatarFile, setAvatarFile] = useState(null); 
  const [successMessage, setSuccessMessage] = useState('');
  const handleviewprofile = () => {
    navigate(`/Profile/${auth.user.id}`);
  };
  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setavatar(reader.result); 
      };
      reader.readAsDataURL(file);
      setAvatarFile(file); 
    }
  };

  const handleEdit = async (e) => {
    if (e) e.preventDefault();

    if (!Fname || !Sname || !phone || !Email || !dateofbirth) {
      toast.error("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    const url = '/api/Account/Update-Account';
    const data = {
      id: auth.user.id,
      userName: `${Fname} ${Sname}`,
      email: Email,
      phone: phone,
      dateOfBirth: dateofbirth,
    };

    try {
   
      if (avatarFile) {
        const formData = new FormData();
        formData.append('NewAva', avatarFile);
        
       
        await api.put(`/api/Account/Update-Avatar-Account?accountId=${auth.user.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      const response = await api.post(url, data);
      console.log(response.data);
      setSuccessMessage('Cập nhật thông tin thành công.');
      setTimeout(() => {
        setSuccessMessage('');
        
      }, 2000);
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra khi cập nhật!");
    }
  };

  const fetchUser = useCallback(async () => {
    try {
      const response = await api.get(`/api/Account/get-by-id?accountId=${auth.user.id}`);
      console.log(response.data)
      const account = response.data;
      const account1 = Array.isArray(response.data) ? response.data : response.data?.$values || [];
      if (account) {
        const fullname = account.userName || '';
        const nameParts = fullname.split(' ');
        const firstname = nameParts[0] || '';
        const lastname = nameParts.slice(1).join(' ') || '';

        setphone(account.phone || '');
        setEmail(account.email || '');
        setdateofbirth(account.dateOfBirth ? account.dateOfBirth.toString() : '');
        setavatar(account.avatar || '');
        setFName(firstname);
        setSName(lastname);
        setAccount(account);
      }
    } catch (error) {
      toast.error("Lỗi khi lấy thông tin người dùng!");
    }
  }, [auth.user.id]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const showConfirmDialog = () => {
    confirmAlert({
      title: <span className="custom-confirm-alert">Cập Nhật Thông Tin</span>,
      message: <span className='custom-confirm'>Bạn có chắc chắn muốn cập nhật thông tin?</span>,
      buttons: [
        {
          label: 'Có',
          onClick: handleEdit,
        },
        {
          label: 'Không',
        },
      ],
    });
  };

  return (
    <div id="UpdateuserPage">
      
      <div className='Update-tong'>
      {successMessage && <div className="success-message">{successMessage}</div>}
        <div className='Info-User'>
          <div className='image-userupdate'>
            <img src={avatar || Account.imageUrl} alt="" className='hinh-user-update' />
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              style={{ display: 'none' }}
              id="avatar-upload"
            />
          

          </div>
          <div className='indentity-tong'>
            <div className='indentity-title-chua'>
              <h2 className='indentity-title'>Xác minh danh tính</h2>
            </div>
            <div className='indentity-sub-chua'>
              <span className='indentity-sub'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.</span>
            </div>
          </div>
          <div className='info-confirm'>
            <div className='info-title-chua'>
              <h2 className='info-title-update'>{Account.userName}</h2>
            </div>
            <div className='info-sub'>
              <div>
                <span className='info-sub-email'>Email được xác nhận</span>
              </div>
              {/* <div>
                <span className='info-sub-mobile'>Mobile Confirmed</span>
              </div> */}
            </div>
          </div>
        </div>
        <div className='Input-user'>
          <div className='header-container'>
            <h2 className='basic-info-title'>Thông tin cá nhân</h2>
            <button onClick={() => handleviewprofile()} className='view-profile-button'>View Profile</button>
          </div>
          <div className='input-container'>
            <div className='input-row'>
              <div className='input-group'>
                <label htmlFor='firstName' className='labelne'>First name</label>
                <input type='text' id='firstName' value={Fname} onChange={(e) => setFName(e.target.value)} name='firstName' placeholder='First name' className='fname'required />
              </div>
              <div className='input-group'>
                <label htmlFor='lastName' className='labelne'>Last name</label>
                <input type='text' id='lastName' value={Sname} onChange={(e) => setSName(e.target.value)} name='lastName' placeholder='Last name' className='lname'required />
              </div>
            </div>
            <div className='input-group'>
              <label htmlFor='phoneNumber' className='labelne'>Số điện thoại</label>
              <input type='text' id='phoneNumber' value={phone} onChange={(e) => setphone(e.target.value)} name='phoneNumber' className='phonenumber' placeholder='Phone number' required />
            </div>
            <div className='input-group'>
              <label htmlFor='dateofbirth' className='labelne'>Ngày sinh</label>
              <input
                type='text'
                id='dateofbirth'
                value={dateofbirth}
                name='dateofbirth'
                className='dateofbirth'
                placeholder='Date of birth'
                onChange={(e) => setdateofbirth(e.target.value)}
                required
              />
            </div>
            <div className='input-group'>
              <label htmlFor='email' className='labelne'>Email</label>
              <div className='email-input-wrapper'>
                <input type='email' readOnly value={Email} id='email' name='email' placeholder='Email' className='emailne' onChange={(e) => setEmail(e.target.value)} />
                <span className='email-lock-icon'>🔒</span>
              </div>
            </div>
            <div className='form-actions'>
          
  
 
   <label for="file-input" class="drop-container">
  <span class="drop-title">Cập nhật hình ảnh</span>
  
  <input type="file"  accept="image/*"
              onChange={handleAvatarUpload} required="" id="file-input"/>
</label>

            
              <button className='save-button' onClick={showConfirmDialog}>Cập nhật</button>
            </div>
          
          </div>
        
        </div>
      </div>
    </div>
  );
};

export default UpdateuserPage;