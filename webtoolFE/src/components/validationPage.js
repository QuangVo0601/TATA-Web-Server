import React from "react";
import Plot from 'react-plotly.js';
//import "../styles/tata.css";
import styles from "../styles/validationPage.module.css";
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
            tpc_traces: [],
            href: ""
        }
    }

    // As soon as the page route, it executes
    componentDidMount() {
        let traces_temp = []
 
        // number of patients is number of traces in tpc graph .Ex: 7 patients
        let no_of_patients = JSON.parse(localStorage.getItem('y_tpc')).length 
        //array of sample names
        let names = localStorage.getItem('pca_text').split(",") 

        // This takes care of TPC multilines graph
        for (let i = 0; i < no_of_patients; i++) {
            let x = JSON.parse(localStorage.getItem('x_tpc'))
            let y = JSON.parse(localStorage.getItem('y_tpc'))[i]
            let name = names[i] //sample name
            let type = 'scatter'
            let mode = 'markers'
            let hoverinfo = "name"
            let marker = { color: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25] } // This is color scheme for tpc graph
            let trace = { x, y, name, type, mode, hoverinfo, marker } // create a new trace obj
            traces_temp.push(trace) // add that trace obj into our tpc_trace
        }

        //just for testing 07/19
        localStorage.setItem('tpc_traces', JSON.stringify(traces_temp))

        // this.setState works the same as setters
        // syntax: this.setState( {target value : value to change} )
        this.setState({
            x_dge: JSON.parse(localStorage.getItem('x_dge')),
            y_dge: JSON.parse(localStorage.getItem('y_dge')),
            x_pca: JSON.parse(localStorage.getItem('x_pca')),
            y_pca: JSON.parse(localStorage.getItem('y_pca')),
            pca_text: localStorage.getItem('pca_text').split(','),
            tpc_traces: traces_temp
        })
        // remove everything from local storage for safety
        // localStorage.removeItem('x_tpc', 'y_tpc', 'x_pca', 'y_pca', 'x_dge', 'y_dge')
    }
  
    handleSubmit = () => {

            this.setState({ href: '/taskpage' }) 
    }

    render() {
        return (
            <div>
                <head>
                    <meta charSet="UTF-8" />
                    <title>Initial Validation</title>
                    {/* <link href="CSS/Inital_validation_responsive.css" rel="stylesheet" /> */}
                    <link href="https://fonts.googleapis.com/css?family=Montserrat:400,700|Oswald&display=swap" rel="stylesheet" />
                </head>
                <body>
                    <div id={styles.wrapper1}>
                        <div className={styles['flex-container1']}>
                            <div id={styles.content}>
                                <div id={styles.nav2}>
                                    <div id={styles.logo}>
                                        <a href="/"> {/*added by Quang, logo linked to homepage*/}
                                            <img src={require('../assets/TATA.png')} alt="logo" />
                                        </a>
                                    </div>
                                    {/* <!--end of log--> */}

                                    <div id={styles.mainnav}>
                                        <div id={styles.circles}>
                                            <ul>
                                                <li><span className={styles.circles} id={styles.active}>1</span></li>
                                                <li><div className={styles.line1}></div></li>
                                                <li><span className={styles.circles}>2</span></li>
                                                <li><div className={styles.line1}></div></li>
                                                <li><span className={styles.circles}>3</span></li>
                                                <li><div className={styles.line}></div></li>
                                                <li><span className={styles.circles}>4</span></li>
                                                <li><div className={styles.line}></div></li>
                                                <li><span className={styles.circles}>5</span></li>
                                            </ul>
                                        </div>
                                        {/* <!--end of circles--> */}

                                        <div id={styles.stepnav}>
                                            <dl>
                                                <div id={styles.task}>
                                                    <dt><div className={styles.active2}>Exploratory Plots</div></dt>
                                                    <dt>Choose Task</dt>
                                                    <dt>Group Samples</dt>
                                                    <dd>Group Samples & create Gtex group</dd>
                                                </div>
                                                {/* <!--end of task--> */}

                                                <div id={styles.samples}>
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

                            <div id={styles.section1}>

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
                                                {...{useResizeHandler: true}}
                                                {...{style: {width: "100%", height: "100%"}}}
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
                                                        tickfont:{size: 12},
                                                    },
                                                    yaxis: {
                                                        autorange: true, type: 'log', showgrid: false, title: {
                                                            text: 'Total TPM',
                                                            font: { family: 'Oswald,sans-serif', size: 18, color: '#114b5f' }
                                                        }
                                                    },
                                                    autosize: true
                                                }}
                                                {...{useResizeHandler: true}}
                                                {...{style: {width: "100%", height: "100%"}}}
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
                                                {...{useResizeHandler: true}}
                                                {...{style: {width: "100%", height: "100%"}}}
                                            />
                                        {/* </div> */}
                                    </div>
                                </div>
                                <div id={styles["initial_header"]}>Exploratory Plots</div>
                                <div id={styles["validation_info"]}>
                                    <div className={styles["initial_info"]}>The data displayed in these graphs is an initial overview of the input data before batch correction. If you have elected to use data sets derived from multiple sequencing runs, or collected by different groups we suggest the application of batch correction. The graphs presented above will be available for download again at the end of the run, however you can elect to download the graphs individually now by using the task bars found at the top of each graph. </div>
                                    <div className={styles["initial_info"]}>The next step in the process is to define the various groups of interest. Please note that batch correction will only be applied after your groups have been defined. More specific information to help interpret each graph can be found next to each graph title. If your data appears correct and complete please continue to grouping samples.</div>
                                    {/* <!--<div className="initial_info">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris non sodales neque. Suspendisse eget magna eu tellus scelerisque posuere. Fusce vel semper nisl. Vivamus imperdiet arcu quis neque vehicula, ac mattis ipsum auctor. Nunc sodales ligula risus, et pretium sem convallis id. Integer vitae nisi ac ante viverra volutpat.</div>--> */}
                                </div>

                                <div className={styles["nav_container1"]}>
                                    <a href={this.state.href} style={{'text-decoration': 'none'}}> 
                                        <button type="Continue" 
                                                className={styles["button-validation-cont"]}
                                                onClick={this.handleSubmit}>Continue</button>
                                    </a>
                                </div>
                            </div>
                            {/* <!--end of section--> */}

                        </div>

                        <Footer /> {/* import Footer from botNav.js */}
                    </div>
                    {/* <!--end of wrapper--> */}
                </body>
            </div>
        );
    }
}
export default ValidationPage;