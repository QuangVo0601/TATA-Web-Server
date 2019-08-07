import React from 'react';
import './App.css';
import { Route } from 'react-router-dom';
import HomePage from './components/homePage';
import ValidationPage from './components/validationPage'
import TaskPage from './components/taskPage'
import GroupingPage from './components/groupingPage'
import BatchPage from './components/batchPage'
import AlgorithmPage from './components/algorithmPage'
import Error from './components/errorPage'
import ResultPage from './components/resultPage'
import LoadModal from './components/loadingModal'
import Contribute from './components/Contributions'
import Loading from './components/loadingPage'
import FileUpload from './components/fileUpload'
import ContactForm from './components/ContactPopUp'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      percent:0,
    }
  }

    // include this in continue button handler
    // interval will start on button click
    startProgress() {
      let that=this
      console.log('in app')
      setInterval(() => {
          if (that.state.percent>=99.00) {
              clearInterval(this.startProgress)
          }
          else {
              this.setState({ percent: this.state.percent += 0.02 })
          }
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
  stopProgress = () => {
      clearInterval(this.startProgress);
      this.setState({ percent: 100.00 })
  }
  //#################################################################################################

  render() {
    return (
      // Render and route specific js file depend on given exact path
      <div className="app-container">
        <Route exact path="/" //need to be changed to Webtool later
          render={() => (
            <HomePage
            />
          )
          }
        />
        <Route exact path="/validation"
          render={() => (
            <ValidationPage /> //added by Quang for testing
          )
          }
        />
        <Route exact path="/taskpage"
          render={() => (
            <TaskPage
            />
          )
          }
        />
        <Route exact path="/groupingpage"
          render={() => (
            <GroupingPage
            />
          )
          }
        />
        <Route exact path="/batchpage"
          render={() => (
            <BatchPage
            />
          )
          }
        />
        <Route exact path="/algorithmpage"
          render={() => (
            <AlgorithmPage
              stopProgress={this.stopProgress}
            />
          )
          }
        />
        <Route exact path="/error"
          render={() => (
            <Error
            />
          )
          }
        />
        <Route exact path="/fileupload"
          render={() => (
            <FileUpload
            />
          )
          }
        />
        <Route exact path="/loading"
          render={() => (
            <Loading
              percent={this.state.percent}
              startProgress={this.startProgress}
            />
          )
          }
        /> 
        <Route exact path="/resultpage"
          render={() => (
            <ResultPage
            />
          )
          }
        />
        {/*  For testing purpose only */}
        <Route exact path="/loadmodal"
          render={() => (
            <LoadModal
            />
          )
          }
        />

        <Route exact path="/contributions" //need to be changed to Webtool later
          render={() => (
            <Contribute
            />
          )
          }
        />
        <Route exact path="/contact" //need to be changed to Webtool later
          render={() => (
            <ContactForm
              closePopup={this.togglePopup.bind(this)}
            />
          )
          }
        />
      </div>
    )
  }
}

export default App;
