import React, {Component} from 'react';
import {Badge, Button, ListGroup, ListGroupItem, ProgressBar} from 'react-bootstrap';
import xml2js from 'react-native-xml2js';
import _ from 'underscore';

import LonghornApi from '../constants/LonghornApi';


export default class ProjectOutputFiles extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
  }

  componentWillReceiveProps() {
    this.setState({
      loading: false
    });
  }

  handleFetchErrors(response) {
    if (!response.ok) {
      response.text().then(text => {
        console.error('ProjectOutputFiles', response, text);
      });
      throw Error(`${response.statusText}`);
    }
    return response;
  }

  fetchProjectOutputFiles(id) {
    let self = this;
    let project = {};

    this.setState({
      loading: true
    });

    return fetch(this.props.longhornUrl + LonghornApi.PATHS.PROJECTS + id + LonghornApi.PATHS.OUTPUT_FILES)
      .then(this.handleFetchErrors)
      .then(response => response.text())
      .then((response) => {
        xml2js.parseString(response, function (err, result) {
          console.debug('fetchProjectOutputFiles result', result);
          self.setState({
            loading: false
          });
          if (_.has(result, 'l') && _.has(result.l, 'e')) {
            project.outputFiles = result.l.e;
            self.setState({
              project: Object.assign(self.props.project, project)
            });
            self.props.alertList.info({
              message: `Project ${id}: has ${project.outputFiles.length} output files`,
            });
          }
        });
      })
      .catch((err) => {
        console.error('fetchProjectOutputFiles', err);
        this.setState({
          loading: false
        });
        this.props.alertList.error({
          headline: `Project ${id}: Failed to fetch project output files`,
          message: `${err.toString()}, check the browser console for details.`
        });
      });
  }

  render() {
    return (
      <ListGroup>
        <ListGroupItem bsStyle="info">
          <strong>&#9315;</strong> Download Output Files
          <Badge pullRight bsClass=""><i className="fa fa-download" aria-hidden="true"/></Badge>
        </ListGroupItem>
        {
          !this.state.loading &&
          <Button
            href={this.props.longhornUrl + LonghornApi.PATHS.PROJECTS + this.props.project.id + LonghornApi.PATHS.OUTPUT_FILES_ZIP}
            download={'project_' + this.props.project.id + '_output.zip'}
            bsStyle="primary" bsSize="large" block
            disabled={!this.props.project.outputFiles.length}>
            Download work pack
          </Button>
        }
        {
          this.state.loading &&
          <ProgressBar ref="progressBar" active={true} now={100} striped={true} label={'Loading Output Files'} />
        }
        {
          this.props.project.outputFiles.map((filename, index) => (
            <ListGroupItem
              key={`project_${this.props.project.id}_output_file_${index}`}
              href={this.props.longhornUrl + LonghornApi.PATHS.PROJECTS + this.props.project.id + LonghornApi.PATHS.OUTPUT_FILES + filename}
              download={filename.split("/").pop()}>
              {filename}
              <Badge pullRight><i className="fa fa-download" aria-hidden="true"/></Badge>
            </ListGroupItem>)
          )
        }
      </ListGroup>
    );
  }
};