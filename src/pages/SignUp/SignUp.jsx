import React, { useState } from 'react';
import api from '../../Components/utils/requestAPI';
import './signup.css'; // Thêm style CSS nếu cần thiết
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [userType, setUserType] = useState("customer");
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [account, setAccount] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = '/api/Account/registration';
    const roleId = userType === "customer" ? "1" : "2";
    const data = {
      username: userName,
      email: email,
      password: password,
      confirmPassword: confirmPassword,
      roleId: roleId,
    };

    try {
      const response = await api.post(url, data);
      if (response.status === 200) {
        setAccount(response.data);
        setShowVerification(true);
      }
    } catch (error) {
      console.error(error);
      alert("Đã xảy ra lỗi khi đăng ký!");
    }
  };

  const handleVerificationChange = (index, value) => {
    if (!/^\d?$/.test(value)) return; // Chỉ cho phép nhập số (hoặc xóa)
  
    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode); // Giữ dạng mảng
  
    if (value && index < 5) {
      const nextInput = document.getElementById(`verification-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleVerify = async () => {
    const code = verificationCode.join('');
    console.log(code);
    console.log(email);
    try {
      const response = await api.post(`/api/Account/verify-account?email=${email}&verificationCode=${code}`);
      if (response.status === 200) {
        setAuth({ user: response.data, authen: true });
        alert("Xác thực thành công!");
        navigate('/login');
      }
    } catch (error) {
      alert("Mã xác thực không đúng!");
    }
  };

  return (
    <div id="Signup" >
    <div className="login-container">
      {/* Hero Section */}
      <div className="hero-wrap">
        <div className="hero-content">
          <div className="container">
            <div className="row">
              <div className="col">
                <div className="logo">
                  <a href="index.html" title="Oxyy">
                    {/* <img src={P35} alt="Oxyy" /> */}
                  </a>
                </div>
                {/* <h1>We are glad to see you again!</h1>
                <p>Log In with QR Code</p> */}
                {/* <img src="images/qr-code.jpg" className="qr-code" alt="QR code" /> */}
                {/* <p className="description">Scan this with your camera or our mobile app to login instantly.</p> */}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Login Form Section */}
      <div className="login-form">
        <div className="container">
          <h3>Chào Mừng Bạn Đến Với Colordanhub</h3>
          <p>Bạn Đã Có Tài Khoản Rồi? <a href="/login">Đăng Nhập Ngay</a></p>
          {showVerification ? (
            <div className="verification-form">
              <div className="verification-header">
                <button className="back-arrow" onClick={() => setShowVerification(false)}>
                  ←
                </button>
                <h2>Xác thực email của bạn</h2>
                <p>Vui lòng nhập mã xác thực gồm 6 chữ số đã được gửi đến email <strong>{email}</strong></p>
              </div>
              
              <div className="verification-inputs">
                {verificationCode.map((digit, index) => (
                  <input
                    key={index}
                    id={`verification-${index}`}
                    type="text"
                    maxLength="1"
                    placeholder="•"
                    value={digit}
                    onChange={(e) => handleVerificationChange(index, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Backspace' && !digit && index > 0) {
                        const prevInput = document.getElementById(`verification-${index - 1}`);
                        if (prevInput) prevInput.focus();
                      }
                    }}
                  />
                ))}
              </div>

              <button className="verify-button" onClick={handleVerify}>
  <span>Xác thực</span>
</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label htmlFor="loginPassword">Họ Tên</label>
                <input
                  type="text"
                  id="loginPassword"
                  required
                  placeholder="Nhập Họ Tên Của Bạn"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>

              <div className="input-group">
                <label htmlFor="emailAddress">Tên Đăng Nhập</label>
                <input
                  type="email"
                  id="emailAddress"
                  required
                  placeholder="Nhập Tài Khoản"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="input-group">
                <label htmlFor="loginPassword">Mật Khẩu</label>
                <input
                  type="password"
                  id="loginPassword"
                  required
                  placeholder="Nhập Mật Khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="input-group">
                <label htmlFor="confirmPassword">Xác Nhận Mật Khẩu</label>
                <input
                  type="password"
                  id="confirmPassword"
                  required
                  placeholder="Nhập Lại Mật Khẩu"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <div className="user-type-selection">
                <label >Bạn Muốn Trở Thành:</label>
                <div className="radio-group">
                  <label>
                    <input
                      type="radio"
                      name="userType"
                      value="customer"
                      checked={userType === "customer"}
                      onChange={() => setUserType("customer")}
                    />
                    Khách hàng Đặt Phòng
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="userType"
                      value="studioOwner"
                      checked={userType === "studioOwner"}
                      onChange={() => setUserType("studioOwner")}
                    />
                    Chủ Kinh Doanh studio 
                  </label>
                </div>
              </div>
              
              {/* <div className="remember-me">
                <input
                  type="checkbox"
                  id="remember-me"
                  name="remember"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                />
                <label htmlFor="remember-me">Keep me signed in</label>
              </div> */}
              <button type="submit">Đăng Ký</button>
            </form>
          )}
          <div className='mutee'>
          <hr className="flex-grow-1" />
  <span className="muted">Hoặc đăng nhập với</span>
  <hr className="flex-grow-1" />
  </div>
          <div className="social-login">
            <button className="facebook-btn">Facebook</button>
            <button className="google-btn">Google</button>
            <button className="twitter-btn">Twitter</button>
          </div>
          {/* <p>Need to find <a href="forgot-password-5.html">your password</a>?</p> */}
        </div>
      </div>
    </div>
    </div>
  );
}

export default Signup;
