import React from "react";
import "../styles/tata.css";
import Plot from 'react-plotly.js';
import Select from "react-select" // to use dropbox
import Footer from './botNav';

class BatchPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            outputOptions: [
                { value: "Yes", label: "Yes" },
                { value: "No", label: "No" }
            ],
            selectedOption: "Yes",
            uncorrected_pca_traces: [],
            corrected_pca_traces: [],
            // x_uncorrected: [], //maybe localStorage.getItem('x_pca').split(",") ?
            // y_uncorrected: [], //maybe localStorage.getItem('y_pca').split(",") ?
            // x_corrected: [], //maybe localStorage.getItem('x_corrected').split(",") ?
            // y_corrected: [], //maybe localStorage.getItem('y_corrected').split(",") ?
        }
    }

    // This method is used to store click option from dropbox
    selectedOption = (selected) => {
        this.setState({ selectedOption: selected })
    }

    // As soon as the page route, it executes
    /*componentDidMount() {

        console.log()

        // number of lines on each graph
        let no_of_dataframes = parseInt(localStorage.getItem('no_of_dataframes'))
        // number of ordered pairs for each line
        let no_of_ordered_pairs = parseInt(localStorage.getItem('no_of_ordered_pairs'))
        let j = 0 // for slice begin
        let k = no_of_ordered_pairs // for slice end

        // for uncorrected pca graph
        let uncorrected_traces_temp = []
        for(let i = 0; i < no_of_dataframes; i++){
            let x = localStorage.getItem('x_uncorrected').split(",").slice(j, k)
            let y = localStorage.getItem('y_uncorrected').split(",").slice(j, k)
            j = k // set new begin index
            k += no_of_ordered_pairs // set new end index
            //let name = names[i] //sample name
            let type = 'scatter'
            let mode = 'markers'
            //let hoverinfo = "name"
            let trace = { x, y, type, mode} // create a new trace obj
            uncorrected_traces_temp.push(trace) // add that trace obj into our tpc_trace
        }

        j = 0 // reset slice begin
        k = no_of_ordered_pairs // reset slice end

        // for corrected pca graph
        let corrected_traces_temp = []
        for(let i = 0; i < no_of_dataframes; i++){
            let x = localStorage.getItem('x_corrected').split(",").slice(j, k)
            let y = localStorage.getItem('y_corrected').split(",").slice(j, k)
            j = k // set new begin index
            k += no_of_ordered_pairs // set new end index
            //let name = names[i] //sample name
            let type = 'scatter'
            let mode = 'markers'
            //let hoverinfo = "name"
            let trace = { x, y, type, mode} // create a new trace obj
            corrected_traces_temp.push(trace) // add that trace obj into our tpc_trace
        }

        // this.setState works the same as setters
        // syntax: this.setState( {target value : value to change} )
        this.setState({
            uncorrected_pca_traces: uncorrected_traces_temp,
            corrected_pca_traces: corrected_traces_temp
        })


    }*/

    render() {
        return (
            <div>
                <head>
                    <meta charset="UTF-8" />
                    <title>Batch Page</title>
                    <link href="css/batchPage.css" rel="stylesheet" />
                </head>
                <body>
                    <div id="batch-wrapper">
                        <div className="batch-flex-container">
                            <div id="content">
                                <div id="nav-batch">
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
                                                <li><div className="line"></div></li>
                                                <li><span className="circles">5</span></li>
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
                                                    <dt>Algorithms & Tuning Parameters</dt>
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
                            </div>
                            {/* <!-- beginning of batch section --> */}
                            <div id="batch-section">
                                <div id="batch-content">
                                    <div id="batch_corrected_section" >
                                        <div className="drophelp">
                                            <div className="batch_title">Corrected Data <img src={require('../assets/Help Icon.png')} className="helpicon" alt="help" /></div>
                                            <div className="helpcontent_batch"> Add content here.</div>
                                        </div>
                                        <div className="corrected-graphsize">
                                            <Plot
                                                data={this.state.corrected_pca_traces}

                                
                                                layout={{
                                                    hovermode: 'closest',
                                                    title: 'Corrected PCA',
                                                    font: { family: 'Oswald,sans-serif', size: 15, color: '#114b5f' },
                                                    width: 460, height: 450,
                                                    xaxis: {
                                                        autorange: true, showgrid: false, title: {
                                                            text: 'PC1',
                                                            font: { family: 'Oswald,sans-serif', size: 15, color: '#114b5f' }
                                                        },
                                                    },
                                                    yaxis: {
                                                        autorange: true, showgrid: false, title: {
                                                            text: 'PC2',
                                                            font: { family: 'Oswald,sans-serif', size: 15, color: '#114b5f' }
                                                        }
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div id="batch_corrected_section" >
                                        <div className="drophelp">
                                            <div className="batch_title">Uncorrected Data <img src={require('../assets/Help Icon.png')} className="helpicon" alt="help" /></div>
                                            <div className="helpcontent_batch ">Add content here.</div>
                                        </div>
                                        <div className="corrected-graphsize">
                                            <Plot
                                                data={this.state.uncorrected_pca_traces}


                                                layout={{
                                                    hovermode: 'closest',
                                                    title: 'Uncorrected PCA',
                                                    font: { family: 'Oswald,sans-serif', size: 15, color: '#114b5f' },
                                                    width: 460, height: 450,
                                                    xaxis: {
                                                        autorange: true, showgrid: false, title: {
                                                            text: 'PC1',
                                                            font: { family: 'Oswald,sans-serif', size: 15, color: '#114b5f' }
                                                        },
                                                    },
                                                    yaxis: {
                                                        autorange: true, showgrid: false, title: {
                                                            text: 'PC2',
                                                            font: { family: 'Oswald,sans-serif', size: 15, color: '#114b5f' }
                                                        }
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* <!-- correction dropdown --> */}
                                <div id="batch-bottom-container">
                                    <div id="batch-bottom-container2" >
                                        <div id="correction_header">Would you like to use batch corrected data?</div>
                                        <div className="batch-styled-select rounded">
                                            {/* <select>
                                                <option>Yes</option>
                                                <option>No</option>
                                            </select> */}
                                            <Select
                                                placeholder={this.state.selectedOption}
                                                value={this.state.selectedOption}
                                                onChange={this.selectedOption}
                                                options={this.state.outputOptions}
                                            />
                                        </div>
                                    </div>

                                    <div className="nav_container4">
                                        <a href='algorithmpage'><button type="Continue" className="button batch_cont">Continue</button></a>
                                        
                                    </div>
                                </div>

                            </div>
                            {/* <!--end of section--> */}
                        </div>
                        <Footer />
                    </div>
                    {/* <!--end of wrapper--> */}
                </body>
            </div>
        );
    }
}
export default BatchPage;
