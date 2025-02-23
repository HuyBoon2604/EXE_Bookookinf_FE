import React, { useState,useEffect } from 'react';
// import { StudioHeader } from './StudioHeader';
import './Course.css';
import api from '../../utils/requestAPI';
import useAuth from '../../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';


const galleryImages = [
  { id: 1, src: "https://img.lovepik.com/photo/40173/1392.jpg_wh860.jpg", alt: "Studio view 1" },
  { id: 2, src: "https://dkstudio.vn/wp-content/uploads/2023/03/Hinh-anh-phong-tap-DK-Dance-Studio-Quan-7-TPHCM-5.jpg", alt: "Studio view 2" },
  { id: 3, src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3i2Ylb2oFnMqxcp0MTQSMICMe-4MaYx9UtA&s", alt: "Studio view 3" },
  { id: 4, src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFlzQ_S9_5KL2qQxspsPEKp-EO6Gj_u-4uWFwpKPr0-Ou3VP6UJYRayFzfnFFBe-OdupY&usqp=CAU", alt: "Studio view 4" }
];

const reviews = [
  {
    id: 1,
    avatar: "https://www.elle.vn/app/uploads/2022/08/15/491817/co-gai-moc-mac-trong-hinh-nen-dien-thoai-scaled.jpg",
    name: "Ông Trịnh",
    date: "12 Tháng 3 2020",
    text: "Khóa học rất bổ ích"
  },
  {
    id: 2,
    avatar: "https://www.elle.vn/app/uploads/2022/08/15/491817/co-gai-moc-mac-trong-hinh-nen-dien-thoai-scaled.jpg",
    name: "Nguyễn Thị Ngọc",
    date: "12 Tháng 3 2020",
    text: "Giáo viên rất tận tâm"
  },
  {
    id: 3,
    avatar: "https://www.elle.vn/app/uploads/2022/08/15/491817/co-gai-moc-mac-trong-hinh-nen-dien-thoai-scaled.jpg",
    name: "Trịnh Trần Phương Tuấn",
    date: "12 Tháng 3 2020",
    text: "Qúa tuyệt vời"
  }
];


export const Course = () => {
  const [selectedImage, setSelectedImage] = useState(null); 
  const [isGroupOpened, setIsGroupOpened] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [user, setUser] = useState(null);
  const [studio, setStudios] = useState([]);
  const [Class, setClass] = useState([]);
  const [ClassId, setClassId] = useState('');
  const [classBooking, setclassBooking] = useState([]);
  const [orderId, setOrderId] = useState('');
  const [role, setRole] = useState([]);
  const [images, setImages] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const navigate = useNavigate();
  const { auth } = useAuth();
    const { Id } = useParams();
  const [isStudent, setIsStudent] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [showAllReviews, setShowAllReviews] = useState(false);

  const calculateAverageRating = (reviews) => {
    if (!reviews.length) return 0;
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (totalRating / reviews.length).toFixed(1); // Giữ 1 số thập phân
  };

  const handleImageSelect = (index) => {
    setSelectedImage(index);
  };
  const formatPrice = (price) => {
    if (typeof price !== "number" || isNaN(price)) {
        return "0 VNĐ"; // Giá trị mặc định nếu `price` không hợp lệ
    }
    return `${price.toLocaleString()} VNĐ`;
};
// Hàm xử lý khi bấm vào nút
const handleButtonClick = () => {
  setIsLiked(!isLiked); // Đảo trạng thái
};

  const handleKeyPress = (event, index) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleImageSelect(index);
    }
  };

  // const handleBooking = () => {
  //   if (!selectedDate || !selectedTime) {
  //     alert('Please select both date and time');
  //     return;
  //   }
  // };
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Tháng được đánh số từ 0-11, nên cần +1
    const day = String(today.getDate()).padStart(2, '0'); // Đảm bảo có đủ 2 chữ số
    return `${year}-${month}-${day}`;
};

useEffect(() => {
  async function fetchData() {
    try {
      if (Id) {
        // Bước 1: Lấy thông tin lớp học theo Id
        const classDetails = await fetchClassDetails(Id);
        setClassId(classDetails);

        // Bước 2: Lấy thông tin studio dựa vào studioId của class
        const studioDetails = await fetchStudioDetails(classDetails.studioId);
        setStudios(studioDetails);

        // Bước 3: Lấy thông tin tài khoản từ accountId của studio
        const accountDetails = await fetchAccountDetails(studioDetails.studio?.accountId);
        setUser(accountDetails);

        // Tạo mảng images từ thông tin studio
        const studioImages = [
          studioDetails.imageUrl1 && { src: studioDetails.imageUrl1, name: "Hình 1" },
          studioDetails.imageUrl2 && { src: studioDetails.imageUrl2, name: "Hình 2" },
          studioDetails.imageUrl3 && { src: studioDetails.imageUrl3, name: "Hình 3" },
          studioDetails.imageUrl4 && { src: studioDetails.imageUrl4, name: "Hình 4" },
          studioDetails.imageUrl5 && { src: studioDetails.imageUrl4, name: "Hình 5" },
          { src: "/ee53ddddc8801eaa90470f5c25934df9.jpg", name: "Hình 6" },
          { src: "/ee53ddddc8801eaa90470f5c25934df9.jpg", name: "Hình 7" },
          
          
        ].filter(Boolean);
        setImages(studioImages);
        console.log("Images:", studioImages);

        // Kiểm tra nếu user có roleId = 3
        if (auth?.user?.roleId === 3) {
          setIsStudent(true);
        }

        console.log("User Role ID:", auth.user.roleId);

        // Thêm kiểm tra trạng thái mua khóa học
        if (auth?.user?.id) {
          const purchased = await checkPurchaseStatus(Id, auth.user.id);
          setHasPurchased(purchased);
          console.log("Trạng thái mua khóa học:", purchased);
        }

        // Gọi API lấy reviews
        await fetchReviews();
      }
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
    }
  }

  fetchData();
}, [Id, auth.user.roleId]);

// Hàm lấy chi tiết lớp học theo classId
async function fetchClassDetails(classId) {
  const response = await api.get(`/Get-ClassDance-By-Id?classId=${classId}`);
  if (response.status === 200 && response.data) {
    // Nếu dữ liệu được bọc trong $values (trả về mảng), trả về mảng đó
    return response.data.$values || response.data;
  }
  throw new Error("Không thể lấy thông tin lớp học.");
}

// Hàm lấy chi tiết studio theo studioId
async function fetchStudioDetails(studioId) {
  const response = await api.get(`/Get-All-Image-Of-Studio-By-StudioId?StudioId=${studioId}`);
  if (response.status === 200 && response.data) {
    return response.data;
  }
  throw new Error("Không thể lấy thông tin studio.");
 
}

// Hàm lấy chi tiết account theo accountId
async function fetchAccountDetails(accountId) {
  const response = await api.get(`/api/Account/get-by-id?accountId=${accountId}`);
  if (response.status === 200 && response.data) {
    return response.data;
  }
  throw new Error("Không thể lấy thông tin tài khoản.");
}
// Chạy 1 lần khi component mount

// useEffect để theo dõi khi user thay đổi
// useEffect(() => {
//   if (user && user.length > 0) {
//     console.log("USER OF STUDIO:", user);
//   } else {
//     console.log("No user found or user is empty");
//   }
// }, [user]);



const handlePayment = async () => {
try {
  // Thông tin truyền vào POST
  const data_userArtwok = {
    accountId: auth.user.id,
    classDanceId: ClassId.id,
    bookingDate: getTodayDate(),
    checkIn: "String",
    checkOut: "String",
    totalPrice: ClassId.pricing,
  };

  // Tạo Booking mới
  const createClassPayment = await api.post(
    `/Add-New-Booking-ClassDance`,
    data_userArtwok
  );

  if (createClassPayment.status === 200 && createClassPayment.data && createClassPayment.data.id) {
    const cBookingId = createClassPayment.data.id;
    console.log("cBooking created successfully, ID:", cBookingId);
    setclassBooking({ id: cBookingId }); // Đảm bảo lưu dưới dạng object với `id`
  } else {
    console.error("cBooking creation failed or response is missing 'id'.", createClassPayment);
  }
} catch (error) {
  console.error("Error creating booking:", error);
}
};

useEffect(() => {
// Theo dõi sự thay đổi của `classBooking`
const createOrderAndPayment = async () => {
  if (classBooking && classBooking.id) {
    try {
      // Tạo Order mới
      const createOrder = await api.post(
        `/Create-New-Order?BookingId=${classBooking.id}`
      );

      if (createOrder.status === 200 && createOrder.data && createOrder.data.id) {
        const orderId = createOrder.data.id;
        console.log("Order created successfully, ID:", orderId);
        setOrderId({ id: orderId }); // Đảm bảo lưu dưới dạng object với `id`
      } else {
        console.error("Order creation failed or response is missing 'id'.", createOrder);
      }
    } catch (error) {
      console.error("Error creating order:", error);
    }
  }
};

createOrderAndPayment();
}, [classBooking]);

useEffect(() => {
// Theo dõi sự thay đổi của `orderId`
const createPaymentLink = async () => {
  if (orderId && orderId.id) {
    try {
      // Tạo đường dẫn PayOS
      const responsePayOs = await api.post(
        `/create-payment-link/${orderId.id}/checkout`
      );

      if (responsePayOs.status === 200 && responsePayOs.data && responsePayOs.data.checkoutUrl) {
        const checkoutUrl = responsePayOs.data.checkoutUrl;
        console.log("Checkout URL:", checkoutUrl);
        window.open(checkoutUrl, "_blank"); // Mở trong tab mới
      } else {
        console.error(
          "Payment link creation failed or response is missing 'checkoutUrl'.",
          responsePayOs
        );
      }
    } catch (error) {
      console.error("Error creating payment link:", error);
    }
  }
};

createPaymentLink();
}, [orderId]);
const closeModal = () => {
  setSelectedImage(null);
};

const handleShareClick = async () => {
  try {
    const currentUrl = window.location.href; // Lấy đường dẫn hiện tại
    await navigator.clipboard.writeText(currentUrl); // Sao chép vào clipboard
    window.alert('Đã sao chép đường dẫn của Studio!'); // Cập nhật thông báo
    
  } catch (error) {
    window.alert("Sao chép thất bại, vui lòng thử lại.");
    console.error("Error copying link:", error);
  }
};

// Thêm hàm kiểm tra khóa học đã mua
const checkPurchaseStatus = async (classId, accountId) => {
  try {
    const response = await api.get(`/Check-Student-Booking-Class?classDanceId=${classId}&accountId=${accountId}`);
    return response.status === 200 && response.data;
  } catch (error) {
    console.error("Lỗi khi kiểm tra trạng thái mua khóa học:", error);
    return false;
  }
};

// Thêm hàm xử lý đánh giá
const handleReview = () => {
  // Chuyển đến form đánh giá
  window.location.href = `/review/${Id}`;
};

// Thêm hàm fetchReviews
const fetchReviews = async () => {
  try {
    const response = await api.get('/Get-All-Review');
    console.log('Review Data:', response.data);
    
    // Lưu dữ liệu vào state
    const reviewData = Array.isArray(response.data) ? response.data : response.data?.$values || [];

    // Gọi API lấy thông tin account cho mỗi review
    const reviewsWithAccounts = await Promise.all(
      reviewData.map(async (review) => {
        if (review.accountId) {
          const account = await fetchAccountForReview(review.accountId);
          return { ...review, account }; // Gán thông tin account vào review
        }
        return review;
      })
    );

    setReviews(reviewsWithAccounts);
  } catch (error) {
    console.error('Error fetching reviews:', error);
  }
};

// Hàm lấy thông tin tài khoản từ API
const fetchAccountForReview = async (accountId) => {
  try {
    const response = await api.get(`/api/Account/get-by-id?accountId=${accountId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching account for ID ${accountId}:`, error);
    return null; // Trả về null nếu lỗi để tránh crash
  }
};

// Thêm hàm xử lý hiển thị thêm reviews
const handleShowMoreReviews = () => {
  setShowAllReviews(true);
};

  return (
    <div id="Course">
    <div className="pageContainer">
      {/* <StudioHeader /> */}
      
      <div className="mainContent">
      {/* <div className="hostInfo">
              <img
                src="https://chiemtaimobile.vn/images/companies/1/%E1%BA%A2nh%20Blog/avatar-facebook-dep/Anh-dai-dien-ngau-chat-cho-con-trai-hut-thuoc.jpg?1704788544123"
                alt="Host Valentino Jr"
                className="hostAvatar"
                loading="lazy"
                width={76}
                height={76}
              />
              <div className="hostDetails">
                {/* <span className="listedBy">Listed By:</span> */}
                {/* <h2 className="hostName">{user?.userName}</h2> */}
                {/* <span className="priceRange">For: $ 1000 - $ 5000</span> */}
              {/* </div>
            </div> */}
      <div className="image-gallery">
        
        <div className="image-main">
          <img
            src={studio?.stduio?.imageStudio}

            alt=""
            className="main-img"
            onClick={() => setSelectedImage(studio?.stduio?.imageStudio)}
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
          +{images.length - 6} hình ảnh
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
        
        <div className="contentGrid">
          <div className="leftColumn">
            <section className="classInfo">
            <div className="titleHeader">
            <div className="titleContainer">
              <h1 className="className">{ClassId.className}</h1>
              <p className="teacherName">Nguyễn Việt Anh</p>
              </div>
              <div className="actionButtons">
              <button
      className="actionIcon"
      tabIndex="0"
      onClick={handleButtonClick} // Gọi hàm khi bấm
      // style={{ border: "none", background: "none", cursor: "pointer" }}
    >
      <img
  loading="lazy"
  src={isLiked ? "https://i.imgur.com/1ApLOZv.png"  : "https://cdn.builder.io/api/v1/image/assets/TEMP/11ec6460177dcabcb2bed7c443e2c9330b46ad24af935eb07fe2d8c5f552402b?placeholderIfAbsent=true&apiKey=c05fb6b607a34c3cab6bc37bd3664ed7"}
  alt="Action button"
  // style={{
  //   maxWidth: "100%", // Đảm bảo ảnh không vượt quá kích thước nút
  //         maxHeight: "100%",
  //         position: "absolute", // Tách ảnh khỏi bố cục cha
  //         top: "50%", // Căn giữa dọc
  //         left: "50%", // Căn giữa ngang
  //         transform: "translate(-50%, -50%)", // Dịch ảnh về chính giữa
  // }}
  // className="actionIcon"
/>
      <span className="visually-hidden">Perform action</span>
    </button>
  <button className="shareIcon" tabIndex="0" onClick={handleShareClick}>
    <img
      loading="lazy"
      src="https://cdn.builder.io/api/v1/image/assets/TEMP/07371e2ba2b94190780c47c86259b57d63466e5fc5d5c16bf302e31d95ffac3f?placeholderIfAbsent=true&apiKey=c05fb6b607a34c3cab6bc37bd3664ed7"
      alt="Share button"
      className="shareIcon"
    />
    <span className="visually-hidden">Share</span>
  </button>
</div>
</div>
  
              <h2 className="sectionTitle">Thông Tin Lớp Học</h2>
              <p className="description">
                {ClassId.description}
              </p>
            </section>

            <section className="reviewsSection" aria-labelledby="reviewsTitle">
              <div className="reviewsHeader">
                <h2 id="reviewsTitle" className="reviewsTitle">Đánh Giá</h2>
                <div className="rating">
                {[...Array(Math.round(calculateAverageRating(reviews)))].map((_, index) => (
    <img 
      key={index}
      src="/star.png"
      alt="star"
      className="starIcon"
      width={20}
      height={20}
    />
  ))}
                  <span className="ratingScore" aria-label={`Rating ${calculateAverageRating(reviews)} out of 5`}>
  {calculateAverageRating(reviews)}
</span>
                </div>
              </div>

              <div className="reviewsList">
                {(showAllReviews ? reviews : reviews.slice(0, 3)).map((review) => (
                  <article key={review.id} className="reviewCard">
                    <div className="reviewerInfo">
                      <img
                        src={review.account?.imageUrl || "https://i.imgur.com/pRy9nMo.png"}
                        alt={`${review.account?.userName}'s profile`}
                        className="reviewerAvatar"
                        width={70}
                        height={70}
                        loading="lazy"
                      />
                      <div className="reviewerDetails">
                        <h3 className="reviewerName">{review.account?.userName}</h3>
                        <time className="reviewDate" dateTime={review.createAt}>
                          {new Date(review.createAt).toLocaleDateString()}
                        </time>
                      </div>
                    </div>
                    <div className="reviewContent">
                      <div className="reviewRating">
                        {[...Array(review.rating)].map((_, index) => (
                          <img 
                            key={index}
                            src="/star.png"
                            alt="star"
                            className="starIcon"
                            width={20}
                            height={20}
                          />
                        ))}
                      </div>
                      <p className="reviewText">{review.reviewMessage}</p>
                    </div>
                  </article>
                ))}
              </div>

              {reviews.length > 3 && !showAllReviews && (
                <button 
                  className="showAllButton"
                  onClick={handleShowMoreReviews}
                  aria-label={`Show all ${reviews.length} reviews`}
                >
                  Xem thêm đánh giá
                </button>
              )}
            </section>
          </div>

          <div className="rightColumnCover">
          <div className="priceContainer">
      <div className="priceHeader">
        {/* <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/b924c4810595165877c0ee0cb66d62f8fcf049b8e44824705f472789c1e5d0ea?placeholderIfAbsent=true&apiKey=c05fb6b607a34c3cab6bc37bd3664ed7"
          className="priceIcon"
          alt="Price icon"
        /> */}
        <div>Khóa Học </div>
        {/* {ClassId.className} */}
      </div>
      
      <div className="feeContainer">
        <div className="courseFee">Chi Phí Khóa Học</div>
        {/* <div className="priceTag">$500</div> */}
        <div className="priceTag">{formatPrice(ClassId.pricing)}</div>
      </div>
      
      <div className="detailsContainer">
        <div className="leftColumn">
        <div className="skillLevel">Thời Gian Học</div>
        <div className="skillLevel">Ngày Bắt Đầu</div>
        <div className="skillLevel">Ngày Kết Thúc</div>
          <div className="skillLevel">Trình Độ</div>
          <div className="classDay">Ngày Học Trong Tuần</div>
          <div className="danceStyle">Phong Cách</div>
        </div>
        <div className="rightColumn">
          <div className="rightInner">
          <div className="skillLevel">{ClassId.timeStart} - {ClassId.timeEnd}</div> 
            <div className="basic">{ClassId.dateStart}</div>
            <div className="basic">{ClassId.dateEnd}</div>
            <div className="basic">Cơ Bản</div>
          </div>
          <div className="schedule">Thứ {ClassId.dateOfWeek}</div>
          <div className="hiphop">Hiphop</div>
        </div>
      </div>
      
      {auth?.user?.roleId !== "3" && (
        <>
          {hasPurchased ? (
            <button 
              className="reviewButton"
              onClick={handleReview}
              tabIndex={0}
              aria-label="Review this class"
            >
              Đánh giá khóa học
            </button>
          ) : (
            <button 
              className="bookingButton"
              onClick={handlePayment} 
              tabIndex={0}
              aria-label="Book this dance class"
            >
              Mua Khóa Học
            </button>
          )}
        </>
      )}
    </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};
