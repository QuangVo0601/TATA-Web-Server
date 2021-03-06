import React, { Component } from 'react';
import "../styles/loadingPage.css";
import TopNav from './topNav'
import BotNav from './botNav';

class LoadingPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            percent: 0
        }
    }

    startProgress() {
        let that=this
        console.log('in app')
        setInterval(() => {
            if (that.state.percent>=99.00) {
                clearInterval(this.startProgress)
            }
            else {
                this.setState({ percent: this.state.percent += 0.01 })
            }
        }, 1000)
    }

    componentDidMount() {
        console.log("Job Code is " + JSON.parse(localStorage.getItem('jobCode')))
        console.log('hi')
        this.startProgress()
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

                    <div className="loading-jobcode">JOB CODE:<span>{JSON.parse(localStorage.getItem('jobCode'))}</span></div>
                    <div className="loading-etaInfo">
                        <span className="percentage">{this.state.percent.toFixed(2)}%</span>
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
                            <div className="loading-emailContent">
                                Make sure to remember your job code or input your email for a reminder when the job is done.
                                <input type="email" className="emailInput" name="emailAddress" placeholder="Email..." />
                                <button type="submit" className="submitButton">Submit</button>
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