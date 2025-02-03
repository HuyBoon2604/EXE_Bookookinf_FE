import React from "react";

import "./../ListItemPage/ListItemPage.css";
import Header from "../../../Components/Items/Header/Header";
import Footer from "../../../Components/Items/Footer/Footer";
import ListItem from "../../../Components/User/ListItem/ListItem";

export default function ListItemPage() {
    return (
        <div id="ListItemPage">
            <Header />
            <div className="ListItemPage-Container">
                <ListItem />
            </div>
            <Footer />
        </div>
    )
}