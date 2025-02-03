import React from "react";
import "./../ListItemPage/ListItemPage.css";

import Header from "../../../Components/Items/Header/Header";
import Footer from "../../../Components/Items/Footer/Footer";
import ItemDetails from "../../../Components/User/ItemDetails/ItemDetails";

export default function ItemDetailsPage() {
    return (
        <div id="ItemDetailsPage">
            <Header />
            <main className="ItemDetailsPage-Container">
                <ItemDetails />
            </main>
            <Footer />
        </div>
    );
}