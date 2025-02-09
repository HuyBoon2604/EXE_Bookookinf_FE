import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../utils/requestAPI';
import './OrderPage.css';
import { useNavigate } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert'; 
import 'react-confirm-alert/src/react-confirm-alert.css'; 

const OrderPage = () => {
    const { Bookingid } = useParams();
    const navigate = useNavigate();
    const [orderId, setOrderId] = useState('');
    const [Order, SetOrder] = useState([]);
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
    useEffect (() => {
      const fetchOrder = async () => {
        const url = `/Get-Booking-By-BookingiD?bookingid=${Bookingid}`;
        try {
          const response = await api.get(url);
          
          console.log('API response:', response.data);
          SetOrder(response.data);
        } catch (error) {
          console.error('Error fetching course data:', error);
        }
      };
  
     
      fetchOrder();
    }, []);
    // Tạo Order
    // useEffect(() => {
    //     const createOrderAndPayment = async () => {
    //         if (Bookingid) {
    //             try {
    //                 const createOrder = await api.post(
    //                     `/Create-New-Order?BookingId=${Bookingid}`
    //                 );

    //                 if (createOrder.status === 200 && createOrder.data) {
    //                     const orderId1 = createOrder.data.id;
    //                     setOrderId(orderId1);
    //                     console.log('Order created successfully, ID:', orderId1);
    //                 } else {
    //                     console.error(
    //                         "Order creation failed or response is missing 'id'.",
    //                         createOrder
    //                     );
    //                 }
    //             } catch (error) {
    //                 console.error('Error creating order:', error);
    //             }
    //         }
    //     };

    //     createOrderAndPayment();
    // }, [Bookingid]);

    // Tạo payment link
    // const createPaymentLink = async () => {
    //     if (orderId) {
    //         try {
    //             const responsePayOs = await api.post(
    //                 `/create-payment-link/${orderId}/checkout`
    //             );

    //             if (
    //                 responsePayOs.status === 200 &&
    //                 responsePayOs.data &&
    //                 responsePayOs.data.checkoutUrl
    //             ) {
    //                 const checkoutUrl = responsePayOs.data.checkoutUrl;
    //                 console.log('Checkout URL:', checkoutUrl);
    //                 window.open(checkoutUrl, '_blank');
    //             } else {
    //                 console.error(
    //                     "Payment link creation failed or response is missing 'checkoutUrl'.",
    //                     responsePayOs
    //                 );
    //             }
    //         } catch (error) {
    //             console.error('Error creating payment link:', error);
    //         }
    //     } else {
    //         console.warn('Order ID is missing. Cannot create payment link.');
    //     }
    // };
    const handleOrderAndPayment = async () => {
        if (!Bookingid) {
          console.log("Bookingid không tồn tại");
          return;
        }
      
        try {
          // tạo mới order
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
            
            // tạo payment link 
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
    const Showconfirmcancel = () =>{
confirmAlert({
title: 'Hủy Order',
message:'Bạn có chắc là sẽ hủy order hay không ?',
buttons:[
{
label: 'có',
onClick: () => handleCancelOrder(),

},
{
    label:'không'
},




],




}
);



    };
    const handleCancelOrder = async () => {
        try {
            const response = await api.delete(`/Delete-Order-And-Booking-By-OrderId?orderID=${orderId}`);
            if (response.status === 200) {
                console.log('Order cancelled successfully');
                alert('Order has been cancelled');
    
               
                setTimeout(() => {
                   
                    navigate(`/StudioInfor/${Order.id}`);
                }, 2000);
            } else {
                console.error('Failed to cancel order:', response);
            }
        } catch (error) {
            console.error('Error cancelling order:', error);
        }
    };

    return (
        <div id="OrderPage">
            <div className="container-order">
                <div className="infoorder-stu">
                    {studios.map((studio) => (
                        <div className="infoorderstu-item" key={studio.id}>
                            <div className="imageorder-stu">
                                <img
                                    src={Order.imageStudio}
                                    alt={studio.title}
                                    className="imageorder-con"
                                />
                            </div>

                            <div className="stu-infoorder">
                                <div className="inforordercon">
                                    <div className="chuavuine">
                                        <span className="nameofstu">
                                            <strong>Tên Studio:</strong>{' '}
                                            {Order.studioName}
                                        </span>
                                    </div>
                                    <div className="chuavuine">
                                        <span className="typeofstu">
                                            <strong>Kích Thước:</strong> {studio.type}
                                        </span>
                                    </div>
                                    <div className="chuavuine">
                                        <span className="Addressofstu">
                                            <strong>Địa Điểm:</strong>{' '}
                                            {Order.studioAddress}
                                        </span>
                                    </div>
                                    <div className="chuavuine">
                                        <span className="Timeofstu">
                                            <strong>Mốc Thời Gian:</strong> {Order.checkIn}-{Order.checkOut}
                                        </span>
                                    </div>
                                    <div className="chuavuine">
                                        <span className="Dateorderstu">
                                            <strong>Ngày đặt:</strong> {Order.bookingDate}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="infouser-order">
                    <h1 className="custumor-title">Thông tin khách hàng</h1>
                    <div className="chuainfoorder">
                        <div className="chuainfovui">
                            <span className="phonevui">Số điện thoại:</span>
                            <span className="kovui">0904762203</span>
                        </div>

                        <div className="chuainfovui">
                            <span className="customername">Tên khách hàng:</span>
                            <span className="kovui">{Order.userName}</span>
                        </div>

                        <div className="chuainfovui">
                            <span className="Priceorder">
                                Giá tiền trong 1 tiếng:
                            </span>
                            <span className="kovui">2000</span>
                        </div>

                        {/* <div className="chuainfovui">
                            <span className="quantityhour">Quantity Hour:</span>
                            <span className="kovui">2</span>
                        </div> */}

                        <div className="chuainfovui">
                            <span className="totalpricevui">
                                Tổng tiền:
                            </span>
                            <span className="kovui">{Order.totalPrice}</span>
                        </div>
                    </div>

<button className='removebutton' onClick={Showconfirmcancel}>Hủy Order</button>




                    <button
                        className="ordernut"
                        onClick={handleOrderAndPayment}
                        tabIndex={0}
                        aria-label="Book this dance class"
                    >
                        Yêu cầu đặt hàng 
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderPage;
