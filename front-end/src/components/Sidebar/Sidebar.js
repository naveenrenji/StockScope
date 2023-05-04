import React, { useState, useEffect } from "react";
import "./Sidebar.css";
import { PersonCircle, Power } from "react-bootstrap-icons";
import { SidebarData } from "../../config/config";
import { UilBars } from "@iconscout/react-unicons";
import { motion } from "framer-motion";
import { Link, useLocation } from 'react-router-dom';
import { isLoggedIn } from "../../pages/Authentication/Login"; 
//Use this above line once user authentication code is 
//complete and modify below accordingly

const Sidebar = () => {
  const [selected, setSelected] = useState(0);
  const [expanded, setExpanded] = useState(true);
  const { pathname } = useLocation();
  const [isLoggedIn, setUserLogin] = useState(false)

  useEffect(() => {
    const selectedIndex = SidebarData.findIndex(item => item.link === pathname);
    setSelected(selectedIndex >= 0 ? selectedIndex : 0);
  }, [pathname]);

  const toggleSidebar = () => {
    setExpanded(prevState => !prevState);
  };

  const handleLogin = () => {
    /* Add login code here */
    setUserLogin(true);
  }

  const handleLogout = () => {
    /* Add logout code here */
    setUserLogin(false);
  }

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
        <UilBars />
      </div>
      <motion.div className='sidebar'
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
          {SidebarData.map((item, index) => {
            return (
              <Link
                className={selected === index ? "menuItem active" : "menuItem"}
                to={item.link}
                key={index}
                onClick={() => setSelected(index)}
                aria-label={index}
              >
                {item.icon}
                <span>{item.heading}</span>
              </Link>
            );
          })}
          <div className="menuItem">
            {isLoggedIn ?
              <button className="authButton" onClick={handleLogout}>Logout <Power size="18px" /></button> :
              <button className="authButton" onClick={handleLogin}>Login <PersonCircle size="18px" /></button>}
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;