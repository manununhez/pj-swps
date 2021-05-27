import React, { useState } from 'react';

// reactstrap components
import {
  FormGroup, Form, Input, Container, Button, Alert
} from "reactstrap";

// core components
import Navbar from "./Navbars/Navbar.js";

// index page sections
import MainMenu from "./Menu/Menu.js";
//Loader
import { css } from "@emotion/react";

import { downloadResults } from '../helpers/fetch';

// CSS - Can be a string as well. Need to ensure each key-value pair ends with ;
const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

export default class BargainResult extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      formData: {
        username: "",//default selected sex
        magic: ""
      },
      visible: false
    }
  }

  onClick = () => {
    let { formData } = this.state

    if (formData.username === '' || formData.magic === '') return

    downloadResults({ username: formData.username, magic: formData.magic }, this._onLoadResultsCallBack.bind(this))
  }

  _onLoadResultsCallBack = (data) => {
    console.log(data.response)
    if (data.response === undefined) {
      this.setState({ visible: true })
      return
    }

    this.createAndDownloadCSVFile(data.response)
    this.setState({ visible: false })
  }

  createAndDownloadCSVFile = (data) => {
    const downloadUrl = window.URL.createObjectURL(new Blob([data]));
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', 'results.csv'); //any other extension
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  validateInputForm = (evt) => {
    const formId = evt.target.id;
    const formInputValue = evt.target.value;
    let { formData } = this.state

    if (formId === 'username_i') {
      formData.username = formInputValue
    } else if (formId === 'magic_i') {
      formData.magic = formInputValue
    }
  }

  render() {
    return (
      <>
        <Navbar />
        <main ref="main">
          <MainMenu />
        </main>
        <Container>
          <Alert color="warning" isOpen={this.state.visible}>
            Wrong credentials! Please insert correct user/pass to proceed with the results.
        </Alert>
          <Form role="form" style={{ marginTop: '30px' }}>
            <FormGroup className="mb-3">
              <div className="d-flex align-items-left">
                {/* <h6>Username *</h6> */}
              </div>
              <Input id="username_i"
                placeholder="Username"
                onChange={this.validateInputForm}
                type="text"
              />
            </FormGroup>
            <FormGroup className="mb-3">
              <div className="d-flex align-items-left">
                {/* <h6>Password *</h6> */}
              </div>
              <Input id="magic_i"
                placeholder="Password"
                onChange={this.validateInputForm}
                type="password"
              />
            </FormGroup>
            <FormGroup className="mb-3">
              <Button onClick={this.onClick}>Download results</Button>
            </FormGroup>
          </Form>
        </Container>
      </>
    );
  }
}