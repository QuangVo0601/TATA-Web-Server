import React from "react";
//import "../styles/tata.css";
import styles from  "../styles/batchPage.module.css";
import Plot from 'react-plotly.js';
import Select from "react-select" // to use dropbox
import Footer from './botNav';

class BatchPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            outputOptions: [
                { value: "Correction Applied", label: "Yes" },
                { value: "No Correction", label: "No" }
            ],
            selectedOption: { value: "Correction Applied", label: "Yes" },
            href: "",
            uncorrected_pca_traces: [],
            corrected_pca_traces: [],
        }
    }

    // This method is used to store click option from dropbox
    selectedOption = (selected) => {
        this.setState({ selectedOption: selected })
    }

    // go to algorithm page, save the "batch_correction_value" in localStorage
    // to be used in algorithmPage.js
    handleSubmit = () => {
        localStorage.setItem('batch_correction_value', JSON.stringify(this.state.selectedOption.value))
        this.setState({ href: '/algorithmpage' }) 
    }

    // Retrieve from back end the data needed for uncorrected & corrected pca graphs
    /*componentDidMount() {

        var group_names_list = JSON.parse(localStorage.getItem('group_names_list'))

        var x_uncorrected_pca = JSON.parse(localStorage.getItem('x_uncorrected_pca'))
        var y_uncorrected_pca = JSON.parse(localStorage.getItem('y_uncorrected_pca'))
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

        var x_corrected_pca = JSON.parse(localStorage.getItem('x_corrected_pca'))
        var y_corrected_pca = JSON.parse(localStorage.getItem('y_corrected_pca'))
        // console.log(x_corrected_pca)
        // console.log(y_corrected_pca)

        // for corrected pca graph
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
            uncorrected_pca_traces: uncorrected_traces_temp,
            corrected_pca_traces: corrected_traces_temp
        })

        // localStorage.removeItem('x_uncorrected_pca', 'y_uncorrected_pca', 'x_corrected_pca', 'y_corrected_pca', 'group_names_list')

    }*/

    render() {
        return (
            <div>
                <head>
                    <meta charset="UTF-8" />
                    <title>Batch Page</title>
                    <link href="css/batchPage.css" rel="stylesheet" />
                    <link href="https://fonts.googleapis.com/css?family=Montserrat:400,500,700%7COswald:500,600,700&display=swap" rel="stylesheet"/>
                </head>
                <body>
                    <div id={styles["batch-wrapper"]}>
                        <div className={styles["batch-flex-container"]}>
                            {/* <div id="content"> */}
                                <div id={styles["nav-batch"]}>
                                    <div id={styles["logo"]}>
                                        <img src={require('../assets/Group 257.png')} width="46px" alt="logo" />
                                    </div>
                                    {/* <!--end of log--> */}

                                    <div id={styles["mainnav"]}>
                                        <div id={styles["circles"]}>
                                            <ul>
                                                <li><span className={styles["circles"]} id="complete">1</span></li>
                                                <li><div className={styles["line1"]} id="active3"></div></li>
                                                <li><span className={styles["circles"]} id="complete" >2</span></li>
                                                <li><div className={styles["line1"]} id="active3"></div></li>
                                                <li><span className={styles["circles"]} id="complete">3</span></li>
                                                <li><div className={styles["line"]} id="active3"></div></li>
                                                <li><span className={styles["circles"]} id="complete">4</span></li>
                                                <li><div className={styles["line"]}></div></li>
                                                <li><span className={styles["circles"]}>5</span></li>
                                            </ul>
                                        </div>
                                        {/* <!--end of circles--> */}

                                        <div id={styles["stepnav"]}>
                                            <dl>
                                                <div id={styles["task"]}>
                                                    <dt><div className={styles["active2"]}>Exploratory Plots</div></dt>
                                                    <dt><div className={styles["active2"]}>Choose Task</div></dt>
                                                    <dt><div className={styles["active2"]}>Group Samples</div></dt>
                                                    <dd>Group Samples & create Gtex group</dd>
                                                </div>
                                                {/* <!--end of task--> */}

                                                <div id={styles["samples"]}>
                                                    <dt><div className={styles["active2"]}>Choose Batch Correction</div></dt>
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
                            {/* </div> */}
                            {/* <!-- beginning of batch section --> */}
                            <div id={styles["batch-section"]}>
                                <div id={styles["batch-content"]}>
                                    <div id={styles["batch_corrected_section"]} >
                                        <div className={styles["drophelp"]}>
                                            <div className={styles["batch_title"]}>Corrected Data <img src={require('../assets/Help Icon.png')} className={styles.helpicon} alt="help" /></div>
                                            <div className={styles["helpcontent_batch"]}>Data correction is applied to remove the variance introduced by non-biological features such as technical variation during sequencing runs. The data correction is done using the R function ASCA Removal of Systematic Noise for sequencing data (ARSyNseq) that is implemented in the NOIseq package.  Decisions on the use of batch correction can be made based on the resulting PCA.  If there is significant clustering after batch correction based on biological features such as disease, then the user may elect to use this correction.
                                                <br/><br/> <i>M. Nueda, A. Conesa, and A. Ferrer. ARSyN: a method for the identification and removal of systematic noise in multifactorial time-course microarray experiments. Biostatistics, 13(3):553–566, 2012.</i>
                                            </div>
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
                                                    legend: {"orientation": "v", "font": {size: 11}},
                                                    // plot_bgcolor: "rgb(182, 215, 168)"
                                                }}
                                                {...{useResizeHandler: true}}
                                                {...{style: {width: "100%", height: "100%"}}}
                                            />
                                        </div>
                                    </div>

                                    <div id={styles["batch_corrected_section"]} >
                                        <div className={styles["drophelp"]}>
                                            <div className={styles["batch_title"]}>Uncorrected Data <img src={require('../assets/Help Icon.png')} className={styles.helpicon} alt="help" /></div>
                                            <div className={styles["helpcontent_batch"]}>This PCA is derived from the raw data after grouping.  Only genes found in all data sets will be used moving forward.  If you have elected to add a GTEx group to your analysis then there may be unexpected variability due to non-biological features.  Please evaluate the uncorrected PCA for expected clustering.  If the clustering is primarily due to a biological feature such as tissue type then you may decide to move forward with the uncorrected data.  If you have already provided data corrected for a batch effect or if the data is from a single sequencing run, then batch correction may introduce variance.</div>
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
                                                    legend: {"orientation": "v", "font": {size: 11}}
                                                }}
                                                {...{useResizeHandler: true}}
                                                {...{style: {width: "100%", height: "100%"}}}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* <!-- correction dropdown --> */}
                                <div id={styles["batch-bottom-container"]}>
                                    <div id={styles["batch-bottom-container2"]} >
                                        <div id={styles["correction_header"]}>Would you like to use batch corrected data?</div>
                                        <div className={styles.select}>
                                            {/* <select>
                                                <option>Yes</option>
                                                <option>No</option>
                                            </select> */}
                                            <Select
                                                // styles={{ control: (base) => ({ ...base, boxShadow: "none", width: "95px" }) }}
                                                // className={styles.select}
                                                placeholder={this.state.selectedOption}
                                                value={this.state.selectedOption}
                                                onChange={this.selectedOption}
                                                options={this.state.outputOptions}
                                            />
                                        </div>
                                    </div>

                                    <div className={styles["nav_container4"]}>
                                    <a href={this.state.href} style={{'text-decoration': 'none'}}>
                                        <button type="Continue" 
                                                className={styles.button}
                                                onClick={this.handleSubmit}>Continue</button>
                                    </a>
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
