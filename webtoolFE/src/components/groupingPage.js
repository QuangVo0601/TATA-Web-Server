import React from "react";
import {
    withRouter
  } from 'react-router-dom'
import "../styles/tata.css";
import Footer from './botNav';
import axios from 'axios'; // to send data to back end
import Select from "react-select"; // to use dropbox
import Popup from './gtexModal';
import Loading from './loadingModal'

class GroupingPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            blur: 'flex-container3',
            // this to send back
            groupLists: [],
            // For modal progess bar handle
            percent: 0,
            showModal: false,
            divState: 'groupflex-section',
            // to store GTEx
            gtexQueries: [],
            //by default is 2 groups (1st group is control group)
            groupLabel: '2 groups',
            // For dropdown box option
            numberOfGroupsOptions: [{ value: 2, label: "2 groups" },
            { value: 3, label: "3 groups" },
            { value: 4, label: "4 groups" },
            { value: 5, label: "5 groups" },
            { value: 6, label: "6 groups" },
            { value: 7, label: "7 groups" },
            { value: 8, label: "8 groups" },
            { value: 9, label: "9 groups" },
            { value: 10, label: "10 groups" }],
            // Default html format
            dndGroup: {
                // replace() to eliminate line break
                'samples': (localStorage.getItem('pca_text').replace(/(\r\n|\n|\r)/gm,"")).split(','),
                'Control group': [],
                '2': []
            },
            // To store created GTEx
            gtexGroup: {},

            // ----- For drag and drop ----- //
            dragFrom: '',
            selectedNumberOfGroups: [],
            // ----- drag and drop section end ----- //

            // For popup
            showGTExPopup: false,

            dndSelectedValue: {},

            // to control groupname 
            groupName: ['Control group', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
            controlgroupname: 'Control group',

            /*--------Quang's part, Phuong em don't delete this pls-------*/
            //dummy group list to send to back end
            // dummy_group_lists: [['Control group', '#Patient1 (Gene Score)', '#Patient3', '#Patient5'],
            // ['group1', '#Patient2', '#Patient4'],
            // ['group2', '#Patient6', '#Patient7']],
            href: "",
            /*-------------------Quang's part ends-------------------------*/
        };
        this.myRef={}
    }

    // gtex group handler
    handleGtex = (name, array, gtexQuery) => {
        this.state.gtexGroup[name] = array
        this.state.gtexQueries.push(gtexQuery) // new added 
    }

    // If reset group, reset those states
    handleResetGroup = () => {
        let newO = {
            'samples': localStorage.getItem('pca_text').split(','),
            'Control group': [],
            '2': []
        }
        this.setState({
            dndGroup: newO,
            selectedNumberOfGroups: [],
            groupLabel: '2 groups'
        });
    }

    // Set gtex dict to empty if reset gtex is clicked
    handleResetGtex = () => {
        this.setState({ gtexGroup: {}, gtexQueries: {} })
    }

    // This method is used to store new number of groups from Select dropbox
    handleChange = (selected) => {
        let oldO = this.state.dndGroup
        let newO = {
            'samples': [],
            'Control group': [],
            '2': []
        }
        let newA = []
        for (let i = 3; i <= selected.value; i++) {
            newA.push([`${i}`])
            newO[`${i}`] = []
        }
        Object.keys(oldO).map(key => {
            if (newO.hasOwnProperty(key)) {
                oldO[key].map(item => {
                    newO[key].push(item)
                })
            }
            else {
                oldO[key].map(item => {
                    newO['samples'].push(item)
                })
            }
        })
        this.setState({
            groupLabel: selected.labbel,
            dndGroup: newO,
            selectedNumberOfGroups: newA
        });
    }

    // ---------- for Drag and Drop ------------- //
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
        if (this.state.dragFrom == 'samples' && this.state) {
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
            newObject[`${this.state.dragFrom}`] = removeData
            newObject[`${id}`] = addData
            this.setState({ dndGroup: newObject })  // added
            let obj = {}
            this.state.dndGroup['samples'].map(item => {
                // added for ui debugged purpose
                // event.target.classList.remove('sample-true')
                // event.target.classList.add('sample-false')
                obj[`${item}`] = false
            })
            this.setState({ dndSelectedValue: obj })
            Object.keys(this.myRef).map(key=>{
                if(this.myRef[key].classList.contains('sample-true') && this.myRef[key]!==null){
                    this.myRef[key].classList.remove('sample-true')
                    this.myRef[key].classList.add('sample-false')
                }
            })
        }
        else if (this.state.dragFrom != 'samples') {
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
    // ----------------- End of Drag and Drop  ------------------- //

    // Give id for those samples
    componentDidMount() {
        let obj = {}
        this.state.dndGroup['samples'].map(item => {
            obj[`${item}`] = false
        })
        this.setState({ dndSelectedValue: obj })
    }

    // -------- Update group name for every onChange ------------- //
    handleGroupName = (event) => {
        event.preventDefault()
    }
    handleNameChange = (event) => {
        let index = parseInt(event.target.id)
        index = index - 1
        let arr = this.state.groupName
        let value = this.state.groupName[(parseInt(event.target.id) - 1)]
        arr[index] = event.target.value
        this.setState({ groupName: arr })
    }
    handleControlGroupName = (event) => {
        this.setState({ controlgroupname: event.target.value }, () => {
            let arr = this.state.groupName
            arr[0] = this.state.controlgroupname
            this.setState({ groupName: arr })
        })

    }
    // -------------- End of update groupname -------------------// 

    // Handle className change for styling when samples is click
    // FIX: UI bug need fixed. sample-false css get override
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


    // ----- To make pop up modals ----- //
    togglePopup() {
        this.setState({ showGTExPopup: (!this.state.showGTExPopup) })
    }
    // loading from grouping to batch
    toggleModalPopup() {
        this.setState({ showModal: (!this.state.showModal)},(()=>{
            if (this.state.showModal) {
            this.setState({blur: 'grouping-blur'})
        }
        }))
    }
    //###############################################################################################
    // include this in continue button handler
    // interval will start on button click
    startProgress() {
        this.toggleModalPopup()
        setInterval(() => {
            this.setState({ percent: this.state.percent += 1.23 })
        }, 1000) 
    } 
    /*
    include this in your axios call then block
    also route to another page using this.props.history.push('/somelink')
    example:
    axios.post('linl', datat).then(()=>{
        this.stopProgress()
        this.props.history.push('/somelink')
    })
    */
    stopProgress= ()=>{
        clearInterval(this.startProgress);
        this.setState({percent:100.00})
    }
    //#################################################################################################
    // ----- End of toggle popup ----- //

    /*--------Quang's part, Phuong em don't delete this pls-------*/
    // handle "Continue" button, go to batchPage.js
    handleGroups = () => { 
        this.startProgress()
        let arr = []
        let control = [this.state.groupName[0]] // index 0 is default to control grroup's name
        this.state.dndGroup['Control group'].forEach(item => {
            control.push(item)
        })
        arr.push(control)
        let groupNumber = Object.keys(this.state.dndGroup).length // checking how many group
        for (let i = 1; i <= groupNumber - 2; i++) {
            let temp = [this.state.groupName[i]]
            let key = (i + 1).toString(10)
            this.state.dndGroup[key].forEach(item => {
                temp.push(item)
            })
            arr.push(temp)
        }
        this.setState({ groupLists: arr }, (() => {
            // sending request to back end need to be together
            //axios call (get in header) to send to back end
            axios.post('http://127.0.0.1:8000/backend/list2', {
                //axios.post('http://oscar19.orc.gmu.edu/backend/list2', {
                groupsList: this.state.groupLists,
                gtexQueries: this.state.gtexQueries
            }).then((arr) => { // to receive data from back end 
                localStorage.setItem('x_uncorrected_pca', JSON.stringify(arr.data.x_uncorrected_pca))
                localStorage.setItem('y_uncorrected_pca', JSON.stringify(arr.data.y_uncorrected_pca))
                localStorage.setItem('x_corrected_pca', JSON.stringify(arr.data.x_corrected_pca))
                localStorage.setItem('y_corrected_pca', JSON.stringify(arr.data.y_corrected_pca))
                localStorage.setItem('group_names_list', JSON.stringify(arr.data.group_names_list))
                
                
            }).then(()=>{
                this.stopProgress()
                this.props.history.push('/batchpage') // auto route to batch page
            })
        }))

    }

    /*-------------------Quang's part ends-------------------------*/

    render() {
        return (
            <div>
                <head>
                    <meta charset="UTF-8" />
                    <title>768 Nav &amp; Footer</title>
                    <link href="https://fonts.googleapis.com/css?family=Montserrat:400,500,700%7COswald:500,600,700&display=swap" rel="stylesheet" />
                </head>

                <body>
                <div className="stepsContainer-group">
						
                        <div id="step1-group">
                            <dt className='direction-dt'>1. Select Number of Groups</dt>
                            <dd className='direction-dd'>Don’t count GTEx in number of groups total and name groups</dd>
                        </div>
                        
                        <div id="step2-group">
                            <dt className='direction-dt'>2. Drag Samples</dt>
                            <dd className='direction-dd'>Drag samples into created groups</dd>
                        </div>
                        
      
                        <div id="step3-group">
                            <dt className='direction-dt'>3. Optional: Create GTEx</dt>
                            <dd className='direction-dd'>Use an unique name for GTEx group </dd>
                        </div>
                   <div id="step4-group">
                            <dt className='direction-dt'>4. Continue</dt>
                            <dd className='direction-dd'>Double check  samples in groups before continuing</dd>
                        
                    </div>
     </div>
                    <div id="wrapper3">
                        <div className={this.state.blur}>
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
                            <div id='groupflex-section'>
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
                                                    ref={(ref)=>{this.myRef[`${sample}`]=ref;}}
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
                                            {this.state.showGTExPopup ?
                                                <Popup
                                                    handleGtex={this.handleGtex}
                                                    closePopup={this.togglePopup.bind(this)}
                                                />
                                                : null
                                            }
                                            {/* <!-- End of pop up module button --> */}
                                            <button onClick={this.handleResetGroup} type="Reset Groups" className="reset_group">Reset All Groups</button>
                                            <button onClick={this.handleResetGtex} type="Reset Groups" className="reset_group">Reset Gtex Groups</button>
                                        </div>
                                    </div>
                                    {/* <!-- end of top of the group bottom section --> */}

                                    {/* <!-- start of all group boxes --> */}
                                    <div className="grid-container" >
                                        <div id="sample-drop-field">
                                            <div id="nav_group2">
                                                <form className="signIn">
                                                    <input
                                                        className="groupingInput"
                                                        type="controlgroup"
                                                        autocomplete='off'
                                                        required
                                                        placeholder="Group Name"
                                                        value={this.state.controlgroupname}
                                                        onChange={this.handleControlGroupName}
                                                    />
                                                    <label className="nullhyp-container">Null Hypothesis</label>
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
                                                <form className="signIn" id='2'>
                                                    <input
                                                        id='2'
                                                        className="groupingInput"
                                                        type="groupname"
                                                        placeholder="Group Name"
                                                        autocomplete='off'
                                                        onChange={this.handleNameChange}
                                                        required
                                                    />
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
                                                        <form
                                                            id={id}
                                                            className="signIn"
                                                            onSubmit={this.handleGroupName}
                                                        >
                                                            <input
                                                                id={id}
                                                                className="groupingInput"
                                                                type="groupname"
                                                                placeholder="Group Name"
                                                                autocomplete='off'
                                                                required
                                                                onChange={this.handleNameChange}
                                                            />
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
                                        {/* <button type="Continue" className="buttontask_cont" onClick={this.toggleModalPopup.bind(this)}>Continue</button> */}
                                        <button type="Continue" className="buttontask_cont" onClick={this.handleGroups}>Continue</button>
                                        {/* <a href={this.state.href} style={{ 'text-decoration': 'none' }}>
                                            
                                        </a> */}
                                    </div>
                                </div>

                                {/* <!-- end of group bottom section --> */}
                            </div>
                        </div>
                        {this.state.showModal ?
                            <Loading
                                percent={this.state.percent}
                            />
                            : null
                        }
                        <Footer />
                    </div>
                </body>
            </div>
        );
    }
}
export default withRouter(GroupingPage);