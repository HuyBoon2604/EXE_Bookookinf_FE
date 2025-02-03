import React from "react";
import "./../ProfilePage/ProfilePage.css";

import Header from "../../../Components/Items/Header/Header";
import Footer from "../../../Components/Items/Footer/Footer";
import UserProfile from "../../../Components/User/Profile/UserProfile";

export default function ProfilePage() {
    return (
        <div id="ProfilePage">
            <Header />
            <main className="ProfilePage-Container">
                <UserProfile />
            </main>
            <Footer />
        </div>
    );
}