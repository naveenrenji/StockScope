import React, { useState, useEffect } from "react";
import "./StockScopeNavbar.css";
import { StockScopeNavbarData } from "../../config/config";
import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from 'react-router-dom';


const StockScopeNavbar = () => {
  const [selected, setSelected] = useState(0);
  const { pathname } = useLocation();

  useEffect(() => {
    const selectedIndex = StockScopeNavbarData.findIndex(item => item.link === pathname);
    setSelected(selectedIndex >= 0 ? selectedIndex : 0);
  }, [pathname]);

  return (
    <>
      <motion.div className='stocksNavigator'>
        {StockScopeNavbarData.map((item, index) => {
          return (
            <Link
              className={selected === index ? "stocksNavigatorItem active" : "stocksNavigatorItem"}
              to={item.link}
              key={index}
              onClick={() => setSelected(index)}
              aria-label={item.heading}
            >
              <span>{item.heading}</span>
            </Link>
          );
        })}
      </motion.div>
    </>
  );
};

export default StockScopeNavbar;