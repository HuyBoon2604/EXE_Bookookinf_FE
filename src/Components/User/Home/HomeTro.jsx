import React, { useState, useEffect, useCallback } from 'react';
import api from '../../utils/requestAPI';
import "./HomeTro.css";
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import 'swiper/css/autoplay';
import Slider from "react-slick";

import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

import { useTranslation } from 'react-i18next';
import { Navigation, Pagination,Autoplay } from "swiper/modules";
import { CiGlobe } from "react-icons/ci";
import { FaArrowRight } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa";



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
  const images = [
    { src: 'Product/476359764_122108515478729479_1248223907243159727_n.jpg', alt: 'Image 1', className:"anhloai" },
    { src: 'Product/476611813_122108515466729479_7299893898540809122_n.jpg', alt: 'Image 2',className:'anhloai' },
    { src: 'Product/476646027_122108515508729479_7375026997810637215_n.jpg', alt: 'Image 3',className:'anhloai' },
    { src: 'Product/476761131_122108515562729479_244088617098562024_n.jpg', alt: 'Image 4', className:'anhloai'},
    { src: 'Product/476952536_122108515538729479_2228140383379190301_n.jpg', alt: 'Image 5',className:'anhloai' },
];


    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };
  useEffect(() => {
    const fetchStudio = async () => {
      const url = "api/Studio/Get-All-Studio-With-IsActive-True";
      try {
        const response = await api.get(url);
        console.log('API raw response:', response);
        console.log('API data:', response.data);

        // Check if response.data is an array or an object
        const extractedStudio = Array.isArray(response.data) ? response.data : response.data?.$values || [];
        
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
            "Tìm các lựa chọn không gian đa dạng và dễ dàng đặt lịch chỉ với một lần bấm.",
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
const handleSeeMoreClick = (event, description) => {
  event.preventDefault();
  alert(description);
};

const settings = {
  // dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  arrows: true, // Thêm dòng này để hiển thị mũi tên
  responsive: [
    { breakpoint: 1024, settings: { slidesToShow: 2 } },
    { breakpoint: 600, settings: { slidesToShow: 1 } }
  ]
};

  return (
    <div id="Home">
    <div className="homepage-body">
   
          
      <section className="search-section">
    
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
  <img src="\Dance Studio Neon Sign, Custom Dancer Led Sign, Custom Dancer LED, Dance Studio Bedroom Neon Sign, Playroom Custom LED Neon Light Decor.jpg" alt="" className='imagewwhy' />
</div><div className='Colordanbanchua'>
  <h2 className='Colordanban'>Bạn</h2>
</div>
<div className='Colordanduocchua'>
  <h2 className='Colordanduoc'>Được</h2>
</div>
<div className='Colordangichua'>
  <h2 className='Colordangi'>Gì ?</h2>
</div>

{/* <div className='chuahoahd'>
<img src="\flower.gif" alt="" className='hoahd' />
</div>



<div className='chuahoahduoi'>
<img src="\flower.gif" alt="" className='hoahduoi' />
</div> */}

<div style={{ width: "50%", top: "50vh", position: "absolute", left: "90vh" }}>
  <Swiper
    modules={[Navigation, Pagination, Autoplay]}
    navigation
    
    spaceBetween={30}
    slidesPerView={1}
    loop={true}
    autoplay={{
      delay: 6000, 
      disableOnInteraction: false, 
    }}
  >
    {slides.map((slide, index) => (
      <SwiperSlide key={index}>
        <div className="baihopchus">
          <h2 className="thebaihoc">{slide.title}</h2>
          <h4 className="desbaihoc">{slide.description}</h4>
        </div>
      </SwiperSlide>
    ))}
  </Swiper>
</div>

      </div>
      <div className="carousel-container">
            <h1 className='madein'>Made in <span className='colordan'>Colordanhub</span></h1>
            <div className="carousel">
                <button className="carousel-button prev" onClick={prevSlide}> <FaArrowLeft /></button>
                <div className="carousel-inner">
                    {images.map((image, index) => (
                        <div
                            key={index}
                            className={`carousel-item ${index === currentIndex ? 'active' : ''}`}
                        >
                            <img src={image.src} alt={image.alt} />
                        </div>
                    ))}
                </div>
                <button className="carousel-button next" onClick={nextSlide}><FaArrowRight /></button>
            </div>
        </div>
      <div className="pop-title-contian">    
         <h2 className="popular-title">STUDIO NỔI BẬT</h2> </div>
     
      <section className="popular-studios">
        
      <div className="studio-list">
      <Slider {...settings}>
        {Studio.map((studio) => (
          <div className="card" key={studio.id} onClick={() => handleCardClick(studio.id)}>
            <div className="card-image">
              <img src={studio.imageStudio} alt={studio.title} />
              <div className="card-price">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(studio.pricing)} / Giờ
              </div>
            </div>
            <div className="card-content">
              <h3 className="card-title">{studio.studioName}</h3>
              <p className="card-address">{studio.studioAddress}</p>
              <div className="card-rating">
                <span className="rating-stars">⭐ {studio.ratingId} ({studio.reviews})</span>
                <span className="rating-reviews">👤 {studio.visitors}</span>
              </div>
              <p className="card-description">
  {studio.studioDescription?.length > 20 ? (
    <>
      {studio.studioDescription.substring(0, 100)}...
      <button
        onClick={(e) => handleSeeMoreClick(e, studio.studioDescription)}
        className="see-more-button"
      >
        Xem thêm
      </button>
    </>
  ) : (
    studio.studioDescription || "Không có mô tả"
  )}
</p>

            </div>
          </div>
        ))}
      </Slider>
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
