import React from "react";
import Plot from 'react-plotly.js';

class Table extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: []
        }
    }

    componentDidMount() {
        let fileReader = new FileReader()
        let file = require('../assets/DummyCSV/patientlist.csv')
        fileReader.readAsText(file[0]) // Error here: para 2 is not type blob 
        let data = fileReader.result;
        this.setState({data:data})
    }

    render() {
        return(
            <div>
                {this.state.data}
                {/* <Plot 
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
                /> */}

            </div>
        )
    }
}

export default Table;
