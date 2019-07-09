import React from "react";
import "../styles/tata.css";
import Select from "react-select" // to use dropbox
import Footer from './botNav';

class AlgorithmPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            algorithmOptions: [{ value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" }],
            selectedAlgorithm: "",

            sampleVarianceOptions: [{ value: "equal", label: "Equal" },
            { value: "unequal", label: "Unequal" }],
            selectedSampleVariance: "",
            
        }
    }

    // This method is used to store "algorithm" option from dropbox
    selectedAlgorithm = (selected) => {
        this.setState({ selectedAlgorithm: selected })
    }   

    // This method is used to store "sample variance" option from dropbox
    selectedSampleVariance = (selected) => {
        this.setState({ selectedSampleVariance: selected })
    }       

    render() {
        return (
            <div>
                <head>
                    <meta charset="UTF-8" />
                    <title>Untitled Document</title>
                    <link href="tata.css" rel="stylesheet" />
                    <link href="https://fonts.googleapis.com/css?family=Montserrat:400,700|Oswald&display=swap" rel="stylesheet" />
                    <link href="https://fonts.googleapis.com/css?family=Montserrat:400,500,600,700&display=swap" rel="stylesheet" />

                    {/* <!-- jQuery library --> */}
                    {/* <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script> */}

                    {/* <!-- MultiSelect CSS & JS library --> */}
                    {/* <script src="jQuery/jquery.built.js"></script> */}
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
                                                <dt><div className="active2">Initial Validation</div></dt>
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
                                    <div id="selection1">
                                        <div id="algorithm"	>
                                            <h2>Algorithm:</h2></div>
                                        <div id="algorithmselection">
                                            {/* <select name="langOpt[]" multiple id="langOpt">
                                                <option value="option1">Option 1</option>
                                                <option value="option2">Option 2</option>
                                            </select> */}
                                            <Select
                                                styles={{control: (base) => ({...base, boxShadow: "none", width: "120px"})}}
                                                placeholder={this.state.selectedAlgorithm}
                                                value={this.state.selectedAlgorithm}
                                                onChange={this.selectedAlgorithm}
                                                options={this.state.algorithmOptions}
                                            />                                            

                                        </div>
                                    </div>
                                    {/* <script>
                    
                    $('#langOpt').multiselect({
                        columns: 1,
                        placeholder: '',
                        search: false,
                    });
                    
                </script> */}
                                    <div id="section2">
                                        <div id="samplevariance">
                                            <h2>Sample Variance:</h2></div>
                                        <div id="varianceselection">
                                            {/* <select name="langOpt2[]" multiple id="langOpt2">
                                                <option value="equal">Equal</option>
                                                <option value="unequal">Unequal</option>
                                            </select> */}
                                            <Select
                                                styles={{control: (base) => ({...base, boxShadow: "none", width: "120px"})}}
                                                placeholder={this.state.selectedSampleVariance}
                                                value={this.state.selectedSampleVariance}
                                                onChange={this.selectedSampleVariance}
                                                options={this.state.sampleVarianceOptions}
                                            />                                                
                                        </div>
                                        {/* <script>
                    
                    $('#langOpt2').multiselect({
                        columns: 1,
                        placeholder: '',
                        search: false,
                    });
                    
                </script> */}
                                    </div>
                                </div>
                                <div id="slider">
                                    <div className="drophelp5">
                                        <h2 className="parameters_title">False Discovery Rate Tunning Parameters <img src={require('../assets/Help Icon.png')} className="helpicon5" alt="help" /></h2>
                                        <div className="helpcontent5 TPC"> Outliers samples may be an expected outcome if your data is derived from diseased groups or from different tissue types. If your data is derived from multiple batches there should be shifts across all chromosomes. Batch correction option is recommended.</div>
                                    </div>
                                    <div id="falseDiscoverySlider">
                                        <input type="range" min="0" max="1" value="0" step="0.025" className="slider" id="myRange" />
                                        <span id="demo"></span>
                                    </div>

                                    <div className="drophelp5">
                                        <h2 className="parameters_title">Bonferroni Alpha Tunning Parameters <img src={require('../assets/Help Icon.png')} className="helpicon5" alt="help" /></h2>
                                        <div className="helpcontent5 TPC">based on tissue source and gender. Outliers samples may be an expected outcome if your data is derived from diseased groups or from different tissue types. </div>
                                    </div>
                                    <div id="bonferroniSlider">
                                        <input type="range" min="0" max="1" value="0" step="0.025" className="slider" id="myRange2" />
                                        <span id="demo2"></span>
                                    </div>

                                    {/* <script>
            var slider = document.getElementById("myRange");
            var output = document.getElementById("demo");
            output.innerHTML = slider.value;
            
            slider.oninput = function() {
              output.innerHTML = this.value;
            }
            </script>  */}

                                    {/* <script>
            var slider = document.getElementById("myRange2");
            var output = document.getElementById("demo2");
            output.innerHTML = slider.value;
            
            slider.oninput = function() {
              output.innerHTML = this.value;
            }
            </script>  */}
                                </div>


                                <div id="button5">
                                    <button type="Back" className="runtask">Run Task</button>
                                </div>
                            </div>
                        </div>
                        <Footer/>
                    </div>
                    {/* <!--end of wrapper--> */}
                </body>
            </div>

        );
    }
}
export default AlgorithmPage;