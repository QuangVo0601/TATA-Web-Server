import React from 'react';
import '../styles/Contributions.css';
import {
    withRouter
  } from 'react-router-dom'
import BotNav from '../components/botNav'

class Contributions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    handleAbout = () => {
        this.props.history.push('/#about')
    }
    render() {
        return (
            <div>
                <head>
                    <meta charset="UTF-8" />
                    <title>Contributors</title>
                    <link href="CSS/home.css" rel="stylesheet" type="text/css" />
                    <link href="https://fonts.googleapis.com/css?family=Montserrat:400,600,700|Oswald:400,500&display=swap" rel="stylesheet" />
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/5.0.0/normalize.min.css" />
                </head>
                <body>
                    <div id="wrapper_contributor">
                        <div className="skewed-bg-contribution">
                            <div className="contributors-page content">
                                <div className="topnav-contribution-contribution">
                                    <img id="home-button" src={require('../assets/White_TATA_Logo.png')} alt="LOGO" width="109px" height="68.67px" href="/home" />
                                    <nav>
                                        <a className="nav_contributor" href="/contributors">Contributors</a>
                                        <a className="nav_contributor" onClick={this.handleAbout}> About us </a>
                                        <a className="nav_contributor" href="/FAQ"> FAQ </a>
                                    </nav>
                                </div>
                                <div className="container-img">
                                    <div className="header_flexContainer">
                                        <div id="contributorsTitle">CONTRIBUTORS</div>
                                        <div id="contributors_Description">The students below were recruited from the
                                        departments of Math, Biology, and Computer Science as well as the School of Art.
                                        Each summer the project has more than 80 highly qualified applicants with a rigorous
                                        application process.  Profiles describing the student and mentors can be seen by
                                        clicking on the individual picture.
                                        </div>
                                    </div>
                                    <img className="scroll_Icon" src={require('../assets/Scroll Icon.png')} alt="scroll" />
                                </div>
                            </div>
                        </div>
                        {/* End of "skewed-bg-contribution" */}

                        {/* <!------------------------------------------------------------- 2019 Gallery --> */}
                        <div id="summer2019">
                            <div className="summerTeamTitle">
                                Summer 2019
                            </div>
                            <div className="o-grid">
                                <div className="o-grid__item c-gallery__item perfundo">
                                    {/* <!-------------------- 1st item --> */}
                                    <a className="perfundo__link qa-link-img1" href="#perfundo-img1_2">
                                        <img className="headshot" src={require("../assets/2019_team/Luis_Rodriguez_2019_H.jpg")} alt="Luis_Rodriguez" />
                                    </a>
                                    <div id="perfundo-img1_2" className="perfundo__overlay fadeIn qa-overlay-img1">
                                        <figure className="perfundo__content perfundo__figure">
                                            <img className="perfundo__hoverAction" src={require("../assets/2019_team/Luis_Rodriguez_2019_H.jpg")} alt="Luis_Rodriguez" />
                                            <div className="perfundo__image">
                                                <div className="popup">
                                                    <div className="leftContent">
                                                        <div className="name">
                                                            Luis Rodriguez
                                                    </div>
                                                        <div className="postion">
                                                        Biology Mentor
                                                    </div>
                                                        <div className="contribution-line">
                                                        </div>
                                                        <div className="bio">
                                                        Dr. Rodriguez is a postdoctoral researcher at George Mason under the guidance of Dr. Geraldine Grant.  As a member of both the 2018 and 2019 team Dr. Rodriguez was the mentor who guided the overall biological relevance of the tool.  Dr. Rodriguez is trained in the application of genomics to problems of disease and used this expertise to ensure that the algorithms and bioinformatic approaches yielded biologically relevance data.  Throughout the process Dr. Rodriguez also served as the connection between the 2018 and 2019 project, ensuring that TATA was a collaborative effort between the students in both summer sessions.
											        </div>
                                                    </div>
                                                    <div
                                                        className="rightPhoto"
                                                        id="Luis_Rodriguez">
                                                    </div>
                                                </div>
                                            </div>
                                        </figure>
                                        <a href="#perfundo-untarget" className="perfundo__close perfundo__control">
                                            Close
                                        </a>
                                        <a className="perfundo__next perfundo__control qa-next-img1" href="#perfundo-img2_2">
                                            Next
                                        </a>
                                    </div>
                                </div>
                                {/* <!---------------------------------------------------------- End of 1st item --> */}
                                <div className="o-grid__item c-gallery__item perfundo">
                                    {/* <!------------------- 2nd item --> */}
                                    <a className="perfundo__link" href="#perfundo-img2_2">
                                        <img className="headshot" src={require('../assets/2019_team/Shanshan_Cui_2019_H.jpg')} alt="Shanshan_Cui" />
                                    </a>
                                    <div id="perfundo-img2_2" className="perfundo__overlay fadeIn qa-overlay-img2">
                                        <figure className="perfundo__content perfundo__figure">
                                            <img src={require('../assets/2019_team/Shanshan_Cui_2019_H.jpg')} alt="Shanshan_Cui" />
                                            <div className="perfundo__image">
                                                <div className="popup">
                                                    <div className="leftContent">
                                                        <div className="name">Shanshan Cui</div>
                                                        <div className="postion">Graphic Design Mentor</div>
                                                        <div className="contribution-line"></div>
                                                        <div className="bio">
                                                        Shanshan Cui is an associate professor for the George Mason University, College of Visual and Performing Arts.  Shanshan brought her expertise in graphic information design and human-computer interface to the project.  Shanshan recruited three talented graphic design students to the 2019 project and supervised their design of the webtool.  While the graphic design students developed the information structure and interface for the webtool, Shanshan refined their ideas and helped in bringing out their creativity.  Shanshan was critical in ensuring that TATA was both functional and intuitive for the user.                                                        </div>
                                                    </div>
                                                    <div className="rightPhoto" id="Shanshan_Cui"></div>

                                                </div>
                                            </div>
                                        </figure>
                                        <a href="#perfundo-untarget" className="perfundo__close perfundo__control">Close</a>
                                        <a className="perfundo__next perfundo__control qa-next-img2" href="#perfundo-img3_2">Next</a>
                                        <a className="perfundo__prev perfundo__control" href="#perfundo-img1_2">Prev</a>
                                    </div>
                                </div>
                                {/* <!---------------------------------------------------------- End of 2nd item --> */}

                                {/* <!----------------- 3rd item --> */}
                                <div className="o-grid__item c-gallery__item perfundo">
                                    <a className="perfundo__link" href="#perfundo-img3_2">
                                        <img className="headshot" src={require('../assets/2019_team/Tyrus_Berry_2019_H.jpg')} alt="Tyrus_Berry" />
                                    </a>
                                    <div id="perfundo-img3_2" className="perfundo__overlay fadeIn qa-overlay-img3">
                                        <figure className="perfundo__content perfundo__figure">
                                            <img src={require('../assets/2019_team/Tyrus_Berry_2019_H.jpg')} alt="Tyrus_Berry" />
                                            <div className="perfundo__image">
                                                <div className="popup">
                                                    <div className="leftContent">
                                                        <div className="name">Tyrus Berry</div>
                                                        <div className="postion">Mathematics Mentor</div>
                                                        <div className="contribution-line"></div>
                                                        <div className="bio">
                                                            Dr. Berry is a professor of Mathematics at George Mason in the department of Mathematical Sciences. As a member of the 2019 team Dr. 
                                                            Berry was the faculty mentor coordinating the mathematical analysis and statistical aspects of the tool. 
                                                            Dr. Berry supervised the developed algorithms from the point of view of data visualization, normalization, and statistical analysis.  
                                                            Together with the other mentors, Dr. Berry also helped manage and oversee the coordination of the various student teams.
                                                        </div>
                                                    </div>
                                                    <div className="rightPhoto" id="Tyrus_Berry"></div>
                                                </div>
                                            </div>
                                        </figure>
                                        <a href="#perfundo-untarget" className="perfundo__close perfundo__control">Close</a>
                                        <a className="perfundo__next perfundo__control qa-next-img3_2" href="#perfundo-img4_2">Next</a>
                                        <a className="perfundo__prev perfundo__control qa-prev-img3" href="#perfundo-img2_2">Prev</a>
                                    </div>
                                </div>
                                {/* <!---------------------------------------------------------- End of 3rd item --> */}

                                {/* <!----------------- 4th item --> */}
                                <div className="o-grid__item c-gallery__item perfundo">
                                    <a className="perfundo__link" href="#perfundo-img4_2">
                                        <img className="headshot" src={require('../assets/2019_team/Humberto_Portillo_2019_H.jpg')} alt="Humberto_Portillo" />
                                    </a>
                                    <div id="perfundo-img4_2" className="perfundo__overlay fadeIn qa-overlay-img3">
                                        <figure className="perfundo__content perfundo__figure">
                                            <img src={require('../assets/2019_team/Humberto_Portillo_2019_H.jpg')} alt="Humberto_Portillo" />
                                            <div className="perfundo__image">
                                                <div className="popup">
                                                    <div className="leftContent">
                                                        <div className="name">Humberto Portillo</div>
                                                        <div className="postion">Graphic Designer/Front End Developer</div>
                                                        <div className="contribution-line"></div>
                                                        <div className="bio">
                                                        During the project Humberto Portillo had just completed her third year at George Mason as a graphic design major. As a member of the 2019 team Humberto was involved in the styling of the website used by TATA. Humbertofirst did wireframes of the website, then move to coding the HTML and CSS ofthe website.  Humberto hopes to join the workforce next year.
                                                        </div>
                                                    </div>
                                                    <div className="rightPhoto" id="Humberto_Portillo"></div>
                                                </div>
                                            </div>
                                        </figure>
                                        <a href="#perfundo-untarget" className="perfundo__close perfundo__control">Close</a>
                                        <a className="perfundo__next perfundo__control qa-next-img2" href="#perfundo-img5_2">Next</a>
                                        <a className="perfundo__prev perfundo__control qa-prev-img3" href="#perfundo-img3_2">Prev</a>
                                    </div>
                                </div>
                                {/* <!---------------------------------------------------------- End of 4th item --> */}

                                {/* <!----------------- 5th item --> */}
                                <div className="o-grid__item c-gallery__item perfundo">
                                    <a className="perfundo__link" href="#perfundo-img5_2">
                                        <img className="headshot" src={require('../assets/2019_team/Jae-Moon_Hwang_2019_H.jpg')} alt="Jae-Moon" />
                                    </a>
                                    <div id="perfundo-img5_2" className="perfundo__overlay fadeIn qa-overlay-img3">
                                        <figure className="perfundo__content perfundo__figure">
                                            <img src={require('../assets/2019_team/Jae-Moon_Hwang_2019_H.jpg')} alt="Jae-Moon" />
                                            <div className="perfundo__image">
                                                <div className="popup">
                                                    <div className="leftContent">
                                                        <div className="name">Jae-Moon Hwang</div>
                                                        <div className="postion">Computer Scientist/Mathematician</div>
                                                        <div className="contribution-line"></div>
                                                        <div className="bio">
                                                        During the project, Jae-Moon Hwang had just completed their 3rd year at George Mason as a Computer Science major. As a member of the 2019 backend team, he was involved in the design of mathematical algorithms used by TATA. Jae-Moon helped develop tools to analyze biological data. Jae-Moon hopes to enter the work force next year.
                                                        </div>
                                                    </div>
                                                    <div className="rightPhoto" id="Jae-Moon"></div>
                                                </div>
                                            </div>
                                        </figure>
                                        <a href="#perfundo-untarget" className="perfundo__close perfundo__control">Close</a>
                                        <a className="perfundo__next perfundo__control qa-next-img2" href="#perfundo-img6_2">Next</a>
                                        <a className="perfundo__prev perfundo__control qa-prev-img3" href="#perfundo-img4_2">Prev</a>
                                    </div>
                                </div>
                                {/* <!---------------------------------------------------------- End of 5th item --> */}

                                {/* <!----------------- 6th item --> */}
                                <div className="o-grid__item c-gallery__item perfundo">
                                    <a className="perfundo__link" href="#perfundo-img6_2">
                                        <img className="headshot" src={require('../assets/2019_team/Jon_Rossi_2019_H.jpg')} alt="Jon-Rossi" />
                                    </a>
                                    <div id="perfundo-img6_2" className="perfundo__overlay fadeIn qa-overlay-img3">
                                        <figure className="perfundo__content perfundo__figure">
                                            <img src={require('../assets/2019_team/Jon_Rossi_2019_H.jpg')} alt="Jon-Rossi" alt="Jon-Rossi" />
                                            <div className="perfundo__image">
                                                <div className="popup">
                                                    <div className="leftContent">
                                                        <div className="name">Jon Rossi</div>
                                                        <div className="postion">Computer Scientist/Mathematician</div>
                                                        <div className="contribution-line"></div>
                                                        <div className="bio">
                                                        During the project Jon had just completed his fourth year at George Mason University as a Math and Computer Science major. As a member of the 2019 team Translating Significant Biological Data through a Novel, Intuitive Graphical User Interface Jon was involved in the design of mathematical algorithms used by TATA. He first worked on creating various exploratory plots for the validation phase, he then worked on creating the querying mechanisms to form the GTEx groups, and also worked on implementing the PCIT algorithm as well as the differential wiring network graph. Next year he plans on finishing school and joining the workforce.
                                                        </div>
                                                    </div>
                                                    <div className="rightPhoto" id="Jon-Rossi"> </div>
                                                </div>
                                            </div>
                                        </figure>
                                        <a href="#perfundo-untarget" className="perfundo__close perfundo__control">Close</a>
                                        <a className="perfundo__next perfundo__control qa-next-img2" href="#perfundo-img7_2">Next</a>
                                        <a className="perfundo__prev perfundo__control qa-prev-img3" href="#perfundo-img5_2">Prev</a>
                                    </div>
                                </div>
                                {/* <!---------------------------------------------------------- End of 6th item --> */}

                                {/* /<!----------------- 7th item --> */}
                                <div className="o-grid__item c-gallery__item perfundo">
                                    <a className="perfundo__link" href="#perfundo-img7_2">
                                        <img className="headshot" src={require('../assets/2019_team/Louisa_Ramirez_2019_H.jpg')} alt="Louisa_Ramirez" />
                                    </a>
                                    <div id="perfundo-img7_2" className="perfundo__overlay fadeIn qa-overlay-img3">
                                        <figure className="perfundo__content perfundo__figure">
                                            <img src={require('../assets/2019_team/Louisa_Ramirez_2019_H.jpg')} alt="Louisa_Ramirez" />
                                            <div className="perfundo__image">
                                                <div className="popup">
                                                    <div className="leftContent">
                                                        <div className="name">Louisa Ramirez</div>
                                                        <div className="postion">Graphic Designer/Front End Developer</div>
                                                        <div className="contribution-line"></div>
                                                        <div className="bio">
                                                        During the project Louisa Ramirez had just completed her third year at George Mason as a graphic design major. As a member of the 2019 team Louisa was involved in the styling of the website used by TATA. Louisa first did wireframes of the website, then move to coding the HTML and CSS of the website. Louisa hopes to join the workforce next year. 
                                                        </div>
                                                    </div>
                                                    <div className="rightPhoto" id="Louisa_Ramirez"></div>
                                                </div>
                                            </div>
                                        </figure>
                                        <a href="#perfundo-untarget" className="perfundo__close perfundo__control">Close</a>
                                        <a className="perfundo__next perfundo__control qa-next-img2" href="#perfundo-img8_2">Next</a>
                                        <a className="perfundo__prev perfundo__control qa-prev-img3" href="#perfundo-img6_2">Prev</a>
                                    </div>
                                </div>
                                {/* <!---------------------------------------------------------- End of 7th item --> */}

                                {/* <!----------------- 8th item --> */}
                                <div className="o-grid__item c-gallery__item perfundo">
                                    <a className="perfundo__link" href="#perfundo-img8_2">
                                        <img className="headshot" src={require('../assets/2019_team/Mathew_Kim_2019_H.jpg')} alt="Mathew_Kim" />
                                    </a>
                                    <div id="perfundo-img8_2" className="perfundo__overlay fadeIn qa-overlay-img3">
                                        <figure className="perfundo__content perfundo__figure">
                                            <img src={require('../assets/2019_team/Mathew_Kim_2019_H.jpg')} alt="Mathew_Kim" />
                                            <div className="perfundo__image">
                                                <div className="popup">
                                                    <div className="leftContent">
                                                        <div className="name">Mathew Kim</div>
                                                        <div className="postion">Computer Scientist/Mathematician</div>
                                                        <div className="contribution-line"></div>
                                                        <div className="bio">During the project Matthew had just completed his 2nd year at George Mason as a Computer Science major. As a member of the 2019 term Matthew was involved in the design of mathematical algorithms used by TATA. Matthew first worked on the filtering and analyzing the data, then proceeded to work on the statistical analysis with the team which also involves the creation of plots and network graphs using statistically corrected data outputted by the algorithm.
Matthew hopes to work on interesting projects like this in the future.</div>
                                                    </div>
                                                    <div className="rightPhoto" id="Mathew_Kim"></div>
                                                </div>
                                            </div>
                                        </figure>
                                        <a href="#perfundo-untarget" className="perfundo__close perfundo__control">Close</a>
                                        <a className="perfundo__next perfundo__control qa-next-img2" href="#perfundo-img9_2">Next</a>
                                        <a className="perfundo__prev perfundo__control qa-prev-img3" href="#perfundo-img7_2">Prev</a>
                                    </div>
                                </div>
                                {/* <!---------------------------------------------------------- End of 8th item --> */}

                                {/* <!----------------- 9th item --> */}
                                <div className="o-grid__item c-gallery__item perfundo">
                                    <a className="perfundo__link" href="#perfundo-img9_2">
                                        <img className="headshot" src={require('../assets/2019_team/Phoung_Tran_2019_H.jpg')} alt="Phuong_Tran" />
                                    </a>
                                    <div id="perfundo-img9_2" className="perfundo__overlay fadeIn qa-overlay-img3">
                                        <figure className="perfundo__content perfundo__figure">
                                            <img src={require('../assets/2019_team/Phoung_Tran_2019_H.jpg')} alt="Phuong_Tran" />
                                            <div className="perfundo__image">
                                                <div className="popup">
                                                    <div className="leftContent">
                                                        <div className="name">Phuong Tran</div>
                                                        <div className="postion">Computer Scientist/Full Stack Developer</div>
                                                        <div className="contribution-line"></div>
                                                        <div className="bio">
                                                        During the project, Phuong Tran had just completed 2nd year at George Mason as a Computer Science major, and Data Science minor. As a member of the 2019 team, Phuong was involved in the development of web application of architecture and data flow. Phuong implementing design elements from HTML/CSS while giving them functionalities through Front End using React.js/JavaScript and merging math algorithms into existing back end server, using Django REST framework as well as deploy the web applications onto Apache server. Phuong hopes to continue her study with a focus in Data Analytics through an MS at George Mason University.
                                                        </div>
                                                    </div>
                                                    <div className="rightPhoto" id="Phuong_Tran"></div>
                                                </div>
                                            </div>
                                        </figure>
                                        <a href="#perfundo-untarget" className="perfundo__close perfundo__control">Close</a>
                                        <a className="perfundo__next perfundo__control qa-next-img2" href="#perfundo-img10_2">Next</a>
                                        <a className="perfundo__prev perfundo__control qa-prev-img3" href="#perfundo-img8_2">Prev</a>
                                    </div>
                                </div>
                                {/* <!---------------------------------------------------------- End of 9th item --> */}

                                {/* <!----------------- 10th item --> */}
                                <div className="o-grid__item c-gallery__item perfundo">
                                    <a className="perfundo__link" href="#perfundo-img10_2">
                                        <img className="headshot" src={require('../assets/2019_team/Quang_Vo_2019_H.jpg')} alt="Quang_Vo" />
                                    </a>
                                    <div id="perfundo-img10_2" className="perfundo__overlay fadeIn qa-overlay-img3">
                                        <figure className="perfundo__content perfundo__figure">
                                            <img src={require('../assets/2019_team/Quang_Vo_2019_H.jpg')} alt="Quang_Vo" />
                                            <div className="perfundo__image">
                                                <div className="popup">
                                                    <div className="leftContent">
                                                        <div className="name">Quang Vo</div>
                                                        <div className="postion">Computer Scientist/Full Stack Developer</div>
                                                        <div className="contribution-line"></div>
                                                        <div className="bio">
                                                        During the project Quang had just completed his third year at George Mason as a Computer Science major. As a member of the 2019 team Quang was involved in the architecture development and the organization of the data flow of TATA web app. Quang implemented design elements from HTML/CSS while giving them functionalities through the front end using React.js/JavaScript; merged math algorithms into existing back end server using Django REST framework; and deployed TATA web app onto Apache server. Quang hopes continue his study in Computer Science and become a full stack developer after his graduation.
                                                            </div>
                                                    </div>
                                                    <div className="rightPhoto" id="Quang_Vo"></div>
                                                </div>
                                            </div>
                                        </figure>
                                        <a href="#perfundo-untarget" className="perfundo__close perfundo__control">Close</a>
                                        <a className="perfundo__next perfundo__control qa-next-img2" href="#perfundo-img11_2">Next</a>
                                        <a className="perfundo__prev perfundo__control qa-prev-img3" href="#perfundo-img9_2">Prev</a>
                                    </div>
                                </div>
                                {/* <!---------------------------------------------------------- End of 10th item --> */}

                                {/* <!----------------- 11th item --> */}
                                <div className="o-grid__item c-gallery__item perfundo">
                                    <a className="perfundo__link" href="#perfundo-img11_2">
                                        <img className="headshot" src={require('../assets/2019_team/Sydney_Ghar_2019_H.jpg')} alt="Sydney_Gahr" />
                                    </a>
                                    <div id="perfundo-img11_2" className="perfundo__overlay fadeIn qa-overlay-img3">
                                        <figure className="perfundo__content perfundo__figure">
                                            <img src={require('../assets/2019_team/Sydney_Ghar_2019_H.jpg')} alt="Sydney_Gahr" />
                                            <div className="perfundo__image">
                                                <div className="popup">
                                                    <div className="leftContent">
                                                        <div className="name">Sydney Gahr</div>
                                                        <div className="postion">Graphic Designer/Front End Developer</div>
                                                        <div className="contribution-line"></div>
                                                        <div className="bio">
                                                            During the project Sydney Gahr had just completed her third year at George Mason as a graphic design major. As a member of the 2019 team Sydney was involved in the styling of the website used by TATA. Sydney first did wireframes of the website, then move to coding the HTML and CSS of the website.  Sydney hopes to join the workforce next year. 
                                                        </div>
                                                    </div>
                                                    <div className="rightPhoto" id="Sydney_Gahr"></div>
                                                </div>
                                            </div>
                                        </figure>
                                        <a href="#perfundo-untarget" className="perfundo__close perfundo__control">Close</a>
                                        <a className="perfundo__next perfundo__control qa-next-img2" href="#perfundo-img12_2">Next</a>
                                        <a className="perfundo__prev perfundo__control qa-prev-img3" href="#perfundo-img10_2">Prev</a>
                                    </div>
                                </div>
                                {/* <!---------------------------------------------------------- End of 11th item --> */}

                                {/* <!----------------- 12th item --> */}
                                <div className="o-grid__item c-gallery__item perfundo">
                                    <a className="perfundo__link" href="#perfundo-img12_2">
                                        <img className="headshot" src={require('../assets/2019_team/yemeen_ayub_2019_h.jpg')} alt="Yemeen_Ayub" />
                                    </a>
                                    <div id="perfundo-img12_2" className="perfundo__overlay fadeIn qa-overlay-img3">
                                        <figure className="perfundo__content perfundo__figure">
                                            <img src={require('../assets/2019_team/yemeen_ayub_2019_h.jpg')} alt="Yemeen_Ayub" />
                                            <div className="perfundo__image">
                                                <div className="popup">
                                                    <div className="leftContent">
                                                        <div className="name">Yemeen Ayub</div>
                                                        <div className="postion">Mathematics Mentor</div>
                                                        <div className="contribution-line"></div>
                                                        <div className="bio">Yemeen is a Mathematics PhD student under the direction of Dr. Tyrus Berry.  Yemeen is a talented mathematician with experience in math, physics, programming, and graphic design.  Given his unique perspectives on the application of math, Yemeen was an important contributor to TATA.  Over the summer Yemeen worked with the algorithm design team, lending help through the troubleshooting process and inspiring new approaches for the students to pursue.  Yemeen was also instrumental in the requirement of Jae-Moon Hwang, which facilitated the progress of the tool greatly.  Yemeen will continue his PhD work at George Mason and hopes to further explore applications of machine learning to real-word challenges.</div>
                                                    </div>
                                                    <div className="rightPhoto" id="Yemeen_Ayub"></div>
                                                </div>
                                            </div>
                                        </figure>
                                        <a href="#perfundo-untarget" className="perfundo__close perfundo__control">Close</a>
                                        <a className="perfundo__prev perfundo__control qa-prev-img3" href="#perfundo-img11_2">Prev</a>
                                    </div>
                                </div>
                                {/* <!---------------------------------------------------------- End of 12th item --> */}
                            </div>
                        </div>
                        {/* <!---------------------------------------------------------- End of 2019 item --> */}

                        {/* <!------------------------------------------------------------- 2018 Gallery --> */}
                        <div id="summer2018">
                            <div className="summerTeamTitle">Summer 2018</div>
                            <div className="o-grid">
                                {/* <!-------------------- 1st item --> */}
                                <div className="o-grid__item c-gallery__item perfundo">
                                    <a className="perfundo__link qa-link-img1" href="#perfundo-img1">
                                        <img className="headshot" src={require('../assets/2018_team/Geraldine_Grant_2018_H.jpg')} alt="Geraldine_Grant" />
                                    </a>
                                    <div id="perfundo-img1" className="perfundo__overlay fadeIn qa-overlay-img1">
                                        <figure className="perfundo__content perfundo__figure">
                                            <img className="perfundo__hoverAction" src={require('../assets/2018_team/Geraldine_Grant_2018_H.jpg')} alt="Geraldine_Grant" />
                                            <div className="perfundo__image">
                                                <div className="popup">
                                                    <div className="leftContent">
                                                        <div className="name">Geraldine Grant</div>
                                                        <div className="postion">Biology Mentor</div>
                                                        <div className="contribution-line"></div>
                                                        <div className="bio">
                                                            Dr. Grant is a professor of Biology at George Mason in the department of Biology. As a member of the 2018 team Dr. 
                                                            Grant was the faculty mentor coordinating the biology data mining of the tool. 
                                                            Dr. Grant supervised the differential expression algorithms from the point of view of biological relevance. 
                                                            The bioinformatics team analyzed data and confirmed their findings with Dr. Grant. 
                                                            In addition to this she brought her significant experience with undergraduate education into the development of the RNA-seq curriculum 
                                                            that was a key aspect of the 2018 summer project.
                                                        </div>
                                                    </div>
                                                    <div className="rightPhoto" id="Geraldine_Grant"></div>
                                                </div>
                                            </div>
                                        </figure>
                                        <a href="#perfundo-untarget" className="perfundo__close perfundo__control">Close</a>
                                        <a className="perfundo__next perfundo__control qa-next-img1" href="#perfundo-img2">Next</a>
                                    </div>
                                </div>
                                {/* <!---------------------------------------------------------- End of 1st item --> */}

                                {/* <!-------------------- 2nd item -->         */}
                                <div className="o-grid__item c-gallery__item perfundo">
                                    <a className="perfundo__link qa-link-img1" href="#perfundo-img2">
                                        <img className="headshot" src={require('../assets/2018_team/Don_Seto_2018_H.jpg')} alt="Don_Seto" />
                                    </a>
                                    <div id="perfundo-img2" className="perfundo__overlay fadeIn qa-overlay-img1">
                                        <figure className="perfundo__content perfundo__figure">
                                            <img className="perfundo__hoverAction" src={require('../assets/2018_team/Don_Seto_2018_H.jpg')} alt="Don_Seto" />
                                            <div className="perfundo__image">
                                                <div className="popup">
                                                    <div className="leftContent">
                                                        <div className="name">Don Seto</div>
                                                        <div className="postion">Bioinformatics Mentor</div>
                                                        <div className="contribution-line"></div>
                                                        <div className="bio">
                                                            Dr. Seto is a professor of Bioinformatics at George Mason in the School of Systems Biology. 
                                                            As a member of the 2018 team Dr. Seto was the faculty mentor coordinating the algorithms and web architecture of the early tool. 
                                                            Dr. Seto’s previous experience in webtool development is emplified by his group’s previous work. 
                                                            Using virus genome data, e.g., adenoviruses and poxviruses, the Seto Research Group has developed, validated 
                                                            and implemented two net-accessible interactive and “on-the-fly” genome comparison software tools <a href='http://binf.gmu.edu/genometools.html'>(http://binf.gmu.edu/genometools.html)</a>. 
                                                            Dr. Seto shared much of his previous work to serve as inspiration for the early framework of TATA.
                                                        </div>
                                                    </div>
                                                    <div className="rightPhoto" id="Don_Seto"></div>
                                                </div>

                                            </div>
                                        </figure>
                                        <a href="#perfundo-untarget" className="perfundo__close perfundo__control">Close</a>
                                        <a className="perfundo__next perfundo__control qa-next-img1" href="#perfundo-img3">Next</a>
                                        <a className="perfundo__prev perfundo__control" href="#perfundo-img1">Prev</a>
                                    </div>
                                </div>
                                {/* <!---------------------------------------------------------- End of 2nd item --> */}

                                {/* <!-------------------- 3rd item --></div>         */}
                                <div className="o-grid__item c-gallery__item perfundo">
                                    <a className="perfundo__link qa-link-img1" href="#perfundo-img3">
                                        <img className="headshot" src={require('../assets/2018_team/Brieann_Sobieski_2018_H.jpg')} alt="Brieann_Sobieski" />
                                    </a>
                                    <div id="perfundo-img3" className="perfundo__overlay fadeIn qa-overlay-img1">
                                        <figure className="perfundo__content perfundo__figure">
                                            <img className="perfundo__hoverAction" src={require('../assets/2018_team/Brieann_Sobieski_2018_H.jpg')} alt="Brieann_Sobieski" />
                                            <div className="perfundo__image">
                                                <div className="popup">
                                                    <div className="leftContent">
                                                        <div className="name">Brieann Sobieski</div>
                                                        <div className="postion">Biology Research</div>
                                                        <div className="contribution-line"></div>
                                                        <div className="bio">
                                                            During the project Brieann had just completed her third year at George Mason as a biology major with a minor in kinesiology. 
                                                            As a member of the 2018 team Brieann participated in the data mining of transcription factor associations and public RNA-seq data. 
                                                            Brieann’s research included an investigation of the development of a course for undergraduate students to be trained in the application and theory behind RNA-seq. 
                                                            Brieann reached out to multiple universities in the state of Virginiato compare and contrast the various undergraduate curriculums for bioinformatics. 
                                                            Brieann hopes to continue her work in biology with a focus in clinical research as an MD or MD/PhD.
                                                        </div>
                                                    </div>
                                                    <div className="rightPhoto" id="Brieann_Sobieski"></div>
                                                </div>
                                            </div>
                                        </figure>
                                        <a href="#perfundo-untarget" className="perfundo__close perfundo__control">Close</a>
                                        <a className="perfundo__next perfundo__control qa-next-img1" href="#perfundo-img4">Next</a>
                                        <a className="perfundo__prev perfundo__control" href="#perfundo-img2">Prev</a>
                                    </div>
                                </div>
                                {/* <!---------------------------------------------------------- End of 3rd item --> */}

                                {/* <!------------------- 4th item --> */}
                                <div className="o-grid__item c-gallery__item perfundo">
                                    <a className="perfundo__link" href="#perfundo-img4">
                                        <img className="headshot" src={require('../assets/2018_team/Anushka_Prativadhi_2018_H.jpg')} alt="Anushka_Prativadhi" />
                                    </a>
                                    <div id="perfundo-img4" className="perfundo__overlay fadeIn qa-overlay-img2">
                                        <figure className="perfundo__content perfundo__figure">
                                            <img src={require('../assets/2018_team/Anushka_Prativadhi_2018_H.jpg')} alt="Anushka_Prativadhi" />
                                            <div className="perfundo__image">
                                                <div className="popup">
                                                    <div className="leftContent">
                                                        <div className="name">Anushka Prativadhi</div>
                                                        <div className="postion">Data Science/Database Research</div>
                                                        <div className="contribution-line"></div>
                                                        <div className="bio">
                                                            During the project Anushka was a senior entering into her final year as a Computational and Data Science major at George Mason. 
                                                            As a member of the 2018 team Anushka worked in the programming and architecture of the early version of TATA. 
                                                            Anushka initially focused on developing a SQL database to hold the transcription factor interactions identified by the biology researchers. 
                                                            In addition todeveloping and maintaining the database throughout the summer, Anushka also aided in the coding of the webtool. 
                                                            The python scripts used to display and derived graphical output was first coded and researched by Anushka. 
                                                            Anushka plans to continue using her data science experience in the professional world.
                                                        </div>
                                                    </div>
                                                    <div className="rightPhoto" id="Anushka_Prativadhi"></div>
                                                </div>
                                            </div>
                                        </figure>
                                        <a href="#perfundo-untarget" className="perfundo__close perfundo__control">Close</a>
                                        <a className="perfundo__next perfundo__control qa-next-img2" href="#perfundo-img5">Next</a>
                                        <a className="perfundo__prev perfundo__control" href="#perfundo-img3">Prev</a>
                                    </div>
                                </div>
                                {/* <!---------------------------------------------------------- End of 4th item --> */}


                                {/* <!----------------- 5th item -->      */}
                                <div className="o-grid__item c-gallery__item perfundo">
                                    <a className="perfundo__link" href="#perfundo-img5">
                                        <img className="headshot" src={require('../assets/2018_team/Erica_Bang_2018_H.jpg')} alt="Erica_Bang" />
                                    </a>
                                    <div id="perfundo-img5" className="perfundo__overlay fadeIn qa-overlay-img3">
                                        <figure className="perfundo__content perfundo__figure">
                                            <img src={require('../assets/2018_team/Erica_Bang_2018_H.jpg')} alt="Erica_Bang" />
                                            <div className="perfundo__image">
                                                <div className="popup">
                                                    <div className="leftContent">
                                                        <div className="name">Erica Bang</div>
                                                        <div className="postion">Computer Programmer</div>
                                                        <div className="contribution-line"></div>
                                                        <div className="bio">
                                                            During the project Erica had just completed her second year at George Mason as a Computer Science major. 
                                                            As a member of the 2018 team Erica worked on the early algorithm used in TATA. 
                                                            Erica’s primary focus was on writing the python code that processed and analyzed the user defined data. 
                                                            Erica also participated in developingthe early architecture of the code, including the implementation of python within Flask, connection to HTML, and interaction with SQL. 
                                                            In the later stages of the summer Erica was also instrumental in linking the bioinformatics algorithms to the functional tool. 
                                                            Erica is continuing her studies in computer science and hopes to enter the professional world after graduation.
                                                        </div>
                                                    </div>
                                                    <div className="rightPhoto" id="Erica_Bang"></div>
                                                </div>
                                            </div>
                                        </figure>
                                        <a href="#perfundo-untarget" className="perfundo__close perfundo__control">Close</a>
                                        <a className="perfundo__next perfundo__control qa-next-img6" href="#perfundo-img6">Next</a>
                                        <a className="perfundo__prev perfundo__control qa-prev-img4" href="#perfundo-img4">Prev</a>
                                    </div>
                                </div>
                                {/* <!---------------------------------------------------------- End of 5th item --> */}

                                {/* <!----------------- 6th item -->   */}
                                <div className="o-grid__item c-gallery__item perfundo">
                                    <a className="perfundo__link" href="#perfundo-img6">
                                        <img className="headshot" src={require('../assets/2018_team/Jorge_Fernandez_Davila_2018_H.jpg')} alt="Jorge_Fernandez_Davila" />
                                    </a>
                                    <div id="perfundo-img6" className="perfundo__overlay fadeIn qa-overlay-img3">
                                        <figure className="perfundo__content perfundo__figure">
                                            <img src={require('../assets/2018_team/Jorge_Fernandez_Davila_2018_H.jpg')} alt="Jorge_Fernandez_Davila" />
                                            <div className="perfundo__image">
                                                <div className="popup">
                                                    <div className="leftContent">
                                                        <div className="name">Jorge Fernandez Davila</div>
                                                        <div className="postion">Biology Research</div>
                                                        <div className="contribution-line"></div>
                                                        <div className="bio">
                                                            During this project Jorge was a rising senior entering into his final year as a biology major at George Mason. 
                                                            As a member of the 2018 team Jorge was involved in the data interpretation and transcription factor interaction investigation. 
                                                            Amongst his tasks was the collection of publicly available RNA seq data to test the early version of TATA. 
                                                            Jorge also mined all public data to collect as much information on transcription factor targets to be used by TATA. 
                                                            Jorge plans to continue his studies in biology through a PhD at George Mason University.
                                                        </div>
                                                    </div>
                                                    <div className="rightPhoto" id="Jorge_Fernandez_Davila"></div>
                                                </div>
                                            </div>
                                        </figure>
                                        <a href="#perfundo-untarget" className="perfundo__close perfundo__control">Close</a>
                                        <a className="perfundo__next perfundo__control qa-next-img7" href="#perfundo-img7">Next</a>
                                        <a className="perfundo__prev perfundo__control qa-prev-img3" href="#perfundo-img5">Prev</a>
                                    </div>
                                </div>
                                {/* <!---------------------------------------------------------- End of 6th item --> */}

                                {/* <!----------------- 7th item -->     */}
                                <div className="o-grid__item c-gallery__item perfundo">
                                    <a className="perfundo__link" href="#perfundo-img7">
                                        <img className="headshot" src={require('../assets/2018_team/Olga_Kukudzhanova_2018_H.jpg')} alt="Olga_Kukudzhanova" />
                                    </a>
                                    <div id="perfundo-img7" className="perfundo__overlay fadeIn qa-overlay-img3">
                                        <figure className="perfundo__content perfundo__figure">
                                            <img src={require('../assets/2018_team/Olga_Kukudzhanova_2018_H.jpg')} alt="Olga_Kukudzhanova" />
                                            <div className="perfundo__image">
                                                <div className="popup">
                                                    <div className="leftContent">
                                                        <div className="name">Olga Kukudzhanova</div>
                                                        <div className="postion"> Computer Programmer</div>
                                                        <div className="contribution-line"></div>
                                                        <div className="bio">
                                                            During the project Olgahad just completed her first year at George Mason as an Information Technology major. 
                                                            As a member of the 2018 team Olga worked on the architecture and algorithm of early TATA. 
                                                            Initially Olga focused on writing the python code required to process and analyze the user data. 
                                                            Part of this involved thewriting of a preliminary analysis algorithm to evaluate the relationship between transcription factors and their target genes. 
                                                            In addition to the algorithm, Olga was also integral in the development of the early architecture connecting the python classes with the HTML interface. 
                                                            Olga is continuing her studies in computer scienceand plans to enter the professional world after graduation.
                                                        </div>
                                                    </div>
                                                    <div className="rightPhoto" id="Olga_Kukudzhanova"></div>
                                                </div>
                                            </div>
                                        </figure>
                                        <a href="#perfundo-untarget" className="perfundo__close perfundo__control">Close</a>
                                        <a className="perfundo__next perfundo__control qa-next-img2" href="#perfundo-img8">Next</a>
                                        <a className="perfundo__prev perfundo__control qa-prev-img3" href="#perfundo-img6">Prev</a>
                                    </div>
                                </div>
                                {/* <!---------------------------------------------------------- End of 7th item --> */}

                                {/* <!----------------- 8th item -->        */}
                                <div className="o-grid__item c-gallery__item perfundo">
                                    <a className="perfundo__link" href="#perfundo-img8">
                                        <img className="headshot" src={require('../assets/2018_team/Tamia_Shazer_2018_H.jpg')} alt="Tamia_Shazer" />
                                    </a>
                                    <div id="perfundo-img8" className="perfundo__overlay fadeIn qa-overlay-img3">
                                        <figure className="perfundo__content perfundo__figure">
                                            <img src={require('../assets/2018_team/Tamia_Shazer_2018_H.jpg')} alt="Tamia_Shazer" />
                                            <div className="perfundo__image">
                                                <div className="popup">
                                                    <div className="leftContent">
                                                        <div className="name">Tamia Shazer</div>
                                                        <div className="postion">Biology/Bioinformatics Research</div>
                                                        <div className="contribution-line"></div>
                                                        <div className="bio">
                                                            During the project Tamia was a rising senior entering into her final year at George Mason with a biology major. 
                                                            As a member of the 2018 team Tamia was tasked with research that bridged the biology research with the bioinformatics tools required to analyze the data. 
                                                            Initially Tamia participated in the data mining of transcription factors and public RNA-seq data. 
                                                            However, she quickly transitioned into researchingthe various differential expression algorithms used to analyze the data. 
                                                            Her work was vital in the preliminary R scripts used in the early version of TATA and later was incorporated into the curriculum for the undergraduate course. 
                                                        </div>
                                                    </div>
                                                    <div className="rightPhoto" id="Tamia_Shazer"></div>
                                                </div>
                                            </div>
                                        </figure>
                                        <a href="#perfundo-untarget" className="perfundo__close perfundo__control">Close</a>
                                        <a className="perfundo__next perfundo__control qa-next-img2" href="#perfundo-img9">Next</a>
                                        <a className="perfundo__prev perfundo__control qa-prev-img3" href="#perfundo-img7">Prev</a>
                                    </div>
                                </div>
                                {/* <!---------------------------------------------------------- End of 8th item --> */}

                                {/* <!----------------- 9th item --> */}
                                <div className="o-grid__item c-gallery__item perfundo">
                                    <a className="perfundo__link" href="#perfundo-img9">
                                        <img className="headshot" src={require('../assets/2018_team/Umber_Sheikh_2018_H.jpg')} alt="Umber_Sheikh" />
                                    </a>
                                    <div id="perfundo-img9" className="perfundo__overlay fadeIn qa-overlay-img3">
                                        <figure className="perfundo__content perfundo__figure">
                                            <img src={require('../assets/2018_team/Umber_Sheikh_2018_H.jpg')} alt="Umber_Sheikh" />
                                            <div className="perfundo__image">
                                                <div className="popup">
                                                    <div className="leftContent">
                                                        <div className="name">Umber Sheikh</div>
                                                        <div className="postion">Bioinformatics Research</div>
                                                        <div className="contribution-line"></div>
                                                        <div className="bio">
                                                            During the project Umber was a rising senior entering into her final year as a bioengineering major at George Mason. 
                                                            As a member of the 2018 team Umber participated in researching differential expression tools and writing R scripts to handle, process, and explore RNA-seq data. 
                                                            In addition to writing the R scripts, Umber also developed a preliminary series of exercises as part of the curriculum for the RNA-seq project. 
                                                            Umber’s work on the preliminary tool in 2018 laid the foundation for the batch correction and differential expression algorithms used in 
                                                            the 2019 version of TATA. 
                                                            Umber hopes to continue her work in data analytics with a graduate degree in data science.
                                                        </div>
                                                    </div>
                                                    <div className="rightPhoto" id="Umber_Sheikh"></div>
                                                </div>
                                            </div>
                                        </figure>
                                        <a href="#perfundo-untarget" className="perfundo__close perfundo__control">Close</a>
                                        <a className="perfundo__prev perfundo__control qa-prev-img3" href="#perfundo-img8">Prev</a>
                                    </div>
                                </div>
                                {/* <!---------------------------------------------------------- End of 9th item --> */}
                            </div>
                        </div>
                        {/* <!---------------------------------------------------------- End of 2018 Gallery item --> */}
                    <BotNav/>    
                    </div>
                    
                </body>
                
            </div>
        )
    }
}
export default withRouter(Contributions);
