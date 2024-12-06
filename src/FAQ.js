import React from 'react';
import './Dashboard.css';
import { Link } from "react-router-dom";
import Navbar from './Navbar'; // Assuming Navbar component is imported from './Navbar'
import './FAQ.css';
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "./AuthContext";

function FAQ() { 
  const auth = useContext(AuthContext);
  if (!auth.user) {
    return <Navigate to="/" replace />;
  }
  return (
    <>
      <Navbar />
      <div className="faq-container">
      <div className="faq-section">
        <p className="question"><strong>Q. What is the meaning of different colour in inventory?</strong></p>
        <p className="answer">A. The red colour denotes that the item has a batch which has been expired, the yellow colour denotes that there is a batch which is about to expire in 3 days and other items are shown in green colour.</p>
      </div>
      <div className="faq-section">
        <p className="question"><strong>Q. How to edit my profile?</strong></p>
        <p className="answer">A. Click on the Profile icon in the top right corner to open your profile page. Click on the ‘Edit Profile’ button, make all the changes, then click ‘Save Profile’ button to save the changes.</p>
      </div>
      <div className="faq-section">
        <p className="question"><strong>Q. How do I search items in the inventory?</strong></p>
        <p className="answer">A. Type the name of the item in the search box to search for it. You can also search by applying various filters using the filters icon.</p>
      </div>
      <div className="faq-section">
        <p className="question"><strong>Q. What is meant by Preview Bill on the Invoice Tab?</strong></p>
        <p className="answer">A. ‘Preview Bill’ button can be used to preview a draft of the Invoice before printing.</p>
      </div>
      <div className="faq-section">
        <p className="question"><strong>Q. What to do in case of any problem with the software?</strong></p>
        <p className="answer">A. You can report your issues via email provided on our ‘Contact Us’ page.</p>
      </div>
    </div>
    </>
  );
}

export default FAQ;
