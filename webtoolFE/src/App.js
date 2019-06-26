import React from 'react';
import './App.css';
import TopNav from './components/topNav';
import { Route } from 'react-router-dom';
import WebTool from './components/webtool';
import Validation from './components/validationPage';
import Chart from './components/chart'

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
          <WebTool/>
        )
        }
      />
      <Route exact path="/validation"
        render={() => (
          /* <Chart /> */
          <Validation />
        )
        }
      />
      <Route exact path="/hello"
        render={() => (
          <h1>Hi there</h1> 
        )
        }
      />

    </div>
  )
}
  }
  
export default App;
