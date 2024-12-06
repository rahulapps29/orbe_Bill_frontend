import React, { useState } from "react";
import "./ContactUs.css"; // Make sure to import your CSS file
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faPhoneAlt,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import Navbar from "./Navbar";

const ContactUs = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    // Send message to backend here
    // You can use fetch or Axios to send a POST request to your backend server
    fetch("https://billback.orbe.in/api/contact/bill/sendmail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, message }),
    })
      .then((response) => {
        if (response.ok) {
          // Handle success, e.g., show a success message to the user
          alert("Message sent successfully");
          // console.log('Message sent successfully');
        } else {
          // Handle error, e.g., show an error message to the user
          //console.log(error);
          alert("Error sending message");
          console.error("Error sending message");
        }
      })
      .catch((error) => {
        //console.log(error);
        console.error("Error sending message:", error);
      });
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <div className="container">
      <Navbar />
      <div className="content">
        <div className="left-side">
          <div className="address details">
            <FontAwesomeIcon icon={faMapMarkerAlt} />
            <div className="topic">Address</div>
            <div className="text-one"> Billing 360</div>
            <div className="text-two">
              KD Lab, IIT Kanpur <br />
              Kanpur, Uttar Pradesh 208016
            </div>
          </div>
          <div className="phone details">
            <FontAwesomeIcon icon={faPhoneAlt} />
            <div className="topic">Phone</div>
            <div className="text-one">xxxxxxxxxx</div>
            {/* <div className="text-two">+0096 3434 5678</div> */}
          </div>
          <div className="email details">
            <FontAwesomeIcon icon={faEnvelope} />
            <div className="topic">Email</div>
            <div className="text-one">billing360iitk@gmail.com</div>
            {/* <div className="text-two">info.codinglab@gmail.com</div> */}
          </div>
        </div>
        <div className="right-side" style={{ marginTop: "10%" }}>
          <div className="topic-text">Send us a message</div>
          <p>
            Got a question or need help? We're happy to hear from you!. Kindly
            refer to the FAQs page for any general queries.
          </p>
          <p>How can we help you?</p>
          <form onSubmit={handleSubmit}>
            <div className="input-box">
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="input-box">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <textarea
              className="input-box message-box"
              placeholder="Enter your message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
            <div className="button">
              <input type="submit" value="Send Now" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default ContactUs;
