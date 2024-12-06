import React from 'react';
import './Invoice.css';
import AddNewInvoice from './components/Invoice/AddInvoice';
import AuthContext from "./AuthContext";
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import Navbar from './Navbar';

const Invoice = () => {
  
    const auth = useContext(AuthContext);
    if (!auth.user) {
      return <Navigate to="/" replace />;
    }
    return (
    <div className="Invoice">
      <Navbar/>
      <AddNewInvoice/>
    </div>
  );
}

export default Invoice;
