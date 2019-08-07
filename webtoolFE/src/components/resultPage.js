import React from "react";
import axios from 'axios'; // to send data to back end
import styles from "../styles/resultPage.module.css";
import Footer from './botNav';
import Plot from 'react-plotly.js';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import FinalPlots from './finalPlots';
import FinalTables from './finalTables';

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
            jobCode: "",
            csv_names_list: "",

        }

    }

    // As soon as the page route, it executes
    componentDidMount() {

        let jobCode = JSON.parse(localStorage.getItem('jobCode')) //from algorithmPage.js or homePage.js

        console.log(jobCode)

        axios.post('http://127.0.0.1:8000/backend/results', {
            //axios.post('http://oscar19.orc.gmu.edu/backend/results', {
                jobCode: jobCode,
            })
            .then((coordinates) => { // to receive data from back end 
                let traces_temp = []
 
                // number of patients is number of traces in tpc graph .Ex: 7 patients
                let no_of_patients = coordinates.data.y_tpc.length 
                //array of sample names
                let names = coordinates.data.pca_text 
        
                // This takes care of TPC multilines graph
                for (let i = 0; i < no_of_patients; i++) {
                    let x = coordinates.data.x_tpc
                    let y = coordinates.data.y_tpc[i]
                    let name = names[i] //sample name
                    let type = 'scatter'
                    let mode = 'markers'
                    let hoverinfo = "name"
                    let marker = { color: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25] } // This is color scheme for tpc graph
                    let trace = { x, y, name, type, mode, hoverinfo, marker } // create a new trace obj
                    traces_temp.push(trace) // add that trace obj into our tpc_trace
                }

                // This takes care of uncorrected PCA graph
                var group_names_list = coordinates.data.group_names_list

                var x_uncorrected_pca = coordinates.data.x_uncorrected_pca
                var y_uncorrected_pca = coordinates.data.y_uncorrected_pca
                // console.log(x_uncorrected_pca)
                // console.log(y_uncorrected_pca)
        
                // number of lines on each graph
                let no_of_dataframes = x_uncorrected_pca.length
        
                // for uncorrected pca graph
                let uncorrected_traces_temp = []
                for(let i = 0; i < no_of_dataframes; i++){
                    let x = x_uncorrected_pca[i]
                    let y = y_uncorrected_pca[i]
                    let name = group_names_list[i] //sample name
                    let type = 'scatter'
                    let mode = 'markers'
                    let hoverinfo = "name"
                    let trace = { x, y, name, type, mode, hoverinfo} // create a new trace obj
                    uncorrected_traces_temp.push(trace) // add that trace obj into our tpc_trace
                }
        
                var x_corrected_pca = coordinates.data.x_corrected_pca
                var y_corrected_pca = coordinates.data.y_corrected_pca
                console.log(x_corrected_pca)
                console.log(y_corrected_pca)
        
                // This takes care of corrected PCA graph
                let corrected_traces_temp = []
                for(let i = 0; i < no_of_dataframes; i++){
                    let x = x_corrected_pca[i]
                    let y = y_corrected_pca[i]
                    let name = group_names_list[i] //sample name
                    let type = 'scatter'
                    let mode = 'markers'
                    let hoverinfo = "name"
                    let trace = { x, y, name, type, mode, hoverinfo} // create a new trace obj
                    corrected_traces_temp.push(trace) // add that trace obj into our tpc_trace
                }
        
                // this.setState works the same as setters
                // syntax: this.setState( {target value : value to change} )             
                this.setState({
                    x_dge: coordinates.data.x_dge,
                    y_dge: coordinates.data.y_dge,
                    tpc_traces: traces_temp,
                    x_pca: coordinates.data.x_pca,
                    y_pca: coordinates.data.y_pca,
                    pca_text: coordinates.data.pca_text,
                    csv_names_list: coordinates.data.csv_names_list,
                    jobCode: coordinates.data.jobCode,
                    uncorrected_pca_traces: uncorrected_traces_temp,
                    corrected_pca_traces: corrected_traces_temp
                })

                //remove everything from local storage for safety
                // localStorage.removeItem('x_tpc', 'y_tpc', 'x_pca', 'y_pca', 'x_dge', 'y_dge', 'pca_text',
                //                         'group_names_list', 'x_uncorrected_pca', 'y_uncorrected_pca', 
                //                         'x_corrected_pca', 'y_corrected_pca', 
                //                         'batch_correction_value', 'taskChosen', 'jobCode')
            })        

    }

    handleDownloadData = () => {
        this.axiosCall()
    }

    handleDeleteData = () => {
        this.axiosCall()
    }

    axiosCall () {
        // need to either download or delete data in back end
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

                <div >
                    <Tabs>
                        <div id={styles["wrapper-result"]}>

                            <nav>
                                <div id={styles["sidenav-content"]}>
                                    <div id={styles["tatalogo"]}>
                                        <a href="/">
                                            <img src={require('../assets/TATA.png')} alt="tatalogo" />
                                        </a>
                                    </div>
                                    <div id={styles["graph-selection"]}>
                                        <div id={styles["jobCode-section"]}>
                                            <div id={styles["jobCode"]}>JOB CODE:<span>{this.state.jobCode}</span></div>
                                        </div>
                                        <TabList>
                                            <Tab type="Continue" className={styles["button-result"]}>Exploratory Plots</Tab>
                                            <Tab type="Continue" className={styles["button-result"]}>Batch Correction</Tab>
                                            <Tab type="Continue" className={styles["button-result"]}>Final Plots</Tab>
                                            <Tab type="Continue" className={styles["button-result"]}>Results Table</Tab>
                                            <Tab type="Continue" className={styles["download"]}>Download Data</Tab>
                                            <Tab type="Continue" className={styles["delete"]}>Delete Data</Tab>
                                        </TabList>
                                        <div id={styles["graphresult-content"]}>
                                            <div className={styles["drophelp"]}>
                                                <div className={styles["result_title"]}> What happens to your data? <img src={require('../assets/Help Icon.png')} className={styles["helpicon"]} alt="help" /></div>
                                                <div className={styles["helpcontent_result"]}>
                                                    <p className={styles["text-color"]}>Your data will be stored for 30 days and can be accessed for download during that time.  If you would like to download all of the analyzed data as CSV files, please click on the <em> “Download Data”</em> button.</p>
                                                    <p className={styles["text-color"]}>Please note that each graph must be downloaded separately if you would like to keep and use it.</p>
                                                    <p className={styles["text-color"]}>If you would like to remove your data from our database prior to the 30 day timeline you may do that here as well.  Note that once you delete your data will no longer be able to access the data using your job code. </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </nav>

                            {/*This TabPanel is for "Exploratory Plots"*/}
                            <TabPanel>
                                <article>
                                    <div id={styles["graph-display"]}>
                                        <div id={styles["top_container"]}>
                                            <div id={styles.contents}>
                                                <div className={styles.drophelp}>
                                                    <div className={`${styles["plot_title"]} ${styles["distribution"]}`}>DISTRIBUTION OF GENES <img src={require('../assets/Help Icon.png')} className={styles.helpicon} alt="help" /></div>
                                                    <div className={`${styles["helpcontent"]} ${styles["PCA"]}`}>Top 100 TPMs is generally a function of tissue type. Outliers are generally only expected for variation in tissue or cell types.  If your data is from multiple tissue sources, we recommend keeping not creating groups with more than one tissue type.</div>
                                                </div>
                                                {/* <div className="graphsize"> */}
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
                                                {/* </div> */}
                                                <div className={styles.drophelp}>
                                                    <div className={styles["plot_title"]}>TPC <img src={require('../assets/Help Icon.png')} className={styles.helpicon} alt="help" /></div>
                                                    <div className={`${styles["helpcontent"]} ${styles["TPC"]}`}> Total TPM/chromosome
								may vary based on tissue source and gender. Outliers samples may be an expected outcome if your data is derived from diseased groups or from different tissue types. If your data is derived from multiple batches there should be shifts across all chromosomes. Batch correction option is recommended.</div>
                                                </div>
                                                {/* <div className="graphsize"> */}
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
                                                {/* </div> */}
                                                <div className={styles.drophelp}>
                                                    <div className={styles["plot_title"]}>PCA <img src={require('../assets/Help Icon.png')} className={styles.helpicon} alt="help" /></div>
                                                    <div className={`${styles["helpcontent"]} ${styles["PCA"]}`}>Distribution of samples is expected to fall into clusters based on samples state (e.g. disease) Highly heterogeneous data may not cluster in initial PCA. If samples cluster based on assay condition such as different sequencing runs, batch correction option is recommended.</div>
                                                </div>
                                                {/* <div className="graphsize"> */}
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
                                                {/* </div> */}
                                            </div>
                                        </div>
                                    </div>

                                </article>
                            </TabPanel>

                            {/*This TabPanel is for "Batch Correction"*/}
                            <TabPanel>
                                <div id={styles["batch-section"]}>
                                    <div id={styles["batch-content"]}>
                                        <div id={styles["batch_corrected_section"]} >
                                            <div className={styles["drophelp"]}>
                                                <div className={styles["batch_title"]}>Corrected Data <img src={require('../assets/Help Icon.png')} className={styles.helpicon} alt="help" /></div>
                                                <div className={styles["helpcontent_batch"]}> Add content here.</div>
                                            </div>
                                            <div className={styles["corrected-graphsize"]}>
                                                <Plot
                                                    data={this.state.corrected_pca_traces}

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
                                                        legend: { "orientation": "v", "font": { size: 11 } },
                                                        // plot_bgcolor: "rgb(182, 215, 168)"
                                                    }}
                                                    {...{ useResizeHandler: true }}
                                                    {...{ style: { width: "100%", height: "100%" } }}
                                                />
                                            </div>
                                        </div>

                                        <div id={styles["batch_corrected_section"]} >
                                            <div className={styles["drophelp"]}>
                                                <div className={styles["batch_title"]}>Uncorrected Data <img src={require('../assets/Help Icon.png')} className={styles.helpicon} alt="help" /></div>
                                                <div className={styles["helpcontent_batch"]}>Add content here.</div>
                                            </div>
                                            <div className={styles["corrected-graphsize"]}>
                                                <Plot
                                                    data={this.state.uncorrected_pca_traces}

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
                                    </div>
                                </div>
                            </TabPanel>

                            {/*This TabPanel is for "Final Plots"*/}
                            <TabPanel>
                                <FinalPlots jobCode={this.state.jobCode} csv_names_list={this.state.csv_names_list} />
                            </TabPanel>

                            {/*This TabPanel is for "Results Table"*/}
                            <TabPanel>
                                <FinalTables jobCode={this.state.jobCode} csv_names_list={this.state.csv_names_list}/>
                            </TabPanel>

                            {/*This TabPanel is for "Download Data", saved in a csv file*/}
                            <TabPanel>
                                {this.handleDownloadData}
                            </TabPanel>

                            {/*This TabPanel is for "Delete Data"*/}
                            <TabPanel>
                                {this.handleDeleteData}
                            </TabPanel>

                        </div>
                    </Tabs>
                    <Footer />
                </div>
            </div>
        );
    }
}
export default ResultPage;       