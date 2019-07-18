import React from "react";
import "../styles/resultPage.css";
import Footer from './botNav';

class ResultPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            current: 'Validation'
        }

    }

    render() {
        return (
            <div>
                <head>
                    <meta charSet="UTF-8" />
                    <title>Untitled Document</title>
                    <link rel="stylesheet" href="result.css" />
                    <link href="https://fonts.googleapis.com/css?family=Montserrat:400,500,700|Oswald&display=swap" rel="stylesheet" />
                </head>

                <body>
                    <div id="wrapper-result">
                        <nav>
                            <div id="sidenav-content">
                                <div id="tatalogo">
                                    <img src={require('../assets/Group 257.png')} alt="tatalogo" width="48px" height="49px" />
                                </div>
                                <div id="graph-selection">
                                    <div id="result-validation">
                                        <button type="Continue" className="button-result">Exploratory Plots</button>
                                    </div>
                                    <div id="result-batch">
                                        <button type="Continue" className="button-result">Batch Correction</button>
                                    </div>
                                    <div id="result-final">
                                        <button type="Continue" className="button-result">Final Plots</button>
                                    </div>
                                    <div id="result-table">
                                        <button type="Continue" className="button-result">Results Table</button>
                                    </div>                                    
                                    <div id="download-data">
                                        <button type="Continue" className="download">Download Data</button>
                                    </div>
                                    <div id="delete-data">
                                        <button type="Continue" className="delete">Delete Data</button>
                                    </div>
                                </div>
                                <div id="graphresult-content">
                                    <p>Your data will be stored for 30 days and can be accessed for download during that time.  If you would like to download all of the analyzed data as CSV files, please click on the <em> “Download Data”</em> button.</p>

                                    <p>Please note that each graph must be downloaded separately if you would like to keep and use it.</p>

                                    <p>If you would like to remove your data from our database prior to the 30 day timeline you may do that here as well.  Note that once you delete your data will no longer be able to access the data using your job code. </p>
                                </div>
                            </div>
                        </nav>
                        <article>
                            <div id="graph-display">
                                <div className="graph-result">
                                </div>
                                <div className="graph-result">
                                </div>
                                <div className="graph-result">
                                </div>
                            </div>
                        </article>
                    </div>
                    <Footer />
                </body>
            </div>
        );
    }
}
export default ResultPage;       