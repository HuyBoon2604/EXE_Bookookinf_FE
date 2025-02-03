import React from 'react'
import Header from '../../../Components/Items/Header/Header'
import Footer from '../../../Components/Items/Footer/Footer'
import LabTabs from '../../../Components/Tabs/Tabs/LabTabs'
// import "./ReservationPage.css"
import "../ReservationPage/ReservationPage.css";


export default function ReservationPage() {
  return (
      <div id="Reservation">
          <Header />
          <LabTabs/>
          <Footer />
      </div>
  )
}