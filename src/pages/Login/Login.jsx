import React, { useEffect, useState } from 'react';
import './login.css'; // Thêm style CSS nếu cần thiết
// import P35 from '../../../public/Product/35.png';
import api from '../../Components/utils/requestAPI';
import useAuth from '../../hooks/useAuth';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { GoogleAuthProvider, signInWithRedirect, getRedirectResult, signInWithPopup } from 'firebase/auth';
import { auth } from '../../firebase/config';

const Login = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [authen, setAuthen] = useState('');
  const { setAuth } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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

          if (!user.isActive) {
            window.alert("Tài khoản của bạn chưa được kích hoạt. Vui lòng liên hệ Admin để kích hoạt tài khoản");
            localStorage.removeItem('Authen'); // Xóa thông tin đăng nhập
            setAuthen(null); // Đặt lại state
            return;
          }

          setAuth({ user, authen });
          if (user.roleId === '1') {
              console.log('ys');
              navigate('/Home');
              window.alert('Đăng nhập thành công');
          }
          if (user.roleId === '2') {
              navigate('/Home');
              window.alert('Đăng nhập thành công');
          } 
          if (user.roleId === '4') {
              navigate('/content');
              window.alert('Đăng nhập thành công');
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

useEffect(() => {
  const checkRedirectResult = async () => {
    try {
      const result = await getRedirectResult(auth);
      if (result) {
        const user = {
          userName: result.user.displayName,
          imageUrl: result.user.photoURL,
          email: result.user.email,
          roleId: "1",
          isActive: true
        };
        
        setAuth({ user, authen: null });
        localStorage.setItem('user', JSON.stringify(user));
        
        navigate('/Home');
      }
    } catch (error) {
      console.error('Lỗi đăng nhập:', error);
      setError('Đăng nhập thất bại. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  checkRedirectResult();
}, [navigate]);

const handleGoogleLogin = async () => {
  try {
    setIsLoading(true);
    setError(null);
    
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    
    // Tạo đối tượng user phù hợp với cấu trúc auth context
    const user = {
      userName: result.user.displayName,
      imageUrl: result.user.photoURL,
      email: result.user.email,
      roleId: "1", // Đặt roleId mặc định cho người dùng Google
      isActive: true
    };

    // Cập nhật auth context
    setAuth({ user, authen: null }); // authen có thể null vì đây là đăng nhập Google
    
    // Lưu thông tin user vào localStorage
    localStorage.setItem('user', JSON.stringify(user));
    
    console.log('Đăng nhập thành công, đang chuyển hướng...');
    navigate('/Home');
    
  } catch (error) {
    console.error('Lỗi đăng nhập:', error);
    setError('Đăng nhập thất bại. Vui lòng thử lại.');
  } finally {
    setIsLoading(false);
  }
};

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
          <h3 className='chaomung'>Chào Mừng Bạn Đến Với Colordanhub</h3>
          <p>Bạn Chưa Có Tài Khoản Colordanhub? <a href="/Signup">Đăng Ký</a></p>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="emailAddress">Email</label>
              <input
                type="text"
                id="emailAddress"
                required
                placeholder="nguyenvananh@gmail.com"
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
            <button 
              className="google-btn" 
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              {isLoading ? 'Đang đăng nhập...' : 'Google'}
            </button>
            {error && <p className="error-message">{error}</p>}
          </div>
          <p>Bạn Không Nhớ <a href="forgot-password-5.html">Mật Khẩu</a>?</p>
        </div>
      </div>
    </div>
    </div>
  );
}

export default Login;
