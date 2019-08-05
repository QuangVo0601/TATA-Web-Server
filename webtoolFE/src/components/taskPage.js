import React from "react";
// import "../styles/tata.css";
import "../styles/taskPage.css";
import Footer from './botNav';

class TaskPage extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			taskOptions: ["Co-Differential Expression Analysis", 
						  "Co-Expression Network Analysis", 
						  "Differential Expression Analysis", 
						  "Task 4"],
			selectedTask: "",
			href: ""
		}
	}

	//change the task when click on 1 of 4 task buttons
	selectedTask = (selected) => {
		this.setState({ selectedTask: selected })
	}
	
	//get the link to the next page 
	getLink = () => {
		// save "taskChosen" in localStorage for use in algorithmPage.js
		localStorage.setItem('taskChosen', JSON.stringify(this.state.selectedTask))

		if(this.state.selectedTask === "") {
			//show alert when no task is selected
			alert(`Oops, please choose a task first!`);
		}
		else{
			this.setState({href: "/groupingpage"})
		}	  
	}
		

	render() {

	return (	
			<div>
				<head>
                    <meta charset="UTF-8"/>
                    <title>Untitled Document</title>
                    <meta name="viewport" content="width=device-width, initial-scale=1"/>
                    <link href="tata.css" rel="stylesheet"/>
                    <link href="https://fonts.googleapis.com/css?family=Montserrat:400,700|Oswald&display=swap" rel="stylesheet"/>
				</head>

				<body>
					<div id="wrapper">
						<div className="flex-container">
							<div id="content">
								<div id="nav">
									<div id="logo">
										<a href="/"> {/*added by Quang, logo linked to homepage*/}
											<img src={require('../assets/TATA.png')} alt="logo" />
										</a>
									</div>
									{/* <!--end of log--> */}
									<div id="mainnav">
										<div id="circles">
											<ul>
												<li><span className="circles" id="complete">1</span></li>
												<li>
													<div className="line1" id="active3"></div>
												</li>
												<li><span className="circles" id="active">2</span></li>
												<li>
													<div className="line1"></div>
												</li>
												<li><span className="circles">3</span></li>
												<li>
													<div className="line"></div>
												</li>
												<li><span className="circles">4</span></li>
												<li>
													<div className="line"></div>
												</li>
												<li><span className="circles">5</span></li>
											</ul>
										</div>
										{/* <!--end of circles--> */}
										<div id="stepnav">
											<dl>
												<div id="task">
													<dt>
														<div className="active2">Exploratory Plots</div>
													</dt>
													<dt>
														<div className="active2">Choose Task</div>
													</dt>
													<dt>Group Samples</dt>
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
							{/* <!--end of flex-container--> */}
							<div id="section">
								<div id="boxes">
									{/*Box 1*/}
									<div className="box" tabindex="0" onClick={this.selectedTask.bind(this, this.state.taskOptions[0])}>
                                    	<div className="content">
                                            <div className="task-img"> <img id="white" src={require('../assets/taskPageImages/Asset2.png')}/> </div>
                                            <h3>CO-DIFFERENTIAL<br/> EXPRESSION ANALYSIS</h3>
											<p>Gene differential expression using NoISeq R/Bioc Package.  Differential expression is done between two groups. Output includes differentially expressed genes and FDR. </p>
										</div>
                                    </div>
									{/*Box 2*/}
									<div className="box" tabindex="0" onClick={this.selectedTask.bind(this, this.state.taskOptions[1])}> 
										<div className="content">
                                            <div className="task-img"> <img id="white2" src={require('../assets/taskPageImages/Distinguishgroups.png')}/> </div>
                                            <h3>CO-EXPRESSION <br/> NETWORK ANALYSIS</h3>
											<p>Network modules are constructed from significant transcription factor-gene interactions.  Output includes individual data set nodules with clustering coefficients to determine interconnectivity. </p>
										</div>
									</div>
									<div className="task2">
										{/*Box 3*/}
										<div className="box" tabindex="0" onClick={this.selectedTask.bind(this, this.state.taskOptions[2])}> 
											<div className="content">
                                                <div className="task-img"><img id="white3" src={require('../assets/taskPageImages/Search.png')}/> </div>
                                                <h3>DIFFERENTIAL <br/> EXPRESSION ANALYSIS</h3>
                                                <p>Using differentially expressed genes, data sets are analyzed for significant differences in gene-transcription factor interactions.  Output includes significant transcription factors regulating top differentially expressed genes.</p>
											</div>
										</div>
									</div>
									<div className="task2">
										{/*Box 4*/}
										<div className="box">
											<div className="content">
                                                <div className="task-img"><img id="white4" src={require('../assets/taskPageImages/Asset1.png')}/> </div>
                                                <h3>Coming <br/> Soon</h3>
												<p>We are devloping new algorithms to analyze your data!  </p>
											</div>
										</div>
									</div>
								</div>
								<div className="nav_container">
									<a href={this.state.href} style={{'text-decoration': 'none'}}> {/*added by Quang for button testing*/}
										<button type="Continue" 
												className="button-task-cont"
												onClick={this.getLink}
												>Continue</button> {/* call getLink() function when click the button*/}
										{/* disabled={!this.state.selectedTask} */}
									</a>
								</div>
							</div>
							{/* <!--end of section--> */}
						</div>
						{/* <!--end of flex-container--> */}

						<Footer/> {/* import Footer from botNav.js */}
					</div>
				</body>
			</div>
		);
	}
}
export default TaskPage;
