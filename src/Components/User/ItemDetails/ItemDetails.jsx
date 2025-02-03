import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ItemDetails.css';
import { IoCartOutline } from "react-icons/io5";
import Header from "../../../Components/Items/Header/Header";
import Footer from "../../../Components/Items/Footer/Footer";

const ItemDetails = () => {
    const { title } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cartCount] = useState(10); // Giả sử số lượng sản phẩm trong giỏ là 10
    const [mainImage, setMainImage] = useState(''); // Thêm state để quản lý ảnh chính

    useEffect(() => {
        // Lấy dữ liệu từ API khi component mount
        fetch(`http://localhost:5000/products?title=${encodeURIComponent(title)}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Unable to fetch product data');
                }
                return response.json();
            })
            .then((data) => {
                // Tìm sản phẩm từ dữ liệu trả về từ API
                const foundProduct = data.find((item) => item.title === decodeURIComponent(title));

                if (foundProduct) {
                    setProduct(foundProduct);
                    setMainImage(foundProduct.images[0]); // Đặt ảnh chính ban đầu
                    setLoading(false);
                } else {
                    setError('Product not found');
                    setLoading(false);
                    navigate('/NotFound'); // Chuyển hướng đến trang NotFound khi không tìm thấy sản phẩm
                }
            })
            .catch((error) => {
                setError('Error fetching product data');
                setLoading(false);
                navigate('/NotFound'); // Chuyển hướng đến trang NotFound nếu có lỗi
            });
    }, [title, navigate]);


    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return (
            <div>
                <p>{error}</p>
                <a href="/">Go back to Home</a>
            </div>
        );
    }

    return (
        <div id="item-details">
            <Header />

            <div className='item-details-container-1'>
                {product ? (
                    <div className="item-info">
                        <div className="item-image">
                            {/* Ảnh chính */}
                            <div className='item-image-maintain'>
                                <img src={mainImage} alt={product.title} className="main-product-image" />
                            </div>

                            <div className="thumbnail-images">
                                {product.images.map((image, index) => (
                                    <div key={index} className="thumbnail-container">
                                        <img
                                            src={image}
                                            alt={`Thumbnail ${index}`}
                                            className="thumbnail"
                                            onClick={() => setMainImage(image)} // Thay đổi ảnh chính khi click
                                        />
                                    </div>
                                ))}
                            </div>

                        </div>
                        <div className="item-details-content">
                            <h2>{product.title}</h2>
                            <span className="item-price">{product.price} {product.currency}</span>
                            <button className="btn-buy" disabled={product.status === 'Hết hàng'}>
                                Chọn mua
                            </button>
                            <span className="item-status">Sản phẩm hiện đang {product.status}.</span>
                            <a href="#" className="store-availability">Xem chi nhánh còn hàng</a>
                            <div className="item-description">
                                <h3>Mô tả sản phẩm</h3>
                                <p>{product.description}</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p>Loading product...</p>
                )}
            </div>

            <div className='item-details-container-2'>
                <h3>Chi tiết sản phẩm</h3>
                <p>{product.additionalInfo.details.description}</p>
                <h4>Danh sách sản phẩm combo xe điều khiển:</h4>
                <ul>
                    {product.additionalInfo.details.productList.map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}
                </ul>
                <p>Khối lượng: {product.additionalInfo.details.weight}</p>
                <h4>Video demo</h4>
                <p><a href={product.additionalInfo.details.demoVideo} target="_blank" rel="noopener noreferrer">Xem video demo</a></p>
                <h4>Code tham khảo:</h4>
                <pre>
                    <code>
                        {product.additionalInfo.details.codeSnippet}
                    </code>
                </pre>
            </div>

            <div className="cart-icon-container">
                <IoCartOutline className="cart-icon" />
                <span className="cart-count">{cartCount}</span>
            </div>

            <Footer />
        </div>
    );
};

export default ItemDetails;
