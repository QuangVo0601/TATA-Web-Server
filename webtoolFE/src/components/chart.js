// This is use to graph for validation

import React from 'react';
import Plot from 'react-plotly.js';
import SubTopNav from './SubTopNav';
import BotNav from './botNav';
import "../styles/chart.css";

class Graph extends React.Component {
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
      let hoverinfo = "name"	
      let marker = {color: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25]} // This is color scheme for tpc graph
      let trace = { x, y, name, type, mode, hoverinfo, marker} // create a new trace obj
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
    localStorage.removeItem('x_tpc', 'y_tpc', 'x_pca', 'y_pca', 'x_dge', 'y_dge','pca_text')
  }

  render() {
    return (
      <div className='validation-page'>
        <SubTopNav />
        <div className='charts-container'>
          <div className='plot'>
            <Plot
              data={[
                {
                  x: this.state.x_dge,
                  y: this.state.y_dge,
                  type: 'scattergl',
                  mode: 'markers',
                  hoverinfo: 'x',
                  marker: { color: 'blue'},
                },
              ]}
              layout={{ 
                hovermode: 'closest',
                title: 'Distribution of Gene Expression',
                font: { family: 'Oswald,sans-serif', size: 18, color: '#114b5f' },
                width: 440, height: 500,
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
            />
          </div>

          <div className='plot'>
            <Plot

              data={this.state.tpc_traces}

              layout={{
                hovermode: 'closest', showlegend: false, title: 'TPM per Chromosome (TPC)',
                font: { family: 'Oswald,sans-serif', size: 18, color: '#114b5f' },
                width: 440, height: 500,
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

          <div className='plot'>
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
                width: 440, height: 500,
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
        <div className='validation'>
          <h1>We Verified Your Data! </h1>
          <p>The preliminary validation plots summarize the data in three ways:
            TPM per Chromosome (TPC):  The input data is plotted as a function of total TPM per chromosome.
            Distribution of gene expression:  The 100 largest TPM means are plotted for each gene.
            Principle component analysis (PCA): The input data is plotted on a two dimensional plot based on sample similarity.
            To see expected plots please select tissue type __________
    </p>
        </div>
        <BotNav />
      </div>
      
    );
  }
}
export default Graph;
