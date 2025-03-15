import React, { useEffect, useState } from 'react';
import './login.css'; // Thêm style CSS nếu cần thiết
// import P35 from '../../../public/Product/35.png';
import api from '../../Components/utils/requestAPI';
import useAuth from '../../hooks/useAuth';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { GoogleAuthProvider, signInWithRedirect, getRedirectResult, signInWithPopup } from 'firebase/auth';
import { auth } from '../../firebase/config';
import { showNotification } from '../../Components/utils/notifications';

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
    setIsLoading(true);
    setError(null);
    
    const url = '/api/Account/log-in';
    const data = {
      email: email,
      password: password
    };

    try {
      const response = await api.post(url, data);
      localStorage.setItem('Authen', JSON.stringify(response.data));
      setAuthen(response.data);
    } catch (error) {
      console.error(error);
      setError('Tên đăng nhập hoặc mật khẩu không chính xác');
      showNotification('Tên đăng nhập hoặc mật khẩu không chính xác', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const authData = localStorage.getItem('Authen');
    if (authData) {
      try {
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
        const response = await api.get(url);
        var user = response.data;

        if (!user.isActive) {
          showNotification("Tài khoản của bạn chưa được kích hoạt. Vui lòng liên hệ Admin để kích hoạt tài khoản", 'error');
          localStorage.removeItem('Authen');
          setAuthen(null);
          return;
        }

        setAuth({ user, authen });
        
        // Chuyển hướng dựa trên vai trò
        if (user.roleId === '1') {
          navigate('/Home');
          showNotification('Đăng nhập thành công!', 'success');
        }
        if (user.roleId === '2') {
          navigate('/Home');
          showNotification('Đăng nhập thành công!', 'success');
        } 
        if (user.roleId === '4') {
          navigate('/content');
          showNotification('Đăng nhập thành công!', 'success');
        }
        if (user.roleId === '3') {
          navigate('/adminmanager');
          showNotification('Đăng nhập thành công!', 'success');
        }
      } catch (error) {
        console.error(error);
        localStorage.removeItem('Authen');
      }
    }
    
    if (authen) {
      fetchUserData();
    }
  }, [authen, navigate, setAuth]);

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
      showNotification('Đăng nhập thành công!', 'success');
      
    } catch (error) {
      console.error('Lỗi đăng nhập:', error);
      setError('Đăng nhập thất bại. Vui lòng thử lại.');
      showNotification('Đăng nhập thất bại. Vui lòng thử lại.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="Login">
      <div className="login-container">
        <div className="hero-wrap">
          <div className="hero-content">
            <div className="container">
              <div className="row">
                <div className="col">
                  <div className="logo">
                    {/* Logo content if needed */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="login-form">
          <h3 className="chaomung">Chào Mừng Đến Colordanhub</h3>
          <p>Bạn chưa có tài khoản? <a href="/Signup">Đăng ký ngay</a></p>
          
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="emailAddress">Email</label>
              <input
                type="email"
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
                placeholder="Nhập mật khẩu"
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
              <label htmlFor="remember-me">Lưu thông tin đăng nhập</label>
            </div>
            
            <button 
              type="submit" 
              disabled={isLoading}
            >
              {isLoading ? 'Đang xử lý...' : 'Đăng Nhập'}
            </button>
          </form>
          
          {/* <div className="divider">
            <div className="divider-line"></div>
            <div className="divider-text">Hoặc</div>
            <div className="divider-line"></div>
          </div> */}
          
          {/* <div className="social-login">
            <button 
              className="google-btn" 
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              {isLoading ? 'Đang xử lý...' : 'Đăng nhập với Google'}
            </button>
          </div> */}
          
          <p>Quên mật khẩu? <a href="/forgot-password">Khôi phục ngay</a></p>
        </div>
      </div>
    </div>
  );
}

export default Login;
