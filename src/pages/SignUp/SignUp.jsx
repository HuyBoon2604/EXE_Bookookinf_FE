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
  const { setAuth } = useAuth();
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = '/api/Account/registration';
    const data = {
      username : userName,
      email: email,
      password: password,
      confirmPassword : confirmPassword,
      roleId : "1"
    };
    console.log({ userName,email, password, confirmPassword });

    try {
      const response = await api.post(url, data);
      setAuth({ user: response.data, authen: true });
      alert("Bạn Đã Đăng Ký Tài Khoản Thành Công");
      navigate('/login');
    } catch (error) {
      console.error(error);
      alert("Đã xảy ra lỗi khi đăng ký!");
    }
}
  

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
                type="text"
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
          <div className='mutee'>
          <hr className="flex-grow-1" />
  <span className="muted">hoặc đăng nhập với</span>
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
