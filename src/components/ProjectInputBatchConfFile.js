import React, {Component} from 'react';
import {
  Badge,
  Button,
  Collapse,
  FormControl,
  FormGroup,
  ListGroup,
  ListGroupItem,
  OverlayTrigger,
  ProgressBar
} from 'react-bootstrap';
import _ from 'underscore';
import s from 'underscore.string';

import LonghornApi from '../constants/LonghornApi';
import Tooltips from '../constants/Tooltips';


export default class ProjectInputBatchConfFile extends Component {

  constructor(props) {
    super(props);

    this.state = {
      stepContainerOpen: false,
      loading: false
    };
  }

  componentWillReceiveProps() {
    this.setState({
      stepContainerOpen: false,
      loading: false
    });
  }

  handleFetchErrors(response) {
    if (!response.ok) {
      response.text().then(text => {
        console.error('ProjectInputBatchConfFile', response, text);
      });
      throw Error(`${response.statusText}`);
    }
    return response;
  }

  uploadBatchConfFile(id, event) {
    console.log('uploadBatchConfFile', 'Project ' + id, event.target.files);

    let fileList = event.target.files;
    let overrideStepParams = this.overrideStepParams.value;


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

      const url = this.props.longhornUrl + LonghornApi.PATHS.PROJECTS + id + LonghornApi.PATHS.BATCH_CONFIGURATION;

      this.setState({
        loading: true
      });

      return fetch(url, {method: 'POST', body: data})
        .then(this.handleFetchErrors)
        .then(response => response.text())
        .then((response) => {
          console.log('uploadBatchConfFile', 'Project ' + id, file, data, response);
          this.setState({
            loading: false
          });
          this.props.alertList.confirm({
            message: `Project ${id}: Uploaded BCONF ${file.name}`,
          });
          this.refs.inputBatchConfFile.value = null;
        })
        .catch((err) => {
          console.error('uploadBatchConfFile', 'Project ' + id, file, err);
          this.setState({
            loading: false
          });
          this.props.alertList.error({
            headline: `Project ${id}: Failed to upload BCONF ${file.name}`,
            message: `${err.toString()}, check the browser console for details.`
          });
          this.refs.inputBatchConfFile.value = null;
        });
    } else {
      this.props.alertList.warning({
        headline: `Please select a valid BCONF`,
        message: `The selected file is not a .bconf`
      });
      this.refs.inputBatchConfFile.value = null;
    }
  }

  render() {
    return (
      <ListGroup>
        <ListGroupItem bsStyle="info">
          <strong>&#9312;</strong> Upload batch configuration
          <Badge pullRight bsClass=""><i className="fa fa-file-archive-o" aria-hidden="true"/></Badge>
        </ListGroupItem>
        <OverlayTrigger placement="bottom"
                        overlay={Tooltips.OPTIONAL}
                        onBlur={() => this.setState({stepContainerOpen: false})}>
          <ListGroupItem>
            <FormGroup controlId="formControlsTextarea">
              <FormControl
                componentClass="textarea"
                ref="overrideStepFormControl"
                inputRef={(ref) => { this.overrideStepParams = ref; }}
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
        <Button componentClass="div" block bsStyle="primary" bsSize="large" className="btn-file" disabled={this.state.loading}>
          <input type="file"
                 ref="inputBatchConfFile"
                 onChange={this.uploadBatchConfFile.bind(this, this.props.project.id)}/>
          Select Batch Configuration File
        </Button>
        {this.state.loading && <ProgressBar ref="progressBar" active={true} now={100} striped={true} label={'Uploading'} />}
      </ListGroup>

    );
  }
};