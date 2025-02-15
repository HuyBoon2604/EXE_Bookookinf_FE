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

dayjs.extend(utc);
dayjs.extend(timezone);


dayjs.tz.setDefault('Asia/Ho_Chi_Minh'); 
const StudioInfor = () => {
  const [selectedImage, setSelectedImage] = useState(null); 
  const [isGroupOpened, setIsGroupOpened] = useState(false); 
  const [studio, setstudio] = useState([]);
  const [stardate, setstardate] = useState(dayjs("2025-01-01T09:00").tz('Asia/Ho_Chi_Minh'));
const [checkin, setcheckin] = useState(dayjs("2025-01-02T10:00").tz('Asia/Ho_Chi_Minh'));
const [checkout, setcheckout] = useState(dayjs("2025-01-02T18:00").tz('Asia/Ho_Chi_Minh'));
const [review, setreview] = useState([]);
const { id } = useParams();
const { auth } = useAuth();
const [BookingId, setBookingId] = useState([]);
 
 
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const handleDateChange = (newDate) => {
    setstardate(newDate.tz('Asia/Ho_Chi_Minh'));
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
       
        {src:"/ee53ddddc8801eaa90470f5c25934df9.jpg", name:"Hình 6"},
        {src:"/ee53ddddc8801eaa90470f5c25934df9.jpg", name:"Hình 7"},
       
      ].filter(Boolean); 
  
      setImages(studioImages); 
    } catch (error) {
      toast.error("Error fetching studio!");
    }
  }, [id]);
  const fetchreview = async () => {
    // const url = "https://cldhbe.azurewebsites.net/Get-All-Review-By-StudioId?studioId=${id}";
    try {
      const response = await api.get(
        `/Get-All-Review-By-StudioId?studioId=${id}`
      );
      console.log('API review:', response);
      console.log('API review:', response.data);

    
      const extractedStudio = response.data?.$values || [];
      setreview(extractedStudio);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  
  useEffect(() => {
    fetchStudio();
    fetchreview();
  }, [fetchStudio], [fetchreview]);

  // const images = [
   
  //   { src: "/ee53ddddc8801eaa90470f5c25934df9.jpg", name: "Hình 2" },
  //   { src: "/ee53ddddc8801eaa90470f5c25934df9.jpg", name: "Hình 3" },
  //   { src: "/ee53ddddc8801eaa90470f5c25934df9.jpg", name: "Hình 4" },
  //   { src: "/ee53ddddc8801eaa90470f5c25934df9.jpg", name: "Hình 5" },
  //   { src: "/ee53ddddc8801eaa90470f5c25934df9.jpg", name: "Hình 5" },
  //   { src: "/ee53ddddc8801eaa90470f5c25934df9.jpg", name: "Hình 5" },
  //   { src: "/ee53ddddc8801eaa90470f5c25934df9.jpg", name: "Hình 5" },
  // ];
  const dancerMasters = [
    { img: "/ec46334718d4ee1a37ca49cd652a194d.jpg",name: "Alice Johnson", specialty: "Hip Hop" },
    {img: "/0f84d7257569027cfba8ab80b5f2af88.jpg", name: "Bob Smith", specialty: "Ballet" },
    { img: "/92075231ccb6efb21748b2e7f2d9cdbd.jpg",name: "Charlie Brown", specialty: "Contemporary" },
    { img: "/7ba53e7463b4afd2c728f9beb59b65ac.jpg",name: "Diana Prince", specialty: "Jazz" },
  ];
  const Reviewer = [

{ img: "/ec46334718d4ee1a37ca49cd652a194d.jpg", date:"12/10/2024", name:"Mr Vinh", cmt:"Studio tuyệt vời với những tiện nghi tuyệt vời!"    },
{ img: "/0f84d7257569027cfba8ab80b5f2af88.jpg", date:"13/10/2024", name:"Meo Meo", cmt:"Dịch vụ tuyệt vời"    },
{ img: "/92075231ccb6efb21748b2e7f2d9cdbd.jpg", date:"14/10/2024", name:"Trịnh Trần Phương Tuấn", cmt:"Quá vừa ý với trải nghiệm thật tốt"    },
{ img: "/ec46334718d4ee1a37ca49cd652a194d.jpg", date:"12/10/2024", name:"Mr Vinh", cmt:"Studio tuyệt vời với những tiện nghi tuyệt vời!"    },
{ img: "/0f84d7257569027cfba8ab80b5f2af88.jpg", date:"13/10/2024", name:"Meo Meo", cmt:"Dịch vụ tuyệt vời"    },
{ img: "/92075231ccb6efb21748b2e7f2d9cdbd.jpg", date:"14/10/2024", name:"Trịnh Trần Phương Tuấn", cmt:"Quá vừa ý với trải nghiệm thật tốt"    },
{ img: "/ec46334718d4ee1a37ca49cd652a194d.jpg", date:"12/10/2024", name:"Mr Vinh", cmt:"Studio tuyệt vời với những tiện nghi tuyệt vời!"    },
{ img: "/0f84d7257569027cfba8ab80b5f2af88.jpg", date:"13/10/2024", name:"Meo Meo", cmt:"Dịch vụ tuyệt vời"    },
{ img: "/92075231ccb6efb21748b2e7f2d9cdbd.jpg", date:"14/10/2024", name:"Trịnh Trần Phương Tuấn", cmt:"Quá vừa ý với trải nghiệm thật tốt"    },

  ];
  const [visibleReviews, setVisibleReviews] = useState(4); // Số lượng đánh giá hiển thị ban đầu

  const handleShowMore = () => {
    setVisibleReviews((prev) => Math.min(prev + 4, review.length)); // Thêm 4 đánh giá, tối đa là tổng số đánh giá
  };

  const closeModal = () => {
    setSelectedImage(null);
  };
 
  // const handleDateChange = (newDate) => {
  //   setstardate(newDate); // Cập nhật giá trị stardate
  // };
  const handleNavigate = (accountId) => {
    navigate(`/Profile/${accountId}`);
  };
  const validateTime = (checkin, checkout) => {
    return checkout.isAfter(checkin);
  };
   const Showconfirmbooking = () => {
          confirmAlert({
              title: 'Đặt Studio',
              message: 'Bạn có muốn kiểm tra lại thông tin trước khi đặt studio ?',
              buttons: [
                  {
                      label: 'Không',
                      onClick: () => handleBooking(),
                  },
                  {
                      label: 'Có'
                  },
              ],
          });
      };
  const handleBooking = async () => {
    if (!validateTime(checkin, checkout)) {
      toast.error("Thời gian checkout phải lớn hơn thời gian checkin!");
      return;
    }
  
    
    console.log("Booking Date:", stardate.format('YYYY-MM-DD HH:mm:ss'));
    console.log("Check-in:", checkin.format('YYYY-MM-DD HH:mm:ss'));
    console.log("Check-out:", checkout.format('YYYY-MM-DD HH:mm:ss'));
  
    try {
      const url = '/Add-New-Booking';
      const data = {
        accountId: auth.user.id,
        studioId: id,
        bookingDate: stardate.format('YYYY-MM-DD HH:mm:ss'), 
        checkIn: checkin.format('YYYY-MM-DD HH:mm:ss'), 
        checkOut: checkout.format('YYYY-MM-DD HH:mm:ss'), 
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
  // useEffect(() => {
  //   // Theo dõi sự thay đổi của `BookingId`
  //   const createOrderAndPayment = async () => {
  //     if (BookingId && BookingId.id) {
  //       try {
  //         // Tạo Order mới
  //         const createOrder = await api.post(
  //           `/Create-New-Order?BookingId=${BookingId.id}`
  //         );
    
  //         if (createOrder.status === 200 && createOrder.data && createOrder.data.id) {
  //           const orderId = createOrder.data.id;
  //           alert('Create Booking Success!');
  //     // navigate(`/order/${createOrder.data.id}`);
  //           console.log("Order created successfully, ID:", orderId);

  //           // setOrderId({ id: orderId }); 
  //         } else {
  //           console.error("Order creation failed or response is missing 'id'.", createOrder);
  //         }
  //       } catch (error) {
  //         console.error("Error creating order:", error);
  //       }
  //     }
  //   };
    
  //   createOrderAndPayment();
  //   }, [BookingId]);


  return (
    <div id="StudioInfor">
    <div className="studio-page">
    
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
          {images.slice(0, -2).map((img, index) => (
            <div key={index} className="image-item">
              <img
                src={img.src}
                alt={img.name}
                className="gallery-img"
                onClick={() => setSelectedImage(img.src)}
              />
              
            </div>
          ))}

      
<div className="grouped-images" onClick={() => setIsGroupOpened(!isGroupOpened)}>
  {!isGroupOpened ? (
    <div className="grouped-images-placeholder">
    
      <div className="image-with-overlay">
        <img
         src={images[5]?.src} 
         
          className="gallery-img"
        />
       
        <div className="overlay-text">
          +{images.length - 6} more
        </div>
      </div>
    </div>
  ) : (
    <div className="grouped-images-expanded">
      {images.slice(-2).map((img, index) => (
        <div key={index} className="image-item">
          <img
            src={img.src}
            alt={img.name}
            className="gallery-img"
            onClick={() => setSelectedImage(img.src)}
          />
        </div>
      ))}
    </div>
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

     
      <div className="studio-info">
        <div className="info-title">

        <h1 className="studio-name">{studio.studio?.studioName}</h1>
        <h1 className="studio-adress">{studio.studio?.studioAddress}</h1>
        <hr  width="100%" align="left" />
        <h2 className="studio-title">Giảng viên</h2>
          <div className="dance-master-chua">

          <ul className="dancer-masters-list">
          {dancerMasters.map((dancer, index) => (
            <li key={index} className="dancer-master-item">
              <img src={dancer.img} alt="" className="hinh-dancer" />
              <p className="info-dancer">
                <strong>{dancer.name}</strong> - {dancer.specialty}
              </p>
            </li>
          ))}
        </ul>
        <hr  width="100%" align="left" top="10px"/>

          </div>

        </div>
       
        <div className="booking-section">
         
             
        <h3 className="price-title">
  <CiDollar className="dollar" />
  <span className="price-text">Giá</span>
</h3>
         
       
          <div className="price-details">
          <span className="price">
  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(studio.studio?.pricing)} / Giờ
</span>
            <span className="discount">10% off</span>
          </div>
          <div className="booking-form">
          
            <div>

<h3 className="dateandtime">Ngày và Giờ</h3>

            </div>
            <div className="start-Date">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer  components={['DatePicker']}>
        <DatePicker value={stardate}   onChange={handleDateChange} label="Ngày bắt đầu" />
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
/>
      </DemoContainer>
    </LocalizationProvider>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer  components={['TimePicker']}>
      <TimePicker
      id="time"
  value={checkout}
  onChange={(newValue) => handleTimeChange(newValue, setcheckout)}
  label="Thời gian kết thúc"
/>
      </DemoContainer>
    </LocalizationProvider>
    {!validateTime(checkin, checkout) && (
    <p style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>
      Thời gian checkout phải lớn hơn thời gian checkin!
    </p>
  )}

            {/* <input type="time" id="time" className="starttime" value={checkin} onChange={(e)=> setcheckin(e.target.value)} />
            <input type="time" id="time" className="endtime" value={checkout} onChange={(e)=> setcheckout(e.target.value)} /> */}
  </div>
           <div className="btn-booking">
             {/* <button type="submit" className="booking-button" >
             Đặt Ngay
            </button> */}

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
      
      </div>
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
  </ul>
</div>
      <hr  width="60%" align="left" top="10px"/>

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
              <img src={reviews.account.imageUrl} alt="" className="hinh-reviewer" />
            </div>
            <div>
              <strong>{reviews.account.userName}</strong>
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
    </div>
    </div>
    </div>
  );
};

export default StudioInfor;
    