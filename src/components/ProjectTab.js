import React, {Component} from 'react';
import {Button, Col, Tab} from 'react-bootstrap';

import LonghornApi from '../constants/LonghornApi';

import ProjectInputBatchConfFile from "./ProjectInputBatchConfFile";
import ProjectInputFiles from "./ProjectInputFiles";
import ProjectOutputFiles from "./ProjectOutputFiles";
import ProjectExecutePipeline from "./ProjectExecutePipeline";


export default class ProjectTab extends Component {

  constructor(props) {
    super(props);
    this.state = {
      okapiLanguages: [],
      project: ProjectTab.getProjectInitialState(),
      stepContainerOpen: false,
    };
  }

  static getProjectInitialState() {
    return {
      id: null,
      inputFiles: [],
      outputFiles: []
    };
  }

  handleFetchErrors(response) {
    if (!response.ok) {
      response.text().then(text => {
        console.error('ProjectTab', response, text);
      });
      throw Error(`${response.statusText}`);
    }
    return response;
  }

  deleteProject(id) {
    let project = {id: null, inputFiles: [], outputFiles: []};
    fetch(this.props.longhornUrl + LonghornApi.PATHS.PROJECTS + id, {method: 'DELETE'})
      .then(this.handleFetchErrors)
      .then(response => response.text())
      .then((response) => {
        console.log('deleteProject result', response);
        this.setState({
          project: project
        });
        this.props.alertList.confirm({
          message: `Project ${id}: Deleted successfully`,
        });
        this.props.projectsTabs.fetchProjects();
      })
      .catch((err) => {
        console.error('deleteProject', err);
        this.props.alertList.error({
          headline: `Project ${id}: Failed to delete project`,
          message: `${err.toString()}, check the browser console for details.`
        });
      });
  }

  fetchProject(id) {
    let project = ProjectTab.getProjectInitialState();
    project.id = id;

    console.log('fetchProject', this.state.project);

    this.refs.projectInputFiles.fetchProjectInputFiles(id);
    this.refs.projectOutputFiles.fetchProjectOutputFiles(id);

    this.setState({
      project: Object.assign(this.state.project, project),
    });
    this.props.alertList.clear();
  }

  render() {
    return (
      <Col sm={9} md={10}>
        <Tab.Content>
          <Tab.Pane eventKey={"project_" + this.state.project.id}>
            <Col md={12}>
              <h3>
                <span>Project {this.state.project.id}</span>
                <Button type="button"
                        bsStyle="link"
                        onClick={this.deleteProject.bind(this, this.state.project.id)}>
                  <i className="fa fa-trash" aria-hidden="true"/> Delete
                </Button>
              </h3>
            </Col>
            <Col md={6}>
              <ProjectInputBatchConfFile project={this.state.project}
                                         alertList={this.props.alertList}
                                         longhornUrl={this.props.longhornUrl}/>
              <ProjectInputFiles ref="projectInputFiles"
                                 project={this.state.project}
                                 alertList={this.props.alertList}
                                 longhornUrl={this.props.longhornUrl}/>
            </Col>
            <Col md={6}>
              <ProjectExecutePipeline ref="projectExecutePipeline"
                                      projectTab={this}
                                      project={this.state.project}
                                      alertList={this.props.alertList}
                                      longhornUrl={this.props.longhornUrl}/>
              <ProjectOutputFiles ref="projectOutputFiles"
                                  project={this.state.project}
                                  alertList={this.props.alertList}
                                  longhornUrl={this.props.longhornUrl}/>
            </Col>
          </Tab.Pane>
        </Tab.Content>
      </Col>
    );
  }
};