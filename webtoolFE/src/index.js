import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {BrowserRouter as Router} from 'react-router-dom';

// Look for html file, root actual html dom
// Render App.js
ReactDOM.render(
<Router>
   <App /> 
</Router>


, document.getElementById('root')); 


