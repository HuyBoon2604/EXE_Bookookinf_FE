import React, {useRef, useState, useEffect, useCallback } from 'react';
import './Studio.css'; // Thay vì import styles từ file CSS module, sử dụng file CSS thông thường
import api from '../../utils/requestAPI';
import useAuth from '../../../hooks/useAuth';
import CreateStudioRequest from '../AddStu/CreateStudioRequest';



export default function Studio() {
  const [activeNav, setActiveNav] = useState('Order'); // Trạng thái cho Nav
  const [orders, setOrders] = useState([]);
  const [studioIsActive, setStudioIsActive] = useState([]);
  const [studioIsUnactive, setStudioIsUnactive] = useState([]);
  const [ordersData, setOrdersData] = useState([]);
  const [ordersDataSuccess, setOrdersDataSuccess] = useState([]);
  const [studio, setStudio] = useState([]);
  const [capacity, setCapacity] = useState([]);
  const { auth } = useAuth();
  const accountId = auth.user.id;

  

  // Tạo ref để tham chiếu đến input file
  const fileInputRef = useRef(null);

  // Khi click vào hình ảnh, kích hoạt click cho input file
  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  // Xử lý khi người dùng chọn file
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Tạo URL tạm thời cho file ảnh được chọn
      const previewURL = URL.createObjectURL(file);
      // Cập nhật state của formData để lưu file và URL preview
      setFormData((prev) => ({
        ...prev,
        // poster: file,  
        // img: previewURL, 
        img: file,
        poster :previewURL,    
      }));
    }
  };
  
    
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
    poster: "",
    id : "",
    img:"",
    name: "",
    price: "",
    detail: "",
    address: "",
    size: "",
    quantity: "",
  }); // Dữ liệu form chỉnh sửa

  const handleEdit = (customer) => {
    setIsEditing(true); // Chuyển sang chế độ chỉnh sửa
    setEditingCustomer(customer); // Lưu thông tin studio
    setFormData({
      id : customer.studioId,
      poster : customer.studio?.imageStudio || "https://via.placeholder.com/40",
      img : customer.studio?.imageStudio || "https://via.placeholder.com/40",
      name: customer.studio?.studioName || "",
      price: customer.studio?.pricing || "",
      detail: customer.studio?.studioDescription || "",
      address: customer.studio?.studioAddress || "",
      size: customer.size.sizeDescription || "",
      quantity: customer.quantity || ""
    });
  };

  // <img src= { customer.imageStudio ||
  // "https://via.placeholder.com/40"} alt="icon" />
  // <td className="editCell">{customer.studioName}</td>
  //           <td className="editCell">{customer.pricing}</td>
  //           <td className="editCell">{customer.studioAddress}</td>
  //           <td className="editCell">{customer.studioDescription}</td>

  const handleInputChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Dữ liệu được gửi:", formData);
  
    try {
      // Tạo đối tượng FormData
      const data = new FormData();
      
      // Append các trường dữ liệu (đảm bảo các tên trường khớp với yêu cầu của API)
      data.append("StudioName", formData.name);
      data.append("StudioDescription", formData.detail); // hoặc formData.description tùy cách bạn lưu trữ
      data.append("Pricing", formData.price);
      data.append("StudioAddress", formData.address);
      
      // Các trường poster (có thể là rỗng nếu không có file được chọn)
      // Ví dụ: nếu bạn lưu file được chọn trong formData.poster (một đối tượng File)
      if (formData.img) {
        data.append("poster", formData.img);
      } else {
        // Nếu không có file mới, bạn có thể để trống hoặc không append trường này,
        // tùy theo yêu cầu của API.
        data.append("poster", "");
      }
      
      // Nếu API yêu cầu các trường poster khác (poster1, poster2, v.v.) thì bạn cần append chúng ở đây,
      // ví dụ:
      data.append("poster1", "");
      data.append("poster2", "");
      data.append("poster3", "");
      data.append("poster4", "");
      data.append("poster5", "");
      // Và các trường khác nếu cần:
      data.append("Quantity",formData.quantity);  // Nếu có
      data.append("SizeId",formData.size);    // Nếu có
  
      // Gọi API cập nhật studio với FormData
      
      const response = await api.put(
        `api/Studio/Update-Studio-With-Capacity-Image?studioId=${formData.id}&accountId=${accountId}`,
        data,
       
      );
      
      console.log("Cập nhật thành công:", response.data);
      
      // Sau khi cập nhật thành công, chuyển sang chế độ xem
      setIsEditing(false);
      setEditingCustomer(null);
    } catch (error) {
      console.error("Cập nhật studio thất bại:", error);
    }
  };
  

  const handleCancel = () => {
    setIsEditing(false); // Quay lại chế độ xem khi hủy
    setEditingCustomer(null);
  };

  useEffect(() => {
    // Hàm fetch dữ liệu studio đã được duyệt theo accountId
    async function fetchStudios() {
      try {
        // const response = await api.get(
        //   `/api/Studio/Get-All-Studio-With-IsActive-True?accountId=${accountId}`
          const [approvedResponse, unapprovedResponse] = await Promise.all([
            api.get(`/api/Studio/Get-All-Studio-With-IsActive-True-By-AccountId?accountId=${accountId}`),
            api.get(`/api/Studio/Get-All-Studio-With-IsActive-Flase-By-AccountId?accountId=${accountId}`),
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

useEffect(() => {
  async function fetchData() {
    try {
      if (!accountId) {
        throw new Error("AccountId không tồn tại");
      }

      // Bước 1: Lấy danh sách các studio mà account đang sở hữu
      const studiosResponse = await api.get(
        `/api/Studio/Get-All-Studio-By-AccountId?AccountId=${accountId}`
      );
      // Nếu dữ liệu được bọc trong $values, lấy mảng đó; nếu không thì lấy trực tiếp
      const studios = studiosResponse.data.$values || studiosResponse.data;
      console.log("Studios:", studios);

      // Bước 2: Với mỗi studio, gọi API lấy các order theo studio id
      const studiosOrders = await Promise.all(
        studios.map(async (studio) => {
          const ordersResponse = await api.get(
            `/Get-All-Order-By-StudioId?StudioId=${studio.id}`
          );
          // Nếu dữ liệu được bọc trong $values thì lấy mảng đó, ngược lại lấy trực tiếp
          const orders = ordersResponse.data.$values || ordersResponse.data;

          // Bước 3: Với mỗi order, lấy thông tin account từ accountId có trong booking
          const enrichedOrders = await Promise.all(
            orders.map(async (order) => {
              const orderAccountId = order.booking?.accountId;
              let accountDetails = null;
              if (orderAccountId) {
                const accountResponse = await api.get(
                  `/api/Account/get-by-id?accountId=${orderAccountId}`
                );
                accountDetails = accountResponse.data;
                console.log("Account details for order", order.id, accountDetails,order);
              }
              return {
                ...order,
                studioDetails: studio,
                accountDetails,
              };
            })
          );

          return enrichedOrders;
        })
      );

      // studiosOrders là một mảng các mảng (mỗi studio trả về mảng order)
      // Dùng flat() để gộp thành một mảng duy nhất
      const flattenedOrders = studiosOrders.flat();
      setOrdersData(flattenedOrders);
    } catch (err) {
      console.error("Lỗi khi lấy dữ liệu orders từ các studio:", err);
    }
  }

  fetchData();
}, [accountId]);

useEffect(() => {
  async function fetchDataSuccess() {
    try {
      if (!accountId) {
        throw new Error("AccountId không tồn tại");
      }

      // Bước 1: Lấy danh sách các studio mà account đang sở hữu
      const studiosResponse = await api.get(
        `/api/Studio/Get-All-Studio-By-AccountId?AccountId=${accountId}`
      );
      // Nếu dữ liệu được bọc trong $values, lấy mảng đó; nếu không thì lấy trực tiếp
      const studios = studiosResponse.data.$values || studiosResponse.data;
      console.log("Studios:", studios);

      // Bước 2: Với mỗi studio, gọi API lấy các order theo studio id
      const studiosOrders = await Promise.all(
        studios.map(async (studio) => {
          const ordersResponse = await api.get(
            `/Get-All-Order-Success-By-StudioId?studioId=${studio.id}`
          );
          // Nếu dữ liệu được bọc trong $values thì lấy mảng đó, ngược lại lấy trực tiếp
          const orders = ordersResponse.data.$values || ordersResponse.data;

          // Bước 3: Với mỗi order, lấy thông tin account từ accountId có trong booking
          const enrichedOrders = await Promise.all(
            orders.map(async (order) => {
              const orderAccountId = order.booking?.accountId;
              let accountDetails = null;
              if (orderAccountId) {
                const accountResponse = await api.get(
                  `/api/Account/get-by-id?accountId=${orderAccountId}`
                );
                accountDetails = accountResponse.data;
                console.log("Account details for order", order.id, accountDetails,order);
              }
              return {
                ...order,
                studioDetails: studio,
                accountDetails,
              };
            })
          );

          return enrichedOrders;
        })
      );

      // studiosOrders là một mảng các mảng (mỗi studio trả về mảng order)
      // Dùng flat() để gộp thành một mảng duy nhất
      const flattenedOrders = studiosOrders.flat();
      setOrdersDataSuccess(flattenedOrders);
    } catch (err) {
      console.error("Lỗi khi lấy dữ liệu orders từ các studio:", err);
    }
  }

  fetchDataSuccess();
}, [accountId]);

useEffect(() => {
  async function loadCapacityForActiveStudios() {
    if (!studioIsActive || studioIsActive.length === 0) {
      console.error("Không có studio active nào hoặc dữ liệu không hợp lệ.");
      return;
    }

    try {
      // Gọi API cho từng studio và thu thập kết quả
      const capacitiesArray = await Promise.all(
        studioIsActive.map(async (studio) => {
          try {
            const response = await api.get(`/Get-Capacity-By-StudioId?StudioId=${studio.id}`);
            if (response.status === 200 && response.data) {
              // Nếu dữ liệu được bọc trong $values thì lấy mảng đó, nếu không thì lấy trực tiếp
              const capacityData = response.data.$values || response.data;
              return capacityData;
            } else {
              console.error(`Không thể lấy thông tin capacity cho studio ${studio.id}.`);
              return [];
            }
          } catch (error) {
            console.error(`Lỗi khi gọi API get capacity cho studio ${studio.id}:`, error);
            return [];
          }
        })
      );

      // Gộp tất cả kết quả vào một mảng duy nhất
      const flattenedCapacities = capacitiesArray.flat();
      setCapacity(flattenedCapacities);
    } catch (error) {
      console.error("Lỗi khi load capacity for active studios:", error);
    }
  }

  loadCapacityForActiveStudios();
}, [studioIsActive]);




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
              <div 
                className={`navItem ${activeNav === 'Tạo Studio' ? 'active' : ''}`} 
                onClick={() => handleNavClick('Tạo Studio')}
              >
                Tạo Studio
                {activeNav === 'Tạo Studio' && <div className="divider" role="separator" />}
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
                    {/* <th className="editCells">Loại phòng</th> */}
                    <th className="editCells">Thời gian bắt đầu</th>
                    <th className="editCells">Thời gian kết thúc</th>
                    <th className="editCells">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                    {ordersData.length > 0 ? (
                      ordersData.map((order, index) => (
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
                          {/* <td className="editCell">{order.studioDetails?.studioSize}</td> */}
                          <td className="editCell">{order.booking?.checkIn}</td>
                          <td className="editCell">{order.booking?.checkOut}</td>
                          <td className="editCell">{order.status ? "true" : "false"}</td>
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
    {ordersDataSuccess.map((customer, index) => (
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
                  {/* Hiển thị ảnh từ formData.img */}
                  <img
                    src={formData.poster || "https://via.placeholder.com/40"}
                    alt="Product preview"
                    className="productImage"
                  />
                  <div className="imageControls">
                    <span className="imageSize">Tải hình ảnh </span>
                    <img
                      src="https://cdn.builder.io/api/v1/image/assets/c05fb6b607a34c3cab6bc37bd3664ed7/ba92d3688b6fd9de0346bb5670f498b04e1cea50f5dd4e592aee512ab7910bd3?apiKey=c05fb6b607a34c3cab6bc37bd3664ed7&"
                      alt="Size control"
                      className="controlIcon"
                      onClick={handleImageClick} // Kích hoạt sự kiện chọn file
                      style={{ cursor: "pointer" }}
                    />
                    {/* Input file ẩn */}
                    <input
                      type="file"
                      ref={fileInputRef}
                      style={{ display: "none" }}
                      onChange={handleFileChange}
                      accept="image/*"
                    />
                  </div>
                </div>
              </div>
              <div className="inputColumn">
                <div className="inputGroup">
                {[
  {
    id: "name",
    label: "Tên Studio",
    placeholder: editingCustomer ? editingCustomer.studio?.studioName : "",
  },
  {
    id: "price",
    label: "Giá một giờ",
    placeholder: editingCustomer ? editingCustomer.studio?.pricing : "",
  },
  {
    id: "address",
    label: "Địa chỉ",
    placeholder: editingCustomer ? editingCustomer.studio?.studioAddress : "",
  },
  {
    id: "detail",
    label: "Chi tiết",
    placeholder: editingCustomer ? editingCustomer.studio?.studioDescription : "",
  },
  {
    id: "size",
    label: "Loại phòng",
    placeholder: editingCustomer ? editingCustomer.size?.sizeDescription : "",
  },
  {
    id: "quantity",
    label: "Sức chứa",
    placeholder: editingCustomer ? editingCustomer.quantity : "",
  },
].map((field) => (
  <div key={field.id} className="inputWrapper">
    <label htmlFor={field.id} className="inputLabel">
      {field.label}
    </label>
    {field.id === "size" ? (
      <select
        id={field.id}
        className="inputField"
        value={formData[field.id]}
        onChange={handleInputChange(field.id)}
        aria-label={field.label}
      >
        <option value="">Chọn kích thước</option>
        <option value="1">Nhỏ</option>
        <option value="2">Vừa</option>
        <option value="3">Lớn</option>
      </select>
    ) : (
      <input
        type="text"
        id={field.id}
        className="inputField"
        placeholder={field.placeholder}
        value={formData[field.id]}
        onChange={handleInputChange(field.id)}
        aria-label={field.label}
      />
    )}
  </div>
))}

                  <div className="actionButtons">
                    <button type="submit" className="submitButton">
                      Lưu
                    </button>
                    <button
                      type="button"
                      className="cancelButton"
                      onClick={handleCancel}
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              </div>
            </div>
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
          <th className="editCells">Loại Phòng</th>
          <th className="editCells">Sức Chứa</th>
        </tr>
      </thead>
      <tbody>
        {capacity.map((customer, index) => (
          <tr className="editCard" key={`customer-${index}`}>
            <td className="editCell">
              <img src= { customer.studio?.imageStudio ||
               "https://via.placeholder.com/40"} alt="icon" />
            </td>
            {/* order.studioDetails?.imageStudio ||
                                "https://via.placeholder.com/40" */}
            <td className="editCell">{customer.studio?.studioName}</td>
        <td className="editCell">{customer.studio?.pricing}</td>
        <td className="editCell">{customer.studio?.studioAddress}</td>
        <td className="editCell">{customer.studio?.studioDescription}</td>
        <td className="editCell">{customer.size?.sizeDescription}</td>
        <td className="editCell">{customer.quantity}</td>
            
            <td className="editCell">
              <button
                className="editButton"
                onClick={() => handleEdit(customer)}
              >
                Chỉnh Sửa
              </button>
              <button
              className="goButton"
              onClick={() => {
              window.location.href = `/StudioInfor/${customer.studioId}`;
              }}>
               Đi đến Studio
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
            // onClick={() => handleEdit(customer)}
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

{activeNav === 'Tạo Studio' && (
   <CreateStudioRequest />
)}
            </section>
          </div>
        </div>
        <footer className="footer" role="contentinfo" />
      </div>
    </div>
  );
}
