import { React, useContext, useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import HomeIcon from '@mui/icons-material/Home';
import ReceiptIcon from '@mui/icons-material/Receipt';
import InventoryIcon from '@mui/icons-material/Inventory';
import PendingTransactionsIcon from '@mui/icons-material/PendingActions';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import HistoryIcon from '@mui/icons-material/History';
import BarChartIcon from '@mui/icons-material/BarChart';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Tooltip from '@mui/material/Tooltip';
import './Navbar.css';
import { performSignout } from './auth';
import AuthContext from './AuthContext';
const iconSize = 32;



const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const authContext = useContext(AuthContext);
    const [userData, setUserData] = useState({firstname: '', lastname: '', email: '', password: '', gstno: '', shopname: '', shopaddress: ''});
    const getUserData = () => {
      setUserData(authContext.userData);
    }
    
    useEffect(() => {
      getUserData(); // Call getUserData on component mount and whenever authContext.user changes
    }, [authContext.userData]);
    
    
    
     
    
const handleSignout = () => {
  performSignout(navigate);
};
    const getPageTitle = () => {
        switch(location.pathname) {
            case '/dashboard':
                return 'Dashboard';
            case '/invoice':
                return 'Invoice';
            case '/inventory':
                return 'Inventory';
            case '/pendingTransactions':
                return 'Pending Transactions';
            case '/TransactionHistory':
                return 'Transaction History';
            case '/Reports':
                return 'Reports';
            case '/FAQ':
                return 'FAQs';
            case '/contactUs':
                return 'Contact Us';
                case '/profile':
                return 'Profile';
            default:
                return '';
        }
    };

    return (
        <>
        <div className="container">
        <div className="left">
          <div className="left-top-box">
            <img src="logo1.png" alt="logo" width={220} height={80} />
          </div>
          <div className="left-mid-box">
            <img src="profile_icon.png" alt="Profile icon" width={80} height={80} />
            <div className="mid-text">
              <p>
                {userData.shopname}
                <br/>
                {userData.gstno}
              </p>
            </div>
          </div>
          <div className="nav-panel" style = {{}}>
            <p className={location.pathname === "/dashboard" ? "active" : ""}>
              <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', color: 'white', textDecoration: 'none' }}>
                <HomeIcon style={{ marginRight: '5px' }}/><strong>Dashboard</strong>
              </Link>
            </p>
            <p className={location.pathname === "/invoice" ? "active" : ""}>
              <Link to="/invoice" style={{ display: 'flex', alignItems: 'center', color: 'white', textDecoration: 'none' }}>
                <ReceiptIcon style={{ marginRight: '5px' }}/><strong>Invoice</strong>
              </Link>
            </p>
            <p className={location.pathname === "/inventory" ? "active" : ""}>
                <Link to="/inventory" style={{ display: 'flex', alignItems: 'center', color: 'white', textDecoration: 'none' }}>
                <InventoryIcon style={{ marginRight: '5px' }} />
                <strong>Inventory</strong>
                </Link>
            </p>
            <p className={location.pathname === "/pendingTransactions" ? "active" : ""}>
                <Link to="/pendingTransactions" style={{ display: 'flex', alignItems: 'center', color: 'white', textDecoration: 'none' }}>
                <PendingTransactionsIcon style={{ marginRight: '5px' }} />
                <strong>Pending Transactions</strong>
                </Link>
            </p>
            <p className={location.pathname === "/TransactionHistory" ? "active" : ""}>
                <Link to="/TransactionHistory" style={{ display: 'flex', alignItems: 'center', color: 'white', textDecoration: 'none' }}>
                <HistoryIcon style={{ marginRight: '5px' }} />
                <strong>Transaction History</strong>
                </Link>
            </p>
            <p className={location.pathname === "/Reports" ? "active" : ""}>
                <Link to="/Reports" style={{ display: 'flex', alignItems: 'center', color: 'white', textDecoration: 'none' }}>
                    <BarChartIcon style={{ marginRight: '5px' }} />
                    <strong>Reports</strong>
                </Link>
            </p>
            <p className={location.pathname === "/FAQ" ? "active" : ""}>
                <Link to="/FAQ" style={{ display: 'flex', alignItems: 'center', color: 'white', textDecoration: 'none' }}>
                    <HelpOutlineIcon style={{ marginRight: '5px' }} />
                    <strong>FAQs</strong>
                </Link>
            </p>
            <p className={location.pathname === "/contactUs" ? "active" : ""}>
                <Link to="/contactUs" style={{ display: 'flex', alignItems: 'center', color: 'white', textDecoration: 'none' }}>
                    <SupportAgentIcon style={{ marginRight: '5px' }} />
                    <strong>Contact Us</strong>
                </Link>
            </p>
          </div>
        </div>
      </div>
      <div className="top-panel" style={{ zIndex: 1 }}>
        <div style={{ textAlign: "left", left: 10, marginLeft: 10, marginTop: 25 }}>
            <h1 style={{ color: "#fff", fontSize: 40 }}>{getPageTitle()}</h1>
        </div>
        <div style={{ position: 'absolute', top: 60, right: 10 }}>
          {/* <Tooltip title="Notifications">
              <NotificationsIcon style={{ color: "#fff", fontSize: iconSize, marginRight: '15px' }} />
          </Tooltip>
          <Tooltip title="Settings">
              <SettingsIcon style={{ color: "#fff", fontSize: iconSize, marginRight: '15px' }} />
          </Tooltip> */}
          <Tooltip title="Profile">
              <Link to="/profile" style={{ color: 'inherit', textDecoration: 'none' }}>
                  <AccountCircleIcon style={{ color: "#fff", fontSize: iconSize, marginRight: '15px' }} />
              </Link>
          </Tooltip>
          <Tooltip title="Logout">
          <button onClick={handleSignout} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
        <LogoutIcon style={{ color: "#fff", fontSize: iconSize }} />
      </button>
          </Tooltip>
        </div>
      </div>
      </>
    );
}

export default Navbar;
