import React, {Component} from 'react';
import {Badge, Button, ListGroup, ListGroupItem, OverlayTrigger} from 'react-bootstrap';
import _ from 'underscore';

import LonghornApi from '../constants/LonghornApi';
import Tooltips from '../constants/Tooltips';

import LanguageSelect from "./LanguageSelect";

export default class ProjectExecutePipeline extends Component {

  constructor(props) {
    super(props);
    this.state = {
      okapiLanguages: []
    };
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

    return fetch(url, {method: 'POST'})
      .then(this.handleFetchErrors)
      .then(response => response.text())
      .then((response) => {
        console.log('executePipeline result', response);
        this.props.alertList.confirm({
          message: `Project ${id}: Tasks executed`,
        });
        this.props.projectTab.refs.projectOutputFiles.fetchProjectOutputFiles(id);
      })
      .catch((err) => {
        console.error('executePipeline fetch', err);
        this.props.alertList.error({
          headline: `Project ${id}: Failed to execute tasks`,
          message: `${err.toString()}, check the browser console for details.`
        });
        this.props.projectTab.refs.projectOutputFiles.fetchProjectOutputFiles(id);
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
        <Button bsStyle="primary" bsSize="large" block onClick={this.executePipeline.bind(this, this.props.project.id)}>
          Execute pipeline
        </Button>
      </ListGroup>
    );
  }
};