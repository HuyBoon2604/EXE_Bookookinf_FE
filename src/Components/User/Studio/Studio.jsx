import React, {useRef, useState, useEffect, useCallback,useMemo } from 'react';
import './Studio.css'; // Thay vì import styles từ file CSS module, sử dụng file CSS thông thường
import api from '../../utils/requestAPI';
import useAuth from '../../../hooks/useAuth';
import CreateStudioRequest from '../AddStu/CreateStudioRequest';
import defaultImage from '../../../assets/images/Background 15.png';





export default function Studio() {
  const [activeNav, setActiveNav] = useState('Order'); // Trạng thái cho Nav
  const [orders, setOrders] = useState([]);
  const [studioIsActive, setStudioIsActive] = useState([]);
  const [studioIsUnactive, setStudioIsUnactive] = useState([]);
  const [ordersData, setOrdersData] = useState([]);
  const [ordersDataSuccess, setOrdersDataSuccess] = useState([]);
  const [studio, setStudio] = useState([]);
  const [capacity, setCapacity] = useState([]);
  const [studioState, setStudioState] = useState([]);
  const prevStudioIds = useRef([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const { auth } = useAuth();
  const isFirstRender = useRef(true);
  const accountId = auth.user.id;

  // Thêm state để quản lý lỗi
  const [errors, setErrors] = useState({
    name: false,
    price: false,
    address: false,
    detail: false,
    timeOn: false,
    timeOff: false,
    descriptionAmentites: false,
    size: false,
    quantity: false
  });

  const base64ToFile = (base64, filename) => {
    const arr = base64.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };
  
  const formatPrice = (price) => {
    if (typeof price !== "number" || isNaN(price)) {
        return "0 VNĐ"; // Giá trị mặc định nếu `price` không hợp lệ
    }
    return `${price.toLocaleString()} VNĐ`;
};
  // Tạo ref để tham chiếu đến input file
  const fileInputRef = useRef(null);

  // Khi click vào hình ảnh, kích hoạt click cho input file
  const handleImageClick = (index) => {
    if (fileInputRefs.current[index]) {
      fileInputRefs.current[index].click(); // Kích hoạt input file tương ứng
      console.log(`🖼 Ảnh được chọn: poster${index + 1}`);
    } else {
      console.error("fileInputRefs chưa khởi tạo hoặc không có phần tử tại vị trí", index);
    }
  };

  // Xử lý khi người dùng chọn file
  // const handleFileChange = (event) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     // Tạo URL tạm thời cho file ảnh được chọn
  //     const previewURL = URL.createObjectURL(file);
  //     // Cập nhật state của formData để lưu file và URL preview
  //     setFormData((prev) => ({
  //       ...prev,
  //       // poster: file,  
  //       // img: previewURL, 
  //       img: file,
  //       poster :previewURL,    
  //     }));
  //   }
  // };
  
    
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
    
    id : "",
    name: "",
    price: "",
    detail: "",
    timeOn: "",
    timeOff: "",
    descriptionAmentites: "",
    address: "",
    size: "",
    quantity: "",
     // Ảnh chính và các ảnh phụ
     poster1: "", // Ảnh chính
     poster2: "", // Ảnh phụ 1
     poster3: "", // Ảnh phụ 2
     poster4: "", // Ảnh phụ 3
     poster5: "", // Ảnh phụ 4
     poster6: "", // Ảnh phụ 5
  }); // Dữ liệu form chỉnh sửa

  const handleEdit = (customer) => {
    setIsEditing(true);
    setEditingCustomer(customer);

    setFormData({
      ...formData,
      id: customer.capacity?.studioId,
      // Nếu có ảnh từ API thì lấy, nếu không thì giữ ảnh placeholder
      poster1: customer.capacity?.studio?.imageStudio || " https://i.imgur.com/pRy9nMo.png",
      poster2: customer.images?.imageUrl1 || " https://i.imgur.com/pRy9nMo.png",
      poster3: customer.images?.imageUrl2 || " https://i.imgur.com/pRy9nMo.png",
      poster4: customer.images?.imageUrl3 || " https://i.imgur.com/pRy9nMo.png",
      poster5: customer.images?.imageUrl4 || " https://i.imgur.com/pRy9nMo.png",
      poster6: customer.images?.imageUrl5 || " https://i.imgur.com/pRy9nMo.png",
      img1: customer.capacity?.studio?.imageStudio || " https://i.imgur.com/pRy9nMo.png",
      img2: customer.images?.imageUrl1 || " https://i.imgur.com/pRy9nMo.png",
      img3: customer.images?.imageUrl2 || " https://i.imgur.com/pRy9nMo.png",
      img4: customer.images?.imageUrl3 || " https://i.imgur.com/pRy9nMo.png",
      img5: customer.images?.imageUrl4 || " https://i.imgur.com/pRy9nMo.png",
      img6: customer.images?.imageUrl5 || " https://i.imgur.com/pRy9nMo.png",
      name: customer.capacity?.studio?.studioName || "",
      price: customer.capacity?.studio?.pricing || "",
      detail: customer.capacity?.studio?.studioDescription || "",
      timeOn: customer.capacity?.studio?.timeOn || "",
      timeOff: customer.capacity?.studio?.timeOff || "",
      descriptionAmentites: customer.capacity?.studio?.studioDescriptionAmentitiesDetail || "",
      address: customer.capacity?.studio?.studioAddress || "",
      size: customer.capacity?.size?.id || "",
      quantity: customer.capacity?.quantity || ""
     
    });
  };

  // <img src= { customer.imageStudio ||
  // " https://i.imgur.com/pRy9nMo.png"} alt="icon" />
  // <td className="editCell">{customer.studioName}</td>
  //           <td className="editCell">{customer.pricing}</td>
  //           <td className="editCell">{customer.studioAddress}</td>
  //           <td className="editCell">{customer.studioDescription}</td>

  const handleInputChange = (field) => (e) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    
    // Reset error khi user bắt đầu nhập
    setErrors(prev => ({
      ...prev,
      [field]: false
    }));
  };

  const urlToFile = async (url, filename) => {
    try {
      // Nếu URL là ảnh mặc định, sử dụng ảnh local
      if (url === " https://i.imgur.com/pRy9nMo.png") {
        const response = await fetch(defaultImage);
        const blob = await response.blob();
        return new File([blob], filename, { type: blob.type });
      }
  
      // Nếu không, tải ảnh từ URL
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Lỗi khi tải ảnh: ${response.status} ${response.statusText}`);
      }
      const blob = await response.blob();
      return new File([blob], filename, { type: blob.type });
    } catch (error) {
      console.error("❌ Lỗi khi chuyển đổi URL thành file:", error);
      throw error; // Ném lỗi để xử lý tiếp
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Kiểm tra các trường bắt buộc
    const newErrors = {
      name: !formData.name,
      price: !formData.price,
      address: !formData.address,
      detail: !formData.detail,
      timeOn: !formData.timeOn,
      timeOff: !formData.timeOff,
      descriptionAmentites: !formData.descriptionAmentites,
      size: !formData.size,
      quantity: !formData.quantity
    };

    setErrors(newErrors);

    // Nếu có lỗi, không submit
    if (Object.values(newErrors).some(error => error)) {
      return;
    }

    // Hiển thị confirm dialog
    if (!window.confirm("Bạn muốn cập nhật thông tin?")) {
      return;
    }

    try {
      const data = new FormData();
      
      // Append các trường dữ liệu cơ bản
      data.append("StudioName", formData.name);
      data.append("StudioDescription", formData.detail);
      data.append("Pricing", formData.price);
      data.append("StudioAddress", formData.address);
      data.append("TimeOn", formData.timeOn.toString());
      data.append("TimeOff", formData.timeOff.toString());
      data.append("DescriptionAmentites", formData.descriptionAmentites);
      data.append("Quantity", formData.quantity);
      data.append("SizeId", formData.size);

      // Xử lý ảnh chính (poster1)
    if (formData.isDeleted1) {
      // Chuyển đổi URL thành file và gửi lên server
      const defaultImage = await urlToFile(" https://i.imgur.com/pRy9nMo.png", "poster1.png");
      data.append("poster", defaultImage);
      console.log("🚮 Đã xóa ảnh chính và gửi ảnh mặc định");
    } else if (formData.poster1?.startsWith('data:')) {
      const file = base64ToFile(formData.poster1, 'poster1.png');
      data.append("poster", file);
    } else if (formData.poster1) {
      data.append("poster", formData.poster1);
    }

    // Xử lý các ảnh phụ - Sửa index để khớp với server
    for (let i = 2; i <= 6; i++) {
      const posterKey = `poster${i}`;
      const isDeleted = formData[`isDeleted${i}`];
      const posterValue = formData[posterKey];

      // Key gửi lên server phải khớp poster1-poster5
      const serverPosterKey = `poster${i - 1}`;

      if (isDeleted) {
        // Chuyển đổi URL thành file và gửi lên server
        const defaultImage = await urlToFile(" https://i.imgur.com/pRy9nMo.png", `${serverPosterKey}.png`);
        data.append(serverPosterKey, defaultImage);
        console.log(`🚮 Đã xóa ảnh ${serverPosterKey} và gửi ảnh mặc định`);
      } else if (posterValue?.startsWith('data:')) {
        const file = base64ToFile(posterValue, `${serverPosterKey}.png`);
        data.append(serverPosterKey, file);
        console.log(`🔼 Upload ảnh mới cho ${serverPosterKey}`);
      } else if (posterValue) {
        data.append(serverPosterKey, posterValue);
        console.log(`🔄 Giữ nguyên ảnh cho ${serverPosterKey}`);
      }
    }

      // Log để kiểm tra
      for (let pair of data.entries()) {
  if (pair[1] instanceof File) {
    console.log(pair[0] + ':', pair[1].name); // Hiển thị tên file
  } else {
    console.log(pair[0] + ':', pair[1]);
  }
}

      const response = await api.put(
        `api/Studio/Update-Studio-With-Capacity-Image?studioId=${formData.id}&accountId=${accountId}`,
        data,
        {
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );

      console.log("✅ Cập nhật thành công:", response.data);
      console.log("✅ Cập nhật thành công1111:", formData); 
      alert("Cập nhật thành công!");
      setIsEditing(false);
      setEditingCustomer(null);
      window.location.reload();

    } catch (error) {
      console.error("❌ Cập nhật thất bại:", error);
      alert("Cập nhật thất bại! Vui lòng thử lại");
    }
  };
  
  

  const handleCancel = () => {
    if (window.confirm("Bạn muốn thoát khỏi trang chỉnh sửa studio?")) {
      setIsEditing(false);
      setEditingCustomer(null);
    }
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
  const currentStudioIds = studioIsActive.map(studio => studio.id);

  // So sánh nếu danh sách studioId không thay đổi, thì không gọi API
  if (JSON.stringify(prevStudioIds.current) === JSON.stringify(currentStudioIds)) {
    // console.log("Không có thay đổi, bỏ qua API call");
    return;
  }

  async function loadStudioData() {
    if (!studioIsActive || studioIsActive.length === 0) {
      console.error("Không có studio active nào hoặc dữ liệu không hợp lệ.");
      return;
    }

    try {
      const studioData = await Promise.all(
        studioIsActive.map(async (studio) => {
          try {
            const [capacityResponse, imageResponse] = await Promise.all([
              api.get(`/Get-Capacity-By-StudioId?StudioId=${studio.id}`),
              api.get(`/Get-All-Image-Of-Studio-By-StudioId?StudioId=${studio.id}`)
            ]);

            return {
              studioId: studio.id,
              capacity: capacityResponse.status === 200 ? (capacityResponse.data.$values || capacityResponse.data) : [],
              images: imageResponse.status === 200 ? (imageResponse.data.$values || imageResponse.data) : [],
            };
          } catch (error) {
            console.error(`Lỗi khi gọi API cho studio ${studio.id}:`, error);
            return {
              studioId: studio.id,
              capacity: [],
              images: [],
            };
          }
        })
      );

      const studioDataMap = studioData.reduce((acc, item) => {
        acc[item.studioId] = { capacity: item.capacity, images: item.images };
        return acc;
      }, {});

      setStudioState(studioDataMap); // Cập nhật state
      prevStudioIds.current = currentStudioIds; // Cập nhật ref để tránh gọi lại API không cần thiết
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu studio:", error);
    }
  }

  loadStudioData();
}, [studioIsActive]);

// Chỉ log khi studioState thực sự thay đổi, tránh spam console
useEffect(() => {
  if (isFirstRender.current) {
    isFirstRender.current = false; // Bỏ qua lần render đầu tiên
    return;
  }
  console.log("studioState hiện tại:", studioState);
}, [studioState]);


// Thêm vào phần khai báo state
const fileInputRefs = useRef([]);

// Xử lý khi click vào ảnh trong gallery
const handleGalleryImageClick = (index) => {
  setFormData(prev => ({
    ...prev,
    poster: prev[`poster${index + 1}`]
  }));
};

// Xử lý khi xóa ảnh
const handleDeleteImage = async (e, index) => {
  e.preventDefault();
  e.stopPropagation();

  try {
    const posterKey = `poster${index + 1}`; // Key của poster (poster1, poster2, ..., poster6)
    const imgKey = `img${index + 1}`; // Key của img (img1, img2, ..., img6)
    console.log(`🗑 Đang xóa ảnh: ${posterKey}`);

    // Cập nhật state
    setFormData(prevData => ({
      ...prevData,
      [posterKey]: " https://i.imgur.com/pRy9nMo.png", // Đặt giá trị của poster thành null
      [imgKey]: " https://i.imgur.com/pRy9nMo.png", // Đặt giá trị của img thành placeholder
      [`isDeleted${index + 1}`]: true // Đánh dấu ảnh đã bị xóa
    }));

    console.log("formData sau khi xóa ảnh:", formData);
  } catch (error) {
    console.error("❌ Lỗi khi xóa ảnh:", error);
    alert("Không thể xóa ảnh. Vui lòng thử lại!");
  }
};

// Xử lý khi click vào nút upload
const handleUploadClick = () => {
  if (fileInputRefs.current[selectedImageIndex]) {
    fileInputRefs.current[selectedImageIndex].click();
  } else {
    console.error("Không tìm thấy input file");
  }
};

// Xử lý khi chọn file mới
const handleFileChange = (event, index) => {
  const file = event.target.files[0];
  console.log(`📸 Đang cập nhật poster ${index + 1}`);
  
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prevData) => ({
        ...prevData,
        [`poster${index}`]: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  }
};
useEffect(() => {
  console.log("formData sau khi thay đổi1111:", formData);
}, [formData]);

// Thêm state để quản lý tìm kiếm
const [searchTerm, setSearchTerm] = useState('');

// Thêm hàm xử lý tìm kiếm
const handleSearch = (event) => {
  setSearchTerm(event.target.value);
};

// Thêm placeholder state để hiển thị placeholder phù hợp với từng nav
const getSearchPlaceholder = () => {
  switch (activeNav) {
    case 'Order':
      return 'Tìm kiếm theo tên khách hàng...';
    case 'Revenue':
      return 'Tìm kiếm theo tên khách hàng...';
    case 'Edit Studio':
      return 'Tìm kiếm theo tên studio...';
    default:
      return 'Tìm kiếm...';
  }
};

// Sửa lại hàm filter tùy theo nav đang active
const getFilteredData = (data) => {
  const searchStr = searchTerm.toLowerCase();
  
  switch (activeNav) {
    case 'Order':
      // Filter cho giao dịch (data là array)
      return Array.isArray(data) ? data.filter(item => 
        item?.accountDetails?.userName?.toLowerCase().includes(searchStr)
      ) : [];
      
    case 'Revenue':
      // Filter cho doanh thu (data là array)
      return Array.isArray(data) ? data.filter(item => 
        item?.accountDetails?.userName?.toLowerCase().includes(searchStr)
      ) : [];
      
    case 'Edit Studio':
      // Filter cho studio (data là object)
      return Object.entries(data).filter(([_, item]) => 
        item?.capacity?.studio?.studioName?.toLowerCase().includes(searchStr) ||
        item?.capacity?.studio?.studioAddress?.toLowerCase().includes(searchStr)
      );
      
    default:
      return Array.isArray(data) ? data : Object.entries(data);
  }
};

  return (
    <div id="Studio">
      <div className="studioManager">
        <div className="mainContent">
          <h1 className="heading">Quản Lý Studio</h1>
          <div className="contentWrapper">
            <div className="navigationWrapper">
              <nav className="navigationSection" aria-label="Main navigation">
                <div 
                  className={`navItem ${activeNav === 'Order' ? 'active' : ''}`} 
                  onClick={() => handleNavClick('Order')}
                >
                  Giao Dịch
                </div>
                <div 
                  className={`navItem ${activeNav === 'Revenue' ? 'active' : ''}`} 
                  onClick={() => handleNavClick('Revenue')}
                >
                  Doanh Thu
                </div>
                <div 
                  className={`navItem ${activeNav === 'Edit Studio' ? 'active' : ''}`} 
                  onClick={() => handleNavClick('Edit Studio')}
                >
                  Thông tin Studio
                </div>
                <div 
                  className={`navItem ${activeNav === 'Chờ duyệt' ? 'active' : ''}`} 
                  onClick={() => handleNavClick('Chờ duyệt')}
                >
                  Chờ Duyệt
                </div>
                <div 
                  className={`navItem ${activeNav === 'Tạo Studio' ? 'active' : ''}`} 
                  onClick={() => handleNavClick('Tạo Studio')}
                >
                  Tạo Studio
                </div>
              </nav>

              <div className="searchContainer">
                <input
                  type="text"
                  placeholder={getSearchPlaceholder()}
                  value={searchTerm}
                  onChange={handleSearch}
                  className="searchInput"
                />
                <i className="fas fa-search searchIcon"></i>
              </div>
            </div>

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
                    {getFilteredData(ordersData).map((data, index) => (
                      <tr className="editCard" key={`order-${index}`}>
                        <td className="editCell">
                          {/* Ví dụ: hiển thị hình ảnh của studio, nếu có */}
                          <img
                            src={data.studioDetails?.imageStudio || " https://i.imgur.com/pRy9nMo.png"}
                            alt="Studio"
                          />
                        </td>
                        <td className="editCell">{data.accountDetails?.userName}</td>
                        <td className="editCell">{formatPrice(data.booking?.totalPrice)}</td>
                        {/* <td className="editCell">{order.studioDetails?.studioSize}</td> */}
                        <td className="editCell">{data.booking?.checkIn}</td>
                        <td className="editCell">{data.booking?.checkOut}</td>
                        <td className={`editCell ${data.status ? "success" : "failed"}`}>
                                                      {data.status ? "Thành Công" : "Thất Bại"}
                        </td>
                      </tr>
                    ))}
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
      <th className="editCells">Hình thức thanh toán</th>
      <th className="editCells">Ngày thanh toán</th>
      {/* <th className="editCells">Hành động</th> */}
    </tr>
  </thead>
  <tbody>
    {getFilteredData(ordersDataSuccess).map((data, index) => (
      <tr className="editCard" key={`revenue-${index}`}>
        {/* <td className="editCell">
          <img src=" https://i.imgur.com/pRy9nMo.png" alt="icon" />
        </td> */}
        <td className="editCell">{data.accountDetails?.userName}</td>
        <td className="editCell">{formatPrice(data.booking?.totalPrice)}</td>
        <td className="editCell">Chuyển khoản</td>
        <td className="editCell">{data.booking?.bookingDate}</td>
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
                  {/* Main image display */}
                  <img
                    src={formData[`poster${selectedImageIndex + 1}`] || " https://i.imgur.com/pRy9nMo.png"}
                    alt="Product preview"
                    className="productImage"
                  />
                  <div className="imageControls">
                    <span className="imageSize">Tải hình ảnh </span>
                    <img
                      src="https://cdn.builder.io/api/v1/image/assets/c05fb6b607a34c3cab6bc37bd3664ed7/ba92d3688b6fd9de0346bb5670f498b04e1cea50f5dd4e592aee512ab7910bd3?apiKey=c05fb6b607a34c3cab6bc37bd3664ed7&"
                      alt="Size control"
                      className="controlIcon"
                      onClick={handleUploadClick} // Kích hoạt sự kiện chọn file
                      style={{ cursor: "pointer" }}
                    />
                  </div>
                  
                  {/* Image gallery */}
                  <div className="imageGallery">
                  {[...Array(6)].map((_, index) => (
  <div key={index} className="galleryItem">
    {formData[`poster${index + 1}`] ? (
      <div className="imageContainer">
        <img
          src={formData[`poster${index + 1}`]}
          alt={`Gallery ${index + 1}`}
          onClick={() => setSelectedImageIndex(index)}
          className="galleryImage"
        />
        <button
          className="deleteImageBtn"
          type="button"
          onClick={(e) => handleDeleteImage(e, index)}
          disabled={formData[`poster${index + 1}`]?.includes('placeholder')}
        >
          X<i className="fas fa-times"></i>
        </button>
      </div>
    ) : (
      <div
        className="uploadPlaceholder"
        onClick={() => setSelectedImageIndex(index)}
      >
        <i className="fas fa-plus"></i>
        <span>Thêm ảnh</span>
      </div>
    )}

    {/* Input file ẩn cho từng ảnh */}
    <input
      type="file"
      ref={(el) => (fileInputRefs.current[index] = el)}
      style={{ display: "none" }}
      onChange={(e) => handleFileChange(e, index + 1)} // Truyền index + 1
      accept="image/*"
    />
  </div>
))}
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
    label: "Số tiền một giờ",
    placeholder: editingCustomer ? editingCustomer.studio?.pricing : "",
  },
  {
    id: "address",
    label: "Địa chỉ",
    placeholder: editingCustomer ? editingCustomer.studio?.studioAddress : "",
  },
  {
    id: "detail",
    label: "Thông tin chi tiết về Studio",
    placeholder: editingCustomer ? editingCustomer.studio?.studioDescription : "",
  },
  {
    id: "timeOn",
    label: "Giờ hoạt động",
    type : "time",
    placeholder: editingCustomer ? editingCustomer.studio?.timeOn : "",
  },
  {
    id: "timeOff",
    label: "Giờ đóng cửa",
    type : "time",
    placeholder: editingCustomer ? editingCustomer.studio?.timeOff : "",
  },
  {
    id: "descriptionAmentites",
    label: "Mô tả tiện ích",
    placeholder: editingCustomer ? editingCustomer.studio?.studioDescriptionAmentitiesDetail : "",
  },
  {
    id: "size",
    label: "Loại phòng",
    placeholder: "Chọn loại phòng",
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
      <div>
        <select
          id={field.id}
          className={`inputField1 ${errors[field.id] ? 'error' : ''}`}
          value={formData.size || ""}
          onChange={handleInputChange(field.id)}
          aria-label={field.label}
        >
          <option value="" disabled>
            {field.placeholder}
          </option>
          <option value="1">Nhỏ</option>
          <option value="2">Vừa</option>
          <option value="3">Lớn</option>
        </select>
        {errors[field.id] && (
          <div className="error-message">Bạn chưa nhập thông tin</div>
        )}
      </div>
    ) : field.type === "time" ? (
      <input
        
        type="time"
        id={field.id}
        className="inputField"
        // placeholder={field.placeholder}
        value={formData[field.id] || ""}
        onChange={handleInputChange(field.id)}
        aria-label={field.label}
        required
      />
    ) : (
      <div>
        <input
          type={field.type || "text"}
          id={field.id}
          className={`inputField ${errors[field.id] ? 'error' : ''}`}
          placeholder={field.placeholder}
          value={formData[field.id] || ""}
          onChange={handleInputChange(field.id)}
          aria-label={field.label}
          required
        />
        {errors[field.id] && (
          <div className="error-message">Bạn chưa nhập thông tin</div>
        )}
      </div>
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
          <th className="editCells">Thông tin chi tiết về Studio</th>
          <th className="editCells">Mô tả tiện ích</th>
          <th className="editCells">Loại Phòng</th>
          <th className="editCells">Sức Chứa</th>
          <th className="editCells">Chức Năng</th>
          
          
        </tr>
      </thead>
      <tbody>
      {getFilteredData(studioState).map(([studioId, data], index) => (
        <tr className="editCard" key={`studio-${index}`}>
          <td className="editCell">
            <img 
              src={data?.capacity?.studio?.imageStudio || " https://i.imgur.com/pRy9nMo.png"} 
              alt="icon" 
            />
          </td>
          <td className="editCell">{data?.capacity?.studio?.studioName}</td>
          <td className="editCell">{formatPrice(data?.capacity?.studio?.pricing)}</td>
          <td className="editCell">{data?.capacity?.studio?.studioAddress}</td>
          <td className="editCell">{data?.capacity?.studio?.studioDescription}</td>
          <td className="editCell">{data?.capacity?.studio?.studioDescriptionAmentitiesDetail}</td>
          <td className="editCell">{data?.capacity?.size?.sizeDescription}</td>
          <td className="editCell">{data?.capacity?.quantity} người</td>
          
          <td className="editCell">
            <button
              className="editButton"
              onClick={() => handleEdit(data)}
            >
              Chỉnh Sửa
            </button>
            <button
            className="goButton"
            onClick={() => {
            window.location.href = `/StudioInfor/${studioId}`;
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
       <th className="editCells">Thông tin chi tiết về Studio</th>
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
            src={customer.imageStudio || " https://i.imgur.com/pRy9nMo.png"}
            alt="icon"
          />
        </td>
        <td className="editCell">{customer.studioName}</td>
        <td className="editCell">{formatPrice(customer.pricing)}</td>
        <td className="editCell">{customer.studioAddress}</td>
        <td className="editCell">{customer.studioDescription}</td>
        <td className="editCell" style={{ color: "#B8860B",fontWeight: "bold" }}>
  Chờ Duyệt
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
      
      </div>
    </div>
  );
}
