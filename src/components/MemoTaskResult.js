import React from "react";

// reactstrap components
import {
  Nav, NavLink, NavItem
} from 'reactstrap';

// core components
import Navbar from "./Navbars/Navbar.js";

// index page sections
import MainMenu from "./Menu/Menu.js";
//Loader
import { css } from "@emotion/react";

// CSS - Can be a string as well. Need to ensure each key-value pair ends with ;
const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

export default class BargainResult extends React.Component {
  render() {
    return (
      <>
        <Navbar />
        <main ref="main">
          <MainMenu />
        </main>
        <Nav vertical>
          <NavItem><NavLink href="https://api.swps-pjatk-experiment.pl/v1/memotask-result">Memo Task results</NavLink></NavItem>
        </Nav>
      </>
    );
  }
}