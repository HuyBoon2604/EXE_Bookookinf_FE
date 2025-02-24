import React from "react";

import "./../HomePage/HomePage.css";
import Header from "../../Components/Items/Header/Header";
import Footer from "../../Components/Items/Footer/Footer";
import Accountmanager from "../../Components/Admin/Accountmanager/Accountmanager";

export default function AccountManaPage1() {
    return (
        <div id="HomePage">
            {/* <Header /> */}
            <Accountmanager />
            <Footer />
        </div>
    )
}