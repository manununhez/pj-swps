import React from "react";

// core components
import Navbar from "./Navbars/Navbar.js";

// index page sections
import MainMenu from "./Menu/Menu.js";
//Loader
import { css } from '@emotion/react'
import FadeLoader from "react-spinners/FadeLoader";

import { fetchVersions } from '../helpers/fetch.js';


// CSS - Can be a string as well. Need to ensure each key-value pair ends with ;
const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

export default class Index extends React.Component {
  state = {
    versions: [],
    loading: false
  }


  componentDidMount() {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    this.refs.main.scrollTop = 0;

    this.setState({ loading: true }); //Show Loading

    // this.verifyToken(this.props.location.search);

    fetchVersions(this._onLoadCallBack.bind(this))
  }

  /**
   * Once versions have been loaded from the spreadsheet
   */
  _onLoadCallBack(data, error) {
    if (data) {
      this.setState({
        versions: data.versions,
        loading: false, //Hide loading
      })
    } else {
      this.setState({
        error: error
      })
    }
  }

  render() {
    return (
      <>
        <Navbar version={this.state.versions} />
        <main ref="main">
          <MainMenu />
        </main>
        <div style={{ position: "fixed", top: "35%", left: "48%" }}>
          <FadeLoader
            css={override}
            size={50}
            color={"#123abc"}
            loading={this.state.loading}
          />
        </div>
      </>
    );
  }
}