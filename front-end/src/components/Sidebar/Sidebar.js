import { useState, useEffect } from "react";
import "./Sidebar.css";
import { List, PersonCircle, Power } from "react-bootstrap-icons";
import { SidebarData } from "../../config/config";
import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { auth } from "../../firebase/firebaseConfiguration";
import { onAuthStateChanged, signOut } from "firebase/auth";

const Sidebar = () => {
  const [selected, setSelected] = useState(0);
  const [expanded, setExpanded] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const selectedIndex = SidebarData.findIndex(
      (item) => item.link === pathname
    );
    setSelected(selectedIndex >= 0 ? selectedIndex : 0);
  }, [pathname]);

  useEffect(() => {
    // Listen for changes in authentication state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log(user);
      setLoggedIn(user !== null);
    });

    // Unsubscribe from the listener when the component is unmounted
    return () => unsubscribe();
  }, []);

  const toggleSidebar = () => {
    setExpanded((prevState) => !prevState);
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        console.log("Signed out successfully");
        window.location.reload();
      })
      .catch((error) => {
        // An error happened.
      });
  };

  const sidebarVariants = {
    true: {
      left: "0",
    },
    false: {
      left: "-60%",
    },
  };

  return (
    <>
      <div
        className="bars"
        style={{ left: expanded ? "60%" : "5%" }}
        onClick={toggleSidebar}
      >
        <List />
      </div>
      <motion.div
        key="sidebar"
        className="sidebar"
        variants={sidebarVariants}
        animate={window.innerWidth <= 768 ? `${expanded}` : ""}
      >
        {/* logo */}
        <Link to="/" className="logo" aria-label="logo">
          <span>StocksScope</span>
        </Link>

        {/* SideBar Section */}
        <div className="menu">
          {loggedIn
            ? SidebarData.map(({ link, icon, heading }, index) => (
                <Link
                  key={link}
                  className={
                    selected === index ? "menuItem active" : "menuItem"
                  }
                  to={link}
                  onClick={() => setSelected(index)}
                  aria-label={heading}
                >
                  {icon}
                  <span>{heading}</span>
                </Link>
              ))
            : SidebarData.slice(0, 2).map(({ link, icon, heading }, index) => (
                <Link
                  key={link}
                  className={
                    selected === index ? "menuItem active" : "menuItem"
                  }
                  to={link}
                  onClick={() => setSelected(index)}
                  aria-label={heading}
                >
                  {icon}
                  <span>{heading}</span>
                </Link>
              ))}
          <div className="menuItem">
            {loggedIn ? (
              <button className="authButton" onClick={handleLogout}>
                Logout <Power size="18px" />
              </button>
            ) : (
              <button className="authButton" onClick={handleLogin}>
                Login <PersonCircle size="18px" />
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;
