import React, {Component} from 'react';
import {MenuItem, Nav, Navbar, NavDropdown} from "react-bootstrap";

import LonghornApi from '../constants/LonghornApi';
import packageJson from '../../package.json';


export default class Header extends Component {

  render() {
    return (
      <Navbar inverse fixedTop>
        <Navbar.Header>
          <Navbar.Brand>
            <a href={process.env.PUBLIC_URL} title={`Okapi Longhorn JS Client ${packageJson.version}`}>
              Okapi Longhorn JS Client
            </a>
          </Navbar.Brand>
          <Navbar.Toggle/>
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav pullRight>
            <NavDropdown title={`Version ${packageJson.version}`}>
              <MenuItem href={this.props.longhornUrl + LonghornApi.PATHS.PROJECTS} target="blank">
                Okapi Longhorn API
              </MenuItem>
              <MenuItem href="http://okapiframework.org/wiki/index.php?title=Longhorn" target="blank">
                Okapi Longhorn API Wiki
              </MenuItem>
              <MenuItem divider />
              <MenuItem href="https://github.com/clementmouchet/longhorn-js-client" target="blank">
                <i className="fa fa-github" aria-hidden="true"/> Fork me on GitHub
              </MenuItem>
              <MenuItem href="https://bitbucket.org/clementmouchet/longhorn-js-client" target="blank">
                <i className="fa fa-bitbucket" aria-hidden="true"/> Fork me on Bitbucket
              </MenuItem>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
};