import React from "react";
import axios from 'axios'; // to send data to back end
import styles from "../styles/finalPlots.module.css"; //use the same css with finalPlots.js
import Plot from 'react-plotly.js';
import Plotly from 'plotly.js/dist/plotly'
import Dropdown from 'react-dropdown';
import Select from 'react-select';

class FinalTables extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      PlotOptions: [],
      selectedPlot: {}, //default is the 1st PlotOption
      jobCode: "",
      csvFileName: "",
      all_columns: [],

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
      }
    )
  }


  //get data for the graphs from back end
  axiosCall() {
    // console.log(this.state.jobCode)
    // console.log(this.state.csvFileName)
    axios.post('http://127.0.0.1:8000/backend/finalTables', {
      //axios.post('http://oscar19.orc.gmu.edu/backend/finalTables', {
      jobCode: this.state.jobCode,
      csvFileName: this.state.csvFileName
    })
      .then((columns) => { // to receive data from back end 
        this.setState({
          all_columns: columns.data.all_columns,
          header: columns.data.header
        },
          () => {
            //create a table here
            var values = this.state.all_columns
            var data = [{
              type: 'table',
              columnwidth: [800, 1900, 1100, 1100, 1100, 1100, 1100, 1100, 1100],
              columnorder: [0, 1, 2, 3, 4, 5, 6, 7, 8],
              header: {
                values: this.state.header,
                align: ["left", "center"],
                line: { width: 1, color: '#d8d8d8' },
                fill: { color: '#144c5f' }, 
                font: { family: "Montserrat", size: 12, color: "white" }
              },
              cells: {
                values: values,
                format: [[],[],[".3e"]],
                align: ["left"],
                line: { color: "#d8d8d8", width: 1 },
                fill: { color: ['#e3e3e3', 'white'] }, 
                font: { family: "Montserrat", size: 10, color: ["#144c5f"] },
              }
            }]
            var layout = {
              width: 920, height: 600,
            }
            Plotly.plot('table', data, layout);
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
            placeholder="Final Tables" />
        </div>
        {/*dropdown ends*/}
        <div id={styles["table-display"]}>

          <div id={styles["top_container"]}>
            <div id={styles.contents}>
              <div id='table'></div>
            </div>
          </div>

        </div>

      </div>

    );
  }
}
export default FinalTables;  