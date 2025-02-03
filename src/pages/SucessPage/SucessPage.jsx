import React from "react";

import "./../SucessPage/SucessPage.css";
import Header from "../../Components/Items/Header/Header";
import Footer from "../../Components/Items/Footer/Footer";
import CheckoutSucess from "../../Components/Checkout/Checkout-sucess/CheckoutSucess";

export default function SucessPage() {
    return (
        <div id="SucessPage">
            <Header />
            <div className="content">
                <CheckoutSucess />
            </div>
            <Footer />
        </div>
    )
}