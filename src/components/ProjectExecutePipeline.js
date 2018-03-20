import React, {Component} from 'react';
import {Badge, Button, ListGroup, ListGroupItem, OverlayTrigger, ProgressBar} from 'react-bootstrap';
import _ from 'underscore';

import LonghornApi from '../constants/LonghornApi';
import Tooltips from '../constants/Tooltips';

import LanguageSelect from "./LanguageSelect";

export default class ProjectExecutePipeline extends Component {

  constructor(props) {
    super(props);
    this.state = {
      okapiLanguages: [],
      processing: false,
      failed: false
    };
  }

  componentWillReceiveProps() {
    this.setState({
      processing: false,
      failed: false
    });
  }

  handleFetchErrors(response) {
    if (!response.ok) {
      response.text().then(text => {
        console.error('ProjectExecutePipeline', response, text);
      });
      throw Error(`${response.statusText}`);
    }
    return response;
  }

  executePipeline(id) {
    let sourceLanguageCode = this.refs.sourceLanguageSelect.refs.sourceLanguageCode.el.val();
    let targetLanguageCodes = this.refs.targetLanguageSelect.refs.targetLanguageCodes.el.val();

    console.log('executePipeline', 'Project ' + id, sourceLanguageCode, targetLanguageCodes);

    let url = this.props.longhornUrl + LonghornApi.PATHS.PROJECTS + id + LonghornApi.PATHS.TASKS_EXECUTE;
    if (!_.isEmpty(sourceLanguageCode) && !_.isEmpty(targetLanguageCodes) && !_.isArray(targetLanguageCodes)) {
      url = `${url}/${encodeURIComponent(sourceLanguageCode)}/${encodeURIComponent(targetLanguageCodes)}`;
    } else if (!_.isEmpty(sourceLanguageCode) && !_.isEmpty(targetLanguageCodes) && _.isArray(targetLanguageCodes)) {
      let targets = [];
      targetLanguageCodes.map((languageCode) => {
        return targets.push('targets=' + encodeURIComponent(languageCode));
      });
      url = `${url}/${encodeURIComponent(sourceLanguageCode)}?${targets.join('&')}`;
    }

    this.setState({
      processing: true,
      failed: false
    });

    return fetch(url, {method: 'POST'})
      .then(this.handleFetchErrors)
      .then(response => response.text())
      .then((response) => {
        console.log('executePipeline result', response);
        this.setState({
          processing: false
        });
        this.props.alertList.confirm({
          message: `Project ${id}: Tasks executed`,
        });
        this.props.projectTab.refs.projectOutputFiles.fetchProjectOutputFiles(this.props.project.id);
      })
      .catch((err) => {
        console.error('executePipeline fetch', err);
        this.setState({
          processing: false,
          failed: true
        });
        this.props.alertList.error({
          headline: `Project ${id}: Failed to execute tasks`,
          message: `${err.toString()}, check the browser console for details.`
        });
        this.props.projectTab.refs.projectOutputFiles.fetchProjectOutputFiles(this.props.project.id);
      });
  }

  render() {
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
        {
          !this.state.processing &&
          <Button bsStyle={this.state.failed ? "danger" : "primary"} bsSize="large" block
                  onClick={this.executePipeline.bind(this, this.props.project.id)}>
            {this.state.failed ? 'Pipeline failed, please check console logs' : 'Execute pipeline'}
          </Button>
        }
        {
          this.state.processing &&
          <ProgressBar ref="progressBar" bsStyle={this.state.failed ? 'danger' : undefined} active={this.state.processing} now={100} striped={this.state.processing} label={'Executing pipeline'} />
        }
      </ListGroup>
    );
  }
};