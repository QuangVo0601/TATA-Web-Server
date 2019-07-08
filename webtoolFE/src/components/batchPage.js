import React from "react";
import "../styles/tata.css";
import Plot from 'react-plotly.js';
import Select from "react-select" // to use dropbox
import Footer from './botNav';

class BatchPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            outputOptions: [{ value: "Yes", label: "Yes" },
            { value: "No", label: "No" }],
            selectedOption: "Yes"
        }
    }

    // This method is used to store click option from dropbox
    selectedOption = (selected) => {
        this.setState({ selectedOption: selected })
    }

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
                                                    <dt><div className="active2">Initial Validation</div></dt>
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
                                                data={[
                                                    {
                                                        x: [1, 2, 3],
                                                        y: [3, 2, 1],
                                                        type: 'scattergl',
                                                        mode: 'markers', //lines or markers
                                                        text: this.state.pca_text,
                                                        hoverinfo: "text",
                                                        marker: { color: 'green' },
                                                    },
                                                ]}
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
                                                data={[
                                                    {
                                                        x: [4, 5, 6],
                                                        y: [6, 5, 4],
                                                        type: 'scattergl',
                                                        mode: 'markers', //lines or markers
                                                        text: this.state.pca_text,
                                                        hoverinfo: "text",
                                                        marker: { color: 'green' },
                                                    },
                                                ]}
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
                                        <div id="correction_header">Would you like to apply Batch Correction to your data?</div>
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
                                        <button type="Continue" className="button batch_cont">Continue</button>
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
