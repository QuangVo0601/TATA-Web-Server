import React from "react";
import "../styles/webtool.css"; // to run this with css file 
import Select from "react-select" // to use dropbox
import CSVReader from './csvReader';
import TopNav from './topNav';
import BotNav from './botNav';

// function to return body of web app
// html body goes inside <div> <div/>
class WebTool extends React.Component {
    constructor(props) { // constructor
        super(props); // super() for parents class
        // initialize
        this.state = {
            // this is a list which contain dictionaries inside, for unit dropbox option
            outputOptions: [{ value: "RPKM", label: "RPKM" },
            { value: "FPKM", label: "FPKM" },
            { value: "TPM", label: "TPM" },
            { value: "Raw Counts", label: "Raw Counts" }],
            // to store selected unit option
            selectedOption: "TPM",
            loadingDiv: "csv-reader",
        }
    }
    /* Syntax in JavaScript: variable = anonymous function
        variable = (parameter) => {
            this.setState({target value : value to change})
        } */

    // Updated groupInput
    changeHandler = (event) => {
        this.setState({ [event.target.name]: event.target.value })
    }
    

    // This method is used to store click option from dropbox
    selectedOption = (selected) => {
        this.setState({ selectedOption: selected })
    }
    
    /* Functions go here */
    setWaitingTime = () => {
        this.setCanClick()
        setTimeout(this.setNextClick,5000)
        
    }

    setCanClick = () => {
        this.setState({loadingDiv: "can-click"})
    }
    setNextClick = () => {
        this.setState({loadingDiv: "csv-reader"})
    }

    render() {

        return (
            <div className="home-page">
                <link href="https://fonts.googleapis.com/css?family=Montserrat:400,600,700|Oswald:400,500&display=swap" rel="stylesheet" />
                <div className='container-img'>
                    <TopNav />
                    <div className="container" id='home'>
                        <div className='left-col'>
                            <h1 className="title">
                                TRANSCRIPTION FACTOR ASSOCIATION TOOL FOR ANALYSIS
                                    </h1>
                            <p className="description">
                                TATA runs a preliminary validation on uploaded data and compares it to tissue matched control data
                                derived from the GTEx database. TATA also allows the user to build
                                samples groups from the GTEx data set for use in their analysis.
                                    </p>
                        </div>
                        <div className="right-col">
                            <h3 className="new-project">NEW PROJECT</h3>
                            <div className="input">
                                <div className="select">
                                    <Select
                                        className="before-click"
                                        value={this.state.selectedOption}
                                        onChange={this.selectedOption}
                                        options={this.state.outputOptions}
                                    />
                                </div>
                                <div>
                                    <div className={this.state.loadingDiv}>Loading</div>
                                    <CSVReader
                                        setWaitingTime={this.setWaitingTime}
                                    />
                                </div>

                            </div>
                            <h3 className="code-search">JOB CODE SEARCH</h3>
                            <div className="codeinput-container">
                                <div className="codeinput-box">
                                    <input
                                        className="code-input"
                                        type='text'
                                        placeholder="Job Code ..."
                                    />
                                    <button className="jobcode-button">
                                        Submit
                                    </button>
                                </div>

                            </div>
                        </div>
                    </div>

                </div>
                <div className='background'>
                    <div className='about-content'id='about'>
                        <div className='about-header'>WHAT IS TATA?</div>
                        <div className='about-para'><p className='abt-para'>The Tool for the Analysis of Transaction 
                        factor Associations is designed for the analysis of transcription
factor to target gene associations in RNA-seq data. The association database has been mine from
publicly available data and is freely available for download here. TATA runs a preliminary validation on
uploaded data and compares it to tissue matched control data derived from the GTEx database. The
user then has the option to choose from a variety of algorithms aimed at identifying significant
differences within samples groups derived from the user’s data. TATA also allows the user to build
samples groups from the GTEx data set for use in their analysis. Finally, TATA provides multiple
publication quality and user friendly graphical output plots for the exploration of transcription factor regulatory networks.</p>
</div>
                    </div>
                    
                </div>
                <div className='the-team'>
                    <div className='team-inside'>
                        <p className='team'>The Team</p>
                        <p className='team-p'>Lorem ipsum dolor sit amet, sectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud ercitation ullamco Lorepsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.. incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud.</p>
                    </div>
                </div>
            
            <BotNav />
            </div>

        )
    }

}

export default WebTool;