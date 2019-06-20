import React from "react";
import "../styles/SubTopNav.css";

// function to return header of other pages excluding home page of web app
// html body goes inside <div> <div/>
function topNav() {
    return (
        <div className="sub-topnav">
            <link href="https://fonts.googleapis.com/css?family=Montserrat:400,600,700|Oswald:400,500&display=swap" rel="stylesheet" />
            <img src={require("../assets/Logo.png")} alt="LOGO" width='77px' height='74px'/>
            <nav>
                <a href="/FAQ"> FAQ </a>
                <a href="#about"> About us </a>
                <a href="/"> Home </a>
            </nav>


        </div>
    );
}
export default topNav;