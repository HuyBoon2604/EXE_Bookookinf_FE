import React from "react";

// import "./../HomePage/HomePage.css";
import Header from "../../Components/Items/Header/Header";
import Footer from "../../Components/Items/Footer/Footer";
import StudioInfor from "../../Components/User/StuidoInfor/StudioInfor";

export default function StudioInforPage() {
    return (
        <div id="StudioPage">
            <Header />
            <StudioInfor />
            <Footer />
        </div>
    )
}