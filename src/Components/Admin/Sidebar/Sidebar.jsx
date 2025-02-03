import React, { useState } from 'react';
import { FaHome, FaFileInvoiceDollar, FaRegChartBar, FaUser, FaCog, FaDollarSign, FaWallet, FaCreditCard, FaLightbulb } from "react-icons/fa"; // Import icons
import './Sidebar.css';

const Sidebar = ({ setActiveTab, activeTab }) => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div id='Sidebar'>
      <div className={`sidebars ${isOpen ? "" : "sidebar-change"}`}>
        {/* <button className="toggle-btn" onClick={toggleSidebar}>
        {isOpen ? "<<" : ">>"}
      </button> */}

        {/* Profile Section */}
        <div className="user-info">
          <div className="info-img img-fit-cover">
            <img src="https://i.imgur.com/4M34hi2.png" alt="profile image" />
          </div>
          {isOpen && <span className="info-name">alice-doe</span>}
        </div>

        {/* Navigation Links */}
        <nav className="navigation">
          <ul className="nav-list">
            <li
              className={`nav-item ${activeTab === "Dashboard" ? "active" : ""}`}
              onClick={() => setActiveTab("Dashboard")}
            >
              <a className="nav-link">
                <FaHome className="nav-link-icon" />
                {isOpen && <span className="nav-link-text">DASHBOARD</span>}
              </a>
            </li>
            <li
              className={`nav-item ${activeTab === "Account" ? "active" : ""}`}
              onClick={() => setActiveTab("Account")}
            >
              <a className="nav-link">
                <FaFileInvoiceDollar className="nav-link-icon" />
                {isOpen && <span className="nav-link-text">ACCOUNTS</span>}
              </a>
            </li>
            <li
              className={`nav-item ${activeTab === "Item" ? "active" : ""}`}
              onClick={() => setActiveTab("Item")}
            >
              <a className="nav-link">
                <FaWallet className="nav-link-icon" />
                {isOpen && <span className="nav-link-text">ITEMS</span>}
              </a>
            </li>
            <li
              className={`nav-item ${activeTab === "Order" ? "active" : ""}`}
              onClick={() => setActiveTab("Order")}
            >
              <a className="nav-link">
                <FaFileInvoiceDollar className="nav-link-icon" />
                {isOpen && <span className="nav-link-text">ORDER</span>}
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;