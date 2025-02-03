import React from "react";

// import "./../HomePage/HomePage.css";
import Header from "../../Components/Items/Header/Header";
import Footer from "../../Components/Items/Footer/Footer";
import CreateStudioRequest from "../../Components/User/AddStu/CreateStudioRequest";

export default function CreateStuPage() {
    return (
        <div id="CreateStuPage">
            {/* <Header /> */}
            <CreateStudioRequest />
            <Footer />
        </div>
    )
}