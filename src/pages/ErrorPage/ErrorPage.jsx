import React from "react";

import "./../SucessPage/SucessPage.css";
import Header from "../../Components/Items/Header/Header";
import Footer from "../../Components/Items/Footer/Footer";
import CheckoutError from "../../Components/Checkout/Checkout-error/CheckoutError";

export default function ErrorPage() {
    return (
        <div id="SucessPage">
            <Header />
            <div className="content">
                <CheckoutError />
            </div>
            <Footer />
        </div>
    )
}