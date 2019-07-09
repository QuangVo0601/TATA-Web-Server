import React from 'react';
import './App.css';
import TopNav from './components/topNav';
import { Route } from 'react-router-dom';
import WebTool from './components/webtool';
import Chart from './components/chart';
import ValidationPage from './components/validationPage'
import TaskPage from './components/taskPage'
import GroupingPage from './components/groupingPage'
import BatchPage from './components/batchPage'
import AlgorithmPage from './components/algorithmPage'

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
            // <Chart
            // />
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

      </div>
    )
  }
}

export default App;
