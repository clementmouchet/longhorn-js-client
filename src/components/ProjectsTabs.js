import React, {Component} from 'react';
import {
  Badge,
  Button,
  Col,
  Collapse,
  FormControl,
  FormGroup,
  ListGroup,
  ListGroupItem,
  Nav,
  NavItem,
  OverlayTrigger,
  Tab
} from 'react-bootstrap';
import {AlertList} from "react-bs-notifier";
import xml2js from 'react-native-xml2js';
import _ from 'underscore';
import s from 'underscore.string';
import $ from 'jquery'
import LanguageSelect from "./LanguageSelect";
import LonghornApi from '../constants/LonghornApi';
import Tooltips from '../constants/Tooltips';


export default class ProjectsTabs extends Component {

  constructor(props) {
    super(props);
    this.state = {
      okapiLanguages: [],
      projects: [],
      project: ProjectsTabs.getProjectInitialState(),
      stepContainerOpen: false,
      alerts: [],
    };
  }

  static getProjectInitialState() {
    return {
      id: null,
      inputFiles: [],
      outputFiles: []
    };
  }

  componentDidMount() {
    this.fetchProjects();
  }

  handleFetchErrors(response) {
    if (!response.ok) {
      response.text().then(text => {
        console.error('handleFetchErrors', response, text);
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
            alerts: [...self.state.alerts, {
              id: (new Date()).getTime(),
              type: 'info',
              message: `${projects.length} projects found`,
            }]
          });
        });
      })
      .catch((err) => {
        console.log('fetchProjects', err);
        this.setState({
          alerts: [...this.state.alerts, {
            id: (new Date()).getTime(),
            type: 'danger',
            headline: `Failed to load projects`,
            message: `${err.toString()}, check the browser console for details.`
          }]
        });
      });
  }

  fetchProject(id) {
    let self = this;
    let project = ProjectsTabs.getProjectInitialState();
    project.id = id;

    console.log('fetchProject', this.state.project);

    this.fetchProjectInputFiles(id);
    this.fetchProjectOutputFiles(id);

    this.setState({
      project: Object.assign(self.state.project, project),
      alerts: []
    });
  }

  createProject() {
    let project = ProjectsTabs.getProjectInitialState();
    fetch(this.props.longhornUrl + LonghornApi.PATHS.PROJECTS + LonghornApi.PATHS.NEW, {method: 'POST'})
      .then(this.handleFetchErrors)
      .then(response => response.text())
      .then((response) => {
        console.log('createProject result', response);
        this.setState({
          project: project,
          alerts: [{
            id: (new Date()).getTime(),
            type: 'success',
            message: `New project created`,
          }]
        });
        this.fetchProjects();
      })
      .catch((err) => {
        console.error('createProject', err);
        this.setState({
          alerts: [{
            id: (new Date()).getTime(),
            type: 'danger',
            headline: `Failed to create new project`,
            message: `${err.toString()}, check the browser console for details.`
          }]
        });
      });
  }

  deleteProject(id) {
    let project = {id: null, inputFiles: [], outputFiles: []};
    fetch(this.props.longhornUrl + LonghornApi.PATHS.PROJECTS + id, {method: 'DELETE'})
      .then(this.handleFetchErrors)
      .then(response => response.text())
      .then((response) => {
        console.log('deleteProject result', response);
        this.setState({
          project: project,
          alerts: [this.state.alerts, {
            id: (new Date()).getTime(),
            type: 'success',
            message: `Project ${id}: Deleted successfully`,
          }]
        });
        this.fetchProjects();
      })
      .catch((err) => {
        console.error('deleteProject', err);
        this.setState({
          alerts: [this.state.alerts, {
            id: (new Date()).getTime(),
            type: 'danger',
            headline: `Project ${id}: Failed to delete project`,
            message: `${err.toString()}, check the browser console for details.`
          }]
        });
      });
  }

  fetchProjectInputFiles(id) {
    let self = this;
    let project = {};
    return fetch(this.props.longhornUrl + LonghornApi.PATHS.PROJECTS + id + LonghornApi.PATHS.INPUT_FILES)
      .then(this.handleFetchErrors)
      .then(response => response.text())
      .then((response) => {
        xml2js.parseString(response, function (err, result) {
          console.log('fetchProjectInputFiles result', result);
          if (_.has(result, 'l') && _.has(result.l, 'e')) {
            project.inputFiles = result.l.e;
            self.setState({
              project: Object.assign(self.state.project, project),
              alerts: [...self.state.alerts, {
                id: (new Date()).getTime(),
                type: 'info',
                message: `Project ${id}: has ${project.inputFiles.length} input files`,
              }]
            });
          }
        });
      })
      .catch((err) => {
        console.error('fetchProjectInputFiles', err);
        this.setState({
          alerts: [...this.state.alerts, {
            id: (new Date()).getTime(),
            type: 'danger',
            headline: `Project ${id}: Failed to fetch project input files`,
            message: `${err.toString()}, check the browser console for details.`
          }]
        });
      });
  }

  fetchProjectOutputFiles(id) {
    let self = this;
    let project = {};
    return fetch(this.props.longhornUrl + LonghornApi.PATHS.PROJECTS + id + LonghornApi.PATHS.OUTPUT_FILES)
      .then(this.handleFetchErrors)
      .then(response => response.text())
      .then((response) => {
        xml2js.parseString(response, function (err, result) {
          console.log('fetchProjectOutputFiles result', result);
          if (_.has(result, 'l') && _.has(result.l, 'e')) {
            project.outputFiles = result.l.e;
            self.setState({
              project: Object.assign(self.state.project, project),
              alerts: [...self.state.alerts, {
                id: (new Date()).getTime(),
                type: 'info',
                message: `Project ${id}: has ${project.outputFiles.length} output files`,
              }]
            });
          }
        });
      })
      .catch((err) => {
        console.error('fetchProjectOutputFiles', err);
        this.setState({
          alerts: [...this.state.alerts, {
            id: (new Date()).getTime(),
            type: 'danger',
            headline: `Project ${id}: Failed to fetch project input files`,
            message: `${err.toString()}, check the browser console for details.`
          }]
        });
      });
  }

  uploadInput(id, event) {
    console.log('uploadInput', 'Project ' + id, $(event.target).prop('files'));

    let fileList = $(event.target).prop('files');

    if (!fileList || _.isEmpty(fileList)) {
      return null;
    }

    if (fileList.length === 1 && s.contains(fileList[0].name, 'zip')) {
      this.uploadInputFilesZip(id, fileList[0]);
    } else {
      this.uploadInputFiles(id, fileList);
    }
  }

  uploadBatchConfFile(id, event) {
    console.log('uploadBatchConfFile', 'Project ' + id, $(event.target).prop('files'));

    let self = this;
    let fileList = $(event.target).prop('files');
    let overrideStepParams = this.refs.overrideStepFormControl.refs.overrideStepParams.value;


    if (!fileList || _.isEmpty(fileList)) {
      return null;
    }

    if (fileList.length === 1 && s.contains(fileList[0].name, 'bconf')) {
      let file = fileList[0];
      let data = new FormData();
      data.append('batchConfiguration', file);
      if (!_.isEmpty(overrideStepParams)) {
        data.append('overrideStepParams', overrideStepParams);
      }

      const url = self.props.longhornUrl + LonghornApi.PATHS.PROJECTS + id + LonghornApi.PATHS.BATCH_CONFIGURATION;

      return fetch(url, {method: 'POST', body: data})
        .then(this.handleFetchErrors)
        .then(response => response.text())
        .then((response) => {
          console.log('uploadBatchConfFile', 'Project ' + id, file, data, response);
          this.setState({
            alerts: [...this.state.alerts, {
              id: (new Date()).getTime(),
              type: 'success',
              message: `Project ${id}: Uploaded BCONF ${file.name}`,
            }]
          });
          this.refs.inputBatchConfFile.value = null;
        })
        .catch((err) => {
          console.error('uploadBatchConfFile', 'Project ' + id, file, err);
          this.setState({
            alerts: [...this.state.alerts, {
              id: (new Date()).getTime(),
              type: 'danger',
              headline: `Project ${id}: Failed to upload BCONF ${file.name}`,
              message: `${err.toString()}, check the browser console for details.`
            }]
          });
          self.refs.inputBatchConfFile.value = null;
        });
    } else {
      this.setState({
        alerts: [...this.state.alerts, {
          id: (new Date()).getTime(),
          type: 'warning',
          headline: `Please select a valid BCONF`,
          message: `The selected file is not a .bconf`
        }]
      });
      self.refs.inputBatchConfFile.value = null;
    }
  }

  uploadInputFiles(id, fileList) {
    console.log('uploadInputFiles', 'Project ' + id, fileList);

    let self = this;
    _.each(fileList, function (file) {
      console.log(file);

      let data = new FormData();
      data.append('inputFile', file);

      const url = self.props.longhornUrl + LonghornApi.PATHS.PROJECTS + id + LonghornApi.PATHS.INPUT_FILES;

      return fetch(url + file.name, {method: 'PUT', body: data})
        .then(self.handleFetchErrors)
        .then(response => response.text())
        .then((response) => {
          console.log('uploadInputFiles', 'Project ' + id, file, data, response);
          self.setState({
            alerts: [...self.state.alerts, {
              id: (new Date()).getTime(),
              type: 'success',
              message: `Project ${id}: Uploaded input file ${file.name}`,
            }]
          });
          self.fetchProjectInputFiles(id);
          self.refs.inputFiles.value = null;
        })
        .catch((err) => {
          console.error('uploadInputFiles', 'Project ' + id, file, err);
          self.setState({
            alerts: [...self.state.alerts, {
              id: (new Date()).getTime(),
              type: 'danger',
              headline: `Project ${id}: Failed to upload input file ${file.name}`,
              message: `${err.toString()}, check the browser console for details.`
            }]
          });
          self.fetchProjectInputFiles(id);
          self.refs.inputFiles.value = null;
        });
    })
  }

  uploadInputFilesZip(id, file) {
    console.log('uploadInputFilesZip', 'Project ' + id, file);
    let self = this;
    let data = new FormData();
    data.append('inputFile', file);

    const url = self.props.longhornUrl + LonghornApi.PATHS.PROJECTS + id + LonghornApi.PATHS.INPUT_FILES_ZIP;

    return fetch(url, {method: 'POST', body: data})
      .then(this.handleFetchErrors)
      .then(response => response.text())
      .then((response) => {
        console.log('uploadInputFilesZip', 'Project ' + id, file, data, response);
        this.setState({
          alerts: [...this.state.alerts, {
            id: (new Date()).getTime(),
            type: 'success',
            message: `Project ${id}: Uploaded zip ${file.name}`,
          }]
        });
        this.fetchProjectInputFiles(id);
        this.refs.inputFiles.value = null;
      })
      .catch((err) => {
        console.error('uploadInputFilesZip', 'Project ' + id, file, err);
        this.setState({
          alerts: [...this.state.alerts, {
            id: (new Date()).getTime(),
            type: 'danger',
            headline: `Project ${id}: Failed to upload zip ${file.name}`,
            message: `${err.toString()}, check the browser console for details.`
          }]
        });
        this.fetchProjectInputFiles(id);
        this.refs.inputFiles.value = null;
      });
  }

  executeTask(id) {
    let sourceLanguageCode = this.refs.sourceLanguageSelect.refs.sourceLanguageCode.el.val();
    let targetLanguageCodes = this.refs.targetLanguageSelect.refs.targetLanguageCodes.el.val();

    console.log('executeTask', 'Project ' + id, sourceLanguageCode, targetLanguageCodes);

    let self = this;

    let url = this.props.longhornUrl + LonghornApi.PATHS.PROJECTS + id + LonghornApi.PATHS.TASKS_EXECUTE;
    if (!_.isEmpty(sourceLanguageCode) && !_.isEmpty(targetLanguageCodes) && !_.isArray(targetLanguageCodes)) {
      url = url + '/' + encodeURIComponent(sourceLanguageCode) + '/' + encodeURIComponent(targetLanguageCodes);
    } else if (!_.isEmpty(sourceLanguageCode) && !_.isEmpty(targetLanguageCodes) && _.isArray(targetLanguageCodes)) {
      let targets = [];
      _.each(targetLanguageCodes, function (languageCode) {
        targets.push('targets=' + encodeURIComponent(languageCode));
      });
      url = url + '/' + sourceLanguageCode + '?' + targets.join('&');
    }

    return fetch(url, {method: 'POST'})
      .then(this.handleFetchErrors)
      .then(response => response.text())
      .then((response) => {
        console.log('executeTask result', response);
        this.setState({
          alerts: [...this.state.alerts, {
            id: (new Date()).getTime(),
            type: 'success',
            message: `Project ${id}: Tasks executed`,
          }]
        });
        self.fetchProjectOutputFiles(id);
      })
      .catch((err) => {
        console.error('executeTask fetch', err);
        this.setState({
          alerts: [...this.state.alerts, {
            id: (new Date()).getTime(),
            type: 'danger',
            headline: `Project ${id}: Failed to execute tasks`,
            message: `${err.toString()}, check the browser console for details.`
          }]
        });
        self.fetchProjectOutputFiles(id);
      });
  }

  renderProjectList() {
    let projects = this.state.projects;
    console.log('renderProjectList', projects);
    if (!_.isEmpty(projects)) {
      console.log('renderProjectList', projects);
      return projects.sort((a, b) => a - b).reverse().map((projectId, index) => (
        <NavItem eventKey={"project_" + projectId} onClick={this.fetchProject.bind(this, projectId)}>
          Project {projectId}
          <Badge pullRight onClick={this.deleteProject.bind(this, projectId)}>
            <i className="fa fa-trash" aria-hidden="true"/>
          </Badge>
        </NavItem>
      ));
    }
  }

  renderProject() {
    let project = this.state.project;
    console.log('renderProject', project);
    return (
      <Tab.Pane eventKey={"project_" + project.id}>
        <Col md={12}>
          <h3>Project {project.id}</h3>
        </Col>
        <Col md={6}>
          {this.renderProjectInputBatchConfFile()}
          {this.renderProjectInputFiles()}
        </Col>
        <Col md={6}>
          {this.renderProjectTasksExecute()}
          {this.renderProjectOutputFiles()}
        </Col>
      </Tab.Pane>
    )
  }

  renderProjectInputBatchConfFile() {
    let project = this.state.project;
    console.log('renderProjectInputBatchConfFile', project);
    return (
      <ListGroup>
        <ListGroupItem bsStyle="info">
          <strong>&#9312;</strong> Upload batch configuration
          <Badge pullRight bsClass=""><i className="fa fa-file-archive-o" aria-hidden="true"/></Badge>
        </ListGroupItem>
        <OverlayTrigger placement="bottom" overlay={Tooltips.OPTIONAL}
                        onBlur={() => this.setState({stepContainerOpen: false})}>
          <ListGroupItem>
            <FormGroup controlId="formControlsTextarea">
              <FormControl
                componentClass="textarea"
                ref="overrideStepFormControl"
                inputRef="overrideStepParams"
                rows="3"
                placeholder="Override Step Parameters"
                onFocus={() => this.setState({stepContainerOpen: !this.state.stepContainerOpen})}/>
            </FormGroup>
            <Collapse in={this.state.stepContainerOpen}>
              <FormGroup controlId="formControlsTextarea">
                <small className="text-info">
                  <i className="fa fa-info-circle" aria-hidden="true"/> Syntax Example:
                </small>
                <pre>
                  <small>
                    <code>
                      &lt;l&gt;<br/>
                      &nbsp;&nbsp;&lt;e&gt;<br/>
                      &nbsp;&nbsp;&nbsp;&nbsp;
                      &lt;stepClassName&gt;net.sf.okapi.someStepName&lt;/stepClassName&gt;<br/>
                      &nbsp;&nbsp;&nbsp;&nbsp;
                      &lt;stepParams&gt;someParam=value&lt;/stepParams&gt;<br/>
                      &nbsp;&nbsp;&lt;/e&gt;<br/>
                      &lt;/l&gt;
                    </code>
                  </small>
                </pre>
              </FormGroup>
            </Collapse>
          </ListGroupItem>
        </OverlayTrigger>
        <Button componentClass="div" block bsStyle="primary" bsSize="large" className="btn-file">
          <input type="file"
                 ref="inputBatchConfFile"
                 onChange={this.uploadBatchConfFile.bind(this, project.id)}/>
          Select Batch Configuration File
        </Button>
      </ListGroup>
    )
  }

  renderProjectInputFiles() {
    let project = this.state.project;
    console.log('renderProjectInputFiles', project);
    return (
      <ListGroup>
        <ListGroupItem bsStyle="info">
          <strong>&#9313;</strong> Upload input files or Okapi work pack
          <Badge pullRight bsClass=""><i className="fa fa-files-o" aria-hidden="true"/></Badge>
        </ListGroupItem>
        <Button componentClass="div" block bsStyle="primary" bsSize="large" className="btn-file">
          <input type="file"
                 multiple
                 className="pull-left"
                 ref="inputFiles"
                 onChange={this.uploadInput.bind(this, project.id)}/>
          Select Input File(s)
        </Button>
        {
          project.inputFiles.map((filename) => (
            <ListGroupItem
              href={this.props.longhornUrl + LonghornApi.PATHS.PROJECTS + project.id + LonghornApi.PATHS.INPUT_FILES + filename}
              target="_blank">
              {filename}
              <Badge><i className="fa fa-download" aria-hidden="true"/></Badge>
            </ListGroupItem>)
          )
        }
      </ListGroup>
    )
  }

  renderProjectTasksExecute() {
    let project = this.state.project;
    console.log('renderProjectTasksExecute', project);
    return (
      <ListGroup>
        <ListGroupItem bsStyle="info">
          <strong>&#9314;</strong> Configure language
          <span className="hidden-md"> combination(s)</span> & Execute pipeline
          <Badge pullRight bsClass=""><i className="fa fa-cog" aria-hidden="true"/></Badge>
        </ListGroupItem>
        <OverlayTrigger placement="bottom" overlay={Tooltips.OPTIONAL}>
          <ListGroupItem>
            <LanguageSelect ref="sourceLanguageSelect" inputRef="sourceLanguageCode"/>
          </ListGroupItem>
        </OverlayTrigger>
        <OverlayTrigger placement="bottom" overlay={Tooltips.OPTIONAL}>
          <ListGroupItem>
            <LanguageSelect ref="targetLanguageSelect" multiple={true} inputRef="targetLanguageCodes"/>
          </ListGroupItem>
        </OverlayTrigger>
        <Button bsStyle="primary" bsSize="large" block onClick={this.executeTask.bind(this, project.id)}>
          Execute pipeline
        </Button>
      </ListGroup>
    )
  }

  renderProjectOutputFiles() {
    let project = this.state.project;
    console.log('renderProjectOutputFiles', project);
    return (
      <ListGroup>
        <ListGroupItem bsStyle="info">
          <strong>&#9315;</strong> Download Output Files
          <Badge pullRight bsClass=""><i className="fa fa-download" aria-hidden="true"/></Badge>
        </ListGroupItem>
        <Button
          href={this.props.longhornUrl + LonghornApi.PATHS.PROJECTS + project.id + LonghornApi.PATHS.OUTPUT_FILES_ZIP}
          download={'project_' + project.id + '_output.zip'}
          bsStyle="primary" bsSize="large" block>
          Download work pack
        </Button>
        {
          project.outputFiles.map((filename) => (
            <ListGroupItem
              href={this.props.longhornUrl + LonghornApi.PATHS.PROJECTS + project.id + LonghornApi.PATHS.OUTPUT_FILES + filename}
              target="_blank">
              {filename}
              <Badge pullRight bsClass=""><i className="fa fa-download" aria-hidden="true"/></Badge>
            </ListGroupItem>)
          )
        }
      </ListGroup>
    )
  }

  dismissAlert(alert) {
    const alerts = this.state.alerts;

    // find the index of the alert that was dismissed
    const idx = alerts.indexOf(alert);

    if (idx >= 0) {
      this.setState({
        // remove the alert from the array
        alerts: [...alerts.slice(0, idx), ...alerts.slice(idx + 1)]
      });
    }
  }

  render() {
    let projects = this.renderProjectList();
    let project = this.renderProject();

    return (
      <Tab.Container id="projects-container" className="projects-container">
        <div className="clearfix">
          <AlertList alerts={this.state.alerts} timeout={5000} onDismiss={this.dismissAlert.bind(this)}/>
          <Col sm={3} md={2}>
            <Nav bsStyle="pills" stacked>
              <NavItem onClick={this.createProject.bind(this)}>
                New project
                <Badge pullRight><i className="fa fa-folder" aria-hidden="true"/></Badge>
              </NavItem>
              {projects}
            </Nav>
          </Col>
          <Col sm={9} md={10}>
            <Tab.Content>
              {project}
            </Tab.Content>
          </Col>
        </div>
      </Tab.Container>
    );
  }
};