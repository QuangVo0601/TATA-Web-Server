import React from "react";
import "../styles/botNav.css"; // import its css in to run with jsx file

// function to return footer of web app
// html body goes inside <div> <div/>
function botNav() {
    return (
        <div className='botNav'>
            <div className='bot-left'>
            </div>
            <div className='bot-right'>
                <div className='contact'><p className='contact-style'>Contact</p></div>
                <div className='bot-logo'>
                    <img src={require('../assets/gmulogo.png')} width='147px' height='97px' />
                    <img src={require('../assets/bottom.png')} width='166px' height='75px' />


                </div>

            </div>
        </div>

    );
}
export default botNav;