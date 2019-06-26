import React from "react";
import Plot from 'react-plotly.js';
import "../styles/validationPage.css";
import Footer from './botNav';

class ValidationPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            // Initialize states
            x_dge: [],
            y_dge: [],
            x_pca: [],
            y_pca: [],
            pca_text: [],
            tpc_traces: []
        }
    }

    // As soon as the page route, it executes
    componentDidMount() {

        let traces_temp = []
        // localStorage stores everything as String
        // split by commas ',' to type cast it to array

        // This is number of chromosomes. Ex: 24
        let no_of_chromosome = (localStorage.getItem('x_tpc').split(",")).length
        // .split(',') = number of patients * number of chromosomes. Ex: 168
        // to find number of patients, take .split(',') / number of chromosomes. Ex: 168 / 24 = 7 patients
        let no_of_patients = (localStorage.getItem('y_tpc').split(",")).length / no_of_chromosome
        let j = 0 // for slice begin
        let k = no_of_chromosome // for slice end
        let names = localStorage.getItem('pca_text').split(",") //array of sample names

        // This takes care of TPC multilines graph
        for (let i = 0; i < no_of_patients; i++) {
            let x = localStorage.getItem('x_tpc').split(",")
            // slice(begin index, end index)
            let y = localStorage.getItem('y_tpc').split(",").slice(j, k)
            j = k // set new begin index
            k += no_of_chromosome // set new end index
            let name = names[i] //sample name
            let type = 'scatter'
            let mode = 'markers'
            let marker = {color: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25]} // This is color scheme for tpc graph
            let trace = { x, y, name, type, mode, marker} // create a new trace obj
            traces_temp.push(trace) // add that trace obj into our tpc_trace
        }
        // this.setState works the same as setters
        // syntax: this.setState( {target value : value to change} )
        this.setState({
            x_dge: localStorage.getItem('x_dge').split(","),
            y_dge: localStorage.getItem('y_dge').split(","),
            x_pca: localStorage.getItem('x_pca').split(","),
            y_pca: localStorage.getItem('y_pca').split(","),
            pca_text: localStorage.getItem('pca_text').split(","),
            tpc_traces: traces_temp
        })
        // remove everything from local storage for safety
        localStorage.removeItem('x_tpc', 'y_tpc', 'x_pca', 'y_pca', 'x_dge', 'y_dge')
    }

    render() {
        return (
            <div>
                <head>
                    <meta charset="UTF-8" />
                    <title>Initial Validation</title>
                    <link href="CSS/Inital_validation_responsive.css" rel="stylesheet" />
                    <link href="https://fonts.googleapis.com/css?family=Montserrat:400,700|Oswald&display=swap" rel="stylesheet" />
                </head>
                <body>
                    <div id="wrapper">
                        <div className="flex-container">
                            <div id="content">
                                <div id="nav">
                                    <div id="logo">
                                        <a href="/"> {/*added by Quang, logo linked to homepage*/}
                                            <img src={require('../assets/Group 257.png')} width="46px" height="46px" alt="logo" />
                                        </a>
                                    </div>
                                    {/* <!--end of log--> */}

                                    <div id="mainnav">
                                        <div id="circles">
                                            <ul>
                                                <li><span className="circles" id="active">1</span></li>
                                                <li><div className="line1"></div></li>
                                                <li><span className="circles">2</span></li>
                                                <li><div className="line1"></div></li>
                                                <li><span className="circles">3</span></li>
                                                <li><div className="line"></div></li>
                                                <li><span className="circles">4</span></li>
                                                <li><div className="line"></div></li>
                                                <li><span className="circles">5</span></li>
                                            </ul>
                                        </div>
                                        {/* <!--end of circles--> */}

                                        <div id="stepnav">
                                            <dl>
                                                <div id="task">
                                                    <dt><div className="active2">Initial Validation</div></dt>
                                                    <dt>Choose Task</dt>
                                                    <dt>Group Samples</dt>
                                                    <dd>Group Samples & create Gtex group</dd>
                                                </div>
                                                {/* <!--end of task--> */}

                                                <div id="samples">
                                                    <dt>Choose Batch Correction</dt>
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

                            <div id="section">

                                <div id="top_container">
                                    <div id="contents">
                                        <div className="graphsize graph1">
                                            <Plot
                                                data={[
                                                    {
                                                        x: this.state.x_dge,
                                                        y: this.state.y_dge,
                                                        type: 'scattergl',
                                                        mode: 'markers',
                                                        marker: { color: 'blue' },
                                                    },
                                                ]}
                                                layout={{
                                                    hovermode: 'closest',
                                                    title: 'Distribution of Gene Expression',
                                                    font: { family: 'Oswald,sans-serif', size: 18, color: '#114b5f' },
                                                    width: 925, height: 450,
                                                    xaxis: {
                                                        showticklabels: false, autorange: true, showgrid: false, title: {
                                                            text: 'Gene',
                                                            font: { family: 'Oswald,sans-serif', size: 18, color: '#114b5f' }
                                                        },
                                                    },
                                                    yaxis: {
                                                        showgrid: false, type: 'log',
                                                        autorange: true, title: {
                                                            text: 'Avg TPM',
                                                            font: { family: 'Oswald,sans-serif', size: 18, color: '#114b5f' }
                                                        }
                                                    }
                                                }}
                                                //{responsive: true}
                                            />
                                        </div>
                                        <div className="graphsize graph2">
                                            <Plot

                                                data={this.state.tpc_traces}

                                                layout={{
                                                    hovermode: 'closest', showlegend: false, title: 'TPM per Chromosome (TPC)',
                                                    font: { family: 'Oswald,sans-serif', size: 18, color: '#114b5f' },
                                                    width: 925, height: 450,
                                                    xaxis: {
                                                        range: [0, 25.5], showgrid: false, title: {
                                                            text: 'Chromosome',
                                                            font: { family: 'Oswald,sans-serif', size: 18, color: '#114b5f' }
                                                        }, tickmode: 'array',
                                                        tickvals: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25],
                                                        ticktext: ['','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','MT','X','Y'],
                                                        ticks: 'outside',
                                                        tick0: 0,
                                                        dtick: 1,
                                                        ticklen: 4,
                                                        tickwidth: 4,
                                                        tickcolor: '#000'
                                                    },
                                                    yaxis: {
                                                        autorange: true, type: 'log', showgrid: false, title: {
                                                            text: 'Total TPM',
                                                            font: { family: 'Oswald,sans-serif', size: 18, color: '#114b5f' }
                                                        }
                                                    },
                                                }}
                                            />
                                        </div>
                                        <div className="graphsize graph3">
                                            <Plot
                                                data={[
                                                    {
                                                        x: this.state.x_pca,
                                                        y: this.state.y_pca,
                                                        type: 'scattergl',
                                                        mode: 'markers', //lines or markers
                                                        text: this.state.pca_text,
                                                        hoverinfo: "text",
                                                        marker: { color: 'green' },
                                                    },
                                                ]}
                                                layout={{
                                                    hovermode: 'closest',
                                                    title: 'Principal Component Analysis (PCA)',
                                                    font: { family: 'Oswald,sans-serif', size: 18, color: '#114b5f' },
                                                    width: 925, height: 450,
                                                    xaxis: {
                                                        autorange: true, showgrid: false, title: {
                                                            text: 'PC1',
                                                            font: { family: 'Oswald,sans-serif', size: 18, color: '#114b5f' }
                                                        },
                                                    },
                                                    yaxis: {
                                                        autorange: true, showgrid: false, title: {
                                                            text: 'PC2',
                                                            font: { family: 'Oswald,sans-serif', size: 18, color: '#114b5f' }
                                                        }
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <h1>Initial Validation</h1>
                                <div id="validation_info">

                                    <p>TPC Plot: Total TPM/chromosome may vary based on tissue source and gender.  Outliers samples may be an expected outcome if your data is derived from diseased groups or from different tissue types.  If your data is derived from multiple batches there should be shifts across all chromosomes.  Batch correction option is recommended.</p>

                                    <p>Distribution of gene expression: Top 100 TPMs is generally a function of tissue type.  Outliers are generally only expected for variation in tissue or cell types.  If your data is from multiple tissue sources, we recommend keeping not creating groups with more than one tissue type.</p>

                                    <p>PCA: Distribution of samples is expected to fall into clusters based on samples state (e.g. disease) Highly heterogeneous data may not cluster in initial PCA.  If samples cluster based on assay condition such as different sequencing runs, batch correction option is recommended.</p>

                                </div>

                                <div className="nav_container">
                                    <a href="/taskPage"> {/*added by Quang for button testing*/}
                                        <button type="Continue" className="button task_cont">Continue</button>
                                    </a>
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
export default ValidationPage;