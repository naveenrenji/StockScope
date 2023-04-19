import React, { useState, useEffect } from "react";
import "./Sidebar.css";
import { Power } from "react-bootstrap-icons";
import { SidebarData } from "../../config/config";
import { UilBars } from "@iconscout/react-unicons";
import { motion } from "framer-motion";
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const [selected, setSelected] = useState(0);
  const [expanded, setExpanded] = useState(true);
  const { pathname } = useLocation();

  useEffect(() => {
    const selectedIndex = SidebarData.findIndex(item => item.link === pathname);
    setSelected(selectedIndex >= 0 ? selectedIndex : 0);
  }, [pathname]);

  const toggleSidebar = () => {
    setExpanded(prevState => !prevState);
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
        <UilBars />
      </div>
      <motion.div className='sidebar'
        variants={sidebarVariants}
        animate={window.innerWidth <= 768 ? `${expanded}` : ''} >
        {/* logo */}
        <div className="logo">
          <span>
            St<span>ocks</span>Scope
          </span>
        </div>

        {/* SideBar Section */}
        <div className="menu">
          {SidebarData.map((item, index) => {
            return (
              <Link
                className={selected === index ? "menuItem active" : "menuItem"}
                to={item.link}
                key={index}
                onClick={() => setSelected(index)}
              >
                {item.icon}
                <span>{item.heading}</span>
              </Link>
            );
          })}
          <div className="menuItem">
            <button className="authButton btn-semi-transparent">Logout <Power size="18px" /></button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;