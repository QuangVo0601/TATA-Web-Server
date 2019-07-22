import React from "react";
import "../styles/tata.css";
import Footer from './botNav';
import axios from 'axios'; // to send data to back end
import Select from "react-select"; // to use dropbox
import Popup from './gtexModal';

class GroupingPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            gtexQueries: [], // new added 
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
                'Control group': [],
                '2': []
            },
            //sampleCLick: false,
            gtexGroup: {},
            dragFrom: '',
            selectedNumberOfGroups: [],

            showPopUp: false,
            dndSelectedValue: {},

            /*--------Quang's part, Phuong em don't delete this pls-------*/
            //dummy group list to send to back end
            dummy_group_lists: [['Control group', '#Patient1 (Gene Score)', '#Patient3', '#Patient5'],
            ['group1', '#Patient2', '#Patient4'],
            ['group2', '#Patient6', '#Patient7']],

            dummy_gtexGroup_lists: [['gtex group 1', 'GTEX-11DXW-0008-SM-5Q59V', 'GTEX-11DXW-0226-SM-5H122', 'GTEX-11DXW-0826-SM-5H118']
            ['gtex group 2', 'GTEX-15CHC-0826-SM-686YW', 'GTEX-15CHQ-0226-SM-6EU2S', 'GTEX-15CHQ-1126-SM-686YY', 'GTEX-15CHR-0626-SM-7938V']],
            href: "",
            /*-------------------Quang's part ends-------------------------*/
        };
    }

    // gtex group handler
    handleGtex = (name, array, gtexQuery) => {
        this.state.gtexGroup[name] = array
        this.state.gtexQueries.push(gtexQuery) // new added 
    }

    handleResetGtex = () => {
        this.setState({ gtexGroup: {} , gtexQueries:{}})
    }

    // This method is used to store new number of groups from Select dropbox
    handleChange = (selected) => {
        let newO = {
            'samples': localStorage.getItem('pca_text').split(','),
            'Control group': [],
            '2': []
        }
        let newA = []
        for (let i = 3; i <= selected.value; i++) {
            newA.push([`${i}`])
            newO[`${i}`] = []
        }
        this.setState({
            groupLabel: selected.labbel,
            dndGroup: newO,
            selectedNumberOfGroups: newA
        });
    }
    
    // for Drag and Drop
    onDragStartHandler = (event, value) => {
        console.log(value, 'value is dragged')
        console.log(event.target.id, 'id is dragged')
        this.setState({ dragFrom: event.target.id }) //store which array data is removed from
        event.dataTransfer.setData("value", value) //store value in event object

    }
    onDropHandler = (event) => {
        let newObject = this.state.dndGroup //create new objectt
        const data = event.dataTransfer.getData("value") //get value from event object
        const id = event.target.id //getting dropped to id
        console.log(event, 'this is event')
        console.log(event.target, 'this is target')
        console.log(id, 'id is in drop')
        if (this.state.dragFrom == 'samples' && this.state) {
            console.log('multi drag from samples')
            const removeData = []
            const addData = this.state.dndGroup[`${id}`]
            this.state.dndGroup[`${this.state.dragFrom}`].map((item) => {
                if (this.state.dndSelectedValue[`${item}`]) {
                    addData.push(item)
                }
                else if (!this.state.dndSelectedValue[`${item}`]) {
                    removeData.push(item)
                }
            })
            console.log(removeData)
            newObject[`${this.state.dragFrom}`] = removeData
            newObject[`${id}`] = addData
            this.setState({ dndGroup: newObject })  // added
        }
        else if(this.state.dragFrom != 'samples'){
            const removeData = this.state.dndGroup[`${this.state.dragFrom}`].filter(value => {
                return value != data
            })
            newObject[`${this.state.dragFrom}`] = removeData
            newObject[`${id}`].push(data)
            this.setState({ dndGroup: newObject })    
        }

    }

    onDragOverHandler = (event) => {
        event.preventDefault() //stop everything from happening at once
    }
   // End of Drag and Drop 

    componentDidMount() {
        let obj = {}
        this.state.dndGroup['samples'].map(item => {
            obj[`${item}`] = false
        })
        this.setState({ dndSelectedValue: obj })
    }
 
    handleDnDSelect = (event, sample) => {
        console.log(event.target.classList)
        let obj = this.state.dndSelectedValue
        obj[sample] = !obj[sample]
        if (obj[sample]) {
            event.target.classList.remove('sample-false')
            event.target.classList.add('sample-true')
        }
        if (!obj[sample]) {
            event.target.classList.remove('sample-true')
            event.target.classList.add('sample-false')
        }
        this.setState({ dndSelectedValue: obj })
    }


    // To make pop up module
    togglePopup() {
        this.setState({ showPopup: (!this.state.showPopup) })
    }

    /*--------Quang's part, Phuong em don't delete this pls-------*/
    // handle "Continue" button, go to batchPage.js
    handleGroups = () => {
        // sending request to back end need to be together
        //axios call (get in header) to send to back end
        axios.post('http://127.0.0.1:8000/backend/list2', {
            //axios.post('http://oscar19.orc.gmu.edu/backend/list2', {
            groupsList: this.state.dummy_group_lists,
            gtexQueries: this.state.gtexQueries
        }).then((arr) => { // to receive data from back end 
            localStorage.setItem('x_uncorrected_pca', JSON.stringify(arr.data.x_uncorrected_pca))
            localStorage.setItem('y_uncorrected_pca', JSON.stringify(arr.data.y_uncorrected_pca))
            localStorage.setItem('x_corrected_pca', JSON.stringify(arr.data.x_corrected_pca))
            localStorage.setItem('y_corrected_pca', JSON.stringify(arr.data.y_corrected_pca))
            localStorage.setItem('group_names_list', JSON.stringify(arr.data.group_names_list))
        })
        this.setState({ href: '/batchpage' })
    }

    /*-------------------Quang's part ends-------------------------*/

    render() {
        return (
            <div>
                <head>
                    <meta charset="UTF-8" />
                    <title>768 Nav &amp; Footer</title>
                    <link href="https://fonts.googleapis.com/css?family=Montserrat:400,500,700%7COswald:500,600,700&display=swap" rel="stylesheet"/>
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
                                                    className="sample-false"
                                                    id='samples'
                                                    draggable
                                                    onDragStart={event => this.onDragStartHandler(event, sample)}
                                                    onClick={event => this.handleDnDSelect(event, sample)}
                                                >
                                                    <span className="grippy"></span> {sample}
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
                                                placeholder="# of Groups"
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
                                                    handleGtex={this.handleGtex}
                                                    closePopup={this.togglePopup.bind(this)}
                                                />
                                                : null
                                            }
                                            {/* <!-- End of pop up module button --> */}
                                            <button type="Reset Groups" className="reset_group">Reset All Groups</button>
                                            <button onClick={this.handleResetGtex} type="Reset Groups" className="reset_group">Reset Gtex Groups</button>
                                        </div>
                                    </div>
                                    {/* <!-- end of top of the group bottom section --> */}

                                    {/* <!-- start of all group boxes --> */}
                                    <div className="grid-container" >
                                        <div id="sample-drop-field">
                                            <div id="nav_group2">
                                                <form className="signIn">
                                                    <input className="groupingInput" type="controlgroup" placeholder="Control Group" autocomplete='off' required />
                                                    <label className="container">Null Hypothesis</label>
                                                </form>
                                            </div>
                                            <div
                                                className="group-box" id='Control group'
                                                onDragOver={event => this.onDragOverHandler(event)}
                                                onDrop={event => this.onDropHandler(event)}
                                            >
                                                <div className="data-draggable" id="Control group">
                                                    {this.state.dndGroup['Control group'].map((sample) => {
                                                        return (
                                                            <li
                                                                className='sample-false'
                                                                id='Control group'
                                                                draggable
                                                                onDragStart={event => this.onDragStartHandler(event, sample)}
                                                            >
                                                                    <span className="grippy"></span> {sample}
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
                                                    <input className="groupingInput" type="groupname" placeholder="Group Name" autocomplete='off' required />
                                                </form>
                                            </div>
                                            <div className="group-box" id='2'
                                                onDragOver={event => this.onDragOverHandler(event)}
                                                onDrop={event => this.onDropHandler(event)}>
                                                <div className="data-draggable" id="2">
                                                    {this.state.dndGroup['2'].map((sample) => {
                                                        return (
                                                            <li
                                                                className='sample-false'
                                                                id='2'
                                                                draggable
                                                                onDragStart={event => this.onDragStartHandler(event, sample)}
                                                            >
                                                                    <span className="grippy"></span> {sample}
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
                                                            <input className="groupingInput" type="groupname" placeholder="Group Name" autocomplete='off' required />
                                                        </form>
                                                    </div>
                                                    <div className="group-box" id={id}
                                                        onDragOver={event => this.onDragOverHandler(event)}
                                                        onDrop={event => this.onDropHandler(event)}>
                                                        <div className="data-draggable" id={id}>
                                                            {this.state.dndGroup[id].map((sample) => {
                                                                return (
                                                                    <li
                                                                        className='sample-false'
                                                                        id={id}
                                                                        draggable
                                                                        onDragStart={event => this.onDragStartHandler(event, sample)}
                                                                    >
                                                                            <span className="grippy"></span> {sample}
                                                                    </li>
                                                                )
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                        {/* End of populating group boxes after selecting number of groups*/}

                                        {/* Start of populating gtex group boxes after selecting number of groups*/}
                                        {Object.keys(this.state.gtexGroup).map((key) => {
                                            return (
                                                <div id="sample-drop-field">
                                                    <div id="nav_group2">
                                                        <form className="signIn">
                                                            {key}
                                                        </form>
                                                    </div>
                                                    <div className="group-box" >
                                                        <div className="data-draggable" >
                                                            {this.state.gtexGroup[key].map((sample) => {
                                                                return (
                                                                    <li className='sample-false'
                                                                    >
                                                                      
                                                                            <span className="grippy"></span> {sample}
                                                                       
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
                                        <a href={this.state.href} style={{ 'text-decoration': 'none' }}>
                                            <button type="Continue" className="buttontask_cont" onClick={this.handleGroups}>Continue</button>
                                        </a>
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