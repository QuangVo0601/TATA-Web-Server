import React, { Component } from 'react';
import "../styles/loadingPage.css";
import TopNav from './topNav'
import BotNav from './botNav';

class LoadingPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    render() {
        return (
            <div className='loading-page'>
                <head>
                    <meta charset="UTF-8" />
                    <title>jobCodePage</title>
                    <link href="https://fonts.googleapis.com/css?family=Montserrat:400,600,700|Oswald:400,500&display=swap" rel="stylesheet" />
                    <link href="jobCodePage.css" rel="stylesheet" type="text/css" />
                </head>
                <div className="loading-wrapper">
                    <TopNav />

                    <div className="loading-jobcode">JOB CODE:<span>1A253M4</span></div>
                    <div className="loading-etaInfo">
                        <span className="percentage">{this.props.percent}%</span>
                    </div>
                    <div className="node-loader">
                        <span className="node"></span>
                        <span className="node"></span>
                        <span className="node"></span>
                        <span className="node"></span>
                        <span className="node"></span>
                        <span className="node"></span>
                        <span className="node"></span>
                        <span className="node"></span>
                        <span className="node"></span>
                        <span className="node"></span>
                        <span className="node"></span>
                        <span className="node"></span>
                        <span className="node"></span>
                        <span className="node"></span>
                        <span className="node"></span>
                        <span className="node"></span>
                        <span className="node"></span>
                        <span className="node"></span>
                    </div>
                    <div className="loading-jobOptions">
                        <div className="loading-email">
                            <div className="emailContent">
                                Make sure to remember your job code or input your email for a reminder when the job is done.
                                <input type="email" className="emailInput" name="emailAddress" placeholder="Email..." />
                                <input type="submit" className="submitButton"/>
                            </div>
                        </div>

                        <div className="loading-taskOptions">
                            <div className="loading-task_container">
                                <button type="Continue" className="button job_new">Start New Task</button>
                                <button type="Back" className="button job_cancel">Cancel This Task</button>
                            </div>
                        </div>

                    </div>
                     
                </div>

<BotNav />
               
            </div>
        )
    }
}
export default LoadingPage;