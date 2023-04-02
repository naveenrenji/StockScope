import React from "react";
import RightSide from '../components/RigtSide/RightSide';
import Sidebar from '../components/Sidebar/Sidebar';
import '../assets/css/style.css';

function Profile() {
    return (
        <div className="Home">
            <div className="HomeGlass">
                <Sidebar />
                <h1>Profile Page</h1>
                <RightSide />
            </div>
        </div>
    );
}

export default Profile;