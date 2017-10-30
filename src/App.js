import React, {Component} from 'react';
import {Tab} from "react-bootstrap";

import NavBar from "./components/Navbar";
import ProjectsTabs from "./components/ProjectsTabs";

import './.css/App.css';

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      longhornUrl: process.env.REACT_APP_LONGHORN_URL || 'https://okapi-longhorn.herokuapp.com'
    };
  }

  render() {
    return (
      <div className="App">
        <NavBar/>
        <Tab.Container id="projects-container" className="projects-container">
          <ProjectsTabs ref="projectsTabs"
                        longhornUrl={this.state.longhornUrl}/>
        </Tab.Container>
      </div>
    );
  }
};