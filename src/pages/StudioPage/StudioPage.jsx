import React from "react";

import "./../HomePage/HomePage.css";
import Header from "../../Components/Items/Header/Header";
import Footer from "../../Components/Items/Footer/Footer";
import Studio from "../../Components/User/Studio/Studio";

export default function StudioPage() {
    return (
        <div id="StudioPage">
            <Header />
            <Studio />
            <Footer />
        </div>
    )
}