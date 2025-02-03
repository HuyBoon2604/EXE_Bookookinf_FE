import React, { useState, useEffect, useCallback } from 'react';
import './UpdateuserPage.css'; 
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../utils/requestAPI';
import { confirmAlert } from 'react-confirm-alert'; 
import 'react-confirm-alert/src/react-confirm-alert.css'; 
import useAuth from '../../../hooks/useAuth';


const UpdateuserPage = () => {
  const accountId = "ACc61f6";
  const { auth } = useAuth();
  const [Fname, setFName] = useState('');
  const [Sname, setSName] = useState('');
    const [phone, setphone] = useState('');
    const [Email, setEmail] = useState('');
    const [dateofbirth, setdateofbirth] = useState('');
 
    const [Account, setAccount] = useState('');
    const [avatar, setavatar] = useState('');
   const [success, setSuccess] = useState('');
  
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
      dateOfBirth: dateofbirth
    };

    try {
      const response = await api.post(url, data);
      console.log(response.data);
      setSuccess("Cập nhật thành công!");
      setTimeout(() => setSuccess(''), 2000);
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra khi cập nhật!");
    }
  };

 
  const fetchUser = useCallback(async () => {
    try {
      const response = await api.get(`https://localhost:7199/api/Account/get-by-id?accountId=${auth.user.id}`);
      const account = response.data;

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
      title: 'Cập Nhật Thông Tin',
      message: 'Bạn có chắc chắn muốn cập nhật thông tin?',
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
return(
  <div id="UpdateuserPage">
    {success && <div className="success-message">{success}</div>}
<div className='Update-tong'>

<div className='Info-User'>
<div className='image-userupdate'>
    <img src={Account.imageUrl} alt="" className='hinh-user-update' />
</div>
<div className='indentity-tong'>
    <div className='indentity-title-chua'>
        <h2 className='indentity-title'>Identity Verification</h2>
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
         <span className='info-sub-email'>Email Confirmed</span>
    </div>
   <div>
     <span className='info-sub-mobile'>Mobile Confirmed</span>
   </div>
   
</div>
</div>
</div>
<div className='Input-user'>
  <div className='header-container'>
    <h2 className='basic-info-title'>Basic information</h2>
    <button className='view-profile-button'>View Profile</button>
  </div>
  <div className='input-container'>
    <div className='input-row'>
      <div className='input-group'>
        <label htmlFor='firstName' className='labelne'>First name</label>
        <input type='text' id='firstName' value={Fname} onChange={(e) => setFName(e.target.value)} name='firstName' placeholder='First name' className='fname' />
      </div>
      <div className='input-group'>
        <label htmlFor='lastName' className='labelne'>Last name</label>
        <input type='text' id='lastName' value={Sname} onChange={(e) => setSName(e.target.value)} name='lastName' placeholder='Last name' className='lname' />
      </div>
    </div>
    <div className='input-group'>
      <label htmlFor='phoneNumber'  className='labelne'>Phone number</label>
      <input type='text' id='phoneNumber'value={phone} onChange={(e) => setphone(e.target.value)}   name='phoneNumber' className='phonenumber' placeholder='Phone number' />
    </div>

    <div className='input-group'>
      <label htmlFor='dateofbirth'  className='labelne'>Date of birth</label>
      <input
  type='text'
  id='dateofbirth'
  value={dateofbirth}
  name='dateofbirth'
  className='dateofbirth'
  placeholder='Date of birth'
  onChange={(e) => setdateofbirth(e.target.value)} 
/>
    </div>
    <div className='input-group'>
      <label htmlFor='email' className='labelne'>Email</label>
      <div className='email-input-wrapper'>
        <input type='email' value={Email} id='email' name='email' placeholder='Email' className='emailne'onChange={(e) => setEmail(e.target.value)} />
        <span className='email-lock-icon'>🔒</span>
      </div>
    </div>
    <div className='form-actions'>
      <button className='cancel-button'>Cancel</button>
      <button className='save-button' onClick={showConfirmDialog}>Cập Nhật</button>
    </div>
  </div>
</div>
</div>
</div>
);
};
export default UpdateuserPage;