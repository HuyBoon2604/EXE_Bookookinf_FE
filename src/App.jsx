import './App.css';
import { Route, Routes, Navigate } from 'react-router-dom'; // Import Navigate từ react-router-dom
import HomePage from './pages/HomePage/HomePage';
import Login from './pages/Login/Login';
import ListItemPage from './pages/UserPage/ListItemPage/ListItemPage';
import ItemDetails from './Components/User/ItemDetails/ItemDetails';
import NotFound from './pages/NotFound/NotFound';
import ProfilePage from './pages/UserPage/ProfilePage/ProfilePage';
import CartPage from './pages/UserPage/CartPage/CartPage';
import SucessPage from './pages/SucessPage/SucessPage';
import Signup from './pages/SignUp/SignUp';
import CoursePage from './pages/CoursePage/CoursePage';
import StudioPage from './pages/StudioPage/StudioPage';
import StudioInforPage from './pages/StudioInforPage/StudioInforPage';
import OrderPage1 from './pages/UserPage/OrderPage/OrderPage1';
import StudioBookingManagerPage from './pages/UserPage/StudioBookingManagerPage/StudioBookingManagerPage';
import EditStudioPage from './pages/UserPage/EditStudioPage/EditStudioPage';
import AdminManagerPage from './pages/AdminManagerPage/AdminManagerPage';
import RevenuePage1 from './pages/UserPage/RevenuePage/RevenuePage1';
import UpdateuserPage1 from './pages/UserPage/UpdateuserPage1/UpdateuserPage1';
import CheckoutError from './Components/Checkout/Checkout-error/CheckoutError';
import ErrorPage from './pages/ErrorPage/ErrorPage';
import ContactPage from './pages/ContactPage/ContactPage';
import SearchnePage from './pages/SearchPage/SearchnePage';
import ReservationPage from './pages/ReservationPage/ReservationPage/ReservationPage';
import CreateStuPage from './pages/CreateStu/CreateStuPage';
import AccountManaPage1 from './pages/AccountManaPage/AccountManaPage1';
import RequireAuth from './components/ReqAuth/RequireAuth'; // Bỏ .jsx extension

import CheckStudio1 from './pages/CheckStudioPage/CheckStudio1';
import UnauthorizedPage from './pages/UnauthorizedPage/UnauthorizedPage';
function App() {
  return (
    <>
      <Routes>
        {/* Route mặc định */}
        <Route path="/" element={<Navigate to="/Login" />} />

        {/* Trang Login */}
        <Route path="/Login" element={<Login />} />
        
        
        <Route path="/Signup" element={<Signup />} />
        

        {/* Trang Home */}
        <Route path="/Home" element={<HomePage />} />

        <Route path="/Course/:Id" element={<CoursePage />} /> 

        {/* Trang danh sách sản phẩm */}
        <Route path="/Product" element={<ListItemPage />} />

        {/* Trang chi tiết sản phẩm */}
        <Route path="/Product/Details/:title" element={<ItemDetails />} />

        {/* Trang NotFound cho mọi route không xác định */}
        <Route path="*" element={<NotFound />} />

        {/* Trang thông tin người dùng */}
        <Route path="/Profile/:accountid" element={<ProfilePage />} />

        {/* Trang Giỏ Hàng */}
        <Route path="/Cart" element={<CartPage />} />
        <Route path="/order/:Bookingid" element={<OrderPage1 />} />
<Route path="/editstu" element={<EditStudioPage />} />
<Route path="/updateuser" element={<UpdateuserPage1 />} />
<Route path="/checkcancel" element={<ErrorPage />} />
<Route path="/contact" element={<ContactPage />} />
<Route path="/Reservation" element={<ReservationPage/>} />
<Route path="/searchpage" element={<SearchnePage />} />
<Route path="/checkout-success" element={<SucessPage />} />

        
        {/* Chủ Studio */}

        <Route element={<RequireAuth allowedRoles={["2"]} />}>
        <Route path="/Studio" element={<StudioPage />} />
        </Route>
        

        <Route path="/StudioInfor/:id" element={<StudioInforPage />} />
        <Route path="/createstu" element={<CreateStuPage />} />
        {/* ADMIN */}
        
        <Route element={<RequireAuth allowedRoles={["3"]} />}>
          <Route path="/checkstu" element={<CheckStudio1 />} />
          <Route path="/accountmana" element={<AccountManaPage1 />} />
          <Route path="/bookingmanager" element={<StudioBookingManagerPage />} />
          <Route path="/adminmanager" element={<AdminManagerPage />} />
          <Route path="/revenue/:id" element={<RevenuePage1 />} />
        </Route>
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        
      </Routes>
    </>
  );
}

export default App;
