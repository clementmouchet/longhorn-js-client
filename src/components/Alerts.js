import React, {Component} from 'react';
import {AlertList} from "react-bs-notifier";

export default class Alerts extends Component {

  constructor(props) {
    super(props);
    this.state = {
      alerts: [],
    };
  }

  info(alert) {
    this.setState({
      alerts: [...this.state.alerts, {
        id: (new Date()).getTime(),
        type: 'info',
        headline: alert.headline,
        message: alert.message,
      }]
    });
  }

  confirm(alert) {
    this.setState({
      alerts: [...this.state.alerts, {
        id: (new Date()).getTime(),
        type: 'success',
        headline: alert.headline,
        message: alert.message,
      }]
    });
  }

  warning(alert) {
    this.setState({
      alerts: [...this.state.alerts, {
        id: (new Date()).getTime(),
        type: 'warning',
        headline: alert.headline,
        message: alert.message,
      }]
    });
  }

  error(alert) {
    this.setState({
      alerts: [...this.state.alerts, {
        id: (new Date()).getTime(),
        type: 'danger',
        headline: alert.headline,
        message: alert.message,
      }]
    });
  }


  clear() {
    this.setState({
      alerts: []
    });
  }

  dismiss(alert) {
    let alerts = this.state.alerts.filter(item => item !== alert);
    this.setState({alerts: alerts});
  }

  render() {
    return (
      <AlertList alerts={this.state.alerts}
                 timeout={5000}
                 onDismiss={this.dismiss.bind(this)}/>
    )
  }
}