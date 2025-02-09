import React, { useState, useEffect, useCallback } from 'react';
import api from '../../utils/requestAPI';
import "./HomeTro.css";
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useTranslation } from 'react-i18next';
import { Navigation, Pagination } from "swiper/modules";
import { CiGlobe } from "react-icons/ci";




const HomeTro = () => {
  const [Studio, Setstudio] = useState([]);
  const [searchLocation, setSearchLocation] = useState('');
  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (searchLocation.trim()) {
      navigate(`/searchpage?location=${searchLocation}`);
    }
  };
  const navigate = useNavigate();
  useEffect(() => {
    const fetchStudio = async () => {
      const url = "api/Studio/Get-All-Studio-With-IsActive-True";
      try {
        const response = await api.get(url);
        console.log('API raw response:', response);
        console.log('API data:', response.data);
        console.log('API $values:', response.data.$values);
      
        const extractedStudio = response.data?.$values || [];
        Setstudio(extractedStudio);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchStudio();
  }, []);
  
  const handleCardClick = (id) => {
    navigate(`/StudioInfor/${id}`);
  };
  const handleLogin = () => {
    navigate(`/Login`);
  };
  const handleSignup = () => {
    navigate(`/Signup`);
  };
  const slides = [
    {
        title: "Những khả năng mới và không bao giờ kết thúc",
        description:
            "Tìm mọi thứ từ các studio được trang bị chuyên nghiệp đến các phòng và nhà ở độc đáo.",
    },
    {
        title: "Khám phá không gian độc đáo",
        description: "Đặt trước những không gian tạo cảm hứng cho buổi họp, sự kiện, hoặc dự án sáng tạo của bạn.",
    },
    {
        title: "Linh hoạt dành cho mọi người",
        description:
            "Tìm các lựa chọn không gian đa dạng và dễ dàng đặt lịch chỉ với một lần bấmmmmmmmmmm.",
    },
];
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
    <div id="Home">
    <div className="homepage-body">
   
          
      <section className="search-section">
      {/* <div className="header-lo">
    <div className="logo-container-lo">
      <img src="public\36650c664e257c37760d0f7a27fe0a8d.jpg" alt="Logo" className="logo-lo" />
    </div>
    
    <div className="auth-buttons">
      <button type="button" onClick={handleLogin} className="login-button">Đăng nhập</button>
      <button type="button" onClick={handleSignup}  className="signup-button">Đăng kí</button>
    </div>
  </div> */}
     <div className="language-selector">
           
          
         </div>
        <div className="overlay">
        
          <h1 className="title-hometro">{t('homepage.findStudio')}</h1>
          <div className="search-bar">
          <div className="image-pop-chua">
             <img className="image-pop" src="\dancing.gif"  />
            
            </div>  
           
            <input
  className="search-where"
  type="text"
  placeholder="Tìm kiếm dựa trên địa điểm"
  value={searchLocation}
  onChange={(e) => setSearchLocation(e.target.value)}
 />
<button type="button" className='button-search' onClick={handleSearchSubmit}>Tìm kiếm</button>
          </div>
        </div>
      </section>
      <div className='wcolordancecontain'>
<div className='whychua'>
  <h2 className='whyne'>Chọn</h2>
</div>

<div className='Colordanchua'>
  <h2 className='Colordanhub'>Colordanhub</h2>
</div>

  <div className='imagewhychua'>
  <img src="https://i.pinimg.com/736x/b0/81/a2/b081a21a7993f4beaede2ec6b5261a7d.jpg" alt="" className='imagewwhy' />
</div><div className='Colordanbanchua'>
  <h2 className='Colordanban'>Bạn</h2>
</div>
<div className='Colordanduocchua'>
  <h2 className='Colordanduoc'>Được</h2>
</div>
<div className='Colordangichua'>
  <h2 className='Colordangi'>Gì ?</h2>
</div>

<div className='chuahoahd'>
<img src="\flower.gif" alt="" className='hoahd' />
</div>



<div className='chuahoahduoi'>
<img src="\flower.gif" alt="" className='hoahduoi' />
</div>

<div style={{ width:"50%", top: "50vh" ,position:"absolute", left:"90vh"}}>
            <Swiper
                modules={[Navigation, Pagination]}
                navigation
                spaceBetween={30}
                slidesPerView={1}
                loop={true}
            >
                {slides.map((slide, index) => (
                    <SwiperSlide key={index}>
                        <div className="baihopchus" >
                            <h2 className="thebaihoc">{slide.title}</h2>
                            <h4 className="desbaihoc">{slide.description}</h4>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
      </div>
      <div className="pop-title-contian">    
         <h2 className="popular-title">STUDIO NỔI BẬT</h2> </div>
     
      <section className="popular-studios">
        
      <div className="studio-list">
      {Studio.map((studio) => (
        <div className="card" key={studio.id}
        onClick={() => handleCardClick(studio.id)}>
          <div className="card-image">
            <img src={studio.imageStudio} alt={studio.title} />
            <div className="card-price">{studio.pricing}VND/Giờ</div>
          </div>
          <div className="card-content">
            <h3 className="card-title">{studio.studioName}</h3>
            <p className="card-address">{studio.studioAddress}</p>
            <div className="card-rating">
              <span className="rating-stars">⭐ {studio.ratingId} ({studio.reviews})</span>
              <span className="rating-reviews">👤 {studio.visitors}</span>
            </div>
            <p className="card-description">
              {studio.studioDescription}
              <a href="#"> Show more</a>
            </p>
          </div>
        </div>
      ))}
    </div>
      </section>

    
      
    </div>
    </div>
  );
};
const StudioCard = ({ imageUrl, title, location, price }) => {
  return (
    <div className="studio-card">
       <div className="studio-card">
  
    <img src={imageUrl} alt={title} />
    <div className="studio-chua">
      <h3 className="studio-title">{title}</h3>
      <p className="studio-location">{location}</p>
      <p className="studio-price">{price}</p>
    </div>
  </div>
</div>
  
  );
};

export default HomeTro;
