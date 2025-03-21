import React, { useState, useRef, useEffect } from 'react';
import './Header.css';
import useAuth from '../../../hooks/useAuth';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CiGlobe } from "react-icons/ci";

export default function Header() {
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [showLanguages, setShowLanguages] = useState(false);
  const location = useLocation();
  const { t, i18n } = useTranslation();

  // Sử dụng ref riêng cho dropdown tài khoản và dropdown ngôn ngữ
  const accountDropdownRef = useRef(null);
  const languageDropdownRef = useRef(null);

  const handleLogout = () => {
    setAuth({ user: null });
    localStorage.clear();
    navigate("/"); 
  };

  const handleLanguageChange = (lng) => {
    i18n.changeLanguage(lng);
    console.log(`Ngôn ngữ đã được thay đổi sang: ${lng}`);
  };

  const toggleLanguageDropdown = () => {
    setShowLanguages((prev) => !prev);
  };

  const toggleDropdownVisible = (e) => {
    e.stopPropagation();
    setDropdownVisible((prev) => !prev);
  };

  // Hàm kiểm tra click bên ngoài cho dropdown tài khoản
  const handleClickOutside = (event) => {
    if (
      accountDropdownRef.current &&
      !accountDropdownRef.current.contains(event.target) && // Kiểm tra nếu click không nằm trong dropdown
      event.target.closest(".contentImage") === null // Đảm bảo click không phải vào ảnh profile
    ) {
      setDropdownVisible(false);
    }
    if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target)) {
      setShowLanguages(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div id="Header" data-role={auth?.user?.roleId || "1"}>
      <div className="mainHeader">
        <div className="navGroup">
          <a href="/home" className='thea'>
            <img
              loading="lazy"
              src="https://ava-grp-talk.zadn.vn/a/1/9/8/4/360/36650c664e257c37760d0f7a27fe0a8d.jpg"
              className="logo"
              alt="Studio logo"
              width={62}
              height={62}
            /> 
            <h2 className="header-logo">Colordanhub</h2>
          </a>
          <nav className="navigation" aria-label="Main navigation">
            <button 
              className={`navItem ${location.pathname === '/Home' ? 'active' : ''}`}
            >
              <a href="/Home">TRANG CHỦ</a>
            </button>
            {auth?.user?.roleId === "2" && (
              <button 
                className={`navItem ${location.pathname === '/studio' ? 'active' : ''}`}
              >
                <a href="/studio">QUẢN LÝ STUDIO</a>
              </button>
            )}
            <button 
              className={`navItem ${location.pathname === '/thuephong' ? 'active' : ''}`}
            >
               <a href="/thuephong">THUÊ PHÒNG TẬP  NHẢY</a>
            </button>
            <button 
              className={`navItem ${location.pathname.startsWith('/Course') ? 'active' : ''}`}
            >
              LỚP NHẢY
              <div className="dropdown">
                <a href="/Course/class1">Lớp Thứ 2-4-6</a>
                <a href="/Course/class2">Lớp Thứ 3-5-7</a>
              </div>
            </button>         
            <button 
              className={`navItem ${location.pathname === '/Contact' ? 'active' : ''}`}
            >
              <a href="/Contact">TIN TỨC</a>
            </button>
          </nav>
          
        </div>
        <div className="actionGroup">
          <div className='icon-translate'>
            <div className='icon-translate1' ref={languageDropdownRef}>
            <CiGlobe className="globe-icon" onClick={toggleLanguageDropdown} />
            {showLanguages && (
              <div className="language-dropdown">
                <button className='btn_en' onClick={() => handleLanguageChange('en')}>
                  <img src='\united-states-of-america.png' className='anhmy'/> English
                </button>
                <button className='btn_vi' onClick={() => handleLanguageChange('vi')}>
                  <img src='\vietnam.png' className='anhvietnam'/> Tiếng Việt
                </button>
              </div>
            )}
          </div></div>
        
          <div className="hostGroup">
            <div>
              {auth?.user ? (
                <div className="profile-container">
                  <div className="profile-wrapper">
                    <img
                      loading="lazy"
                      src={auth.user.imageUrl || "https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg"}
                      className="profile-avatar"
                      alt="User profile"
                    />
                    <button className="menu-toggle" onClick={(e) => toggleDropdownVisible(e)}>
                      <span className="toggle-line"></span>
                      <span className="toggle-line"></span>
                      <span className="toggle-line"></span>
                    </button>
                  </div>
                  
                  {dropdownVisible && (
                    <div className="dropdownMenu" ref={accountDropdownRef}>
                      <h2>{auth?.user?.userName}</h2>
                      ---------------------------------
                      <button className="logout-button">
                        <a href="/Reservation">Lịch Sử</a>
                      </button>
                      <button className="logout-button">
                        <a href="/updateuser">Tài Khoản</a>
                      </button>
                      {auth?.user?.roleId === "2" && (
                        <button className="logout-button">
                          <a href="/studio">Quản lý studio</a>
                        </button>
                      )}
                      ---------------------------------
                      <button className="logout-button" onClick={handleLogout}>
                        Đăng Xuất
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="auth-buttons">
                  <button className="login-button">
                    <a href="/Login">Đăng Nhập</a>
                  </button>
                  <button className="signup-button">
                    <a href="/Signup">Đăng Ký</a>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}