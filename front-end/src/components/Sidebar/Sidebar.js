import React, { useState } from "react";
import "./Sidebar.css";
import { Power } from "react-bootstrap-icons";
import { SidebarData } from "../../config/config";
import { UilBars } from "@iconscout/react-unicons";
import { motion } from "framer-motion";
import { Link } from 'react-router-dom';

const Sidebar = () => {
  const [selected, setSelected] = useState(0);

  const [expanded, setExpaned] = useState(true)

  const sidebarVariants = {
    true: {
      left : '0'
    },
    false:{
      left : '-60%'
    }
  }
  console.log(window.innerWidth)
  return (
    <>
      <div className="bars" style={expanded?{left: '60%'}:{left: '5%'}} onClick={()=>setExpaned(!expanded)}>
        <UilBars />
      </div>
    <motion.div className='sidebar'
    variants={sidebarVariants}
    animate={window.innerWidth<=768?`${expanded}`:''}
    >
      {/* logo */}
      <div className="logo">
        <span>
          St<span>ocks</span>Scope
        </span>
      </div>

      {/* <div className="menu">
      {SidebarData.map((item, index) => {
        return (
          <div key={index}>
            {item.icon}
            <span>{item.heading}</span>
          </div>
        );
      })}
      
      <div className="menuItem">
          <p>Logout</p><Power size="20px"/>
        </div>
    </div> */}

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
          <p>Logout</p><Power size="20px"/>
        </div>
    </div>

      {/* {<div className="menu">
        {SidebarData.map((item, index) => {
          return (
            <div
              className={selected === index ? "menuItem active" : "menuItem"}
              key={index}
              onClick={() => setSelected(index)}
            >
              <item.icon />
              <span>{item.heading}</span>
            </div>
          );
        })}
        <div className="menuItem">
          <p>Logout</p><Power size="20px"/>
        </div>
      </div>} */}
    </motion.div>
    </>
  );
};

export default Sidebar;
