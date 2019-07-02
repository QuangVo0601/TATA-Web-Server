import React from "react";
import "../styles/tata.css";
import Footer from './botNav';
import DragAndDrop from './groupingPageDrag&Drop';

class GroupingPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            samples: localStorage.getItem('pca_text').split(',')
        }
    }

    // As soon as the page routes, it executes
    componentDidMount() {
        // console.log(this.state.samples) // Test if this.state.samples is array
        DragAndDrop() // enable drag and drop functionality
    }

    render() {
        return (
            <div>
                <head>
                    <meta charset="UTF-8" />
                    <title>768 Nav &amp; Footer</title>
                    <link href="tata.css" rel="stylesheet" />
                </head>

                <body>
                <div id="wrapper3">
                    <div className="flex-container3">
                        <div id="content">
                            <div id="nav3">
                                <div id="logo">
                                    <img src={require('../assets/Group 257.png')} width="46px" height="46px" alt="logo" />
                                </div>
                                {/* <!--end of log--> */}

                                <div id="mainnav">
                                    <div id="circles">
                                        <ul>
                                            <li><span className="circles" id="complete">1</span></li>
                                            <li><div className="line1" id="active3"></div></li>
                                            <li><span className="circles" id="complete" >2</span></li>
                                            <li><div className="line1" id="active3"></div></li>
                                            <li><span className="circles" id="active">3</span></li>
                                            <li><div className="line"></div></li>
                                            <li><span className="circles">4</span></li>
                                            <li><div className="line"></div></li>
                                            <li><span className="circles">5</span></li>
                                        </ul>
                                    </div>
                                    {/* <!--end of circles--> */}

                                    <div id="stepnav">
                                        <dl>
                                            <div id="task">
                                                <dt><div className="active2">Initial Validation</div></dt>
                                                <dt><div className="active2">Choose Task</div></dt>
                                                <dt><div className="active2">Group Samples</div></dt>
                                                <dd>Group Samples & create Gtex group</dd>
                                            </div>
                                            {/* <!--end of task--> */}

                                            <div id="samples">
                                                <dt>Choose Batch Correction</dt>
                                                <dd>Choose correction & View Plots</dd>
                                                <dt>Algorithms & Tuning Parameters</dt>
                                                <dd>Choose algoithims & set parameters</dd>
                                            </div>
                                            {/* <!--end of samples--> */}
                                        </dl>
                                    </div>
                                    {/* <!--end of stepnav--> */}
                                </div>
                                {/* <!--end of mainnav--> */}
                            </div>
                            {/* <!--end of nav--> */}

                        </div>
                        <div id="groupflex-section">
                            {/* <!-- samples section --> */}
                            <div id="sample-section">
                                <div id="all1">
                                    <ul data-draggable="target">
                                        {/* Samples input code goes here */}
                                        {this.state.samples.map((sample) => (
                                            <li data-draggable="item"><label className="sample-container"><span className="grippy"></span> {sample}
								<input type="checkbox" checked="checked" />
                                            <span className="checkmark-sample"></span></label>
                                        </li>
                                        ))}
                                        {/* End of JSX dynamic code */}
                                    </ul>
                                </div>
                            </div>

                            {/* <!--  group bottom section --> */}
                            <div id="group-section">
                                <div id="nav_group1">
                                    <div className="styled-select rounded">
                                        <select>
                                            <option>Number of Groups</option>
                                            <option>The second option</option>
                                        </select>
                                    </div>
                                    {/* <!-- group gtex & reset --> */}
                                    <div id="group-button">
                                        <button type="Create Gtext Group" className="gtex_group">Create Gtex Group</button>
                                        <button type="Reset Groups" className="reset_group">Reset Groups</button>
                                    </div>
                                </div>
                                {/* <!-- end of top of the group bottom section --> */}
                                {/* <!--    - --> */}
                                <div className="grid-container">
                                    <div id="sample-drop-field">
                                        <div id="nav_group2">
                                            <form className="signIn">
                                                <input type="controlgroup" placeholder="Control Group" autocomplete='off' required />
                                                <label className="container">Null Hypothesis</label>
                                            </form>
                                        </div>
                                        <div id="group-box">
                                            <ol data-draggable="target">
                                            </ol>
                                        </div>
                                    </div>

                                    {/* <!--  --> */}

                                    <div id="sample-drop-field">
                                        <div id="nav_group2">
                                            <form className="signIn">
                                                <input type="groupname" placeholder="Group Name" autocomplete='off' required />
                                            </form>
                                        </div>
                                        <div id="group-box">
                                            <ol data-draggable="target">
                                            </ol>
                                        </div>
                                    </div>

                                    {/* <!--  --> */}

                                    <div id="sample-drop-field">
                                        <div id="nav_group2">
                                            <form className="signIn">
                                                <input type="groupname" placeholder="Group Name" autocomplete='off' required />
                                            </form>
                                        </div>
                                        <div id="group-box">
                                            <ol data-draggable="target">
                                            </ol>
                                        </div>
                                    </div>
                                    <div id="sample-drop-field">
                                        <div id="nav_group2">
                                            <form className="signIn">
                                                <input type="groupname" placeholder="Group Name" autocomplete='off' required />
                                            </form>
                                        </div>
                                        <div id="group-box">
                                            <ol data-draggable="target">
                                            </ol>
                                        </div>
                                    </div>
                                    {/* <!--  --> */}
                                    <div id="sample-drop-field">
                                        <div id="nav_group2">
                                            <form className="signIn">
                                                <input type="groupname" placeholder="Group Name" autocomplete='off' required />
                                            </form>
                                        </div>
                                        <div id="group-box">
                                            <ol data-draggable="target">
                                            </ol>
                                        </div>
                                    </div>
                                    {/* <!--  --> */}
                                    <div id="sample-drop-field">
                                        <div id="nav_group2">
                                            <form className="signIn">
                                                <input type="groupname" placeholder="Group Name" autocomplete='off' required />
                                            </form>
                                        </div>
                                        <div id="group-box">
                                            <ol data-draggable="target">
                                            </ol>
                                        </div>
                                    </div>
                                    {/* <!--  --> */}
                                    <div id="sample-drop-field">
                                        <div id="nav_group2">
                                            <form className="signIn">
                                                <input type="groupname" placeholder="Group Name" autocomplete='off' required />
                                            </form>
                                        </div>
                                        <div id="group-box">
                                            <ol data-draggable="target">
                                            </ol>
                                        </div>
                                    </div>
                                    {/* <!--  --> */}
                                    <div id="sample-drop-field">
                                        <div id="nav_group2">
                                            <form className="signIn">
                                                <input type="groupname" placeholder="Group Name" autocomplete='off' required />
                                            </form>
                                        </div>
                                        <div id="group-box">
                                            <ol data-draggable="target">
                                            </ol>
                                        </div>
                                    </div>
                                    {/* <!--  --> */}
                                    <div id="sample-drop-field">
                                        <div id="nav_group2">
                                            <form className="signIn">
                                                <input type="groupname" placeholder="Group Name" autocomplete='off' required />
                                            </form>
                                        </div>
                                        <div id="group-box">
                                            <ol data-draggable="target">
                                            </ol>
                                        </div>
                                    </div>
                                    {/* <!--  --> */}
                                    <div id="sample-drop-field">
                                        <div id="nav_group2">
                                            <form className="signIn">
                                                <input type="groupname" placeholder="Group Name" autocomplete='off' required />
                                            </form>
                                        </div>
                                        <div id="group-box">
                                            <ol data-draggable="target">
                                            </ol>
                                        </div>
                                    </div>
                                    {/* <!--  --> */}
                                    {/* <!--  --> */}
                                    {/* <!-- div below is the div for the .gridcontainer --> */}
                                </div>
                                {/* <!--............................... --> */}

                                <div className="nav_container3">
                                    <button type="Continue" className="buttontask_cont">Continue</button>
                                </div>
                            </div>

                            {/* <!-- end of group bottom section --> */}
                        </div>

                    </div>
                    <Footer />
                </div>
                </body>
            </div>
        );
    }
}
export default GroupingPage;