import React, { useState,useCallback,useEffect } from "react";
import "./StudioInfor.css";
import { toast, ToastContainer } from 'react-toastify';
import api from '../../utils/requestAPI';
import { CiDollar } from "react-icons/ci";
import { useParams,useNavigate } from 'react-router-dom';
import { FaStar } from "react-icons/fa6";
import { MdLightMode } from "react-icons/md";
import { MdCleaningServices } from "react-icons/md";
import { FaWifi } from "react-icons/fa6";
import { FaRegNewspaper } from "react-icons/fa";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import useAuth from '../../../hooks/useAuth';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import Footer from "../../../Components/Items/Footer/Footer";
import { TbAirConditioning } from "react-icons/tb";
import { MdOutlineSurroundSound } from "react-icons/md";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";


dayjs.extend(utc);
dayjs.extend(timezone);


dayjs.tz.setDefault('Asia/Ho_Chi_Minh'); 
const StudioInfor = () => {
  const [selectedImage, setSelectedImage] = useState(null); 
  const [isGroupOpened, setIsGroupOpened] = useState(false); 
  const [studio, setstudio] = useState([]);
const [stardate, setStardate] = useState(dayjs().tz('Asia/Ho_Chi_Minh'));
const [checkin, setcheckin] = useState(null);
const [checkout, setcheckout] = useState(null);
const [review, setreview] = useState([]);
const { id } = useParams();
const { auth } = useAuth();
const [BookingId, setBookingId] = useState([]);
const [isExpanded, setIsExpanded] = useState(false);
const [bookedTimes, setBookedTimes] = useState([]);

const center = [21.03279, 105.78788];

    const toggleExpand = () => {
      setIsExpanded(!isExpanded);
  };
  
 
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const handleDateChange = (newDate) => {
    setStardate(newDate.tz('Asia/Ho_Chi_Minh'));
  };

  const handleTimeChange = (newValue, setState) => {
    const localTime = newValue?.tz('Asia/Ho_Chi_Minh'); 
    setState(localTime);
  };
  


  const fetchStudio = useCallback(async () => {
    try {
      const response = await api.get(
        `/Get-All-Image-Of-Studio-By-StudioId?StudioId=${id}`
      );
  
      console.log("API response:", response.data);
      const data = response.data;
  
      setstudio(data); 
  
     
      const studioImages = [
        data.imageUrl1 && { src: data.imageUrl1, name: "Hình 1" },
        data.imageUrl2 && { src: data.imageUrl2, name: "Hình 2" },
        data.imageUrl3 && { src: data.imageUrl3, name: "Hình 3" },
        data.imageUrl4 && { src: data.imageUrl4, name: "Hình 4" },
        data.imageUrl4 && { src: data.imageUrl5, name: "Hình 5" },
       
        
       
      ].filter(Boolean); 
  
      setImages(studioImages); 
    } catch (error) {
      toast.error("Error fetching studio!");
    }
  }, [id]);

  const isOwner = auth.user?.id === studio.studio?.accountId;
  const fetchreview = async () => {
    
    try {
      const response = await api.get(
        `/Get-All-Review-By-StudioId?studioId=${id}`
      );
      console.log('API review:', response);
      console.log('API review:', response.data);

    
      const extractedStudio = Array.isArray(response.data) ? response.data : response.data?.$values || [];
      setreview(extractedStudio);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  
  useEffect(() => {
    fetchStudio();
    fetchreview();
  }, [fetchStudio], [fetchreview]);

  
  
  
  
  const [visibleReviews, setVisibleReviews] = useState(4); 

  const handleShowMore = () => {
    setVisibleReviews((prev) => Math.min(prev + 4, review.length)); // Thêm 4 đánh giá, tối đa là tổng số đánh giá
  };

  const closeModal = () => {
    setSelectedImage(null);
  };
 
  
  const handleNavigate = (accountId) => {
    navigate(`/Profile/${accountId}`);
  };
  const validateTime = (checkin, checkout) => {
    if (!checkin || !checkout) return false; // Nếu một trong hai là null, trả về false
    return checkout.isAfter(checkin);
  };
   const Showconfirmbooking = () => {
          confirmAlert({
              title: <span className="custom-confirm-alert">Đặt Studio</span>,
              message: <span className='custom-confirm'>Bạn có muốn kiểm tra lại thông tin trước khi đặt studio ?</span>,
              buttons: [
                  {
                      label: 'Có',
                      onClick: () => handleBooking(),
                  },
                  {
                      label: 'Không'
                  },
              ],
          });
      };
  const handleBooking = async () => {
    if (!validateTime(checkin, checkout)) {
      toast.error("Thời gian kết thúc phải lớn hơn thời gian bắt đầu!");
      return;
    }
  
    
    console.log("Booking Date:", stardate.format('DD-MM-YYYY'));
    console.log("Check-in:", checkin.format('HH:mm:ss'));
    console.log("Check-out:", checkout.format('HH:mm:ss'));
  
    try {
      const url = '/Add-New-Booking';
      const data = {
        accountId: auth.user.id,
        studioId: id,
        bookingDate: stardate.format('DD-MM-YYYY'), 
        checkIn: checkin.format('HH:mm:ss'), 
        checkOut: checkout.format('HH:mm:ss'), 
      };
  
      const response = await api.post(url, data);
      if (response.status === 200 && response.data && response.data.id) {
        const cBookingId = response.data.id;
       
        navigate(`/order/${cBookingId}`);
        console.log("cBooking created successfully, ID:", cBookingId);
      } else {
        console.error("cBooking creation failed or response is missing 'id'.", response);
      }
    } catch (error) {
      console.error(error);
      console.log("aaaaa",auth)
    }
  };
  
  const disablePastDates = (date) => {
    return date.isBefore(dayjs(), 'day');
  };
  useEffect(() => {
    if (!stardate || !id) return;

    const fetchBookedTimes = async () => {
      try {
        const formattedDate = stardate.format("DD-MM-YYYY");
        const apiUrl = `/Get-Successful-BookingDates-By-Studio/${id}?dateStr=${formattedDate}`;
        
        const response = await api.get(apiUrl);
        console.log(response.data);
        const booked = response.data.map(({ checkIn, checkOut }) => ({
          start: dayjs(stardate)
            .hour(checkIn.trim().split(":")[0])
            .minute(checkIn.trim().split(":")[1])
            .second(0),
          end: dayjs(stardate)
            .hour(checkOut.trim().split(":")[0])
            .minute(checkOut.trim().split(":")[1])
            .second(0),
        }));
        setBookedTimes(booked);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu đặt phòng:", error);
      }
    };

    fetchBookedTimes();
    // const mockBookedData = [
    //   { start: "09:00", end: "10:30" },
    //   { start: "14:00", end: "15:00" },
    //   { start: "16:30", end: "18:00" },
    // ];

    // const booked = mockBookedData.map(({ start, end }) => ({
    //   start: dayjs(stardate).hour(start.split(":")[0]).minute(start.split(":")[1]),
    //   end: dayjs(stardate).hour(end.split(":")[0]).minute(end.split(":")[1]),
    // }));

    // setBookedTimes(booked);
  }, [stardate, id]);
  const isTimeBooked = (time) => {
    return bookedTimes.some(
      ({ start, end }) => time.isAfter(start.subtract(1, "minute")) && time.isBefore(end.add(1, "minute"))
    );
  };
  const isRangeOverlapping = (start, end) => {
    return bookedTimes.some(
      ({ start: bookedStart, end: bookedEnd }) =>
        (start.isBefore(bookedEnd) && end.isAfter(bookedStart)) 
    );
  };

  const isCheckoutDisabled = (time) => {
    if (!checkin) return isTimeBooked(time);
    return time.isBefore(checkin.add(30, "minute")) || isTimeBooked(time);
  };

  const formattedPrice = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
  .format(studio.studio?.pricing)
  .replace('₫', 'VND')
  .trim();

  const isWithinStudioHours = (time) => {
    if (!studio.studio?.timeOn || !studio.studio?.timeOff) return false;
  
    const timeOn = dayjs(studio.studio.timeOn, "HH:mm");
    const timeOff = dayjs(studio.studio.timeOff, "HH:mm");
  
    return time.isAfter(timeOn.subtract(1, "minute")) && time.isBefore(timeOff.add(1, "minute"));
  };
  return (
    <div id="StudioInfor">
  
    
    <div className="image-gallery">
  <div className="image-main">
    <img
      src={studio.studio?.imageStudio}
      alt=""
      className="main-img"
      onClick={() => setSelectedImage(studio.imageStudio)}
    />
  </div>

  <div className="image-thumbnails">
   
    {images.slice(0, 3).map((img, index) => (
      <div key={index} className="image-item">
        <img
          src={img.src}
          alt={img.name}
          className="gallery-img"
          onClick={() => setSelectedImage(img.src)}
        />
      </div>
    ))}

    {/* Khung thứ 4 */}
    <div className="image-item">
  {images[3] && images[3].src ? (
    <img
      src={images[3].src}
      alt={images[3].name}
      className="gallery-img"
      onClick={() => setSelectedImage(images[3].src)}
    />
  ) : images.length > 4 ? (
    <div className="image-with-overlay">
      <div className="overlay-text">+{images.length - 4} hình ảnh</div>
    </div>
  ) : (
    <div className="empty-square"></div> 
  )}
</div>
  </div>
</div>

     
      {selectedImage && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-button" onClick={closeModal}>
              &times;
            </span>
            <img src={selectedImage} alt="Selected" className="modal-image" />
          </div>
        </div>
      )}

     <div className="studio-info-chua">
     <div className="studio-info">
        <div className="info-title">

        <h1 className="studio-name">{studio.studio?.studioName}</h1>
        <h1 className="studio-adress">{studio.studio?.studioAddress}</h1>
        <hr  width="100%" align="left" />
 <div className="about-space">
    <h3 className="title-vuivai">Mô tả tiện ích</h3>
    <p className={`description-vuivui ${isExpanded ? 'expanded' : ''}`}>
      {isExpanded ? studio.studio?.studioDescriptionAmentitiesDetail : `${studio.studio?.studioDescriptionAmentitiesDetail?.slice(0, 300)}...`}
    </p>
    <button onClick={toggleExpand} className="read-more-btn">
      {isExpanded ? 'Hạn chế' : 'Xem Thêm'}
    </button>
    <hr  width="100%" align="left" />
    <div className="amenities-section">
  <h2 className="amen-title">Tiện nghi được cung cấp</h2>
  <ul className="amenities-list">
    <li className="type-amen">
      <MdLightMode />
      <span className="phukien">Ánh sáng</span>
    </li>
    <li className="type-amen">
    <MdCleaningServices />
      <span className="phukien">Không gian</span>
    </li>
    <li className="type-amen">
    <FaWifi />
      <span className="phukien">Wifi</span>
    </li>
    <li className="type-amen">
    <FaRegNewspaper />
      <span className="phukien">Quy định</span>
    </li>
    <li className="type-amen">
    <TbAirConditioning />
      <span className="phukien">Máy lạnh</span>
    </li>
    <li className="type-amen">
    <MdOutlineSurroundSound />
      <span className="phukien">Âm thanh</span>
    </li>
   
  </ul>
</div>
{/* <div className="location-hehe">
      <div className="tittle-local">
        <h2 className="diadiem">Location</h2>
      </div>
      <MapContainer
        center={center}
        zoom={15}
        style={{ width: "100%", height: "400px" }}
      >
      
        <TileLayer
  url={`https://mapapis.openmap.vn/v1/tiles/{z}/{x}/{y}?apikey=${"C6gl6YCxg3oeLpfO2atFBY2ia1m1rBr9"}`}
  attribution='&copy; <a href="https://openmap.vn/">OpenMap.vn</a>'
/>
        <Marker position={center}>
          <Popup>Vị trí của bạn</Popup>
        </Marker>
      </MapContainer>
    </div> */}
<hr width="100%" align="left"></hr>
<div class="listing-section-margins" id="ophours_section"><h2 class="h5"><span>Giờ hoạt động</span></h2>
<div className="thuchua"><div class="flex space-between "><div class="flex-one">Thứ hai</div><div class="flex-one"><div>{studio.studio?.timeOn} Giờ - {studio.studio?.timeOff} Giờ</div>
</div></div><div class="flex space-between "><div class="flex-one">Thứ ba</div><div class="flex-one"><div>{studio.studio?.timeOn} Giờ - {studio.studio?.timeOff} Giờ</div>
</div></div><div class="flex space-between "><div class="flex-one">Thứ tư</div><div class="flex-one"><div>{studio.studio?.timeOn} Giờ - {studio.studio?.timeOff} Giờ</div>
</div></div><div class="flex space-between "><div class="flex-one">Thứ năm</div><div class="flex-one"><div> {studio.studio?.timeOn} Giờ - {studio.studio?.timeOff} Giờ</div>
</div></div><div class="flex space-between "><div class="flex-one">Thứ sáu</div><div class="flex-one"><div>{studio.studio?.timeOn} Giờ - {studio.studio?.timeOff} Giờ</div>
</div></div><div class="flex space-between "><div class="flex-one">Thứ bảy</div><div class="flex-one"><div>{studio.studio?.timeOn} Giờ - {studio.studio?.timeOff} Giờ</div>
</div></div><div class="flex space-between "><div class="flex-one">Chủ nhật</div><div class="flex-one"><div>{studio.studio?.timeOn} Giờ - {studio.studio?.timeOff} Giờ</div></div></div></div></div>
<hr  width="100%" align="left" />
<div className="review-chua">
      <div className="review-vui">
        <h2 className="review-title">Đánh giá</h2>
        <h2 className="rate-review">({review.length})</h2>
      </div>

      <div className="reviews-section">
  {review.slice(0, visibleReviews).map((reviews, index) => (
    <div
      className="review"
      key={index}
      onClick={() => handleNavigate(reviews.accountId)}
      style={{ cursor: "pointer" }}
    >
      <div>
        <img src={reviews.account?.imageUrl} alt="" className="hinh-reviewer" />
      </div>
      <div className="chuareviewandrating">
       
        <strong className="tenreview">{reviews.account?.userName}</strong>
        <div className="rating">
          {[...Array(5)].map((star, i) => {
            const ratingValue = i + 1;
            return (
              <span
                key={i}
                className="star"
                style={{
                  color: ratingValue <= reviews.rating ? "#ffc107" : "#e4e5e9",
                }}
              >
                &#9733;
              </span>
            );
          })}
        </div>
      
        
        <p>{reviews.reviewMessage}</p>
        <p className="reviewdate">
          ({new Date(reviews.reviewDate).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })})
        </p>
      </div>
    </div>
  ))}
</div>

      {visibleReviews < review.length && ( 
        <button className="show-more-button" onClick={handleShowMore}>
          Xem thêm
        </button>
      )}
      <Footer />
    </div>
  </div>
        </div>
       
        {!isOwner && (
        <div className="booking-section">
         
             
        <h3 className="price-title">
  <CiDollar className="dollar" />
  <span className="price-text">Giá</span>
</h3>
         
       
          <div className="price-details">
            <div className="pricechuavui">
            <span className="price">
            {formattedPrice} / Giờ
</span>
            {/* <span className="discount">10% off</span> */}
            </div>
         
          </div>
          <div className="booking-form">
          
            <div>

<h3 className="dateandtime">Ngày và Giờ</h3>

            </div>
            <div className="vuivuihe">
            <div className="start-Date">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer  components={['DatePicker']}>
        <DatePicker  value={stardate}   onChange={handleDateChange } label="Ngày bắt đầu" format="DD/MM/YYYY" shouldDisableDate={disablePastDates} sx={{
    '& .MuiInputLabel-root': { color: 'black' }, 
    '& .MuiInputLabel-root.Mui-focused': { color: 'blue' }, 
  }} />
        
      </DemoContainer>
    </LocalizationProvider>
    </div>
           
<div className="timechua">  
<LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer    components={['TimePicker']}>
      <TimePicker
       id="time"
  value={checkin}
  onChange={(newValue) => handleTimeChange(newValue, setcheckin)}
  label="Thời gian bắt đầu"
  shouldDisableTime={(value) =>!isWithinStudioHours(value) || isTimeBooked(value)}
  disabled={!stardate}
  views={['hours']} 
  sx={{
    '& .MuiInputLabel-root': { color: 'black' }, 
    '& .MuiInputLabel-root.Mui-focused': { color: 'blue' }, 
  }}
/>
      </DemoContainer>
    </LocalizationProvider>
    </div>
    <div className="timechua"> 
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer  components={['TimePicker']}>
      <TimePicker
      id="time"
  value={checkout}
  onChange={(newValue) => {
    if (checkin && !isRangeOverlapping(checkin, newValue)) {
      setcheckout(newValue);
    }
  }}
  shouldDisableTime={(value) =>
    !checkin || value.isBefore(checkin.add(30, "minute")) || isRangeOverlapping(checkin, value)|| !isWithinStudioHours(value)
  }
  disabled={!stardate || !checkin}
  views={['hours']} 
  label="Thời gian kết thúc"
  sx={{
    '& .MuiInputLabel-root': { color: 'black' }, 
    '& .MuiInputLabel-root.Mui-focused': { color: 'blue' }, 
  }}
  // shouldDisableTime={(value) => isCheckoutDisabled(value)}
  // disabled={!stardate || !checkin}
/>
      </DemoContainer>
    </LocalizationProvider>
    </div>
    {!validateTime(checkin, checkout) && (
    <p style={{ color: 'red', fontSize: '14px', marginTop: '10px', marginLeft: '35px' }}>
      Thời gian kết thúc phải lớn hơn thời gian bắt đầu!
    </p>
  )}
</div>
            {/* <input type="time" id="time" className="starttime" value={checkin} onChange={(e)=> setcheckin(e.target.value)} />
            <input type="time" id="time" className="endtime" value={checkout} onChange={(e)=> setcheckout(e.target.value)} /> */}
 
           <div className="btn-booking">
           

            <button 
        className="booking-button"
        onClick={Showconfirmbooking} 
        tabIndex={0}
        aria-label="Book this dance class"
      
      >
         Đặt Studio
      </button>
           </div>
           
          
          </div>
        </div>
      )}
      </div>
     </div>
     
      
      

    </div>
    
    
  );
};

export default StudioInfor;
    