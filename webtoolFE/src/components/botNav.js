import React from "react";
import "../styles/botNav.css"; // import its css in to run with jsx file
import ContactForm from './ContactPopUp'

class botNav extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            popup: false,
        }
    }

    handleContactPopUp() {
        this.setState({ popup: (!this.state.popup) })
    }

    // function to return footer of web app
    // html body goes inside <div> <div/>
    render() {
        return (
            <div className='botNav'>
                <div>
                {/* For contact pop up */}
                {/* {this.state.popup ?
                            <ContactForm
                                closepopup={this.handleContactPopUp.bind(this)}
                            />
                            : null
                        } */}
                </div>
                <footer>
                    <div id="footer">
                        <div id="footernav">
                            <div id="footerlogo">
                                <img src={require('../assets/TATAWHITE.png')} alt="LOGO" width="109px" height="68.67px" />
                                <p>TATA was developed as a Summer Impact Project Funded by the Office of Student Scholarship, Creative Activates, and Research</p>
                            </div>
                            
                            {/* <!--end of footerlogo--> */}

                            <div id="line">
                            </div>

                            <div id="contact">
                                <p onClick={this.handleContactPopUp.bind(this)}>Contact Us</p>
                                
                            </div>

                            <div id="logos">
                                <img src={require('../assets/Mason Logo.png')} alt="LOGO" width="64px" height="64px" />
                                <img src={require('../assets/OSCAR LOGO.png')} alt="LOGO" className="oscar" />
                            </div>
                            {/* <!--end of logos--> */}

                        </div>
                        {/* <!--end of footernav--> */}
                    </div>
                    {/* <!--end of footer--> */}
                    
                </footer>

            </div>
            

            );
    }
}
export default botNav;