import React, { Component } from 'react';
import '../styles/loadingModal.css'


class LoadingModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    render() {
        return (
            <div className='modal-inner'>
                <div className='loadingmodal-wrapper'>
                    <div className="loading-etaInfo">
                        <span className="percentage">{this.props.percent.toFixed(2)}%</span>
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