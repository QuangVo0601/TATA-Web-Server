import React from "react";
import "../styles/resultPage.css";
import Footer from './botNav';
import Plot from 'react-plotly.js';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

class FinalPlots extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            x_test: [],
            y_test: [],
            x_test2: [],
            y_test2: [],

        }

    }


    // As soon as the page route, it executes
    // componentDidMount() {

    //     var test_list = JSON.parse(localStorage.getItem('test_list'))
    //     console.log(test_list)
    //     var test_list2 = JSON.parse(localStorage.getItem('test_list2'))

    //     this.setState({
    //         x_test: test_list[0],
    //         y_test: test_list[1],
    //         x_test2: test_list2[0],
    //         y_test2: test_list2[1],
    //     })

    // }

    render() {
        return (
            <div>
                {/*Graph 1 "Volcano Plot"*/}
                <div className="graph-result">
                    <Plot
                        data={[
                            {
                                x: [1, 2, 3],
                                y: [3, 2, 1],
                                // x: this.state.x_test,
                                // y: this.state.y_test,
                                type: 'scattergl',
                                mode: 'markers', //lines or markers
                                text: this.state.pca_text,
                                hoverinfo: "text",
                                marker: { color: 'red' },
                            },
                        ]}
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
                            autosize: true
                        }}
                        {...{ useResizeHandler: true }}
                        {...{ style: { width: "100%", height: "100%" } }}
                    />
                </div>
                {/*Graph 2 "Differential Expression TPM Plot"*/}
                <div className="graph-result">
                    <Plot
                        data={[
                            {
                                // x: this.state.x_test2,
                                // y: this.state.y_test2,
                                x: [1, 2, 3],
                                y: [3, 2, 1],
                                type: 'scattergl',
                                mode: 'markers', //lines or markers
                                text: this.state.pca_text,
                                hoverinfo: "text",
                                marker: { color: 'red' },
                            },
                        ]}
                        layout={{
                            hovermode: 'closest',
                            title: 'Differential Expression TPM Plot',
                            font: { family: 'Oswald,sans-serif', size: 18, color: '#114b5f' },
                            // width: 900, height: 450,
                            xaxis: {
                                autorange: true, showgrid: false, title: {
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
                            autosize: true
                        }}
                        {...{ useResizeHandler: true }}
                        {...{ style: { width: "100%", height: "100%" } }}
                    />
                </div>
            </div>

        );
    }
}
export default FinalPlots;  