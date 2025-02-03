import React, { useState, useEffect } from 'react';
import "./../ListItem/ListItem.css"
import { IoCartOutline } from "react-icons/io5";
import { Link } from "react-router-dom";

export default function ListItem() {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [cartCount] = useState(10); // Giả sử số lượng sản phẩm trong giỏ là 10
    const [sortOption, setSortOption] = useState(""); // Tùy chọn sắp xếp
    const [productType, setProductType] = useState(""); // Tùy chọn loại sản phẩm
    const [priceRange, setPriceRange] = useState(""); // Phạm vi giá
    const itemsPerPage = 16; // Số sản phẩm hiển thị mỗi trang

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [cartItems, setCartItems] = useState([]);


    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('userId'));
        if (storedUser) {
            setUser(storedUser);
        } else {
            console.error("User ID không tồn tại trong localStorage");
        }
    }, []);

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

    // Tính toán chỉ số sản phẩm hiện tại
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    // Lọc dữ liệu dựa trên từ khóa tìm kiếm, loại sản phẩm và phạm vi giá
    const filteredData = products.filter(item => {
        // Chuyển đổi giá thành số
        const itemPrice = parseFloat(item.price.replace(/\./g, '').replace('₫', '').trim());

    

        // Xác định khoảng giá
        let minPrice = 0;
        let maxPrice = Infinity;

        if (priceRange === "0-200") {
            maxPrice = 200000; // Điều chỉnh giá tối đa
        } else if (priceRange === "200-500") {
            minPrice = 200000;
            maxPrice = 500000;
        } else if (priceRange === "500-1000") {
            minPrice = 500000;
            maxPrice = 1000000;
        } else if (priceRange === "1000-2000") {
            minPrice = 1000000;
            maxPrice = 5000000;
        }

        return (
            (item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (productType ? (productType === "DIY" ? item.title.startsWith("Combo") : !item.title.startsWith("Combo")) : true) &&
            (itemPrice >= minPrice && itemPrice < maxPrice) // Kiểm tra khoảng giá
        );
    });

    const updateUserCart = async (updatedCart) => {
        if (!user) return;
        const updatedUser = { ...user, cart: updatedCart };

        try {
            const response = await fetch(`http://localhost:5000/users/${user.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedUser),
            });

            if (response.ok) {
                setUser(updatedUser);
                setCartItems(updatedCart);
            } else {
                console.error("Error updating cart:", response.statusText);
            }
        } catch (error) {
            console.error("Error updating cart:", error);
        }
    };



    const addToCart = async (product) => {
        try {
            const userId = user.id;  // Ensure userId is accessible
            if (!userId) {
                console.error("User ID not found");
                return;
            }
    
            // Fetch the current user data
            const userResponse = await fetch(`http://localhost:5000/users/${userId}`);
            if (!userResponse.ok) {
                console.error("Error fetching user data:", userResponse.statusText);
                return;
            }
    
            const userData = await userResponse.json();
            
            // Check if product is already in cart
            const existingProduct = userData.cart.find(item => item.productId === product.productId);
            if (existingProduct) {
                // Increase quantity if already in cart
                existingProduct.quantity += 1;
            } else {
                // Add new product to cart
                userData.cart.push({ productId: product.productId, quantity: 1 });
                console.log(product)
            }
    
            // Update user data on the server with the modified cart
            const updateResponse = await fetch(`http://localhost:5000/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
    
            if (updateResponse.ok) {
                const updatedUser = await updateResponse.json();
                // setCartItems(updatedUser.cart);  // Update local state with the new cart
                updateUserCart(updatedUser.cart);
                alert("Product add to cart successful!"); // Set success message

        // Clear the message after a delay
        // setTimeout(() => setAddToCartMessage(""), 3000);
            } else {
                console.error("Error updating cart:", updateResponse.statusText);
            }
        } catch (error) {
            console.error("Error adding product to cart:", error);
        }
    };



    // Sắp xếp dữ liệu theo tùy chọn
    const sortedData = [...filteredData].sort((a, b) => {
        const priceA = parseFloat(a.price.replace(/\./g, '').replace('₫', '').trim());
        const priceB = parseFloat(b.price.replace(/\./g, '').replace('₫', '').trim());

        switch (sortOption) {
            case "name":
                return a.title.localeCompare(b.title);
            case "priceLowToHigh":
                return priceA - priceB; // Sắp xếp từ thấp đến cao
            case "priceHighToLow":
                return priceB - priceA; // Sắp xếp từ cao đến thấp
            default:
                return 0;
        }
    });

    // Lấy danh sách sản phẩm hiện tại cho trang hiện tại
    const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(sortedData.length / itemsPerPage);

    // Hàm xử lý thay đổi trang
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber); // Assuming you have a state for currentPage
        window.scrollTo({
            top: 0, // Scroll to the top of the page
            behavior: 'smooth' // Smooth scroll
        });
    };

    // Hàm xử lý thay đổi từ khóa tìm kiếm
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset trang về 1 khi tìm kiếm
    };

    // Hàm xử lý thay đổi tùy chọn sắp xếp
    const handleSortChange = (option) => {
        setSortOption(option);
        setCurrentPage(1); // Reset trang về 1 khi sắp xếp
    };

    // Hàm xử lý thay đổi loại sản phẩm
    const handleTypeChange = (type) => {
        setProductType(type);
        setCurrentPage(1); // Reset trang về 1 khi thay đổi loại sản phẩm
    };

    // Hàm xử lý thay đổi phạm vi giá
    const handlePriceRangeChange = (range) => {
        setPriceRange(range);
        setCurrentPage(1); // Reset trang về 1 khi thay đổi phạm vi giá
    };

    return (
        <div id="ListItem">
            <div className="ListItem-Container1">
                {/* Task View Side Panel */}
                <div className="task-view">
                    {/* Sort Buttons */}
                    <div className="sort-buttons">
                        <h4>Sort by</h4>
                        <button onClick={() => handleSortChange("name")}>Name (A-Z)</button>
                        <button onClick={() => handleSortChange("priceLowToHigh")}>Price (Low to High)</button>
                        <button onClick={() => handleSortChange("priceHighToLow")}>Price (High to Low)</button>
                        <button onClick={() => handleSortChange("newest")}>Newest</button>
                    </div>

                    {/* Filter by Product Type */}
                    <div className="filter-type">
                        <h4>Filter by Product Type</h4>
                        <button onClick={() => handleTypeChange("DIY")}>DIY</button>
                        <button onClick={() => handleTypeChange("Module")}>Module</button>
                        <button onClick={() => handleTypeChange("")}>All</button>
                    </div>

                    {/* Price Range Selector */}
                    <div className="price-range">
                        <h4>Select Price Range</h4>
                        <select onChange={(e) => handlePriceRangeChange(e.target.value)} className="price-select">
                            <option value="">All</option>
                            <option value="0-200">0₫ - 200₫</option>
                            <option value="200-500">200₫ - 500₫</option>
                            <option value="500-1000">500₫ - 1.000₫</option>
                            <option value="1000-2000">1.000₫ - 2.000₫</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="ListItem-Container2">
                <div className="filter-container">
                    <input
                        id="search"
                        type="text"
                        className="filter-input"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                    <button className="filter-button">Search</button>
                </div>

                <div className="ListItemPage-Container">
                    <div className="products-container">
                        {loading ? (
                            <p>Loading...</p> // Hiển thị thông báo nếu đang tải dữ liệu
                        ) : error ? (
                            <p>Error: {error.message}</p> // Hiển thị lỗi nếu có
                        ) : filteredData.length === 0 ? (
                            <p>No products found.</p> // Hiển thị nếu không có sản phẩm nào
                        ) : (
                            currentItems.map((item, index) => (
                                <div className="list-item" key={index}>
                                    <Link to={`/Product/Details/${item.title}`} className="list-item-link">
                                        <img src={item.image} alt={item.title} className="product-image" />
                                        <div className="product-details">
                                            <h3 className="product-title">{item.title}</h3>
                                            <p className="product-description">{item.description}</p>
                                            <p className="product-price">{item.price}</p>
                                        </div>
                                    </Link>
                                    <button className="add-to-cart-button" onClick={() => addToCart(item)}> 
                                        <IoCartOutline /> Add to Cart
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="cart-icon-container">
                    <IoCartOutline className="cart-icon" />
                    <span className="cart-count">{cartCount}</span>
                </div>

                {/* Pagination */}
                <div className="pagination-container">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index}
                            onClick={() => handlePageChange(index + 1)}
                            className={currentPage === index + 1 ? "active" : ""}
                        >
                            {index + 1}
                        </button>
                    ))}
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}
