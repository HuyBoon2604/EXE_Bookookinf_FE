import * as React from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { useState, useEffect, useCallback } from "react";
import useAuth from "../../../hooks/useAuth";
import api from "../../utils/requestAPI";
import { toast } from "react-toastify";
import OrderCard from "../../Items/Card/OrderCard";
import OrderHistory from "../../Items/Table/OrderHistory"
import { useNavigate } from "react-router-dom";
import { Typography, Modal, Rating, TextField, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import { Star } from "@mui/icons-material";


export default function LabTabs() {
  const [value, setValue] = useState("1");
  const [orderSuccess, setOrderSuccess] = useState([]);
  const [signedClass, setSignedClass] = useState([]);
  const [classData, setClassData] = useState([]);
  const [orderInfo, setOrderInfo] = useState([]);
  const [Capa, Setcapa] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openReviewModal, setOpenReviewModal] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [rating, setRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [existingReview, setExistingReview] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedImg, setSelectedImg] = useState(null);
  const [classReviews, setClassReviews] = useState({});
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [hasReviewed, setHasReviewed] = useState({});

  const { auth } = useAuth();
  const accountid = auth.user.id;
  const navigate = useNavigate();

  const checkPurchaseStatus = async () => { 
    try {
      const response = await api.get(`/Get-All-Order-By-AccountId?accountId=${accountid}`);
  
      if (response.status === 200 && Array.isArray(response.data)) {
        // Lấy danh sách các đơn hàng
        const orderInfos = response.data.map(order => ({
          status: order.status,
          classId: order?.booking?.classId
        }));
  
        console.log("Order Infos:", orderInfos);
  
        // Lọc các đơn hàng hợp lệ
        const signedClass1 = orderInfos.filter(order => 
          order.status === true && (order.classId === "class1" || order.classId === "class2")
        );
  
        console.log("Signed Classes:", signedClass1);
        setSignedClass(signedClass1);
  
        // Gọi API lấy dữ liệu lớp học song song
        const classDataPromises = signedClass1.map(order => 
          order.classId ? api.get(`/Get-ClassDance-By-Id?classId=${order.classId}`) : null
        );
  
        const classDataResponses = await Promise.all(classDataPromises);
        const classDataArray = classDataResponses.map(res => res?.data).filter(Boolean);
  
        console.log("Class Data:", classDataArray);
  
        // Lấy studioId từ classData
        const studioIds = classDataArray.map(classData => classData?.studioId).filter(Boolean);
  
        // Gọi API lấy hình ảnh studio song song
        const studioImagePromises = studioIds.map(studioId => 
          api.get(`/Get-All-Image-Of-Studio-By-StudioId?StudioId=${studioId}`)
        );
  
        const studioImageResponses = await Promise.all(studioImagePromises);
        const studioImagesArray = studioImageResponses.map(res => res?.data).filter(Boolean);
  
        console.log("Studio Images:", studioImagesArray);
  
        // Gộp tất cả dữ liệu vào một mảng duy nhất
        const mergedData = signedClass1.map((order, index) => ({
          orderInfo: order,
          classData: classDataArray[index] || null,
          studioImages: studioImagesArray[index] || null
        }));
  
        console.log("Merged Data:", mergedData);
  
        // Sau khi có mergedData, kiểm tra reviews cho từng lớp
        const reviewPromises = mergedData.map(item => 
          checkExistingReview(accountid, item.classData?.id)
        );
        const reviews = await Promise.all(reviewPromises);
        
        // Tạo object map classId -> review
        const reviewMap = {};
        mergedData.forEach((item, index) => {
          if (reviews[index]) {
            reviewMap[item.classData?.id] = true;
          }
        });
        
        setHasReviewed(reviewMap);
        setClassData(mergedData);
      }
    } catch (error) {
      console.error("Lỗi khi kiểm tra trạng thái mua khóa học:", error);
      setSignedClass([]);
    }
  };
  

  useEffect(() => {
    checkPurchaseStatus();
  }, []);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
        const response = await api.get(`/Get-All-Order-Success-By-AccounId?accountId=${accountid}`);
        const extractedOrders = Array.isArray(response.data) ? response.data : response.data?.$values || [];
        console.log("Orders:", extractedOrders);
        setOrderSuccess(extractedOrders);
    } catch (error) {
        toast.error("Error fetching orders data: " + error.message);
    } finally {
        setLoading(false);
    }
}, [accountid]);

const fetchCapacities = useCallback(async (studioIds) => {
  setLoading(true);
  try {
    const capacityPromises = studioIds.map(async (studioId) => {
      const response = await api.get(`/Get-Capacity-By-StudioId?StudioId=${studioId}`);
    
    
      
      return { studioId, capacity: response.data };
    });

    const capacities = await Promise.all(capacityPromises);
    const capacitiesMap = capacities.reduce((acc, { studioId, capacity }) => {
      acc[studioId] = capacity;
      return acc;
    }, {});

    console.log("Capacities Map:", capacitiesMap);
    Setcapa(capacitiesMap);
  } catch (error) {
    toast.error("Error fetching capacities: " + error.message);
  } finally {
    setLoading(false);
  }
}, []);

useEffect(() => {
  const fetchAllData = async () => {
    await fetchOrders();
  };
  fetchAllData();
}, [fetchOrders]);

useEffect(() => {
  if (orderSuccess.length > 0) {
    const studioIds = orderSuccess
      .map(order => order.booking?.studio?.id || order.studioId)
      .filter((id, index, arr) => id && arr.indexOf(id) === index);
    fetchCapacities(studioIds);
  }
}, [orderSuccess, fetchCapacities]);

const handleReviewClick = (orderId, studioId) => {
  navigate(`/review/${orderId}/${studioId}`);
};

const getClassStatus = (startDate, endDate) => {
  if (!startDate || !endDate) return "Chưa xác định";

  const currentDate = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  const normalizeDate = (date) => {
    const normalized = new Date(date);
    normalized.setHours(0, 0, 0, 0);
    return normalized;
  };

  const normalizedCurrent = normalizeDate(currentDate);
  const normalizedStart = normalizeDate(start);
  const normalizedEnd = normalizeDate(end);

  console.log("normalizedCurrent:", normalizedCurrent);
  console.log("normalizedStart:", normalizedStart);
  console.log("normalizedEnd:", normalizedEnd);

  if (normalizedCurrent.getTime() > normalizedEnd.getTime()) {
    return {
      status: "Đã hoàn thành",
      color: "#2196F3"
    };
  } else if (
    normalizedCurrent.getTime() >= normalizedStart.getTime() && 
    normalizedCurrent.getTime() <= normalizedEnd.getTime()
  ) {
    return {
      status: "Đang học",
      color: "#4CAF50"
    };
  } else if (normalizedCurrent.getTime() < normalizedStart.getTime()) {
    return {
      status: "Chưa bắt đầu",
      color: "#FFC107"
    };
  }

  return {
    status: "Chưa xác định",
    color: "#757575"
  };
};

const checkExistingReview = async (accountId, classId) => {
  try {
    const response = await api.get(`/Get-Review-By-AccountId-${accountId}-and-ClassId-${classId}`);
    console.log("aaaaa",response.data)
    return response.data;
    
  } catch (error) {
    console.error("Lỗi khi kiểm tra đánh giá:", error);
    return null;
  }
};

const handleOpenReview = async (classData,classImg) => {
  setSelectedClass(classData);
  setSelectedImg(classImg);
  const existingReview = await checkExistingReview(accountid, classData.id);
  
  if (existingReview) {
    setExistingReview(existingReview);
    setRating(existingReview.rating);
    setReviewComment(existingReview.reviewMessage);
  } else {
    setExistingReview(null);
    setRating(0);
    setReviewComment('');
  }
  
  setOpenReviewModal(true);
};

const handleCloseReview = () => {
  setOpenReviewModal(false);
  setSelectedClassId(null);
};

const handleUpdateReview = async () => {
  try {
    console.log("Sending update with:", {
      reviewId: existingReview.id,
      reviewRating: rating,
      reviewMessage: reviewComment
    });

    const response = await api.put(
      `/Update-Classdance-Review?rating=${rating}&reviewId=${existingReview.id}&ReviewComment=${reviewComment}`
    );
    
    if (response.status === 200) {
      console.log("Update response:", response.data);
      
      setExistingReview({
        ...existingReview,
        rating: rating,
        reviewMessage: reviewComment
      });

      setClassReviews(prev => ({
        ...prev,
        [selectedClass.id]: {
          ...prev[selectedClass.id],
          rating: rating,
          reviewMessage: reviewComment
        }
      }));

      toast.success("Cảm ơn bạn đã cập nhật đánh giá, chúng tôi cố gắng hoàn thiện ngày càng tốt hơn");
      setHasReviewed(prev => ({
        ...prev,
        [selectedClass.id]: true
      }));
      handleCloseReview();
      setOpenConfirmDialog(false);
      checkPurchaseStatus();
    }
  } catch (error) {
    console.error("Lỗi khi cập nhật đánh giá:", error);
    toast.error("Có lỗi xảy ra khi cập nhật đánh giá");
  }
};

const handleUpdateConfirm = () => {
  setOpenConfirmDialog(true);
};

const handleGui = async () => {
  try {
    if (existingReview) {
      handleUpdateConfirm();
    } else {
      const dataGui = {
        accountId: accountid,
        classId: selectedClass.id,
        reviewComment: reviewComment,
        rating: rating
      };

      const response = await api.post("/Create-New-Classdance-Review", dataGui);
      
      if (response.status === 200) {
        toast.success("Cảm ơn bạn đã gửi đánh giá, chúng tôi cố gắng hoàn thiện ngày càng tốt hơn");
        setHasReviewed(prev => ({
          ...prev,
          [selectedClass.id]: true
        }));
        handleCloseReview();
        checkPurchaseStatus();
      }
    }
  } catch (error) {
    console.error("Lỗi khi gửi đánh giá:", error);
    toast.error("Có lỗi xảy ra khi gửi đánh giá");
  }
};

  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList
            textColor="secondary"
            indicatorColor="secondary"
            onChange={handleChange}
            aria-label="lab API tabs example"
          >
            {/* <Tab label="Lịch Sử" value="1" /> */}
            <Tab label="Lịch sử đơn Hàng" value="1" />
            <Tab label="Khóa học đã mua" value="2" />
          </TabList>
        </Box>
        {/* <TabPanel value="1">
        <OrderHistory/>
        </TabPanel>
 */}
        <TabPanel value="1">
          {loading ? (
            <p>Đang tải...</p>
          ) : orderSuccess.length > 0 ? (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: "20px",
              }}
            >
            {orderSuccess.map((order) => {
    const studioId = order.booking?.studio?.id || order.studioId;
    const capacity = Capa?.[studioId] || [];
    console.log("Capacity for studio", studioId, ":", capacity);
   
    return (
      <OrderCard 
        key={order.id} 
        order={order} 
        capacity={capacity}
        onReviewClick={() => handleReviewClick(order.id, studioId)}
      />
    );
})}

            </Box>
          ) : (
            <p>Bạn chưa có đơn hàng nào.</p>
          )}
        </TabPanel>
        <TabPanel value="2">
          {loading ? (
            <p>Đang tải...</p>
          ) : classData.length > 0 ? (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
                gap: "20px",
                padding: "20px",
              }}
            >
              {classData.map((item, index) => {
                const { status, color } = getClassStatus(
                  item.classData?.dateStart,
                  item.classData?.dateEnd
                );
                
                return (
                  <Box
                    key={index}
                    sx={{
                      backgroundColor: 'white',
                      borderRadius: '10px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      overflow: 'hidden',
                      border: '1px solid black', /* Viền đậm màu đen */
                    }}
                  > 
                    {/* Hình ảnh Studio */}
                    <Box
                      sx={{
                        height: '200px',
                        overflow: 'hidden',
                        position: 'relative',
                      }}
                    >
                      <img
                        src={item.studioImages?.imageUrl1 || "https://i.imgur.com/pRy9nMo.png"}
                        alt="Studio"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                      <Box
                        sx={{
                          position: 'absolute',
                          top: '10px',
                          right: '10px',
                          padding: '5px 10px',
                          borderRadius: '15px',
                          backgroundColor: color,
                          color: 'white',
                          fontWeight: 'bold',
                        }}
                      >
                        {status}
                      </Box>
                    </Box>

                    {/* Thông tin lớp học */}
                    <Box sx={{ padding: '20px' }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 'bold',
                          marginBottom: '10px',
                          color: '#333',
                        }}
                      >
                        {item.classData?.className}
                      </Typography>

                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <Typography>
                          <strong>Giáo viên:</strong>{' '}
                          Nguyễn Việt Anh
                        </Typography>
                        <Typography>
                          <strong>Ngày bắt đầu:</strong>{' '}
                          {new Date(item.classData?.dateStart).toLocaleDateString()}
                        </Typography>
                        <Typography>
                          <strong>Ngày kết thúc:</strong>{' '}
                          {new Date(item.classData?.dateEnd).toLocaleDateString()}
                        </Typography>
                        <Typography>
                          <strong>Thời gian học:</strong>{' '}
                          {item.classData?.timeStart} - {item.classData?.timeEnd}
                        </Typography>
                        <Typography>
                          <strong>Lịch học: Thứ</strong>{' '}
                          {item.classData?.dateOfWeek}
                        </Typography>
                        <Typography>
                          <strong>Giá:</strong>{' '}
                          {new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND'
                          }).format(item.classData?.pricing)}
                        </Typography>
                        <Typography>
                          <strong>Mô tả:</strong>{' '}
                          {item.classData?.description}
                        </Typography>
                      </Box>
                    </Box>

                    {(status === "Đã hoàn thành" || status === "Đang học") && (
                      hasReviewed[item.classData?.id] ? (
                        <Button
                          onClick={() => navigate(`/course/${item.classData?.id}`)}
                          sx={{
                            mt: 2,
                            bgcolor: '#9747FF',
                            color: 'white',
                            width: '100%',
                            '&:hover': {
                              bgcolor: '#7A39C4',
                            },
                          }}
                        >
                          Đi đến lớp học
                        </Button>
                      ) : (
                        <Button
                          onClick={() => handleOpenReview(item.classData, item.studioImages)}
                          sx={{
                            mt: 2,
                            bgcolor: '#9747FF',
                            color: 'white',
                            width: '100%',
                            '&:hover': {
                              bgcolor: '#7A39C4',
                            },
                          }}
                        >
                          {classReviews[item.classData?.id] ? "Chỉnh sửa đánh giá của bạn" : "Đánh giá khóa học"}
                        </Button>
                      )
                    )}
                  </Box>
                );
              })}
            </Box>
          ) : (
            <Typography
              sx={{
                textAlign: 'center',
                padding: '20px',
                color: '#666',
              }}
            >
              Bạn chưa mua khóa học nào.
            </Typography>
          )}
        </TabPanel>
      </TabContext>

      <Modal
        open={openReviewModal}
        onClose={handleCloseReview}
        aria-labelledby="review-modal-title"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 500,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          {selectedClass && selectedImg && (
            <>
              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <img 
                  src={selectedImg.imageUrl1 || "https://i.imgur.com/pRy9nMo.png"}
                  alt={selectedClass.className}
                  style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8 }}
                />
                <Box>
                  <Typography variant="h6" component="h2">
                    {selectedClass.className}
                  </Typography>
                  <Typography color="text.secondary">
                    {selectedClass.description}
                  </Typography>
                </Box>
              </Box>

              <Typography variant="h6" gutterBottom>
                {existingReview ? "Chỉnh sửa đánh giá" : "Đánh giá khóa học"}
              </Typography>
              
              <Box sx={{ my: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography component="legend">Đánh giá sao:</Typography>
                  <Rating
                    value={rating}
                    onChange={(event, newValue) => {
                      setRating(newValue);
                    }}
                    precision={1}
                    icon={<Star style={{ color: '#FFD700' }} />}
                  />
                </Box>

                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Viết đánh giá của bạn"
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                />

                <Button
                  variant="contained"
                  onClick={handleGui}
                  sx={{
                    bgcolor: '#9747FF',
                    color: 'white',
                    '&:hover': {
                      bgcolor: '#7A39C4',
                    },
                  }}
                >
                  {existingReview ? "Cập nhật đánh giá" : "Gửi đánh giá"}
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>

      <Dialog
        open={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
      >
        <DialogTitle>Xác nhận cập nhật</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn sẽ không được sửa đánh giá nữa sau khi thực hiện chỉnh sửa. Bạn chắc chứ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmDialog(false)} color="primary">
            Không
          </Button>
          <Button onClick={handleUpdateReview} color="primary" autoFocus>
            Có
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
