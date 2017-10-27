import React, {Component} from 'react';
import {Nav, Navbar, NavItem} from "react-bootstrap";
import packageJson from '../../package.json';


export default class Header extends Component {

  render() {
    return (
      <Navbar inverse fixedTop>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="/" title={`Okapi Longhorn JS Client ${packageJson.version}`}>Okapi Longhorn JS Client</a>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav pullRight>
            <NavItem href="http://okapiframework.org/wiki/index.php?title=Longhorn" target="blank">Longhorn Wiki</NavItem>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
};