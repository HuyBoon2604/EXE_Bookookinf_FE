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
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";

import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

import { useTranslation } from 'react-i18next';
import { Navigation, Pagination,Autoplay } from "swiper/modules";
import { CiGlobe } from "react-icons/ci";
import { FaArrowRight } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa";
import axios from 'axios';



const HomeTro = () => {
  const [Studio, Setstudio] = useState([]);
  const [searchLocation, setSearchLocation] = useState('');
  const [districts, setDistricts] = useState([]); // Danh sách quận/huyện
  const [searchTerm, setSearchTerm] = useState(""); // Giá trị ô tìm kiếm
  const [filteredDistricts, setFilteredDistricts] = useState([]); // Danh sách gợi ý
  const [showDropdown, setShowDropdown] = useState(false);
  useEffect(() => {
    // Gọi API để lấy danh sách tất cả quận/huyện
    axios
      .get("https://provinces.open-api.vn/api/?depth=2")
      .then((response) => {
        let allDistricts = [];
        response.data.forEach((province) => {
          province.districts.forEach((district) => {
            allDistricts.push({
              name: district.name,
              province: province.name,
            });
          });
        });
        setDistricts(allDistricts);
      })
      .catch((error) => console.error("Error fetching districts:", error));
  }, []);
 
  const handleInputChange = (event) => {
  const value = event.target.value;
  setSearchTerm(value);

  if (value.trim() === "") {
    setFilteredDistricts([]);
    setShowDropdown(false);
    return;
  }

  const searchValue = removeVietnameseTones(value.toLowerCase());

  const results = districts.filter((district) =>
    removeVietnameseTones(district.name.toLowerCase()).includes(searchValue)
  );

  setFilteredDistricts(results);
  setShowDropdown(results.length > 0);
};

  const handleSelectDistrict = (districtName) => {
    setSearchTerm(districtName);
    setShowDropdown(false);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/searchpage?location=${encodeURIComponent(searchTerm)}`);
    }
  };
  const handelthuephongtap = () =>{
navigate('/thuephong')


  }
  const navigate = useNavigate();
  const images = [
    { src: 'Product/476359764_122108515478729479_1248223907243159727_n.jpg', alt: 'Image 1', className:"anhloai" },
    { src: 'Product/476611813_122108515466729479_7299893898540809122_n.jpg', alt: 'Image 2',className:'anhloai' },
    { src: 'Product/476646027_122108515508729479_7375026997810637215_n.jpg', alt: 'Image 3',className:'anhloai' },
    { src: 'Product/476761131_122108515562729479_244088617098562024_n.jpg', alt: 'Image 4', className:'anhloai'},
    { src: 'Product/476952536_122108515538729479_2228140383379190301_n.jpg', alt: 'Image 5',className:'anhloai' },
];


    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentIndex1, setCurrentIndex1] = useState(0);
    const nextSlide1 = () => {
      setCurrentIndex1((prevIndex) => (prevIndex + 1) % Studio.length);
    };
  
    const prevSlide1 = () => {
      setCurrentIndex1((prevIndex) => (prevIndex - 1 + Studio.length) % Studio.length);
    };
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
        title: "Không gian lý tưởng cho những bước nhảy hoàn hảo",
        description:
            "Khám phá các phòng tập nhảy được trang bị đầy đủ tiện nghi, phù hợp cho mọi phong cách nhảy từ cổ điển đến hiện đại.",
    },
    {
        title: "Đặt phòng tập nhảy dễ dàng và nhanh chóng",
        description:
            "Tìm và đặt ngay những phòng tập chất lượng cao, phù hợp với lịch trình và nhu cầu của bạn.",
    },
    {
        title: "Khóa học nhảy chuyên nghiệp dành cho mọi lứa tuổi",
        description:
            "Tham gia các khóa học nhảy đa dạng, từ cơ bản đến nâng cao, với đội ngũ giảng viên giàu kinh nghiệm.",
    },
];
useEffect(() => {
  const interval = setInterval(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  }, 5000); 

  return () => clearInterval(interval);
}, [slides.length]);
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
// const [isExpanded, setIsExpanded] = useState(false);
//     const toggleExpand = (id) => {
//         setIsExpanded((prev) => ({
//           ...prev,
//           [id]: !prev[id] 
//         }));
//       };
const dropdownStyle = {
  position: "absolute",
  top: "40px",
  left: 0,
  width: "100%",
  backgroundColor: "#fff",
  border: "1px solid #ccc",
  borderRadius: "5px",
  maxHeight: "200px",
  overflowY: "auto",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  zIndex: 1000,
};
const removeVietnameseTones = (str) => {
  return str
    .normalize("NFD") // Tách dấu khỏi ký tự
    .replace(/[\u0300-\u036f]/g, "") // Xóa các dấu
    .replace(/đ/g, "d") // Chuyển đ -> d
    .replace(/Đ/g, "D"); // Chuyển Đ -> D
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
  value={searchTerm}
  onChange={handleInputChange}
  onFocus={() => setShowDropdown(filteredDistricts.length > 0)}
 />
   {showDropdown && (
          <ul className="dropdown-list" style={dropdownStyle}>
            {filteredDistricts.map((district, index) => (
              <li
                key={index}
                onClick={() => handleSelectDistrict(district.name)}
                className="dropdown-item"
              >
                {district.name}, {district.province}
              </li>
            ))}
          </ul>
        )}
<button type="button" className='button-search' onClick={handleSearchSubmit}>Tìm kiếm</button>
          </div>
        </div>
      </section>
     {/* <div className='tongohyeah'> */}
     <section className='nenhometong'>
     <div className='khungcha'>
  <div className='khungcon'> 
    <div className='khungconcon'>
      <div className='chua-title-con'>
        <h2 className='title-con'>FIND YOUR IDEAL STUDIO SPACE</h2>
      </div>

      <div className='chua-des-con'>
        <h3 className='des-con'>Find the ideal space for your next session</h3>
      </div>

      <div className='btn-thuephongtap'>
        <button onClick={handelthuephongtap} className='thuephongcon'>Thuê phòng tập</button>
      </div>
    </div>
  </div>

  <div className="slideanhstu">
    <div className="anhluot">
      <img src="/pexels-hikaique-307847.jpg" alt="" className="anhluotcon" />
      <img src="https://ava-grp-talk.zadn.vn/a/1/9/8/4/360/36650c664e257c37760d0f7a27fe0a8d.jpg" alt="Logo" className="logo-trai-tren" />
    </div>
  </div>

  {/* Thêm 2 logo vào góc dưới bên trái */}
  <div className="logos-duoi-trai">
  <a href="https://www.facebook.com/profile.php?id=61571884383793" target="_blank" rel="noopener noreferrer">
   <FaFacebook className="logo-duoi-trai" style={{ color: "#1877F2", fontSize: "20px" }} />
   </a>
   <a href="https://www.instagram.com/colordanhub.dance/" target="_blank" rel="noopener noreferrer">
    <FaInstagram className="logo-duoi-trai" style={{ color: "#E4405F", fontSize: "20px", marginLeft: "15px" }} />
    </a>
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
      <div className="baihopchus">
        <h2 className="thebaihoc">{slides[currentIndex]?.title}</h2>
        <h4 className="desbaihoc">{slides[currentIndex]?.description}</h4>
      </div>

      <div style={{ marginTop: "10px" }}>
        {slides.map((_, index) => (
          <span
            key={index}
            onClick={() => setCurrentIndex(index)}
            style={{
              display: "None",
              width: "10px",
              height: "10px",
              margin: "5px",
              backgroundColor: index === currentIndex ? "black" : "gray",
              borderRadius: "50%",
              cursor: "pointer",
            }}
          ></span>
        ))}
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
                            <img className='hinhtheloai' src={image.src} alt={image.alt} />
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
      <button onClick={prevSlide1} className="prev-button"><FaArrowLeft /></button>
      <div className="card-container">
        {Studio.slice(currentIndex1, currentIndex1 + 3).map((studio) => (
          <div className="card" key={studio.id}>
            <div className="card-image" >
              <img src={studio.imageStudio} alt={studio.title} onClick={() => handleCardClick(studio.id)} />
              <div className="card-price">
                {new Intl.NumberFormat('vi-VN').format(Number(studio.pricing) || 0)} VND / Giờ
              </div>
            </div>
            <div className="card-content">
              <h3 className="card-title">{studio.studioName}</h3>
              <p className="card-address">{studio.studioAddress}</p>
              <div className="card-rating">
                <span className="rating-stars">⭐ {studio.ratingId} ({studio.reviews})</span>
                <span className="rating-reviews">👤 {studio.visitors}</span>
                
              </div>
              <p className='descripvui'>{studio?.studioDescription}</p>
             
            </div>
          </div>
        ))}
      </div>
      <button onClick={nextSlide1} className="next-button"><FaArrowRight /></button>
    </div>
      </section>

      </div>
      
    </div>
    // </div>
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
