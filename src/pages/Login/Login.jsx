import React, { useEffect, useState } from 'react';
import './login.css'; // Thêm style CSS nếu cần thiết
// import P35 from '../../../public/Product/35.png';
import api from '../../Components/utils/requestAPI';
import useAuth from '../../hooks/useAuth';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [authen, setAuthen] = useState('');
  const { setAuth } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const url = '/api/Account/log-in';
    const data = {
      email: email,
      password: password
    };

    try {
        console.log(data);
        const response = await api.post(url, data);
        console.log(response.data)
        localStorage.setItem('Authen', JSON.stringify(response.data));
        setAuthen(response.data)
    } catch (error) {
        console.error(error);
        setLoginError('Tên đăng nhập hoặc mật khẩu không chính xác'); 
        window.alert('Tên đăng nhập hoặc mật khẩu không chính xác'); 
    }
}

useEffect(() => {
  const authData = localStorage.getItem('Authen');
  if (authData) {
      try {
          // const decodedAuth = JSON.parse(authData);
          const decodedToken = jwtDecode(authData);
          const currentTime = Date.now() / 1000;
          if (decodedToken.exp > currentTime) {
              setAuthen(authData);
          }
      } catch (error) {
          console.error(error);
      }
  }
}, []);

useEffect(() => {
  async function fetchUserData() {
      try {
          var decode = jwtDecode(authen);
          var userid = decode.AccountID;
          const url = `/api/Account/get-by-id?accountId=${userid}`;
          // const paymentUrl = `/api/Payment/get-payment?OrderId=${cartItems[0]?.orderId}`;
          const headers = {
              'accept': '*/*',
              'Content-Type': 'application/json-patch+json'
          };
          // const data = {
          //   accountId: userid
          // };
          const response = await api.get(url);
          var user = response.data;
          setAuth({ user, authen });
          if (user.roleId === '1') {
              console.log('ys');
              navigate('/Home');
          }
          if (user.roleId === '2') {
              navigate('/Home');
          } 
          if (user.roleId === '4') {
              navigate('/content');
          }
          if (user.roleId === '3') {
              navigate('/adminmanager');
              window.alert('Đăng nhập thành công');
          }
      } catch (error) {
          console.error(error);
          console.log(decode);
          console.log(userid);
          console.log(user);
          // console.log(respone);
          localStorage.removeItem('Authen'); // Xóa thông tin đăng nhập khi có lỗi xảy ra
      }
  }
  if (authen) {
      fetchUserData();
  }
}, [authen, navigate]);

  return (
    <div id="Login" >
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
          <p>Bạn Chưa Có Tài Khoản Colordanhub? <a href="/Signup">Đăng Ký</a></p>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="emailAddress">Tên Đăng Nhập</label>
              <input
                type="text"
                id="emailAddress"
                required
                placeholder="Điền Tên Đăng NHập"
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
                placeholder="Điền Mật Khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="remember-me">
              <input
                type="checkbox"
                id="remember-me"
                name="remember"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              <label htmlFor="remember-me">Lưu Thông Tin Đăng Nhập</label>
            </div>
            <button type="submit">Đăng Nhập</button>
          </form>
          <div className='mutee'>
          <hr className="flex-grow-1" />
  <span className="muted">Hoặc Đăng Nhập Với</span>
  <hr className="flex-grow-1" />
  </div>
          <div className="social-login">
            <button className="facebook-btn">Facebook</button>
            <button className="google-btn">Google</button>
            <button className="twitter-btn">Twitter</button>
          </div>
          <p>Bạn Không Nhớ <a href="forgot-password-5.html">Mật Khẩu</a>?</p>
        </div>
      </div>
    </div>
    </div>
  );
}

export default Login;
