import React from "react";

// import "./../HomePage/HomePage.css";
import Header from "../../../Components/Items/Header/Header";
import Footer from "../../../Components/Items/Footer/Footer";
import StudioBookingManager from "../../../Components/Admin/StudioBookingManager/StudioBookingManager";

export default function StudioBookingManagerPage() {
    return (
        <div id="HomePage">
            <Header />
            <StudioBookingManager />
            <Footer />
        </div>
    )
}