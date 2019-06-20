import React from "react";
import axios from 'axios'; // to send data to back end
import "../styles/csvReaders.css";

let fileReader;
class csvReader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            buttonText: "Upload",
            className: "before-upload",
            csvName: "file_name.csv",
            href: ""
        }
    }
    handleFileRead = () => {
        const content = fileReader.result;
        //console.log(content);
        // console.log(option);

        // sending request to back end need to be together
        //axios call (get in header) to send to back end
        axios.post('http://127.0.0.1:8000/backend/list', {
        //axios.post('http://oscar19.orc.gmu.edu/backend/list', {
            csvFile: content
        }).then((arr) => { // to receive data from back end 
            localStorage.setItem('x_dge',arr.data.x_dge)
            localStorage.setItem('y_dge',arr.data.y_dge)
            localStorage.setItem('x_tpc',arr.data.x_tpc)
            localStorage.setItem('y_tpc',arr.data.y_tpc)
            localStorage.setItem('x_pca',arr.data.x_pca)
            localStorage.setItem('y_pca',arr.data.y_pca)
            localStorage.setItem('pca_text', arr.data.pca_text)

        })

    }
    handleFileSelect = (file) => {
        this.setState({ csvName: file.name })
        this.setState({ className: "after-upload" })
        this.setState({ buttonText: "Next" })
        fileReader = new FileReader();
        // onloadend = when done loading file
        // async call ( which means loading and reading concurrently)
        fileReader.onloadend = this.handleFileRead; // calling method
        fileReader.readAsText(file); // return a result
    }

    handleSubmit = () => {
        if (this.state.buttonText === "Next") {
            this.setState({ href: '/validation' }) 
        }
    }

    render() {
        if (this.state.buttonText === 'Next') {
            return (
                <div className="csv-container">
                    <link href="https://fonts.googleapis.com/css?family=Montserrat:600&display=swap" rel="stylesheet" />
                    <div className={this.state.className}>{this.state.csvName}</div>
                    <a href={this.state.href} target="_blank">
                        <button className='next-butt' onClick={this.handleSubmit}>Next</button>
                    </a>         
                </div>
            )
        }
        return (
            <div className="csv-container">
                <link href="https://fonts.googleapis.com/css?family=Montserrat:600&display=swap" rel="stylesheet" />
                <div className={this.state.className}>{this.state.csvName}</div>
                <input
                    className={'csv-input'}
                    id="csv-id"
                    type="file" accept=".csv"
                    onChange={e => { this.handleFileSelect(e.target.files[0]) }}
                />
                <label for="csv-id">
                    {this.state.buttonText}
                </label>

            </div>
        )
    }

}
export default csvReader;