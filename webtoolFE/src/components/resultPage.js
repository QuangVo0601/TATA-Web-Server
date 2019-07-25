import React from "react";
import "../styles/resultPage.css";
import Footer from './botNav';
import Plot from 'react-plotly.js';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import FinalPlots from './finalPlots';

class ResultPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            x_dge: [],
            y_dge: [],
            x_pca: [],
            y_pca: [],
            pca_text: [],
            tpc_traces: [],
            uncorrected_pca_traces: [],
            corrected_pca_traces: [],
            // x_test: [],
            // y_test: [],

        }

    }

    // As soon as the page route, it executes
    componentDidMount() {

        //var test_list = JSON.parse(localStorage.getItem('test_list'))

        this.setState({
            x_dge: JSON.parse(localStorage.getItem('x_dge')),
            y_dge: JSON.parse(localStorage.getItem('y_dge')),
            x_pca: JSON.parse(localStorage.getItem('x_pca')),
            y_pca: JSON.parse(localStorage.getItem('y_pca')),
            pca_text: localStorage.getItem('pca_text').split(','),
            tpc_traces: JSON.parse(localStorage.getItem('tpc_traces')),
            // x_test: test_list[0],
            // y_test: test_list[1],
        })

    }

    render() {
        return (
            <div>
                <head>
                    <meta charSet="UTF-8" />
                    <title>Untitled Document</title>
                    <link rel="stylesheet" href="result.css" />
                    <link href="https://fonts.googleapis.com/css?family=Montserrat:400,500,700|Oswald&display=swap" rel="stylesheet" />
                </head>

                <body>
                    <Tabs>
                        <div id="wrapper-result">

                            <nav>
                                <div id="sidenav-content">
                                    <div id="tatalogo">
                                        <img src={require('../assets/Group 257.png')} alt="tatalogo" width="48px" height="49px" />
                                    </div>
                                    <div id="graph-selection">

                                        <TabList>
                                            {/* <div id="result-validation"> */}
                                            {/* <button type="Continue" className="button-result">Exploratory Plots</button> */}
                                            <Tab type="Continue" className="button-result">Exploratory Plots</Tab>
                                            {/* </div> */}
                                            {/* <div id="result-batch"> */}
                                            {/* <button type="Continue" className="button-result">Batch Correction</button> */}
                                            <Tab type="Continue" className="button-result">Batch Correction</Tab>
                                            {/* </div> */}
                                            {/* <div id="result-final"> */}
                                            {/* <button type="Continue" className="button-result">Final Plots</button> */}
                                            <Tab type="Continue" className="button-result">Final Plots</Tab>
                                            {/* </div> */}
                                            {/* <div id="result-table"> */}
                                            {/* <button type="Continue" className="button-result">Results Table</button> */}
                                            <Tab type="Continue" className="button-result">Results Table</Tab>
                                            {/* </div>                                     */}
                                            {/* <div id="download-data"> */}
                                            {/* <button type="Continue" className="download">Download Data</button> */}
                                            <Tab type="Continue" className="download">Download Data</Tab>
                                            {/* </div> */}
                                            {/* <div id="delete-data"> */}
                                            {/* <button type="Continue" className="delete">Delete Data</button> */}
                                            <Tab type="Continue" className="delete">Delete Data</Tab>
                                            {/* </div> */}
                                        </TabList>
                                    </div>
                                    <div id="graphresult-content">
                                        <p>Your data will be stored for 30 days and can be accessed for download during that time.  If you would like to download all of the analyzed data as CSV files, please click on the <em> “Download Data”</em> button.</p>

                                        <p>Please note that each graph must be downloaded separately if you would like to keep and use it.</p>

                                        <p>If you would like to remove your data from our database prior to the 30 day timeline you may do that here as well.  Note that once you delete your data will no longer be able to access the data using your job code. </p>
                                    </div>
                                </div>
                            </nav>

                            {/*This TabPanel is for "Exploratory Plots"*/}
                            <TabPanel>
                                <article>
                                    <div id="graph-display">
                                        <div className="graph-result">

                                            <Plot
                                                data={[
                                                    {
                                                        x: this.state.x_dge,
                                                        y: this.state.y_dge,
                                                        type: 'scattergl',
                                                        mode: 'markers',
                                                        hoverinfo: 'x',
                                                        marker: { color: '#517C8A' },
                                                    },
                                                ]}
                                                layout={{
                                                    hovermode: 'closest',
                                                    title: 'Distribution of Gene Expression',
                                                    font: { family: 'Oswald,sans-serif', size: 18, color: '#114b5f' },
                                                    // width: 900, height: 450,
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
                                                    },
                                                    autosize: true
                                                }}
                                                {...{ useResizeHandler: true }}
                                                {...{ style: { width: "100%", height: "100%" } }}
                                            />
                                        </div>
                                        <div className="graph-result">
                                            <Plot

                                                data={this.state.tpc_traces}

                                                layout={{
                                                    hovermode: 'closest', showlegend: false, title: 'TPM per Chromosome (TPC)',
                                                    font: { family: 'Oswald,sans-serif', size: 18, color: '#114b5f' },
                                                    // width: 900, height: 450,
                                                    xaxis: {
                                                        range: [0, 25.5], showgrid: false, title: {
                                                            text: 'Chromosome',
                                                            font: { family: 'Oswald,sans-serif', size: 18, color: '#114b5f' }
                                                        }, tickmode: 'array',
                                                        tickvals: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25],
                                                        ticktext: ['', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', 'MT', 'X', 'Y'],
                                                        ticks: 'outside',
                                                        tick0: 0,
                                                        dtick: 1,
                                                        ticklen: 4,
                                                        tickwidth: 4,
                                                        tickcolor: '#000',
                                                        // tickangle: 1,
                                                        tickfont: { size: 12 },
                                                    },
                                                    yaxis: {
                                                        autorange: true, type: 'log', showgrid: false, title: {
                                                            text: 'Total TPM',
                                                            font: { family: 'Oswald,sans-serif', size: 18, color: '#114b5f' }
                                                        }
                                                    },
                                                    autosize: true
                                                }}
                                                {...{ useResizeHandler: true }}
                                                {...{ style: { width: "100%", height: "100%" } }}
                                            />
                                        </div>
                                        <div className="graph-result">
                                            <Plot
                                                data={[
                                                    {
                                                        x: this.state.x_pca,
                                                        y: this.state.y_pca,
                                                        type: 'scattergl',
                                                        mode: 'markers', //lines or markers
                                                        text: this.state.pca_text,
                                                        hoverinfo: "text",
                                                        marker: { color: '#2EC4B6' },
                                                    },
                                                ]}
                                                layout={{
                                                    hovermode: 'closest',
                                                    title: 'Principal Component Analysis (PCA)',
                                                    font: { family: 'Oswald,sans-serif', size: 18, color: '#114b5f' },
                                                    // width: 900, height: 450,
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
                                                    },
                                                    autosize: true
                                                }}
                                                {...{ useResizeHandler: true }}
                                                {...{ style: { width: "100%", height: "100%" } }}
                                            />

                                        </div>
                                    </div>

                                </article>
                            </TabPanel>

                            {/*This TabPanel is for "Batch Correction"*/}
                            <TabPanel>
                                <div className="batch-display">
                                    <div className="batch-result">
                                        <Plot
                                            data={[
                                                {
                                                    // x: this.state.x_pca,
                                                    // y: this.state.y_pca,
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
                                                font: { family: 'Oswald,sans-serif', size: 13, color: '#114b5f' },
                                                // width: 460, height: 450,
                                                xaxis: {
                                                    autorange: true, showgrid: false, title: {
                                                        text: 'PC1',
                                                        font: { family: 'Oswald,sans-serif', size: 12, color: '#114b5f' }
                                                    },
                                                },
                                                yaxis: {
                                                    autorange: true, showgrid: false, title: {
                                                        text: 'PC2',
                                                        font: { family: 'Oswald,sans-serif', size: 12, color: '#114b5f' }
                                                    }
                                                },
                                                autosize: true,
                                                showlegend: true,
                                                legend: { "orientation": "v", "font": { size: 11 } }
                                            }}
                                            {...{ useResizeHandler: true }}
                                            {...{ style: { width: "100%", height: "100%" } }}
                                        />
                                    </div>
                                    <div className="batch-result">
                                        <Plot
                                            data={[
                                                {
                                                    // x: this.state.x_pca,
                                                    // y: this.state.y_pca,
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
                                                title: 'Uncorrected PCA',
                                                font: { family: 'Oswald,sans-serif', size: 13, color: '#114b5f' },
                                                // width: 460, height: 450,
                                                xaxis: {
                                                    autorange: true, showgrid: false, title: {
                                                        text: 'PC1',
                                                        font: { family: 'Oswald,sans-serif', size: 12, color: '#114b5f' }
                                                    },
                                                },
                                                yaxis: {
                                                    autorange: true, showgrid: false, title: {
                                                        text: 'PC2',
                                                        font: { family: 'Oswald,sans-serif', size: 12, color: '#114b5f' }
                                                    }
                                                },
                                                autosize: true,
                                                showlegend: true,
                                                legend: { "orientation": "v", "font": { size: 11 } }
                                            }}
                                            {...{ useResizeHandler: true }}
                                            {...{ style: { width: "100%", height: "100%" } }}
                                        />
                                    </div>
                                </div>
                            </TabPanel>

                            {/*This TabPanel is for "Final Plots"*/}
                            <TabPanel>
                                <FinalPlots/>
                            </TabPanel>

                            {/*This TabPanel is for "Results Table"*/}
                            <TabPanel>
                                <div>Result Table here</div>
                                

                            </TabPanel>

                            {/*This TabPanel is for "Download Data", saved in a csv file*/}
                            <TabPanel>
                                <div>Download Data (saved in csv file) here</div>

                            </TabPanel>

                            {/*This TabPanel is for "Delete Data"*/}
                            <TabPanel>
                                <div>Delete Data here</div>

                            </TabPanel>

                        </div>
                    </Tabs>
                    <Footer />
                </body>
            </div>
        );
    }
}
export default ResultPage;       