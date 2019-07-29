import React from "react";
// import "../styles/tata.css";
import "../styles/algorithmPage.css";
import axios from 'axios'; // to send data to back end
import Select from "react-select" // to use dropbox
import Footer from './botNav';
import Loading from './loadingPage'
// to math team: ask Luis, choose from taskPage.js, and use here
class AlgorithmPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            percent: 0,
            step: 1,
            algorithmOptions: [{ value: "Co-Differential Expression Analysis", label: "Co-Differential Expression Analysis" },
            { value: "Co-Expression Network Analysis", label: "Co-Expression Network Analysis" },
            { value: "Differential Expression Analysis", label: "Differential Expression Analysis" }],
            selectedAlgorithm: "", //default is the one chosen from taskPage.js

            sampleVarianceOptions: [{ value: "Equal", label: "Equal" },
            { value: "Unequal", label: "Unequal" }],
            selectedSampleVariance: { value: "Unequal", label: "Unequal" }, //default is "Unequal"

            falseDiscoveryRate_value: "0.050",
            bonferroniAlpha_value: "0.050",
            batch_correction_value: "", //depends on the one chosen from batchPage.js
            href: "",

        }
        this.handleChangeFalseDiscovery = this.handleChangeFalseDiscovery.bind(this);
        this.handleChangeBonferroni = this.handleChangeBonferroni.bind(this);
    }

    // This method is used to store "algorithm" option from dropbox
    selectedAlgorithm = (selected) => {
        this.setState({ selectedAlgorithm: selected })
    }

    // This method is used to store "sample variance" option from dropbox
    selectedSampleVariance = (selected) => {
        this.setState({ selectedSampleVariance: selected })
    }

    // This method is used to store "False Discovery Rate" from slider 1
    handleChangeFalseDiscovery(event) {
        this.setState({ falseDiscoveryRate_value: event.target.value });
    }

    // This method is used to store "Bonferroni Alpha" from slider 2
    handleChangeBonferroni(event) {
        this.setState({ bonferroniAlpha_value: event.target.value });
    }

    // when user clicks on "Run Task" button
    runTaskHandler = () => {
        this.setState({ step: 2 })

        //to be sent to back end
        let falseDiscoveryRate_value = parseFloat(this.state.falseDiscoveryRate_value)
        let bonferroniAlpha_value = parseFloat(this.state.bonferroniAlpha_value)

        console.log("false is " + falseDiscoveryRate_value)
        console.log("type of false " + typeof (falseDiscoveryRate_value))
        console.log("bon is " + bonferroniAlpha_value)
        console.log("type of bon " + typeof (bonferroniAlpha_value))

        // sending request to back end need to be together
        //axios call (get in header) to send to back end
        axios.post('http://127.0.0.1:8000/backend/list3', {
            //axios.post('http://oscar19.orc.gmu.edu/backend/list3', {
            selections: [this.state.batch_correction_value,
            this.state.selectedAlgorithm.value,
            this.state.selectedSampleVariance.value,
                falseDiscoveryRate_value,
                bonferroniAlpha_value]
        }).then((arr) => { // to receive data from back end 
            localStorage.setItem('test_list', JSON.stringify(arr.data.test_list))
            localStorage.setItem('test_list2', JSON.stringify(arr.data.test_list2))
        })
        // }).then(()=>{
        //     this.setState({ href: '/resultpage' }) 
        // })

        //this.setState({ href: '/resultpage' }) 
    }


    // As soon as the page route, it executes
    componentDidMount() {
        //get the "batch_correction_value" (yes/no?) from batchPage.js
        let batch_correction_value = JSON.parse(localStorage.getItem('batch_correction_value'))
        //get the "taskChosen" from taskPage.js
        let taskChosen = {
            value: JSON.parse(localStorage.getItem('taskChosen')),
            label: JSON.parse(localStorage.getItem('taskChosen'))
        }

        this.setState({
            batch_correction_value: batch_correction_value,
            selectedAlgorithm: taskChosen
        })
    }

    render() {
        if (this.state.step === 1) {
            return (
                <div>
                    <head>
                        <meta charSet="UTF-8" />
                        <title>Untitled Document</title>
                        <link href="tata.css" rel="stylesheet" />
                        <link href="https://fonts.googleapis.com/css?family=Montserrat:400,500,600,700%7COswald:500,600,700&display=swap" rel="stylesheet" />
                    </head>

                    <body>
                        <div id="wrapper5">
                            <div className="flex-container5">
                                <div id="nav5">
                                    <div id="logo">
                                        <img src={require('../assets/Group 257.png')} width="46px" height="46px" alt="logo" />
                                    </div>
                                    {/* <!--end of log--> */}
                                    <div id="mainnav">
                                        <div id="circles">
                                            <ul>
                                                <li><span className="circles" id="complete">1</span></li>
                                                <li><div className="line1" id="active3"></div></li>
                                                <li><span className="circles" id="complete" >2</span></li>
                                                <li><div className="line1" id="active3"></div></li>
                                                <li><span className="circles" id="complete">3</span></li>
                                                <li><div className="line" id="active3"></div></li>
                                                <li><span className="circles" id="complete">4</span></li>
                                                <li><div className="line" id="active3"></div></li>
                                                <li><span className="circles" id="active">5</span></li>
                                            </ul>
                                        </div>
                                        {/* <!--end of circles--> */}
                                        <div id="stepnav">
                                            <dl>
                                                <div id="task">
                                                    <dt><div className="active2">Exploratory Plots</div></dt>
                                                    <dt><div className="active2">Choose Task</div></dt>
                                                    <dt><div className="active2">Group Samples</div></dt>
                                                    <dd>Group Samples & create Gtex group</dd>
                                                </div>
                                                {/* <!--end of task--> */}
                                                <div id="samples">
                                                    <dt><div className="active2">Choose Batch Correction</div></dt>
                                                    <dd>Choose correction & View Plots</dd>
                                                    <dt><div className="active2">Algorithms & Tuning Parameters</div></dt>
                                                    <dd>Choose algoithims & set parameters</dd>
                                                </div>
                                                {/* <!--end of samples--> */}
                                            </dl>
                                        </div>
                                        {/* <!--end of stepnav--> */}
                                    </div>
                                    {/* <!--end of mainnav--> */}
                                </div>
                                {/* <!--end of nav--> */}
                                <div id="content5">
                                    <div id="sections5">
                                        <div className="batch-container-sections">
                                            <div id="selection3">
                                                <div id="batch-action">
                                                    <h2>BATCH CORRECTION:</h2>
                                                </div>
                                                <span className="batch-text-block">{this.state.batch_correction_value}</span>
                                            </div>
                                        </div>
                                        <div className="container-sections">
                                            <div id="selection1">
                                                <div id="algorithm"	>
                                                    <h2>ALGORITHM:</h2>
                                                </div>
                                                <div id="algorithmselection">
                                                    {/* <select name="langOpt[]" multiple id="langOpt">
                                                <option value="option1">Option 1</option>
                                                <option value="option2">Option 2</option>
                                            </select> */}
                                                    <Select
                                                        styles={{ control: (base) => ({ ...base, boxShadow: "none", width: "162px" }) }}
                                                        placeholder={this.state.selectedAlgorithm}
                                                        value={this.state.selectedAlgorithm}
                                                        onChange={this.selectedAlgorithm}
                                                        options={this.state.algorithmOptions}
                                                    />

                                                </div>
                                            </div>
                                        </div>
                                        <div className="container-sections">
                                            <div id="section2">
                                                <div id="samplevariance">
                                                    <h2>SAMPLE VARIANCE:</h2></div>
                                                <div id="varianceselection">
                                                    {/* <select name="langOpt2[]" multiple id="langOpt2">
                                                <option value="equal">Equal</option>
                                                <option value="unequal">Unequal</option>
                                            </select> */}
                                                    <Select
                                                        styles={{ control: (base) => ({ ...base, boxShadow: "none", width: "162px" }) }}
                                                        placeholder={this.state.selectedSampleVariance}
                                                        value={this.state.selectedSampleVariance}
                                                        onChange={this.selectedSampleVariance}
                                                        options={this.state.sampleVarianceOptions}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div id="slider">
                                        <div className="drophelp5">
                                            <h2 className="parameters_title">False Discovery Rate Tunning Parameters <img src={require('../assets/Help Icon.png')} className="helpicon5" alt="help" /></h2>
                                            <div className="helpcontent5 TPC"> Outliers samples may be an expected outcome if your data is derived from diseased groups or from different tissue types. If your data is derived from multiple batches there should be shifts across all chromosomes. Batch correction option is recommended.</div>
                                        </div>
                                        <div id="falseDiscoverySlider">
                                            <input type="range" min="0" max="1" value={this.state.falseDiscoveryRate_value} step="0.001" className="slider" id="myRange" onChange={this.handleChangeFalseDiscovery} />
                                            <input type="text" value={this.state.falseDiscoveryRate_value} onChange={this.handleChangeFalseDiscovery} />
                                        </div>

                                        <div className="drophelp5">
                                            <h2 className="parameters_title">Bonferroni Alpha Tunning Parameters <img src={require('../assets/Help Icon.png')} className="helpicon5" alt="help" /></h2>
                                            <div className="helpcontent5 TPC">Based on tissue source and gender. Outliers samples may be an expected outcome if your data is derived from diseased groups or from different tissue types. </div>
                                        </div>
                                        <div id="bonferroniSlider">
                                            <input type="range" min="0.001" max="1" value={this.state.bonferroniAlpha_value} step="0.001" className="slider" id="myRange2" onChange={this.handleChangeBonferroni} />
                                            <input type="text" value={this.state.bonferroniAlpha_value} onChange={this.handleChangeBonferroni} />
                                        </div>
                                    </div>


                                    <div id="button5">
                                        {/* <a href={this.state.href} style={{textDecoration: 'none'}}> */}
                                    
                                            <button type="Back"
                                                className="runtask"
                                                onClick={this.runTaskHandler}>Run Task</button>
         
                                        {/* </a> */}
                                    </div>
                                </div>
                            </div>
                            <Footer />
                        </div>
                        {/* <!--end of wrapper--> */}
                    </body>
                </div>

            );
        }
        else{
            return(
                <Loading
                    percent={this.state.percent}
                />
            )
        }
    }
}
export default AlgorithmPage;