import React from 'react';
import './App.css';
import { Route } from 'react-router-dom';
import WebTool from './components/webtool';
import HomePage from './components/homePage';
import ValidationPage from './components/validationPage'
import TaskPage from './components/taskPage'
import GroupingPage from './components/groupingPage'
import BatchPage from './components/batchPage'
import AlgorithmPage from './components/algorithmPage'
import Dnd from './components/dummyDND'
import Error from './components/errorPage'
import Loading from './components/loadingPage'
import ResultPage from './components/resultPage'
import LoadModal from './components/loadingModal'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  render() {
    return (
      // Render and route specific js file depend on given exact path
      <div className="app-container">
        <Route exact path="/"
          render={() => (
            <WebTool />
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
            />
          )
          }
        />
        <Route exact path="/dummydnd"
          render={() => (
            <Dnd
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
        <Route exact path="/loading"
          render={() => (
            <Loading
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
        <Route exact path="/homepage" //need to be changed to Webtool later
          render={() => (
            <HomePage
            />
          )
          }
        />        
      </div>
    )
  }
}

export default App;
