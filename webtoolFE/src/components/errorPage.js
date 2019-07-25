import React, { Component } from 'react';
import "../styles/errorPage.css";
import BotNav from './botNav';

class ErrorPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    render() {
        return (
            <div className='error-page'>
                <head>
                    <meta charset="UTF-8"/>
                        <title>Untitled Document</title>
                        <link rel="stylesheet" href="error.css"/>
                            <link href="https://fonts.googleapis.com/css?family=Montserrat:400,500,700|Oswald:500,600,700&display=swap" rel="stylesheet"/>
                </head>
                <body> 
                    <div className="wrapper-error">
                        <nav>
                            <iv className="error-nav-content"/>
                            <div className="errorlogo">
	                            <img src={require('../assets/Group 257.png')} alt="tatalogo" width="48px" height="49px"/>
		                    </div>
                        </nav>
                        <article>
                            <div className="error-container">
	                            <div className="error-result">
		                            <div className='error-c'>
			                            <img src={require('../assets/error-11.png')} alt="error-image"/>
			                            <div className='_oops'>OOPS</div>
				                        <div className='_text'>THIS STRAND IS BROKEN</div>
	                                </div>
                                </div>
                            </div>
                        </article>
                        
                    </div>
                 <BotNav/>   
                </body>               
            </div>
                        )
                    }
                }
export default ErrorPage;