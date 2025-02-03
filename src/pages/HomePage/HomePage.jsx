import React from "react";

// import "./../HomePage/HomePage.css";
import Header from "../../Components/Items/Header/Header";
import Footer from "../../Components/Items/Footer/Footer";
import HomeTro from "../../Components/User/Home/HomeTro";

export default function HomePage() {
    return (
        <div id="HomePage">
            <Header />
            <HomeTro />
            <Footer />
        </div>
    )
}