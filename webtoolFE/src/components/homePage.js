import React from "react";
import styles from "../styles/homePage.module.css"; // to run this with css file 
import Select from "react-select" // to use dropbox
import CSVReader from './csvReader';
import TopNav from './topNav';
import Footer from './botNav';

// function to return body of web app
// html body goes inside <div> <div/>
class HomePage extends React.Component {
    constructor(props) { // constructor
        super(props); // super() for parents class
        // initialize
        this.state = {
            // this is a list which contain dictionaries inside, for unit dropbox option
            outputOptions: [{ value: "RPKM", label: "RPKM" },
            { value: "FPKM", label: "FPKM" },
            { value: "TPM", label: "TPM" }],
            // to store selected unit option
            selectedOption: "Select Unit",
            loadingDiv: "csv-reader",
        }
    }
    /* Syntax in JavaScript: variable = anonymous function
        variable = (parameter) => {
            this.setState({target value : value to change})
        } */

    // Updated groupInput
    changeHandler = (event) => {
        this.setState({ [event.target.name]: event.target.value })
    }
    
    // This method is used to store click option from dropbox
    selectedOption = (selected) => {
		console.log(selected.value)
        this.setState({ selectedOption: selected.value })
    }
    
    /* Functions go here */
    setWaitingTime = () => {
        this.setCanClick()
        setTimeout(this.setNextClick,5000)
    }

    setCanClick = () => {
        this.setState({loadingDiv: "can-click"})
    }
    setNextClick = () => {
        this.setState({loadingDiv: "csv-reader"})
    }

    render() {

        return (
            <>
				<head>
				<meta charSet="UTF-8"/>
				<title>Home</title>
				<link href="CSS/homePage.css" rel="stylesheet" type="text/css"/>
				<link href="https://fonts.googleapis.com/css?family=Montserrat:400,600,700|Oswald:400,500&display=swap" rel="stylesheet" />
				<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/5.0.0/normalize.min.css"/>
				</head> 

				{/* <body> */}
				<div id={styles["active-background"]}>
					<div id={styles["wrapper-home"]}>
					<div className={styles['skewed-bg']}>
					<div className={`${styles["home-page"]} ${styles.content}`}>
								<div className={styles["container-img"]}>
									<div className={styles.topnav}>

										<img src={require('../assets/homePageImages/Group 257.png')} alt="LOGO" width="77px" height="74px" href="/home"/>
										<nav>
											<a href="/FAQ"> FAQ </a>
											<a href="#about"> About us </a>
										</nav>

									</div>
														
									<div className={styles.container} id="home">
										<div className={styles["left-col"]}>
											<h1 className={styles.title}>TRANSCRIPTION FACTOR ASSOCIATION TOOL FOR ANALYSIS</h1>
					
											<p className={styles.description}>
												TATA runs a preliminary validation on uploaded data and compares it to tissue matched control data
												derived from the GTEx database. TATA also allows the user to build
												samples groups from the GTEx data set for use in their analysis.
											</p>
											<div className={styles.stepsContainer}>
												
												<div id={styles.step1}>
													<dt>1. Select Units</dt>
													<dd><a href="/">Which units do you choose?</a></dd>
												</div>
												
												<div id={styles.step2}>
													<dt>2. Prepare File</dt>
													<dd><a href="/">How to prep your file?</a></dd>
												</div>
												
												<div id={styles.step3}>
													<dt>3. Upload & validate</dt>
													<dd><a href="https://www.youtube.com/watch?v=atNosTtdUaE">Demo of the tool.</a></dd>
												</div>
											</div>
										</div>
										<div className={styles["right-col"]}>
											<h3 className={styles["new-project"]}>NEW PROJECT</h3>
											<div className={styles.input}>
												<div className={styles.select}>
												<Select
														value={this.state.selectedOption}
														onChange={this.selectedOption}
														options={this.state.outputOptions}
														placeholder={this.state.selectedOption}
													/>
												</div>
												<div>
													<CSVReader
														selectedUnit = {this.state.selectedOption}
														setWaitingTime={this.setWaitingTime}
													/>
													<div className={this.state.loadingDiv}>Please wait while we process your data...</div>
													<a href={require("../assets/Sample File.csv")}>Example CSV file</a>
												</div>

											</div>
											<h3 className={styles["code-search"]}>JOB CODE SEARCH</h3>
											<div className={styles["codeinput-container"]}>
												<div className={styles["codeinput-box"]}>
													<input
														className={styles["code-input"]}
														type={styles['text']}
														placeholder='Job Code ...'
													/>
													<button className={styles["jobcode-button"]}>Submit</button>
												</div>

											</div>
										</div>
									</div> 
									{/* <!-- End of "container" --> */}
				</div>
								</div>
						</div>
						{/* <!-- End of "skewed-bg" --> */}
								<div className={styles.background}>
									<div className={styles["about-content"]} id="about">
										<div className={styles["about-inside"]}>
										<div className={styles["about-header"]}>WHAT IS TATA?</div>
											<div className={styles["about-para"]}>The Tool for the Analysis of Transaction 
											factor Associations is designed for the analysis of transcription
											factor to target gene associations in RNA-seq data. The association database has been mine from
											publicly available data and is freely available for download here. TATA runs a preliminary validation on
											uploaded data and compares it to tissue matched control data derived from the GTEx database. The
											user then has the option to choose from a variety of algorithms aimed at identifying significant
											differences within samples groups derived from the user’s data. TATA also allows the user to build
											samples groups from the GTEx data set for use in their analysis. Finally, TATA provides multiple
											publication quality and user friendly graphical output plots for the exploration of transcription factor regulatory networks.
											</div>
										</div>
										<img id={styles["circle-bg"]} src={require('../assets/homePageImages/circle-bg.png')} alt="circle"/>
									</div>
									
								
								<div className={styles["the-team"]}>
									<div className={styles["team-inside"]}>
										<div className={styles.team}>THE TEAM</div>
										<p className={styles["team-p"]}>Lorem ipsum dolor sit amet, sectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud ercitation ullamco Lorepsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.. incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.</p>
									</div>
									
									<ul className={styles.slides}>
													<input type="radio" name="radio-btn" id={styles["img-1"]}  checked />
													<li className={styles["slide-container"]}>
														<div className={styles.slide}>
															<img src={require('../assets/homePageImages/annie-spratt-QckxruozjRg-unsplash.jpg')} alt="LOGO" />
														</div>
														<div className={styles.nav}>
															<label htmlFor={styles["img-6"]} className={styles.prev}>&#x2039;</label>
															<label htmlFor={styles["img-2"]} className={styles.next}>&#x203a;</label>
														</div>
													</li>

													<input type="radio" name="radio-btn" id={styles["img-2"]} />
													<li className={styles["slide-container"]}>
														<div className={styles.slide}>
														<img src={require('../assets/homePageImages/headway-jfR5wu2hMI0-unsplash.jpg')} alt="LOGO"/>
														</div>
														<div className={styles.nav}>
															<label htmlFor={styles["img-1"]} className={styles.prev}>&#x2039;</label>
															<label htmlFor={styles["img-3"]} className={styles.next}>&#x203a;</label>
														</div>
													</li>

													<input type="radio" name="radio-btn" id={styles["img-3"]} />
													<li className={styles["slide-container"]}>
														<div className={styles.slide}>
														<img src={require('../assets/homePageImages/you-x-ventures-Oalh2MojUuk-unsplash.jpg')} alt="LOGO" />
														</div>
														<div className={styles.nav}>
															<label htmlFor={styles["img-2"]} className={styles.prev}>&#x2039;</label>
															<label htmlFor={styles["img-4"]} className={styles.next}>&#x203a;</label>
														</div>
													</li>

													<input type="radio" name="radio-btn" id={styles["img-4"]} />
													<li className={styles["slide-container"]}>
														<div className={styles.slide}>
														<img src={require('../assets/homePageImages/adult-chart-diagram-1181346.jpg')} alt="LOGO"/>
														</div>
														<div className={styles.nav}>
															<label htmlFor={styles["img-3"]} className={styles.prev}>&#x2039;</label>
															<label htmlFor={styles["img-5"]} className={styles.next}>&#x203a;</label>
														</div>
													</li>

													<input type="radio" name="radio-btn" id={styles["img-5"]}/>
													<li className={styles["slide-container"]}>
														<div className={styles.slide}>
														<img src={require('../assets/homePageImages/brainstorming-collaborate-collaboration-1204649.jpg')} alt="LOGO"/>
														</div>
														<div className={styles.nav}>
															<label htmlFor={styles["img-4"]} className={styles.prev}>&#x2039;</label>
															<label htmlFor={styles["img-6"]} className={styles.next}>&#x203a;</label>
														</div>
													</li>

													<input type="radio" name="radio-btn" id={styles["img-6"]} />
													<li className={styles["slide-container"]}>
														<div className={styles.slide}>
														<img src={require('../assets/homePageImages/brainstorming-colleagues-communication-1374363.jpg')} alt="LOGO"/>
														</div>
														<div className={styles.nav}>
															<label htmlFor={styles["img-5"]} className={styles.prev}>&#x2039;</label>
															<label htmlFor={styles["img-1"]} className={styles.next}>&#x203a;</label>
														</div>
													</li>

													<li className={styles["nav-dots"]}>
													<label htmlFor={styles["img-1"]} className={styles["nav-dot"]} id={styles["img-dot-1"]}></label>
													<label htmlFor={styles["img-2"]} className={styles["nav-dot"]} id={styles["img-dot-2"]}></label>
													<label htmlFor={styles["img-3"]} className={styles["nav-dot"]} id={styles["img-dot-3"]}></label>
													<label htmlFor={styles["img-4"]} className={styles["nav-dot"]} id={styles["img-dot-4"]}></label>
													<label htmlFor={styles["img-5"]} className={styles["nav-dot"]} id={styles["img-dot-5"]}></label>
													<label htmlFor={styles["img-6"]} className={styles["nav-dot"]} id={styles["img-dot-6"]}></label>
													</li>
												</ul>

								</div>
							</div>
							
					</div>
					
					
				{/* <!------------------------------ End of wrapper --------------------------------------> */}
				<Footer />
				</div>		
				{/* </body> */}
				{/* </div> */}
            </>
        
        )
    
        }
    }
    
    export default HomePage; 