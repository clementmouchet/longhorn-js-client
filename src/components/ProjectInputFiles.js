import React, {Component} from 'react';
import {Badge, Button, ListGroup, ListGroupItem, ProgressBar} from 'react-bootstrap';
import xml2js from 'react-native-xml2js';
import _ from 'underscore';
import s from 'underscore.string';

import LonghornApi from '../constants/LonghornApi';


export default class ProjectInputFiles extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      uploads: []
    };
  }

  componentWillReceiveProps() {
    this.setState({
      loading: false,
      uploads: []
    });
  }

  handleFetchErrors(response) {
    if (!response.ok) {
      response.text().then(text => {
        console.error('ProjectInputFiles', response, text);
      });
      throw Error(`${response.statusText}`);
    }
    return response;
  }

  fetchProjectInputFiles(id) {
    let self = this;
    let project = {};

    this.setState({
      loading: true
    });

    return fetch(this.props.longhornUrl + LonghornApi.PATHS.PROJECTS + id + LonghornApi.PATHS.INPUT_FILES)
      .then(this.handleFetchErrors)
      .then(response => response.text())
      .then((response) => {
        xml2js.parseString(response, function (err, result) {
          console.debug('fetchProjectInputFiles result', result);
          self.setState({
            loading: false
          });
          if (_.has(result, 'l') && _.has(result.l, 'e')) {
            self.props.project.inputFiles = result.l.e;
            self.setState({
              project: Object.assign(self.props.project, project),
            });
            self.props.alertList.info({
              message: `Project ${id}: has ${self.props.project.inputFiles.length} input files`,
            })
          }
        });
      })
      .catch((err) => {
        console.error('fetchProjectInputFiles', err);
        this.setState({
          loading: false
        });
        this.props.alertList.error({
          headline: `Project ${id}: Failed to fetch project input files`,
          message: `${err.toString()}, check the browser console for details.`
        });
      });
  }

  uploadInput(id, event) {
    console.debug('uploadInput', 'Project ' + id, event.target.files);

    let fileList = event.target.files;

    if (!fileList || _.isEmpty(fileList)) {
      return null;
    }

    if (s.contains(fileList[0].name, 'zip') || s.contains(fileList[0].name, 'rkp')) {
      this.uploadInputZipFiles(id, fileList);
    } else {
      this.uploadInputFiles(id, fileList);
    }
  }

  uploadInputFiles(id, fileList) {
    console.debug('uploadInputFiles', 'Project ' + id, fileList);

    [...fileList].map((file) => {
      let data = new FormData();
      data.append('inputFile', file);

      const url = this.props.longhornUrl + LonghornApi.PATHS.PROJECTS + id + LonghornApi.PATHS.INPUT_FILES;

      this.addUploadingFile(file.name);

      return fetch(url + file.name, {method: 'PUT', body: data})
        .then(this.handleFetchErrors)
        .then(response => response.text())
        .then((response) => {
          console.debug('uploadInputFiles', 'Project ' + id, file, data, response);
          this.removeUploadingFile(file.name);
          this.props.alertList.confirm({
            message: `Project ${id}: Uploaded input file ${file.name}`,
          });
          this.fetchProjectInputFiles(id);
        })
        .catch((err) => {
          console.error('uploadInputFiles', 'Project ' + id, file, err);
          this.removeUploadingFile(file.name);
          this.props.alertList.error({
            headline: `Project ${id}: Failed to upload input file ${file.name}`,
            message: `${err.toString()}, check the browser console for details.`
          });
          this.fetchProjectInputFiles(id);
        })
    })
  }

  uploadInputZipFiles(id, fileList) {
    console.debug('uploadInputZipFiles', 'Project ' + id, fileList);

    [...fileList].map((file) => {
      let data = new FormData();
      data.append('inputFile', file);

      const url = this.props.longhornUrl + LonghornApi.PATHS.PROJECTS + id + LonghornApi.PATHS.INPUT_FILES_ZIP;

      this.addUploadingFile(file.name);

      return fetch(url, {method: 'POST', body: data})
        .then(this.handleFetchErrors)
        .then(response => response.text())
        .then((response) => {
          console.debug('uploadInputZipFiles', 'Project ' + id, file, data, response);
          this.removeUploadingFile(file.name);
          this.props.alertList.confirm({
            message: `Project ${id}: Uploaded zip ${file.name}`
          });
          this.fetchProjectInputFiles(id);
        })
        .catch((err) => {
          console.error('uploadInputZipFiles', 'Project ' + id, file, err);
          this.removeUploadingFile(file.name);
          this.props.alertList.error({
            headline: `Project ${id}: Failed to upload zip ${file.name}`,
            message: `${err.toString()}, check the browser console for details.`
          });
          this.fetchProjectInputFiles(id);
        });
    })
  }

  addUploadingFile(fileName) {
    this.setState(prevState => ({
      uploads: [...prevState.uploads, fileName]
    }));
  }

  removeUploadingFile(fileName) {
    let uploads = this.state.uploads.filter(upload => upload !== fileName);
    this.setState({uploads: uploads});
  }

  render() {
    return (
      <ListGroup>
        <ListGroupItem bsStyle="info">
          <strong>&#9313;</strong> Upload input files or Okapi work pack
          <Badge pullRight bsClass=""><i className="fa fa-files-o" aria-hidden="true"/></Badge>
        </ListGroupItem>
        {
          !this.state.loading &&
          <Button componentClass="div" block bsStyle="primary" bsSize="large" className="btn-file"
                  disabled={this.state.loading}>
            <input type="file"
                   multiple
                   className="pull-left"
                   ref="inputFiles"
                   onChange={this.uploadInput.bind(this, this.props.project.id)}/>
            Select Input File(s)
          </Button>
        }
        {
          this.state.loading &&
          <ProgressBar ref="progressBar" active={true} now={100} striped={true} label={'Loading Input Files'}/>
        }
        {
          this.props.project.inputFiles.map((filename, index) => (
            <ListGroupItem
              key={`project_${this.props.project.id}_input_file_${index}`}
              href={this.props.longhornUrl + LonghornApi.PATHS.PROJECTS + this.props.project.id + LonghornApi.PATHS.INPUT_FILES + filename}
              download={filename.split("/").pop()}>
              {filename}
              <Badge><i className="fa fa-download" aria-hidden="true"/></Badge>
            </ListGroupItem>
          ))
        }
        {
          this.state.uploads.length > 0 &&
          this.state.uploads.map((filename, index) => (
            <ListGroupItem
              key={`project_${this.props.project.id}_upload_file_${filename}_${index}`}
              disabled={true}>
              <i>{filename}</i>
              <Badge title='Uploading'><i className="fa fa-upload faa-flash animated" aria-hidden="true"/></Badge>
            </ListGroupItem>
          ))
        }
      </ListGroup>
    );
  }
};