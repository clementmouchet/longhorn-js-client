import React, {Component} from 'react';
import {Badge, Col, Nav, NavItem} from 'react-bootstrap';
import xml2js from 'react-native-xml2js';
import _ from 'underscore';

import LonghornApi from '../constants/LonghornApi';

import ProjectTab from "./ProjectTab";
import Alerts from "./Alerts";


export default class ProjectsTabs extends Component {

  constructor(props) {
    super(props);
    this.state = {
      projects: [],
    };
  }

  componentDidMount() {
    this.fetchProjects();
  }

  handleFetchErrors(response) {
    if (!response.ok) {
      response.text().then(text => {
        console.error('ProjectsTabs', response, text);
      });
      throw Error(`${response.statusText}`);
    }
    return response;
  }

  fetchProjects() {
    console.log('fetchProjects', this.state.projects);
    let self = this;
    let projects = [];
    fetch(this.props.longhornUrl + LonghornApi.PATHS.PROJECTS)
      .then(this.handleFetchErrors)
      .then(response => response.text())
      .then((response) => {
        xml2js.parseString(response, function (err, result) {
          console.log('fetchProjects result', result);
          if (_.has(result, 'l') && _.has(result.l, 'e')) {
            projects = result.l.e;
          }
          self.setState({
            projects: projects,
          });
          self.refs.alertList.info({
            message: `${projects.length} projects found`,
          })
        });
      })
      .catch((err) => {
        console.log('fetchProjects', err);
        self.refs.alertList.error({
          headline: `Failed to load projects`,
          message: `${err.toString()}, check the browser console for details.`
        });
      });
  }

  createProject() {
    let project = ProjectTab.getProjectInitialState();
    fetch(this.props.longhornUrl + LonghornApi.PATHS.PROJECTS + LonghornApi.PATHS.NEW, {method: 'POST'})
      .then(this.handleFetchErrors)
      .then(response => response.text())
      .then((response) => {
        console.log('createProject result', response);
        this.setState({
          project: project,
        });
        this.refs.alertList.clear();
        this.refs.alertList.confirm({
          message: `New project created`,
        });
        this.fetchProjects();
      })
      .catch((err) => {
        console.error('createProject', err);
        this.refs.alertList.error({
          headline: `Failed to create new project`,
          message: `${err.toString()}, check the browser console for details.`
        });
      });
  }

  render() {
    return (
      <div>
        <Alerts ref="alertList"/>
        <Col sm={3} md={2}>
          <Nav bsStyle="pills" stacked>
            <NavItem onClick={this.createProject.bind(this)}>
              New project
              <Badge pullRight><i className="fa fa-folder-o" aria-hidden="true"/></Badge>
            </NavItem>
            {
              this.state.projects.sort((a, b) => a - b).reverse().map((projectId, index) => (
                <NavItem eventKey={"project_" + projectId}
                         key={"project_" + index}
                         onClick={this.refs.projectDetails.fetchProject.bind(this.refs.projectDetails, projectId)}>
                  Project {projectId}
                  <Badge pullRight><i className="fa fa-folder" aria-hidden="true" /></Badge>
                </NavItem>
              ))
            }
          </Nav>
        </Col>
        <ProjectTab ref="projectDetails"
                    projectsTabs={this}
                    alertList={this.refs.alertList}
                    longhornUrl={this.props.longhornUrl}/>
      </div>
    );
  }
};