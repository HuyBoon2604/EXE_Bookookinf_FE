import React from 'react';
import "./Cart.css";

export default function Payment() {
  const steps = [
    { text: "Your choice", icon: "https://e7.pngegg.com/pngimages/966/803/png-clipart-check-mark-tick-green-tick-mark-angle-leaf-thumbnail.png" },
    { text: "Information", icon: "https://e7.pngegg.com/pngimages/966/803/png-clipart-check-mark-tick-green-tick-mark-angle-leaf-thumbnail.png" },
    { text: "Payment", icon: "https://e7.pngegg.com/pngimages/966/803/png-clipart-check-mark-tick-green-tick-mark-angle-leaf-thumbnail.png" }
  ];

  return (
    <div id='Payment'>
    <div className="container">
      <div className="progressContainer">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <img
              loading="lazy"
              src={`https://e7.pngegg.com/pngimages/966/803/png-clipart-check-mark-tick-green-tick-mark-angle-leaf-thumbnail.png`}
              className="stepIcon"
              alt={`${step.text} step icon`}
            />
            <div className="stepText">{step.text}</div>
            {index < steps.length - 1 && (
              <img
                loading="lazy"
                src={`https://cdn.builder.io/api/v1/image/assets/TEMP/cfda424e0d6f60cf29cf7079cb478370c61b158819e0a9bda2de0163328a9f2f?placeholderIfAbsent=true&apiKey=c05fb6b607a34c3cab6bc37bd3664ed7`}
                className="stepDivider"
                alt=""
              />
            )}
          </React.Fragment>
        ))}
      </div>
      
      <main className="content">
        <div className="grid">
          <div className="column">
            <section className="section">
              <h2 className="sectionTitle">Studio Name</h2>
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/cfda424e0d6f60cf29cf7079cb478370c61b158819e0a9bda2de0163328a9f2f?placeholderIfAbsent=true&apiKey=c05fb6b607a34c3cab6bc37bd3664ed7"
                className="sectionImage"
                alt="Studio preview"
              />
              <p className="text">Address</p>
              <p className="text">Date booked</p>
            </section>
            
            <section className="section">
              <h2 className="sectionTitle">Room's information</h2>
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/6e0833c1f8b003f4ababdaa621f03c6ba214257c5f84cb7c09cdc59bf763c445?placeholderIfAbsent=true&apiKey=c05fb6b607a34c3cab6bc37bd3664ed7"
                className="sectionImage"
                alt="Room preview"
              />
            {/* </section> */}
            <div className="roomInfoSection">
      {/* Cột trái */}
      <div className="columnLeft">
        <div className="formGroupRoom">
          <label htmlFor="checkIn" className="inputLabel">Check In</label>
          {/* <input type="text" id="checkIn" className="input" placeholder="Enter Check In date" /> */}
        </div>
        <div className="formGroupRoom">
          <label htmlFor="checkInDate" className="inputLabel">Date</label>
          {/* <input type="date" id="checkInDate" className="input" /> */}
        </div>
        <div className="formGroupRoom">
          <label htmlFor="checkInTime" className="inputLabel">Time</label>
          {/* <input type="time" id="checkInTime" className="input" /> */}
        </div>
      </div>

      {/* Cột phải */}
      <div className="columnRight">
        <div className="formGroupRoom">
          <label htmlFor="checkOut" className="inputLabel">Check Out</label>
          {/* <input type="text" id="checkOut" className="input" placeholder="Enter Check Out date" /> */}
        </div>
        <div className="formGroupRoom">
          <label htmlFor="checkOutDate" className="inputLabel">Date</label>
          {/* <input type="date" id="checkOutDate" className="input" /> */}
        </div>
        <div className="formGroupRoom">
          <label htmlFor="checkOutTime" className="inputLabel">Time</label>
          {/* <input type="time" id="checkOutTime" className="input" /> */}
        </div>
      </div>
    </div>
    </section>
            <section className="section">
              <h2 className="sectionTitle">Voucher</h2>
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/55481651045a3bc4ed91b8b5b33c6e7b4df62ab2c07726967f0d738a9908ae5a?placeholderIfAbsent=true&apiKey=c05fb6b607a34c3cab6bc37bd3664ed7"
                className="sectionImage"
                alt="Voucher preview"
              />
              <p className="text">Type voucher</p>
              <input type="text" id="checkOut" className="input" placeholder="Enter Voucher" />
            </section>
          </div>
          
          <div className="column">
            <section className="section">
              <h2 className="sectionTitle">Customer's information</h2>
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/c5b40e6f47cf0f9b7a9733d1a0d61d5f2ddfdb06d7b1e4a14f2e2b35c875642e?placeholderIfAbsent=true&apiKey=c05fb6b607a34c3cab6bc37bd3664ed7"
                className="sectionImage"
                alt="Customer information form"
              />
              <p className="text">First Name</p>
              <input type="text" id="checkOut" className="input" placeholder="Enter Voucher" />
              <p className="text">Last Name</p>
              <input type="text" id="checkOut" className="input" placeholder="Enter Voucher" />
              <p className="text">Phone Number</p>
              <input type="text" id="checkOut" className="input" placeholder="Enter Voucher" />
              <p className="text">Special Request</p>
              <input type="text" id="checkOut" className="input4" placeholder="Enter Voucher" />
              <div className="formGroupNext">
                  <button type="submit" className="nextButton">Next</button>
                  </div>
            </section>
          </div>
          
          <div className="column">
            <section className="section">
              <h2 className="sectionTitle">Payment information</h2>
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/a23efd428cbe7ab3c40031298e86f16f320212d082966a3c27ae68e7a70021e8?placeholderIfAbsent=true&apiKey=c05fb6b607a34c3cab6bc37bd3664ed7"
                className="sectionImage"
                alt="Payment information header"
              />
              <form className="formContainer">
                <div className="formGroup">
                  <div className="formGroup">
                    <label htmlFor="cardNumber" className="inputLabel">Card Number</label>
                    <input
                      type="text"
                      id="cardNumber"
                      className="input"
                      placeholder="1234 5678 9101 1121"
                      pattern="[0-9\s]{13,19}"
                      maxLength="19"
                      required
                      aria-label="Card number"
                    />
                  </div>
                  
                  <div className="row">
                    <div className="formGroup">
                      <label htmlFor="expiryDate" className="inputLabel">Expiration Date</label>
                      <input
                        type="text"
                        id="expiryDate"
                        className="input"
                        placeholder="MM/YY"
                        pattern="(0[1-9]|1[0-2])\/([0-9]{2})"
                        maxLength="5"
                        required
                        aria-label="Card expiry date"
                      />
                    </div>
                    
                    <div className="formGroup">
                      <label htmlFor="cvv" className="inputLabel">CVV</label>
                      <input
                        type="text"
                        id="cvv"
                        className="input"
                        placeholder="123"
                        pattern="[0-9]{3,4}"
                        maxLength="4"
                        required
                        aria-label="Card security code"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="formGroup">
                  <button type="submit" className="submitButton">Payment</button>
                  <p className="privacyText">
                    Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our privacy policy.
                  </p>
                </div>
              </form>
            </section>
          </div>
        </div>
      </main>
    </div>
    </div>
  );
}
