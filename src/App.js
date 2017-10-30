import React, {Component} from 'react';

import NavBar from "./components/Navbar";
import ProjectsTabs from "./components/ProjectsTabs";

import './.css/App.css';

export default class App extends Component {
  render() {
    return (
      <div className="App">
        <NavBar/>
        <ProjectsTabs longhornUrl={process.env.REACT_APP_LONGHORN_URL || 'https://okapi-longhorn.herokuapp.com'}/>
      </div>
    );
  }
};