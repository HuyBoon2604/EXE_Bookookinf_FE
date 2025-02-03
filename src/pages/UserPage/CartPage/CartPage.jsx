import React from "react";
import "./../CartPage/CartPage.css";

import Header from "../../../Components/Items/Header/Header";
import Footer from "../../../Components/Items/Footer/Footer";
import Cart from "../../../Components/User/Cart/Cart";

export default function CartPage() {
    return (
        <div id="CartPage">
            <Header />
            <main className="CartPage-Container">
                <Cart />
            </main>
            <Footer />
        </div>
    );
}