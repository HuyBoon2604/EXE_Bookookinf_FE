import React from "react";

import "./../CoursePage/CoursePage.css";
import Header from "../../Components/Items/Header/Header";
import Footer from "../../Components/Items/Footer/Footer";
import { Course } from "../../Components/User/Course/Course";

export default function CoursePage() {
    return (
        <div id="CoursePage">
            <Header />
            <Course />
            <Footer />
        </div>
    )
}