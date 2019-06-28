import React from 'react';
import './App.css';
import TopNav from './components/topNav';
import { Route } from 'react-router-dom';
import WebTool from './components/webtool';
import Chart from './components/chart';
import TaskPage from './components/taskPage'
import ValidationPage from './components/validationPage'

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
            <ValidationPage/> //added by Quang for testing
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

      </div>
    )
  }
}

export default App;
