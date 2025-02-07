import React, { useState, useEffect, useCallback } from 'react';
import './Studio.css'; // Thay vì import styles từ file CSS module, sử dụng file CSS thông thường
import api from '../../utils/requestAPI';
import useAuth from '../../../hooks/useAuth';



export default function Studio() {
  const [activeNav, setActiveNav] = useState('Order'); // Trạng thái cho Nav
  const [orders, setOrders] = useState([]);
  const [studioIsActive, setStudioIsActive] = useState([]);
  const [studioIsUnactive, setStudioIsUnactive] = useState([]);
  const { auth } = useAuth();
  const accountId = auth.user.id;

  const customerData = [
    {
      name: 'Customer1',
      checkInDate: '12 Mar 2021',
      price: '100',
      type: 'Small',
      time: '16h-18h'
    },
    {
      name: 'Customer2',
      checkInDate: '12 Mar 2021',
      price: '100',
      type: 'Small',
      time: '18h-20h'
    }
  ];

  const RevenueData = [
    {
      name: 'Customer1',
      checkInDate: '12 Mar 2021',
      price: '100',
      type: 'Tiền mặt',
      time: '21/01/2025'
    },
    {
      name: 'Customer2',
      checkInDate: '12 Mar 2021',
      price: '100',
      type: 'Chuyển khoản',
      time: '20/02/2025'
    }
  ];

  
  // Hàm thay đổi mục nav khi nhấn
  const handleNavClick = (navItem) => {
    setActiveNav(navItem);
  };
  const [isEditing, setIsEditing] = useState(false); // Quản lý trạng thái chỉnh sửa
  const [editingCustomer, setEditingCustomer] = useState(null); // Dữ liệu của studio đang chỉnh sửa



  const handleSave = () => {
    setIsEditing(false); // Quay lại chế độ xem sau khi lưu
    setEditingCustomer(null); // Reset dữ liệu chỉnh sửa
  };

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    detail: "",
    address: "",
  }); // Dữ liệu form chỉnh sửa

  const handleEdit = (customer) => {
    setIsEditing(true); // Chuyển sang chế độ chỉnh sửa
    setEditingCustomer(customer); // Lưu thông tin studio
    setFormData({
      name: customer.name || "",
      price: customer.price || "",
      detail: customer.detail || "",
      address: customer.address || "",
    });
  };

  const handleInputChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Dữ liệu được gửi:", formData);
    setIsEditing(false); // Quay lại chế độ xem sau khi lưu
    setEditingCustomer(null);
  };

  const handleCancel = () => {
    setIsEditing(false); // Quay lại chế độ xem khi hủy
    setEditingCustomer(null);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        // Bước 1: Lấy tất cả các order
        const ordersResponse = await api.get("/Get-All-Order");
        // Giả sử API trả về dữ liệu theo dạng: { $values: [...] } hoặc trực tiếp là mảng
        const ordersData = ordersResponse.data.$values || ordersResponse.data;
        console.log(ordersData)

        // Bước 2 & 3: Với mỗi order, lấy thông tin studio và tài khoản
        const enrichedOrders = await Promise.all(
          ordersData.map(async (order) => {
            const studioId = order.booking?.studioId;
        const accountId = order.booking?.accountId;

        // Gọi API để lấy thông tin studio nếu studioId tồn tại
        let studioDetails = null;
        if (studioId) {
          const studioResponse = await api.get(`/api/Studio/Get-Studio-By-Id?id=${studioId}`);
          studioDetails = studioResponse.data;
          console.log("aaaa",studioDetails)
        }

        // Gọi API để lấy thông tin account nếu accountId tồn tại
        let accountDetails = null;
        if (accountId) {
          const accountResponse = await api.get(`/api/Account/get-by-id?accountId=${accountId}`);
          accountDetails = accountResponse.data;
          console.log("bbbbb",accountDetails)
        }

            // Trả về một đối tượng order mới, gộp thêm thông tin studio và account
            return {
              ...order,
              studioDetails,
              accountDetails,
            };
          })
        );

        // Cập nhật state với các order đã được enrich dữ liệu
        setOrders(enrichedOrders);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu orders:", error);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    // Hàm fetch dữ liệu studio đã được duyệt theo accountId
    async function fetchStudios() {
      try {
        // const response = await api.get(
        //   `/api/Studio/Get-All-Studio-With-IsActive-True?accountId=${accountId}`
          const [approvedResponse, unapprovedResponse] = await Promise.all([
            api.get(`/api/Studio/Get-All-Studio-With-IsActive-True?accountId=${accountId}`),
            api.get(`/api/Studio/Get-All-Studio-With-IsActive-False?accountId=${accountId}`)
          ]);
          const approvedStudios = approvedResponse.data.$values || approvedResponse.data;
        const unapprovedStudios = unapprovedResponse.data.$values || unapprovedResponse.data;
        
        if (approvedResponse.status === 200 && approvedResponse.data && unapprovedResponse.status === 200 && unapprovedResponse.data) {
          // Nếu dữ liệu được bọc trong $values thì lấy mảng đó, ngược lại lấy response.data
          setStudioIsActive(approvedStudios);
          setStudioIsUnactive(unapprovedStudios)

        } else {
          throw new Error("Không thể lấy thông tin studio đã được duyệt.");
        }
      } catch (err) {
        console.error("Error fetching approved studios:", err);
     
    }
    

    // Nếu có accountId, gọi hàm fetch, ngược lại tắt loading
    if (accountId) {
      fetchStudios();
    } else {
      throw new Error("accountId không tồn tại",accountId);
    }
  } 
  fetchStudios();
}, [accountId]);

  return (
    <div id="Studio">
      <div className="studioManager">
        <div className="mainContent">
          <h1 className="heading">Quản Lý Studio</h1>
          <div className="contentWrapper">
             <nav className="navigationSection" aria-label="Main navigation">
              <div 
                className={`navItem ${activeNav === 'Order' ? 'active' : ''}`} 
                onClick={() => handleNavClick('Order')}
              >
                Giao Dịch
                {activeNav === 'Order' && <div className="divider" role="separator" />}
              </div>
              <div 
                className={`navItem ${activeNav === 'Revenue' ? 'active' : ''}`} 
                onClick={() => handleNavClick('Revenue')}
              >
                Doanh Thu
                {activeNav === 'Revenue' && <div className="divider" role="separator" />}
              </div>
              <div 
                className={`navItem ${activeNav === 'Edit Studio' ? 'active' : ''}`} 
                onClick={() => handleNavClick('Edit Studio')}
              >
                Chỉnh sửa Studio
                {activeNav === 'Edit Studio' && <div className="divider" role="separator" />}
              </div>
              <div 
                className={`navItem ${activeNav === 'Chờ duyệt' ? 'active' : ''}`} 
                onClick={() => handleNavClick('Chờ duyệt')}
              >
                Chờ Duyệt
                {activeNav === 'Chờ duyệt' && <div className="divider" role="separator" />}
              </div>
            </nav>
            <section className="mainSection">
              {/* <div className="navigationMenu">
                <div>{activeNav}</div> 
              </div> */}

              {/* Hiển thị nội dung tùy thuộc vào mục Nav đang chọn */}
              {activeNav === 'Order' &&  (
                <table className="editTable">
                <thead>
                  <tr className="editRowHeader">
                    <th className="editCells">Hình ảnh</th>
                    <th className="editCells">Tên khách hàng</th>
                    <th className="editCells">Số tiền </th>
                    <th className="editCells">Loại phòng</th>
                    <th className="editCells">Thời gian bắt đầu</th>
                    <th className="editCells">Thời gian kết thúc</th>
                    <th className="editCells">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                    {orders.length > 0 ? (
                      orders.map((order, index) => (
                        <tr className="editCard" key={`order-${index}`}>
                          <td className="editCell">
                            {/* Ví dụ: hiển thị hình ảnh của studio, nếu có */}
                            <img
                              src={
                                order.studioDetails?.imageStudio ||
                                "https://via.placeholder.com/40"
                              }
                              alt="Studio"
                            />
                          </td>
                          <td className="editCell">{order.accountDetails?.userName}</td>
                          <td className="editCell">{order.booking?.totalPrice}</td>
                          <td className="editCell">{order.studioDetails?.studioSize}</td>
                          <td className="editCell">{order.booking?.checkIn}</td>
                          <td className="editCell">{order.booking?.checkOut}</td>
                          <td className="editCell">
                            <button
                              className="editButton"
                              aria-label={`Edit Order ${order.id}`}
                            >
                              Chỉnh Sửa
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td className="editCell" colSpan="7">
                          Không có order nào
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}

{activeNav === 'Revenue' && (
  <table className="editTable">
  <thead>
    <tr className="editRowHeader">
      {/* <th className="editCells">Hình ảnh</th> */}
      <th className="editCells">Tên khách hàng</th>
      <th className="editCells">Số tiền</th>
      <th className="editCells">Hình thức nhận</th>
      <th className="editCells">Ngày nhận</th>
      {/* <th className="editCells">Hành động</th> */}
    </tr>
  </thead>
  <tbody>
    {orders.map((customer, index) => (
      <tr className="editCard" key={`customer-${index}`}>
        {/* <td className="editCell">
          <img src="https://via.placeholder.com/40" alt="icon" />
        </td> */}
        <td className="editCell">{customer.accountDetails?.userName}</td>
        <td className="editCell">{customer.booking?.totalPrice}</td>
        <td className="editCell">Chuyển khoản</td>
        <td className="editCell">{customer.booking?.bookingDate
        }</td>
        {/* <td className="editCell">
          <button
            className="editButton"
            aria-label={`Edit ${customer.name}`}
          >
            Chỉnh Sửa
          </button>
        </td> */}
      </tr>
    ))}
  </tbody>
</table>
)}

{activeNav === 'Edit Studio' && (
  <div>
  {isEditing ? (
        // Giao diện chỉnh sửa thông tin studio
        <div className="studioContainer">
          <div className="description">Chỉnh sửa thông tin Studio</div>
          <form onSubmit={handleSubmit} className="studioForm">
            <div className="formLayout">
              <div className="imageColumn">
                <div className="imageSection">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets/c05fb6b607a34c3cab6bc37bd3664ed7/f93d3346142bc49372484ec44867abca05026fd0557be16daf66d1d9380ac6d7?apiKey=c05fb6b607a34c3cab6bc37bd3664ed7&"
                    alt="Product preview"
                    className="productImage"
                  />
                  <div className="imageControls">
                    <span className="imageSize">Medium</span>
                    <img
                      src="https://cdn.builder.io/api/v1/image/assets/c05fb6b607a34c3cab6bc37bd3664ed7/ba92d3688b6fd9de0346bb5670f498b04e1cea50f5dd4e592aee512ab7910bd3?apiKey=c05fb6b607a34c3cab6bc37bd3664ed7&"
                      alt="Size control"
                      className="controlIcon"
                    />
                  </div>
                </div>
              </div>
              <div className="inputColumn">
  <div className="inputGroup">
    {[
      { id: "name", label: "Tên Studio" },
      { id: "price", label: "Giá một giờ" },
      { id: "detail", label: "Chi tiết" },
      { id: "address", label: "Địa chỉ" },
    ].map((field) => (
      <div key={field.id} className="inputWrapper">
        <label htmlFor={field.id} className="inputLabel">
          {field.label}
        </label>
        <input
          type="text"
          id={field.id}
          className="inputField"
          value={formData[field.id]}
          onChange={handleInputChange(field.id)}
          aria-label={field.label}
        />
      </div>
    ))}
    <div className="actionButtons">
      <button type="submit" className="submitButton">
        Lưu
      </button>
      <button type="button" className="cancelButton" onClick={handleCancel}>
        Hủy
      </button>
    </div>
  </div>
</div>
            </div>
            {/* <div className="actionButtons">
              <button type="submit" className="submitButton">
                Lưu
              </button>
              <button type="button" className="cancelButton" onClick={handleCancel}>
                Hủy
              </button>
            </div> */}
          </form>
        </div>
  ) : (
    // Giao diện danh sách studio
    <table className="editTable">
      <thead>
        <tr className="editRowHeader">
          <th className="editCells">Hình ảnh</th>
          <th className="editCells">Tên Studio</th>
          <th className="editCells">Số tiền một giờ</th>
          <th className="editCells">Địa chỉ</th>
          <th className="editCells">Miêu tả về Studio</th>
          <th className="editCells">Hành động</th>
        </tr>
      </thead>
      <tbody>
        {studioIsActive.map((customer, index) => (
          <tr className="editCard" key={`customer-${index}`}>
            <td className="editCell">
              <img src= { customer.imageStudio ||
               "https://via.placeholder.com/40"} alt="icon" />
            </td>
            {/* order.studioDetails?.imageStudio ||
                                "https://via.placeholder.com/40" */}
            <td className="editCell">{customer.studioName}</td>
            <td className="editCell">{customer.pricing}</td>
            <td className="editCell">{customer.studioAddress}</td>
            <td className="editCell">{customer.studioDescription}</td>
            
            <td className="editCell">
              <button
                className="editButton"
                onClick={() => handleEdit(customer)}
              >
                Chỉnh Sửa
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )}
</div>
)}
{activeNav === 'Chờ duyệt' && (
   <table className="editTable">
   <thead>
     <tr className="editRowHeader">
       <th className="editCells">Hình ảnh</th>
       <th className="editCells">Tên Studio</th>
       <th className="editCells">Số tiền một giờ</th>
       <th className="editCells">Địa chỉ</th>
       <th className="editCells">Miêu tả về Studio</th>
       <th className="editCells">Trạng thái</th>
     </tr>
   </thead>
   <tbody>
  {studioIsUnactive.length === 0 ? (
    <tr>
      <td colSpan="6" className="editCell">
        Bạn không có studio nào chưa được duyệt
      </td>
    </tr>
  ) : (
    studioIsUnactive.map((customer, index) => (
      <tr className="editCard" key={`customer-${index}`}>
        <td className="editCell">
          <img
            src={customer.imageStudio || "https://via.placeholder.com/40"}
            alt="icon"
          />
        </td>
        <td className="editCell">{customer.studioName}</td>
        <td className="editCell">{customer.pricing}</td>
        <td className="editCell">{customer.studioAddress}</td>
        <td className="editCell">{customer.studioDescription}</td>
        <td className="editCell">
          <button
            className="editButton"
            onClick={() => handleEdit(customer)}
          >
            Chờ Duyệt
          </button>
        </td>
      </tr>
    ))
  )}
</tbody>

 </table>
)}
            </section>
          </div>
        </div>
        <footer className="footer" role="contentinfo" />
      </div>
    </div>
  );
}
