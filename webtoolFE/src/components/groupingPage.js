import React from "react";
import "../styles/tata.css";
import Footer from './botNav';
//import DragAndDrop from './groupingPageDrag&Drop';
import Select from "react-select"; // to use dropbox
import Popup from './gtexModal';

class GroupingPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            //by default is 2 groups (1st group is control group)
            groupLabel: '2 groups',
            numberOfGroupsOptions: [{ value: 2, label: "2 groups" },
            { value: 3, label: "3 groups" },
            { value: 4, label: "4 groups" },
            { value: 5, label: "5 groups" },
            { value: 6, label: "6 groups" },
            { value: 7, label: "7 groups" },
            { value: 8, label: "8 groups" },
            { value: 9, label: "9 groups" },
            { value: 10, label: "10 groups" }],
            dndGroup: {
                'samples': localStorage.getItem('pca_text').split(','),
                '1': [],
                '2': []
            },
            dragFrom: '',
            selectedNumberOfGroups: [],

            showPopUp: false
        };
    }

    // This method is used to store new number of groups from Select dropbox
    handleChange = (selected) => {
        let newO = {
            'samples': localStorage.getItem('pca_text').split(','),
            '1': [],
            '2': []
        }
        let newA = []
        for (let i = 2; i <= selected.value; i++) {
            if (i < selected.value) { newA.push([`${i}`]) }
            newO[`${i}`] = []
        }
        this.setState({
            groupLabel: selected.labbel,
            dndGroup: newO,
            selectedNumberOfGroups: newA
        });
    }
    onDragStartHandler = (event, value) => {
        console.log(value, 'value is dragged')
        console.log(event.target.id, 'id is dragged')
        this.setState({ dragFrom: event.target.id })//store which array data is removed from
        event.dataTransfer.setData("value", value)//store value in event object

    }
    onDropHandler = (event) => {
        let newObject = this.state.dndGroup//create new objectt
        const data = event.dataTransfer.getData("value")//get value from event object
        const id = event.target.id //getting dropped to id
        console.log(event, 'this is event')
        console.log(event.target, 'this is target')
        console.log(id, 'id is in drop')
        const removeData = this.state.dndGroup[`${this.state.dragFrom}`].filter(value => {
            return value != data
        })
        newObject[`${this.state.dragFrom}`] = removeData
        newObject[`${id}`].push(data)
        this.setState({ dndGroup: newObject })

    }
    onDragOverHandler = (event) => {
        event.preventDefault()//stop everything from happening at once
    }


    // To make pop up module
    togglePopup() {
        this.setState({ showPopup: (!this.state.showPopup) })
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
                                                    <dt><div className="active2">Exploratory Plots</div></dt>
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
                                    <div
                                        className="all1"
                                        id="samples"
                                        onDragOver={event => this.onDragOverHandler(event)}
                                        onDrop={event => this.onDropHandler(event)}
                                    >
                                        <ul>
                                            {/* Samples input code goes here */}
                                            {this.state.dndGroup['samples'].map((sample) => (
                                                <li
                                                    id='samples'
                                                    draggable
                                                    onDragStart={event => this.onDragStartHandler(event, sample)}
                                                >
                                                    <label className="sample-container">
                                                        <span className="grippy"></span> {sample}
                                                        <input type="checkbox" checked="checked" />
                                                        <span className="checkmark-sample"></span>
                                                    </label>
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
                                            <Select
                                                placeholder="Number of Groups"
                                                value={this.state.groupLabel}
                                                onChange={this.handleChange}
                                                options={this.state.numberOfGroupsOptions}
                                            />

                                        </div>
                                        {/* <!-- group gtex & reset --> */}
                                        <div id="group-button">

                                            {/* <!-- Start of pop up module button --> */}
                                            <button
                                                type="Create Gtext Group"
                                                className="gtex_group"
                                                onClick={this.togglePopup.bind(this)}
                                            >
                                                Create Gtex Group
                                            </button>
                                            {this.state.showPopup ?
                                                <Popup
                                                    closePopup={this.togglePopup.bind(this)}
                                                />
                                                : null
                                            }
                                            {/* <!-- End of pop up module button --> */}

                                            <button type="Reset Groups" className="reset_group">Reset Groups</button>
                                        </div>
                                    </div>
                                    {/* <!-- end of top of the group bottom section --> */}

                                    {/* <!-- start of all group boxes --> */}
                                    <div className="grid-container" >
                                        <div id="sample-drop-field">
                                            <div id="nav_group2">
                                                <form className="signIn">
                                                    <input type="controlgroup" placeholder="Control Group" autocomplete='off' required />
                                                    <label className="container">Null Hypothesis</label>
                                                </form>
                                            </div>
                                            <div
                                                className="group-box" id='1'
                                                onDragOver={event => this.onDragOverHandler(event)}
                                                onDrop={event => this.onDropHandler(event)}
                                            >
                                                <div className="data-draggable" id="1">
                                                    {this.state.dndGroup['1'].map((sample) => {
                                                        return (
                                                            <li
                                                                id='1'
                                                                draggable
                                                                onDragStart={event => this.onDragStartHandler(event, sample)}
                                                            >
                                                                <label className="sample-container">
                                                                    <span className="grippy"></span> {sample}
                                                                    <input type="checkbox" checked="checked" />
                                                                    <span className="checkmark-sample"></span>
                                                                </label>
                                                            </li>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        </div>

                                        {/* <!--  --> */}

                                        <div id="sample-drop-field">
                                            <div id="nav_group2">
                                                <form className="signIn">
                                                    <input type="groupname" placeholder="Group Name" autocomplete='off' required />
                                                </form>
                                            </div>
                                            <div className="group-box" id='2'
                                                onDragOver={event => this.onDragOverHandler(event)}
                                                onDrop={event => this.onDropHandler(event)}>
                                                <div className="data-draggable" id="2">
                                                    {this.state.dndGroup['2'].map((sample) => {
                                                        return (
                                                            <li
                                                                id='2'
                                                                draggable
                                                                onDragStart={event => this.onDragStartHandler(event, sample)}
                                                            >
                                                                <label className="sample-container">
                                                                    <span className="grippy"></span> {sample}
                                                                    <input type="checkbox" checked="checked" />
                                                                    <span className="checkmark-sample"></span>
                                                                </label>
                                                            </li>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Start of populating group boxes after selecting number of groups*/}
                                        {this.state.selectedNumberOfGroups.map((id) => {
                                            return (
                                                <div id="sample-drop-field">
                                                    <div id="nav_group2">
                                                        <form className="signIn">
                                                            <input type="groupname" placeholder="Group Name" autocomplete='off' required />
                                                        </form>
                                                    </div>
                                                    <div className="group-box" id={id}
                                                        onDragOver={event => this.onDragOverHandler(event)}
                                                        onDrop={event => this.onDropHandler(event)}>
                                                        <div className="data-draggable" id={id}>
                                                            {this.state.dndGroup[id].map((sample) => {
                                                                return (
                                                                    <li
                                                                        id={id}
                                                                        draggable
                                                                        onDragStart={event => this.onDragStartHandler(event, sample)}
                                                                    >
                                                                        <label className="sample-container">
                                                                            <span className="grippy"></span> {sample}
                                                                            <input type="checkbox" checked="checked" />
                                                                            <span className="checkmark-sample"></span>
                                                                        </label>
                                                                    </li>
                                                                )
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                        {/* End of populating group boxes after selecting number of groups*/}

                                        {/* <!-- div below is the div for the .gridcontainer --> */}
                                    </div>
                                    {/* <!--............................... --> */}

                                    <div className="nav_container3">
                                        <a href='/batchpage'><button type="Continue" className="buttontask_cont">Continue</button></a>
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