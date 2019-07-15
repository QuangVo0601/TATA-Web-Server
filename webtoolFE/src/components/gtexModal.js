import React, { Component } from "react";
import Multiselect from 'react-multiselect-checkboxes'
import "../styles/tata.css";
import axios from 'axios'; // to send data to back end



class GtexModule extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            gtexGroupName: "",
            sampleCount: 0,
            // ---- //
            ageOpt: [
                { label: "20-29", value: "20-29" },
                { label: "30-39", value: "30-39" },
                { label: "40-49", value: "40-49" },
                { label: "50-59", value: "50-59" },
                { label: "60-69", value: "60-69" },
                { label: "70-79", value: "70-79" },
            ],
            ages: [],
            // ---- //

            sexOpt: [
                { label: "Male", value: "Male" },
                { label: "Female", value: "Female" }
            ],
            sex: [],
            // ---- //

            deathOpt: [
                { label: "Ill Chronic", value: "Ill Chronic" },
                { label: "Ventilator", value: "Ventilator" },
                { label: "Fast Violent", value: "Fast Violent" },
                { label: "Ill Unexpected", value: "Ill Unexpected" },
                { label: "Fast Natural", value: "Fast Natural" },
            ],
            death: [],
            // ---- //

            tissue1: ['Adipose Tissue', 'Adrenal Gland', 'Bladder', 'Brain', 'Breast', 'Cervix Uteri', 'Colon', 'Esophagus',
                'Fallopian Tube', 'Heart', 'Kidney', 'Liver', 'Lung', 'Muscle', 'Nerve'],
            tissue2: ['Ovary', 'Pancreas', 'Pituitary', 'Prostate', 'Salivary Gland', 'Skin', 'Small Intestine', 'Spleen',
                'Stomach', 'Testis', 'Thyroid', 'Uterus', 'Vagina', 'Whole Blood'],
            tissueType: [],
            tissueObj: {},
        }
        this.handleGtexGroupName = this.handleGtexGroupName.bind(this);

    }
    componentDidMount() {
        this.handleTissueState()
    }


    // Age update handling
    handleAgeOnChange = (selected) => {
        console.log(selected)
        let arr = []
        selected.forEach(element => {
            arr.push(element.value)
        })
        this.setState({ ages: arr })
    }
    // Sex update handling
    handleSexOnChange = (selected) => {
        let arr = []
        for (let i = 0; i < selected.length; i++) {
            arr.push(selected[i].value)
        }
        this.setState({ sex: arr });
    }
    // Death update handling
    handleDeathOnChange = (selected) => {
        let arr = []
        for (let i = 0; i < selected.length; i++) {
            arr.push(selected[i].value)
        }
        this.setState({ death: arr });
    }

    /* For Tissue type handling */
    handleTissueState() {
        let obj = this.state.tissueObj
        this.state.tissue1.map((item) => {
            obj[item] = false
        })
        this.state.tissue2.map((item) => {
            obj[item] = false
        })
        this.setState({ tissueObj: obj })
    }

    handleTissueClick = (event, key) => {
        let o = this.state.tissueObj
        o[key] = !o[key]
        if (o[key]) {
            event.target.classList.add('selectedLI')
        }
        if (!o[key]) {
            event.target.classList.remove('selectedLI')
        }
        this.setState({ tissueObj: o })

    }

    // toggle 'create' button
    createHandler = () => {
        let arr = []
        this.state.tissue1.forEach(item => {
            if (this.state.tissueObj[item]) {
                arr.push(item)
            }
        })
        this.state.tissue2.forEach(item => {
            if (this.state.tissueObj[item]) {
                arr.push(item)
            }
        })
        this.setState({ tissueType: arr },
            () => {
                this.axiosCall()
            }

        )
    }

    axiosCall() {
        axios.post('http://127.0.0.1:8000/backend/detail', {
        //axios.post('http://oscar19.orc.gmu.edu/backend/detail', {
            gtex: [[], this.state.sex, this.state.ages, this.state.death, [], this.state.tissueType]
        }).then((arr) => { // to receive data from back end 
            this.setState({sampleCount: arr.data.sample_count}) // receive sample count from back end
        })
    }

    /* End of tissue type handling */

    handleRefreshButton = () =>{

    }

    // this stores the gtex group name entered by the user
    handleGtexGroupName(event) {
        this.setState({gtexGroupName: event.target.value});
    }

    render() {
        return (
            <div>
                <div className="popup-inner">
                    <head>
                        <meta charset="UTF-8" />
                        <title>gtex group</title>
                        <link href="gtex.css" rel="stylesheet" />
                        <meta name="viewport" content="width=device-width, initial-scale=1" />
                        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
                        <link href="https://fonts.googleapis.com/css?family=Montserrat:400,700|Oswald&display=swap" rel="stylesheet" />
                        <link href="https://fonts.googleapis.com/css?family=Montserrat:400,500,600,700&display=swap" rel="stylesheet" />

                    </head>
                    <body>
                        <div id="wrapper4">
                            <div id="topcontent">
                                <div id="gtex">
                                    <h1>Select Gtex <br />Characteristics</h1>
                                </div>
                                <div id="controlgroup">
                                    <h2>GTEX Group Name:</h2>
                                    {/* <input type="controlgroup" placeholder="" autocomplete="off" required /> */}
                                    <input type="text" value={this.state.gtexGroupName} onChange={this.handleGtexGroupName} />
                                </div>
                                <div id="sample">
                                    <h2>Sample Count:</h2>
                                    <div className="sample2">
                                        <h3>{this.state.sampleCount}</h3>
                                        {/*refresh button part starts*/}
                                        <button id="refresh" onClick={this.createHandler}><i className="fa fa-refresh" style={{ 'font-size': '20px' }}></i>
                                            <span className="text-block">
                                                Refresh sample count
                                        </span>
                                        </button>
                                        {/*refresh button part ends*/}
                                    </div>
                                </div>
                            </div>
                            <div id="bottomcontent">
                                <div id="age">
                                    <h2>Age Range:</h2></div> {/*<!--pick one or more, send to Math team, click refresh to update sample count-->*/}
                                <div id="age_drop_down">
                                    <Multiselect
                                        isMulti
                                        value={this.state.age}
                                        onChange={this.handleAgeOnChange}
                                        closeMenuOnSelect={false}
                                        options={this.state.ageOpt}
                                    />
                                </div>

                                <div id="sex">
                                    <h2>Sex:</h2></div> {/*<!--pick one or more, send to Math team, click refresh to update sample count-->*/}
                                <div className="sex-dropdown">
                                    <Multiselect
                                        isMulti
                                        onChange={this.handleSexOnChange}
                                        closeMenuOnSelect={false}
                                        options={this.state.sexOpt}
                                    />
                                </div>

                                <div id="death">
                                    <h2>Death:</h2></div> {/*<!--pick one or more, send to Math team, click refresh to update sample count-->*/}
                                <div className="death-dropdown">
                                    <Multiselect
                                        isMulti
                                        onChange={this.handleDeathOnChange}
                                        closeMenuOnSelect={false}
                                        options={this.state.deathOpt}
                                    />

                                </div>

                            </div>
                            <div id="title">
                                <h2>Select Tissue type(s):</h2></div> {/*<!--pick one or more, send to Math team, click refresh to update sample count-->*/}
                            <div id="all">
                                <div id="set1">
                                    <ul>
                                        {this.state.tissue1.map((name) => <li onClick={(event) => this.handleTissueClick(event, name)}>{name}</li>)}
                                    </ul>
                                    <ul>
                                        {this.state.tissue2.map((name) => <li onClick={(event) => this.handleTissueClick(event, name)}>{name}</li>)}
                                    </ul>
                                </div>
                            </div>
                            <div id="gtexbuttons">
                                <button type="Continue" className="buttoncancel" onClick={this.props.closePopup}>Cancel</button>
                                <button type="Back" className="buttongroup" onClick={this.createHandler}>Create</button>
                            </div>
                        </div>
                    </body>
                </div>
            </div>
        );
    }
}
export default GtexModule;