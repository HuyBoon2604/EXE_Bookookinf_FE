import React, { useState, useEffect,useCallback } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../utils/requestAPI';
import './OrderPage.css';
import { useNavigate } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import useAuth from '../../../hooks/useAuth';

const OrderPage = () => {
    const { Bookingid } = useParams();
    const { auth } = useAuth();
    const navigate = useNavigate();
    const [orderId, setOrderId] = useState('');
    const [Order, SetOrder] = useState([]);
    const[host, sethost] =useState([]);
    const[user, setuser] =useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [studios] = useState([
        {
            id: 1,
            image: '/0f867cb427035cc0008c7757df861157.jpg',
            price: 'From 100$/hr',
            type: 'large',
            title: 'Flow Dance',
            address: '123 Main St, Cityville',
            date: '21/10/2024',
            time: '11:00 - 13:00',
        },
    ]);

    useEffect(() => {
        const fetchOrder = async () => {
            const url = `/Get-Booking-By-BookingiD?bookingid=${Bookingid}`;
            try {
                const response = await api.get(url);
                console.log('Booking:', response.data);
                SetOrder(response.data);
            } catch (error) {
                console.error('Error fetching course data:', error);
            }
        };

        fetchOrder();
        
    }, [Bookingid]);
    useEffect(() => {
        if (Order?.studioId) {
            const fetchstuofuser = async () => {
                try {
                    const response = await api.get(`/api/Studio/Get-Studio-By-Id?id=${Order.studioId}`);
                    console.log('API Host:', response.data);
                    sethost(response.data);
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            };
            fetchstuofuser();
        }
    }, [Order?.studioId]);
    
    const handleOrderAndPayment = async () => {
        if (!Bookingid) {
            console.log("Bookingid không tồn tại");
            return;
        }

        try {
            // Tạo mới order
            const createOrderResponse = await api.post(
                `/Create-New-Order?BookingId=${Bookingid}`
            );

            if (
                createOrderResponse.status === 200 &&
                createOrderResponse.data &&
                createOrderResponse.data.id
            ) {
                const newOrderId = createOrderResponse.data.id;
                console.log("Order created successfully, ID:", newOrderId);

                // Tạo payment link
                const responsePayOs = await api.post(
                    `/create-payment-link/${newOrderId}/checkout`
                );

                if (
                    responsePayOs.status === 200 &&
                    responsePayOs.data &&
                    responsePayOs.data.checkoutUrl
                ) {
                    const checkoutUrl = responsePayOs.data.checkoutUrl;
                    console.log("Checkout URL:", checkoutUrl);
                    window.open(checkoutUrl, "_self");
                } else {
                    console.error(
                        "Payment link creation failed or response is missing 'checkoutUrl'.",
                        responsePayOs
                    );
                }
            } else {
                console.error(
                    "Order creation failed or response is missing 'id'.",
                    createOrderResponse
                );
            }
        } catch (error) {
            console.error("Error creating order and payment link:", error);
        }
    };

    const Showconfirmcancel = () => {
        confirmAlert({
            title: <span className="custom-confirm-alert">Hủy đơn</span>,
            message: <span className='custom-confirm'>Bạn có muốn hủy đơn này không ?</span>,
            buttons: [
                {
                    label: 'Có',
                    onClick: () => handleCancelOrder(),
                },
                {
                    label: 'Không'
                },
            ],
        });
    };
    const Showconfirmorder = () => {
        confirmAlert({
            title: <span className="custom-confirm-alert">Yêu cầu đặt hàng</span>,
            message: <span className='custom-confirm'>Bạn đã kiểm tra đúng thông tin đơn ?</span>,
            buttons: [
                {
                    label: 'Có',
                    onClick: () => handleOrderAndPayment(),
                },
                {
                    label: 'Không'
                },
            ],
        });
    };

    const handleCancelOrder = async () => {
        try {
            const response = await api.delete(`/Delete-Booking-By-BookingiD?bookingId=${Bookingid}`);
            if (response.status === 200) {
                console.log('Order cancelled successfully');
                // alert('Order has been cancelled');
                setSuccessMessage('Hủy đơn thành công.');
                setTimeout(() => {
                  setSuccessMessage('');
                  navigate(`/StudioInfor/${Order.studioId}`);
                }, 3000);
                // setSuccess("Hủy đơn thành công!");
                
                // setTimeout(() => {
                //     navigate(`/StudioInfor/${Order.studioId}`);
                // }, 2000);
            } else {
                console.error('Failed to cancel order:', response);
            }
        } catch (error) {
            console.error('Error cancelling order:', error);
        }
    };
    const calculateHours = (checkIn, checkOut) => {
        if (!checkIn || !checkOut) return 0; 
      
        
        const checkInTime = new Date(`1970-01-01T${checkIn}`);
        const checkOutTime = new Date(`1970-01-01T${checkOut}`);
      
    
        const timeDifference = checkOutTime - checkInTime;
      
    
        const hours = timeDifference / (1000 * 60 * 60);
      
        return hours;
      };
      const fetchUser = useCallback(async () => {
        try {
          const response = await api.get(`/api/Account/get-by-id?accountId=${auth.user.id}`);
          console.log(response.data)
          const account = response.data;
          
          setuser(account);
           
        } catch (error) {
          toast.error("Lỗi khi lấy thông tin người dùng!");
        }
      }, [auth.user.id]);
    
      useEffect(() => {
        fetchUser();
      }, [fetchUser]);
    return (
        <div id="OrderPage">
           
            <div className="container-order">
            

                <div className="infoorder-stu">
                    {studios.map((studio) => (
                        <div className="infoorderstu-item" key={studio.id}>
                           

                            <div className="stu-infoorder">
                                <div className="inforordercon">
                                <h1 className="custumor-title">Thông tin đơn</h1>
                                <div className="chuavuine">
                                        <div className="nameofhost">
                                            <strong>Người tạo studio</strong>{' '}
                                            <div className='vuiquatr'>
  <a href={`/profile/${host.account?.id}`}>
    <img src={host.account?.imageUrl} className='anhhost' alt="" />
  </a>
</div> 
                                           <span className='vuiquatr'>{host.account?.userName} </span> 
                                        </div>
                                    </div>
                                    <div className="chuavuine">
                                        <span className="nameofstu">
                                            <strong>Tên Studio</strong>{' '}
                                           <div className='vuiquatr'>{Order.studioName}</div> 
                                        </span>
                                    </div>
                                    <div className="chuavuine">
                                        <span className="typeofstu">
                                            <strong>Loại phòng</strong> 
                                            <div className='vuiquatr'>{studio.type}</div>
                                        </span>
                                    </div>
                                    <div className="chuavuine">
                                        <span className="Addressofstu">
                                            <strong>Địa chỉ</strong>{' '}
                                           <div className='vuiquatr'> {Order.studioAddress}</div>
                                        </span>
                                    </div>
                                    <div className="chuavuine">
                                        <span className="Timeofstu">
                                            <strong>Thời Gian</strong> 
                                            <div className='vuiquatr'>
  {Order.checkIn?.split(' ')[1]} - {Order.checkOut?.split(' ')[1]}
</div>
                                        </span>
                                    </div>
                                    <div className="chuavuine">
                                        <span className="Dateorderstu">
                                            <strong>Ngày đặt</strong> <div className='vuiquatr'>
  {Order.bookingDate?.split(' ')[0]}
</div>
                                        </span>
                                    </div>
                                </div>
                                <div className="imageorder-stu">
                                <img
                                    src={Order.imageStudio}
                                    alt={studio.title}
                                    className="imageorder-con"
                                />
                            </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="infouser-order">
                    <h1 className="custumor-title">Thông tin khách hàng</h1>
                    <div className="chuainfoorder">
                        <div className="chuainfovui">
                            <span className="phonevui"><strong>Số điện thoại:</strong></span>
                            <span className="kovui">{user.phone}</span>
                        </div>
                        <div className="chuainfovui">
                            <span className="phonevui"><strong>Email:</strong></span>
                            <span className="kovui">{user?.email}</span>
                        </div>

                        <div className="chuainfovui">
                            <span className="customername"><strong>Tên khách hàng:</strong></span>
                            <span className="kovui">{Order.userName}</span>
                        </div>

                        <div className="chuainfovui">
                            <span className="Priceorder">
                               <strong>Số giờ:</strong> 
                            </span>
                            <span className="kovui"> {calculateHours(Order.checkIn?.split(' ')[1], Order.checkOut?.split(' ')[1])} giờ</span>
                        </div>

                        <div className="chuainfovui">
                            <span className="totalpricevui">
                               <strong> Tổng tiền:</strong>
                            </span>
                            <span className="kovui"> {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Order.totalPrice)}</span>
                        </div>
                    </div>

                    <button className='removebutton' onClick={Showconfirmcancel}>Hủy Đơn</button>

                    <button
                        className="ordernut"
                        onClick={Showconfirmorder}
                        tabIndex={0}
                        aria-label="Book this dance class"
                    >
                        Yêu cầu đặt hàng
                    </button>
                </div>
                {successMessage && <div className="success-message">{successMessage}</div>}
            </div>
        </div>
    );
};

export default OrderPage;