import React from "react";
import '../styles/ContactPopUp.css'

class ContactForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            name: '',
            email: '',
            subject: '',
            message: ''
        }
    }

    render() {
        return (
            <div className='contact-form'>
                <div >
                    <h1 className='contactform-h1'> GET IN TOUCH </h1>
                </div>
                <div>
                      <p className='contact-label'>FULL NAME:</p>
                    <input className='form-input' 
                    type='text' required value={this.state.subject} />
                </div>
                <div>
                      <p className='contact-label'>EMAIL:</p>
                    <input className='form-input' 
                    type='text' required value={this.state.subject} />
                </div>
                <div>
                      <p className='contact-label'>SUBJECT:</p>
                    <input className='form-input' 
                    type='text' required value={this.state.subject} />
                </div>
                <div>
                    <p className='contact-label'>MESSAGE:</p>
                    <input className='form-input' 
                    type='text' required value={this.state.subject} />
                </div>
                <div>
                    <button className='contact-submit' onClick={this.props.closepopup}>Submit</button>
                </div>
            </div>
        )
    }
}
export default ContactForm;