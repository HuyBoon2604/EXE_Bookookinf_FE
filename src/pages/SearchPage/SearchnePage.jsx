import React from "react";

// import "./../HomePage/HomePage.css";
import Header from "../../Components/Items/Header/Header";
import Footer from "../../Components/Items/Footer/Footer";
import SearchPage from "../../Components/User/Search/SearchPage";

export default function SearchnePage() { 
    return (
        <div id="SearchPage">
            <Header />
            <SearchPage />
            <Footer />
        </div>
    );
}
