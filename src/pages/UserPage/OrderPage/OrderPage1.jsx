import React from "react";

// import "./../HomePage/HomePage.css";
import Header from "../../../Components/Items/Header/Header";
import Footer from "../../../Components/Items/Footer/Footer";
import OrderPage from "../../../Components/User/Order/OrderPage";

export default function OrderPage1() {
    return (
        <div id="HomePage">
            <Header />
            <OrderPage />
            <Footer />
        </div>
    )
}