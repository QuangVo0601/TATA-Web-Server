import React from "react";
import axios from 'axios'; // to send data to back end
import styles from "../styles/finalPlots.module.css";
import Plot from 'react-plotly.js';
import Dropdown from 'react-dropdown';
import Select from 'react-select';

class FinalPlots extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            PlotOptions: [],
            selectedPlot: {}, //default is the 1st PlotOption,
            volcano_traces: [],
            differential_traces: [],
            x_volcano: [],
            y_volcano: [],
            x_differential: [],
            y_differential: [],
            jobCode: "",
            csvFileName: "",
            heatmap_png_path: ""

        }

    }

    // This method is used to store "Plot" option from dropbox
    selectedPlot = (selected) => {

        this.setState({
            selectedPlot: selected,
            csvFileName: selected.value
        },
            () => {
                this.axiosCall()
            }
        )
    }

    //As soon as the page route, it executes
    componentDidMount() {

        //need to read the csv_names_list, then create PlotOptions
        //back end always send the 1st csv file back

        console.log("jobCode from resultPage: " + this.props.jobCode)
        console.log("csv_names_list from resultPage: " + this.props.csv_names_list)
        //get the csv_names_list passed from resultPage.js
        let csv_names_list = this.props.csv_names_list
        console.log(csv_names_list)

        //use the csv_names_list to create PlotOptions dropdown
        let PlotOptionsTemp = []
        for (let i = 0; i < csv_names_list.length; i++) {
            let option = { value: csv_names_list[i], label: csv_names_list[i] }
            PlotOptionsTemp.push(option) //add each option to the list of options
        }

        this.setState({
            jobCode: this.props.jobCode, //jobCode passed from resultPage.js
            PlotOptions: PlotOptionsTemp,
            selectedPlot: PlotOptionsTemp[0], // default is the 1st option
            csvFileName: csv_names_list[0]
        }, // 1st option for axios call
            () => {
                this.axiosCall() //get data from back end
            },
        )

    }

    //get data for the graphs from back end
    axiosCall() {
        // console.log(this.state.jobCode)
        // console.log(this.state.csvFileName)
        axios.post('http://127.0.0.1:8000/backend/finalPlots', {
            //axios.post('http://oscar19.orc.gmu.edu/backend/finalPlots', {
            jobCode: this.state.jobCode,
            csvFileName: this.state.csvFileName
        })
            .then((coordinates) => { // to receive data from back end 
                console.log(coordinates.data.heatmap_png_path)
                // This takes care of volcano plot
                let volcano_temp = []
                for (let i = 0; i < 2; i++) {
                    let x = coordinates.data.x_volcano[i]
                    let y = coordinates.data.y_volcano[i]
                    let name = '' 
                    let type = 'scatter'
                    let mode = 'markers'
                    let text =  coordinates.data.ensIDs
                    let hoverinfo = 'text'
                    let marker = {}
                    if(i === 0){
                        name = 'p < alpha/n'
                        marker = { color: 'black' } // for the 1st plot p < alpha/n
                    }
                    else{
                        name = 'p > alpha/n'
                        marker = { color: 'red' } // for the 2nd plot p < alpha/n
                    }
                    let trace = { x, y, name, type, mode, text, hoverinfo, marker } // create a new trace obj
                    volcano_temp.push(trace) // add that trace obj into our tpc_trace
                }

                // This takes care of differential plot
                let differential_temp = []
                for (let i = 0; i < 2; i++) {
                    let x = coordinates.data.x_differential[i]
                    let y = coordinates.data.y_differential[i]
                    let name = '' 
                    let type = 'scatter'
                    let mode = 'markers'
                    let text =  coordinates.data.ensIDs
                    let hoverinfo = 'text'
                    let marker = {}
                    if(i === 0){
                        name = 'p < alpha/n'
                        marker = { color: 'black' } // for the 1st plot p < alpha/n
                    }
                    else{
                        name = 'p > alpha/n'
                        marker = { color: 'red' } // for the 2nd plot p < alpha/n
                    }
                    let trace = { x, y, name, type, mode, text, hoverinfo, marker } // create a new trace obj
                    differential_temp.push(trace) // add that trace obj into our tpc_trace
                }

                console.log(coordinates.data.heatmap_png_path)
                this.setState({
                    volcano_traces: volcano_temp,
                    differential_traces: differential_temp,
                    heatmap_png_path: coordinates.data.heatmap_png_path
                })
            })
    }

    render() {
        

        return (
            <div >
                
                {/*dropdown part*/}
                <div className={styles["finalPlot-wrapper"]}>
                    <Select
                        styles={{ control: (base) => ({ ...base, boxShadow: "none", width: "200px", fontSize: "12px" }) }}
                        options={this.state.PlotOptions}
                        onChange={this.selectedPlot}
                        value={this.state.selectedPlot}
                        placeholder="Final Plots" />
                    {/* <div className={styles["dropdown-container"]}>
                        <div className={styles["dropdown-label"]}>
                            <Dropdown options={this.state.PlotOptions} onChange="" value={this.state.selectedPlot} placeholder="Final Plots" />
                            <div className={styles["dropdown-active"]}>
                            </div>
                            <div className={styles["dropdown-select"]}>
                            </div>
                        </div>
                    </div> */}
                </div>
                {/*dropdown ends*/}
                <div id={styles["graph-display"]}>

                    <div id={styles["top_container"]}>
                        <div id={styles.contents}>
                            <div className={styles.drophelp}>
                                <div className={`${styles["plot_title"]} ${styles["distribution"]}`}>Volcano Plot <img src={require('../assets/Help Icon.png')} className={styles.helpicon} alt="help" /></div>
                                <div className={`${styles["helpcontent"]} ${styles["PCA"]}`}>This plot highlights any significant differentially expressed gene in red.  Significance is determined as a p-value below the Bonferroni corrected cutoff.</div>
                            </div>
                            {/* <div className="graphsize"> */}
                            {/*Graph 1 "Volcano Plot"*/}
                            <Plot
                                data={this.state.volcano_traces}
                                layout={{
                                    hovermode: 'closest',
                                    title: 'Volcano Plot',
                                    font: { family: 'Oswald,sans-serif', size: 18, color: '#114b5f' },
                                    // width: 900, height: 450,
                                    xaxis: {
                                        range: [-15, 15], showgrid: false, title: {
                                            text: 'Fold Change',
                                            font: { family: 'Oswald,sans-serif', size: 18, color: '#114b5f' }
                                        },
                                    },
                                    yaxis: {
                                        autorange: true, showgrid: false, title: {
                                            text: '-log p values',
                                            font: { family: 'Oswald,sans-serif', size: 18, color: '#114b5f' }
                                        }
                                    },
                                    showlegend: true,
                                    legend: {x: -.1, y: 1.3, "font": { size: 10}},
                                    autosize: true
                                }}
                                {...{ useResizeHandler: true }}
                                {...{ style: { width: "100%", height: "100%" } }}
                            />
                            {/* </div> */}
                            <div className={styles.drophelp}>
                                <div className={styles["plot_title"]}>Differential Expression TPM Plot <img src={require('../assets/Help Icon.png')} className={styles.helpicon} alt="help" /></div>
                                <div className={`${styles["helpcontent"]} ${styles["TPC"]}`}>This plot highlights any significant differentially expressed gene in red.  Significance is determined as a p-value below the Bonferroni corrected cutoff.</div>
                            </div>
                            {/* <div className="graphsize"> */}
                            {/*Graph 2 "Differential Expression TPM Plot"*/}
                            <Plot
                                data={this.state.differential_traces}
                                layout={{
                                    hovermode: 'closest',
                                    title: 'Differential Expression TPM Plot',
                                    font: { family: 'Oswald,sans-serif', size: 15, color: '#114b5f' },
                                    // width: 900, height: 450,
                                    xaxis: {
                                        range: [-100, 100], showgrid: false, title: {
                                            text: 'Average Expression',
                                            font: { family: 'Oswald,sans-serif', size: 18, color: '#114b5f' }
                                        },
                                    },
                                    yaxis: {
                                        range: [-15, 15], showgrid: false, title: {
                                            text: 'Fold Change',
                                            font: { family: 'Oswald,sans-serif', size: 18, color: '#114b5f' }
                                        }
                                    },
                                    showlegend: true,
		                            legend: {x: -.1, y: 1.3, "font": { size: 10}},
                                    autosize: true
                                }}
                                {...{ useResizeHandler: true }}
                                {...{ style: { width: "100%", height: "100%" } }}
                            />
                            {/* </div> */}
                            <div className={styles.drophelp}>
                                <div className={styles["plot_title"]}>Heatmap <img src={require('../assets/Help Icon.png')} className={styles.helpicon} alt="help" /></div>
                                <div className={`${styles["helpcontent"]} ${styles["PCA"]}`}>This cluster map groups similar samples based on log 2 normalized values.  Each cell contains the log 2 fold change relative to the mean of each row.</div>
                            </div>
                            {/* <div className="graphsize"> */}
                            {/* <img className={[styles["heatmap"]]} src={this.state.heatmap_png_path} alt="tatalogo" /> */}
                            {/* </div> */}
                            
                        </div>
                    </div>
                </div>

            </div>

        );
    }
}
export default FinalPlots;  