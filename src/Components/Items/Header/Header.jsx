import React, { useState } from 'react';
import './Header.css';
import useAuth from '../../../hooks/useAuth';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Navigation, Pagination } from "swiper/modules";
import { CiGlobe } from "react-icons/ci";

export default function Header() {
  const { auth, setAuth } = useAuth();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const location = useLocation();

  const handleLogout = () => {
    setAuth({ user: null }); 
    localStorage.clear()
    setDropdownVisible(false); 
    
  };
  const { t, i18n } = useTranslation();
  const [showLanguages, setShowLanguages] = useState(false);
  
  const handleLanguageChange = (lng) => {
    i18n.changeLanguage(lng); 
    console.log(`Ngôn ngữ đã được thay đổi sang: ${lng}`);
    console.log(t('homepage.findStudio'));
  
  };
  const toggleLanguageDropdown = () => {
    setShowLanguages(!showLanguages);
  };
  return (
    <div id="Header">
      <div className="mainHeader">
        <div className="navGroup">
          <a href="/home">
            <img
              loading="lazy"
              src="https://ava-grp-talk.zadn.vn/a/1/9/8/4/360/36650c664e257c37760d0f7a27fe0a8d.jpg"
              className="logo"
              alt="Studio logo"
              width={62}
              height={62}
            />
          </a>
          <nav className="navigation" aria-label="Main navigation">
      <button 
        className={`navItem ${location.pathname === '/Home' ? 'active' : ''}`}
      >
        <a href="/Home">TRANG CHỦ</a>
      </button>
      <button 
        className={`navItem ${location.pathname === '/Rental' ? 'active' : ''}`}
      >
        THUÊ PHÒNG TẬP NHẢY
      </button>
      <button 
        className={`navItem ${location.pathname === '/Course' ? 'active' : ''}`}
        
      >
        <a href="/Course">LỚP NHẢY</a>
        <div className="dropdown">
    <a href="/Course">Course 1</a>
    <a href="/Course2">Course 2</a>
  </div>
      </button>         
      <button 
        className={`navItem ${location.pathname === '/Contact' ? 'active' : ''}`}
      >
        <a href="/Contact">LIÊN HỆ</a>
      </button>
    </nav>
     <CiGlobe className="globe-icon"  onClick={toggleLanguageDropdown}  />
               {showLanguages && (
                 <div className="language-dropdown">
                   <button className='btn_en' onClick={() => handleLanguageChange('en')}><img src='\united-states-of-america.png' className='anhmy'/> English</button>
                   <button className='btn_vi' onClick={() => handleLanguageChange('vi')}><img src='\vietnam.png' className='anhvietnam'/> Tiếng Việt</button>
                 </div>
               )}
        </div>

        <div className="actionGroup">
          {/* <button className="downloadApp" aria-label="Download mobile app">
            Tải Về Phiên Bản App
          </button> */}
          <div className="hostGroup">
            {/* <button className="hostButton" aria-label="Become a host">
              Trở Thành Chủ Studio
            </button> */}
            <div>
              {auth?.user ? (
                <div className="imageContainer">
                  <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/5df20729ee94e58904c9f308479cb5c731926066ec9735296b6160062a8c308b?placeholderIfAbsent=true&apiKey=c05fb6b607a34c3cab6bc37bd3664ed7"
                    className="contentImage"
                    alt="User profile"
                    onClick={() => setDropdownVisible(!dropdownVisible)}
                    style={{ cursor: 'pointer' }}
                  />

                  {dropdownVisible && (
                    <div
                      className="dropdownMenu"
                     
                    >

                      <button className="logout-button"
                        
                      >
                         <a href="/Reservation" >Lịch Sử</a>
                      </button>
                      <button className="logout-button"
                        
                      >
                        <a href={`/updateuser`}>Tài Khoản</a>

                      </button>
                      <button className="logout-button"
                        onClick={handleLogout} 
                      >
                        Đăng Xuất
                      </button>
                      
                    </div>
                    
                  )}
                </div>
              ) : (
                <div className="auth-buttons">
                  <button className="login-button">
                  <a href="/Login" >Đăng Nhập</a>

                  </button>
                  <button className="signup-button">
                  <a href="/Signup" >Đăng Ký</a>
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
