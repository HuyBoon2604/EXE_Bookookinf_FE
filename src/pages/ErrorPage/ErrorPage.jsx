import React from "react";

import "./ErrorPage.css";
import Header from "../../Components/Items/Header/Header";
import Footer from "../../Components/Items/Footer/Footer";
import CheckoutError from "../../Components/Checkout/Checkout-error/CheckoutError";

export default function ErrorPage() {
    return (
        <div id="ErrorPage">
            <Header />
            <div className="content">
                <CheckoutError />
            </div>
            <Footer />
        </div>
    )
}