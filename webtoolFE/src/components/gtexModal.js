/* This is for syyntax purpose
import React from "react";
import "../styles/gtexModal.css";

class GtexModule extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            ageRange: [],
            sex: [],
            death: [],
            tissueType: []
        }
    }
    render() {
        return (
            <div className="popup">
                <div className="popup-inner"> <p>'hi'</p>
                    <button onClick={this.props.closePopup}>Close</button>
                </div>
            </div>
        )
    }
}
export default GtexModule;
*/

import React from "react";
//import "../styles/gtexModal.css";
import "../styles/tata.css";
//import GtexModuleJquery from './gtexModuleJquery';


class GtexModule extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            // For age drop down
            ageRange: [],
            // -- End of age drop down -- //
            
            sex: [],
            death: [],
            tissueType: []
        }
    }

    // 	componentDidMount() {
    // 		GtexModuleJquery() 
    // }

    render() {
        return (
            <div>
                <div className="popup-inner">
                    <head>
                        <meta charset="UTF-8" />
                        <title>gtex group</title>
                        <link href="gtex.css" rel="stylesheet" />
                        <meta name="viewport" content="width=device-width, initial-scale=1" />
                        <link href="https://fonts.googleapis.com/css?family=Montserrat:400,700|Oswald&display=swap" rel="stylesheet" />
                        <link href="https://fonts.googleapis.com/css?family=Montserrat:400,500,600,700&display=swap" rel="stylesheet" />

                        {/* <!-- jQuery library --> */}
                        {/* <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script> */}

                        {/* <!-- MultiSelect CSS & JS library --> */}
                        {/* <script src="jQuery/jquery.built.js"></script> */}

                    </head>
                    <body>
                        <div id="wrapper4">
                            <div id="topcontent">
                                <div id="gtex">
                                    <h1>Select Gtex <br />Characteristics</h1>
                                </div>
                                <div id="controlgroup">
                                    <h2>GTEX Group Name:</h2>
                                    <input type="controlgroup" placeholder="" autocomplete="off" required />
                                </div>
                                <div id="sample">
                                    <h2>Sample Count:</h2>
                                    <h3>0</h3> {/*<!--need a refresh icon next to this sample count-->*/}
                                </div>
                            </div>
                            <div id="bottomcontent">
                                <div id="age">
                                    <h2>Age Range:</h2></div> {/*<!--pick one or more, send to Math team, click refresh to update sample count-->*/}
                                <div id="age_drop_down">
                                    <select name="langOpt[]" multiple id="langOpt">
                                        <option value="20-29">20-29</option>
                                        <option value="30-39">30-39</option>
                                        <option value="40-49">40-49</option>
                                        <option value="50-59">50-59</option>
                                        <option value="60-69">60-69</option>
                                        <option value="70-79">70-79</option>
                                        {/* <!--	<option value="PHP">PHP</option>
		<option value="Ruby on Rails">Ruby on Rails</option>
		<option value="Android">Android</option>
		<option value="iOS">iOS</option>
		<option value="HTML">HTML</option>
		<option value="XML">XML</option>	--> */}
                                    </select>
                                </div>

                                <script>

                                    {/* $('#langOpt').multiselect({
			{columns: '2',
			placeholder: '',
			search: 'false',
			selectAll: 'true'}
		}); */}

                                </script>
                                <div id="sex">
                                    <h2>Sex:</h2></div> {/*<!--pick one or more, send to Math team, click refresh to update sample count-->*/}
                                <div className="sex-dropdown">
                                    <select name="langOpt1[]" multiple id="langOpt1">
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </div>
                                <script>

                                    {/* $('#langOpt1').multiselect({
			{columns: '1',
			placeholder: '',
			search: 'false',
			selectAll: 'true'}
		}); */}

                                </script>

                                <div id="death">
                                    <h2>Death:</h2></div> {/*<!--pick one or more, send to Math team, click refresh to update sample count-->*/}
                                <div className="death-dropdown">
                                    <select name="langOpt2[]" multiple id="langOpt2">
                                        <option value="Ill Chronic">Ill Chronic</option>
                                        <option value="Ventilator">Ventilator</option>
                                        <option value="Fast Violent">Fast Violent</option>
                                        <option value="Ill Unexpected">Ill Unexpected</option>
                                        <option value="Fast Natural">Fast Natural</option>
                                    </select>
                                </div>
                                <script>

                                    {/* $('#langOpt2').multiselect({
			{columns: '2',
			placeholder: '',
			search: 'false',
			selectAll: 'true'}
		}); */}

                                </script>
                            </div>
                            <div id="title">
                                <h2>Select Tissue type(s):</h2></div> {/*<!--pick one or more, send to Math team, click refresh to update sample count-->*/}
                            <div id="all">
                                <div id="set1">
                                    <ul>
                                        <li>Adipose Tissue</li>
                                        <li>Adrenal Gland</li>
                                        <li>Bladder</li>
                                        <li>Brain</li>
                                        <li>Breast</li>
                                        <li>Cervix Uteri</li>
                                        <li>Colon</li>
                                        <li>Esophagus</li>
                                        <li>Fallopian Tube</li>
                                        <li>Heart</li>
                                        <li>Kidney</li>
                                        <li>Liver</li>
                                        <li>Lung</li>
                                        <li>Muscle</li>
                                        <li>Nerve</li>

                                    </ul>
                                    <ul>
                                        <li>Ovary</li>
                                        <li>Pancreas</li>
                                        <li>Pituitary</li>
                                        <li>Prostate</li>
                                        <li>Salivary Gland</li>
                                        <li>Skin</li>
                                        <li>Small Intestine</li>
                                        <li>Spleen</li>
                                        <li>Stomach</li>
                                        <li>Testis</li>
                                        <li>Thyroid</li>
                                        <li>Uterus</li>
                                        <li>Vagina</li>
                                        <li>Whole Blood</li>
                                    </ul>
                                </div>
                            </div>
                            <div id="gtexbuttons">
                                <button type="Continue" className="buttoncancel" onClick={this.props.closePopup}>Cancel</button>
                                <button type="Back" className="buttongroup" onClick={this.props.closePopup}>Create</button>
                            </div>
                        </div>
                    </body>
                </div>
            </div>
        );
    }
}
export default GtexModule;