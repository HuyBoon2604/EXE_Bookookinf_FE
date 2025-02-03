import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ProductList.css';
import P1 from '../../../assets/Product/1.jpg';
import P2 from '../../../assets/Product/2.jpg';
import P3 from '../../../assets/Product/3.jpg';
import P4 from '../../../assets/Product/4.jpg';
import P5 from '../../../assets/Product/5.jpg';
import P6 from '../../../assets/Product/6.jpg';
import P7 from '../../../assets/Product/7.jpg';
import P8 from '../../../assets/Product/8.jpg';

const ProductList = () => {
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const [newItem, setNewItem] = useState({ image: '', title: '', quantity: '', price: '', description: '' });
    const [searchTerm, setSearchTerm] = useState('');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch("http://localhost:5000/products")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json(); // Chuyển đổi dữ liệu từ response thành JSON
            })
            .then((data) => {
                setProducts(data); // Cập nhật danh sách sản phẩm
                setLoading(false);  // Đánh dấu dữ liệu đã được tải xong
            })
            .catch((error) => {
                console.error("Error fetching products:", error);
                setError(error);  // Cập nhật lỗi nếu có
                setLoading(false); // Đánh dấu kết thúc tải dù có lỗi
            });
    }, []); // Chạy một lần khi component render lần đầu

    

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewItem((prev) => ({ ...prev, [name]: value }));
    };

    const validateItem = () => {
        const { name, quantity, price } = newItem;
        const nameRegex = /^[a-zA-ZÀ-ỹ\s]+$/;
        const quantityRegex = /^[0-9]+$/;
        const priceRegex = /^[0-9]+(\.[0-9]{1,2})?$/;

        if (!nameRegex.test(name)) {
            toast.error('Invalid please try again');
            return false;
        }

        if (!quantityRegex.test(quantity)) {
            toast.error('Invalid please try again');
            return false;
        }

        if (!priceRegex.test(price)) {
            toast.error('Invalid please try again');
            return false;
        }

        return true;
    };

    const handleAddItem = () => {
        if (!validateItem()) return;

        const newId = products.length ? products[products.length - 1].id + 1 : 1;
        setProducts([...products, { ...newItem, id: newId, locked: false, price: Number(newItem.price) }]);
        toast.success('Item added successfully!');
        resetForm();
    };

    const handleEditItem = (item) => {
        setIsEditing(true);
        setCurrentItem(item);
        setNewItem(item);
        setIsModalOpen(true);
    };

    const handleUpdateItem = () => {
        if (!validateItem()) return;

        setProducts(products.map(item =>
            item.id === currentItem.id ? { ...newItem, id: currentItem.id, price: Number(newItem.price) } : item
        ));
        toast.success('Item updated successfully!');
        resetForm();
    };

    const handleDeleteItem = (id) => {
        setProducts(products.filter(item => item.id !== id));
        toast.success('Item deleted successfully!');
    };

    const handleDetailsItem = (item) => {
        setCurrentItem(item);
        setIsDetailModalOpen(true);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const resetForm = () => {
        setIsModalOpen(false);
        setIsEditing(false);
        setNewItem({ image: '', title: '', quantity: '', price: '', description: '' });
        setCurrentItem(null);
        setIsDetailModalOpen(false);
    };

    const filteredItems = products.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    

    return (
        <div id="ProductList" className="items-container">
            <div className="items-header">
                <h2>Item List</h2>
                <div className="header-actions">
                    <button className="add-item-btn" onClick={() => setIsModalOpen(true)}>Add Item</button>
                    <input
                        type="text"
                        placeholder="Search items"
                        className="search-input"
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </div>
            </div>
            <table className="items-table">
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredItems.map((item, index) => (
                        <tr key={item.id}>
                            <td>{index + 1}</td>
                            <td><img src={item.image} alt={item.name} style={{ width: '50px', height: '50px' }} /></td>
                            <td>{item.title}</td>
                            <td>{item.quantity}</td>
                            <td>{item.price.toLocaleString('vi-VN')} VNĐ</td>
                            <td>
                                <button className="details-btn" onClick={() => handleDetailsItem(item)}>Details</button>
                                <button className="edit-btn" onClick={() => handleEditItem(item)}>Edit</button>
                                <button className="delete-btn" onClick={() => handleDeleteItem(item.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>{isEditing ? "Edit item" : "Add New Item"}</h3>
                        <div className="input-group">
                            <label className='image-title' htmlFor="image">Image URL</label>
                            <input
                                type="text"
                                id="image"
                                name="image"
                                placeholder="Image URL"
                                value={newItem.image}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="input-group">
                            <label className='name-title' htmlFor="name">Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                placeholder="Name"
                                value={newItem.title}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="input-group">
                            <label className='quantity-title' htmlFor="quantity">Quantity</label>
                            <input
                                type="number"
                                id="quantity"
                                name="quantity"
                                placeholder="Quantity"
                                value={newItem.quantity}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="input-group">
                            <label className='price-title' htmlFor="price">Price</label>
                            <input
                                type="text"
                                id="price"
                                name="price"
                                placeholder="Price"
                                value={newItem.price}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="input-group">
                            <label className='description-title' htmlFor="description">Description</label>
                            <textarea
                                className='description-text'
                                id="description"
                                name="description"
                                placeholder="Description"
                                value={newItem.description}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="button-container">
                            <button onClick={isEditing ? handleUpdateItem : handleAddItem}>
                                {isEditing ? "Update item" : "Add item"}
                            </button>
                            <button className='btn-cancel' onClick={resetForm}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {isDetailModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>{currentItem?.name}</h3>
                        <img className='img' src={currentItem?.image} alt={currentItem?.name} style={{ width: '30%', height: '30%' }} />
                        <p><strong>Price:</strong> {currentItem?.price.toLocaleString('vi-VN')} VNĐ</p>
                        <p><strong>Quantity:</strong> {currentItem?.quantity}</p>
                        <p><strong>Description:</strong><br />{currentItem?.description}</p>
                        <button onClick={resetForm}>Close</button>
                    </div>
                </div>
            )}

            <ToastContainer />
        </div>
    );
};

export default ProductList;
