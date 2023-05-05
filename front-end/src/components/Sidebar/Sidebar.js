import React, { useState, useEffect } from "react";
import "./Sidebar.css";
import { List, PersonCircle, Power } from "react-bootstrap-icons";
import { SidebarData } from "../../config/config";
import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { logout, auth } from "../../firebase/FirebaseFunctions";


const Sidebar = () => {
  const [selected, setSelected] = useState(0);
  const [expanded, setExpanded] = useState(true);
  const { pathname } = useLocation();

  const navigate = useNavigate();

  useEffect(() => {
    const selectedIndex = SidebarData.findIndex(item => item.link === pathname);
    setSelected(selectedIndex >= 0 ? selectedIndex : 0);
  }, [pathname]);

  const toggleSidebar = () => {
    setExpanded(prevState => !prevState);
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleLogout = () => {
    try {
      logout();
    } catch (error) {
      console.error(error);
    }
  };

  const sidebarVariants = {
    true: {
      left: '0'
    },
    false: {
      left: '-60%'
    }
  };

  return (
    <>
      <div className="bars" style={{ left: expanded ? '60%' : '5%' }} onClick={toggleSidebar}>
        <List />
      </div>
      <motion.div key="sidebar" className='sidebar'
        variants={sidebarVariants}
        animate={window.innerWidth <= 768 ? `${expanded}` : ''} >
        {/* logo */}
        <Link to="/" className="logo" aria-label="logo">
          <span>
            St<span>ocks</span>Scope
          </span>
        </Link>

        {/* SideBar Section */}
        <div className="menu">
          {auth.currentUser ? SidebarData.map(({ link, icon, heading }, index) => (
            <Link
              key={link}
              className={selected === index ? "menuItem active" : "menuItem"}
              to={link}
              onClick={() => setSelected(index)}
              aria-label={index}
            >
              {icon}
              <span>{heading}</span>
            </Link>
          )): SidebarData.slice(0,2).map(({ link, icon, heading }, index) => (
            <Link
              key={link}
              className={selected === index ? "menuItem active" : "menuItem"}
              to={link}
              onClick={() => setSelected(index)}
              aria-label={index}
            >
              {icon}
              <span>{heading}</span>
            </Link>
          ))}
          <div className="menuItem">
            {auth.currentUser ?
              <button className="authButton" onClick={handleLogout}>Logout <Power size="18px" /></button> :
              <button className="authButton" onClick={handleLogin}>Login <PersonCircle size="18px" /></button>}
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;