import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import './Order.css';
import api from '../../utils/requestAPI';

// Mock product prices for calculating total prices
const prices = {
    "1": 220000,
    "2": 257000,
    "3": 369000,
    // Add other product prices if needed
};
    

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentOrder, setCurrentOrder] = useState(null);
    const { orderId } = useParams();

    // Fetch users with roleId = 1 and extract their orders
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('http://localhost:5000/users');
                if (response.ok) {
                    const users = await response.json();
                    // Filter users with roleId = 1 and extract their orders
                    const filteredOrders = users
                        .filter(user => user.roleId === 1)
                        .flatMap(user => user.orders.map(order => ({ ...order, user })));
                    setOrders(filteredOrders);
                } else {
                    console.error("Failed to fetch users:", response.statusText);
                }
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchUsers();
    }, []);

    

    // Format price in VND
    const formatPrice = (price) => `${Number(price).toLocaleString()} VNĐ`;

    // Calculate total price for the order based on item prices and quantities
    const calculateTotalPrice = (items) =>
        items.reduce((total, item) => total + (prices[item.productId] || 0) * item.quantity, 0);

    // Handle modal for showing order details
    const handleDetails = (order) => {
        setCurrentOrder(order);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentOrder(null);
    };

    return (
        <div id="OrderList" className="orders-container">
            <h2>Order List</h2>
            <table className="orders-table">
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Name</th>
                        <th>Phone</th>
                        <th>Address</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Total Price</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order, index) => (
                        <tr key={order.orderId}>
                            <td>{index + 1}</td>
                            <td>{order.user.name}</td>
                            <td>{order.user.phone}</td>
                            <td>{order.user.address}</td>
                            <td>{order.date}</td>
                            <td>{order.status}</td>
                            <td>{formatPrice((order.total))}</td>
                            <td>
                                <button className="details-btn" onClick={() => handleDetails(order)}>Details</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {isModalOpen && currentOrder && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Order Details</h3>
                        <p><strong>Name:</strong> {currentOrder.user.name}</p>
                        <p><strong>Phone:</strong> {currentOrder.user.phone}</p>
                        <p><strong>Address:</strong> {currentOrder.user.address}</p>
                        <p><strong>Date:</strong> {currentOrder.date}</p>
                        <p><strong>Total Price:</strong> {formatPrice(currentOrder.total)}</p>
                        <div className="product-images">
                            <p><strong>Items:</strong></p>
                            <div className="image-grid">
                                {currentOrder.items.map((item, index) => (
                                    <div key={index}>
                                        <img src={item.image} alt={`Product ${item.productId}`} />
                                        <p>{item.title}</p>
                                        <p>{formatPrice(item.price)}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <button className="close-btn" onClick={closeModal}>Close</button>
                    </div>
                </div>
            )}

            <ToastContainer />
        </div>
    );
};

export default OrderList;
