import React, { Component } from 'react';
import { storage } from '../config/index';

class FileUpload extends React.Component{
    constructor(props){
        super(props)
        this.state={
            jobcode: "20190805-P6Y97MD1",
            filename:"filtered_batch_corrected_data.csv",
        }
    }
  
    render(){
        let file = require(`../csvDatabase/${this.state.jobcode}/results/${this.state.filename}`)
        return(
            <div>
                <a href={file}>{`download ${this.state.filename}`}</a>
            </div>
        )
    }
}
export default FileUpload;