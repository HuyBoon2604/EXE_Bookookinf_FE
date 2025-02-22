import React from "react";

import "./../HomePage/HomePage.css";
import Header from "../../Components/Items/Header/Header";
import Footer from "../../Components/Items/Footer/Footer";
import AdminManager from "../../Components/Admin/AdminManager/AdminManager";

export default function AdminManagerPage() {
    return (
        <div id="HomePage">
            {/* <Header /> */}
            <AdminManager />
            <Footer />
        </div>
    )
}