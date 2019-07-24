import React, { Component } from 'react';
import '../styles/loadingModal.css'


class LoadingModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            percent: 0,
        }
    }
    render() {
        return (
            <div className='modal-inner'>
                <div className='loadingmodal-wrapper'>
                    <div className="loading-etaInfo">
                        <span className="percentage">{this.state.percent}%</span>
                    </div>
                    <div className="node-loader">
                        <span className="node"></span>
                        <span className="node"></span>
                        <span className="node"></span>
                        <span className="node"></span>
                        <span className="node"></span>
                        <span className="node"></span>
                        <span className="node"></span>
                        <span className="node"></span>
                        <span className="node"></span>
                        <span className="node"></span>
                        <span className="node"></span>
                        <span className="node"></span>
                        <span className="node"></span>
                        <span className="node"></span>
                        <span className="node"></span>
                        <span className="node"></span>
                        <span className="node"></span>
                        <span className="node"></span>
                    </div>
            </div>
            </div>
            
            
        )
    }
}

export default LoadingModal