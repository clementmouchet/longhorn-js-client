import React, {Component} from 'react';

import NavBar from "./components/Navbar";
import ProjectsTabs from "./components/ProjectsTabs";

import './.css/App.css';

export default class App extends Component {
  render() {
    return (
      <div className="App">
        <NavBar/>
        <ProjectsTabs longhornUrl="http://localhost:8080/okapi-longhorn"/>
      </div>
    );
  }
};