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
    const alerts = this.state.alerts;

    // find the index of the alert that was dismissed
    const index = alerts.indexOf(alert);

    if (index >= 0) {
      this.setState({
        // remove the alert from the array
        alerts: [...alerts.slice(0, index), ...alerts.slice(index + 1)]
      });
    }
  }

  render() {
    return (
      <AlertList alerts={this.state.alerts}
                 timeout={5000}
                 onDismiss={this.dismiss.bind(this)}/>
    )
  }
}