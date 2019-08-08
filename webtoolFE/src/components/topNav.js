import React from "react";
import "../styles/topNav.css";

// function to return header of home page of web app
// html body goes inside <div> <div/>
function topNav() {
    return (
        <div className="topnav">
            <link href="https://fonts.googleapis.com/css?family=Montserrat:400,600,700|Oswald:400,500&display=swap" rel="stylesheet" />
            <a href="/">
               <img src={require("../assets/Group 257.png")} alt="LOGO" width='77px' /> 
            </a>
            
            <nav>
                <a href="/FAQ"> FAQ </a>
                <a href="#about"> About us </a>
                <a href="/"> Home </a>
            </nav>


        </div>
    );
}
export default topNav;
