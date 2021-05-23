import React from "react";

// reactstrap components
import { FormGroup, Form, Input, Container, Col, Label, Alert } from "reactstrap";

import NumberFormat from 'react-number-format';

import * as constant from '../../helpers/constants';

import "./style.css";

const DEBUG = (process.env.REACT_APP_DEBUG_LOG === "true") ? true : false;

class UserForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      formData: {
        sex: constant.TEXT_EMPTY,//default selected sex
        age: 0,
        yearsEduc: 0,
        levelEduc: constant.FORM_LEVEL_EDUC_DEFAULT, //default selected 
        profession: constant.TEXT_EMPTY
      },
      error: {
        showError: false,
        textError: constant.TEXT_EMPTY
      }
    }
  }

  componentDidMount() {
    //for keyboard detection
    document.addEventListener(constant.EVENT_KEY_DOWN, this.handleKeyDownEvent, false);
  }

  componentWillUnmount() {
    document.removeEventListener(constant.EVENT_KEY_DOWN, this.handleKeyDownEvent, false);
  }

  handleKeyDownEvent = (event) => {
    if (event.keyCode === constant.ENTER_KEY_CODE) { //Transition between screens
      const { formData } = this.state
      let error = {
        showError: false,
        textError: constant.TEXT_EMPTY
      }
      // CONTROL OF EMPTY_TEXT
      if (formData.age === 0) {
        error.textError = constant.ERROR_5;
        error.showError = true;
      } else if (formData.profession === constant.TEXT_EMPTY) {
        error.textError = constant.ERROR_7;
        error.showError = true;
      } else if (formData.levelEduc === constant.FORM_LEVEL_EDUC_DEFAULT) {
        error.textError = constant.ERROR_11;
        error.showError = true;
      } else if (formData.yearsEduc === 0) {
        error.textError = constant.ERROR_6;
        error.showError = true;
      } else if (formData.sex === constant.TEXT_EMPTY) {
        error.textError = constant.ERROR_14;
        error.showError = true;
      }

      if (error.showError) {
        this.setState({ error: error })
      } else {
        this.props.action(this.state.formData)
      }
    }
  }

  validateInputForm = (evt) => {
    const formId = evt.target.id;
    const formInputValue = evt.target.value;

    let { formData } = this.state

    if (DEBUG) console.log(formId)
    if (DEBUG) console.log(formInputValue)

    //We save all fields from form data 
    if (formId === constant.FORM_SEX) {
      if (formInputValue === constant.MALE_VALUE || formInputValue === constant.FEMALE_VALUE) {
        formData.sex = formInputValue
      } else {
        formData.sex = constant.TEXT_EMPTY
      }
    } else if (formId === constant.FORM_AGE) {
      if (isNaN(formInputValue) || formInputValue === constant.TEXT_EMPTY || formInputValue < 0) {
        formData.age = 0
      } else {
        formData.age = parseInt(formInputValue)
      }
    } else if (formId === constant.FORM_PROFESSION) {
      formData.profession = formInputValue
    } else if (formId === constant.FORM_YEARS_EDUC) {
      if (isNaN(formInputValue) || formInputValue === constant.TEXT_EMPTY || formInputValue < 0) {
        formData.yearsEduc = 0
      } else {
        formData.yearsEduc = parseInt(formInputValue)
      }
    } else if (formId === constant.FORM_LEVEL_EDUC) {
      if (formInputValue === constant.FORM_LEVEL_EDUC_DEFAULT || formInputValue === constant.FORM_LEVEL_EDUC_INITIAL
        || formInputValue === constant.FORM_LEVEL_EDUC_MIDDLE || formInputValue === constant.FORM_LEVEL_EDUC_SUPERIOR) {
        formData.levelEduc = formInputValue
      } else {
        formData.levelEduc = constant.FORM_LEVEL_EDUC_DEFAULT
      }

    }

    let errorDefault = { //This would clean the previous error message, if it was shown
      showError: false,
      textError: constant.TEXT_EMPTY
    }

    this.setState({ formData: formData, error: errorDefault })
  }

  validateNumberFormat = (id, numberFormat) => {
    let e = { target: { id: id, value: numberFormat.formattedValue } }
    this.validateInputForm(e)
  }

  render() {
    const { formData, error } = this.state
    const { showError, textError } = error
    return (
      <Container className="justify-content-center">
        <div className="text-center mt-2"><h3>Twoje dane</h3></div>
        <Alert style={{ fontSize: "1.0rem" }} color="warning" isOpen={showError}>
          <span className="alert-inner--text ml-1">
            {textError}
          </span>
        </Alert>
        <Form role="form" style={{ marginTop: '40px' }}>
          <FormGroup className="mb-3">
            <div className="d-flex align-items-left">
              <h5>Wiek</h5>
            </div>
            <NumberFormat className="form-control"
              id={constant.FORM_AGE}
              placeholder={constant.TEXT_EMPTY}
              autoFocus={true}
              onValueChange={this.validateNumberFormat.bind(this, constant.FORM_AGE)}
              decimalScale={0} />
          </FormGroup>
          <FormGroup className="mb-3">
            <div className="d-flex align-items-left">
              <h5>Zawód</h5>
            </div>
            <Input id={constant.FORM_PROFESSION}
              placeholder={constant.TEXT_EMPTY}
              onChange={this.validateInputForm}
              type="text"
            />
          </FormGroup>
          <FormGroup>
            <div className="d-flex align-items-left">
              <h5>Poziom wykształcenia</h5>
            </div>
            <Input type="select" name="select" id={constant.FORM_LEVEL_EDUC} onChange={this.validateInputForm}>
              <option value={constant.FORM_LEVEL_EDUC_DEFAULT}>Wybierz...</option>
              <option value={constant.FORM_LEVEL_EDUC_INITIAL}>podstawowe</option>
              <option value={constant.FORM_LEVEL_EDUC_MIDDLE}>średnie</option>
              <option value={constant.FORM_LEVEL_EDUC_SUPERIOR}>wyższe</option>
            </Input>
          </FormGroup>
          <FormGroup className="mb-3">
            <div className="d-flex align-items-left">
              <h5>Lata formalnej edukacji <small><i>(tylko etapy kończące się formalnym świadectwem: podstawowe, średnie, wyższe: np 8 lat szkoły podstawowej + 4 lata liceum = 12 lat)</i></small></h5>
            </div>
            <NumberFormat className="form-control"
              id={constant.FORM_YEARS_EDUC}
              placeholder={constant.TEXT_EMPTY}
              onValueChange={this.validateNumberFormat.bind(this, constant.FORM_YEARS_EDUC)}
              decimalScale={0} />
          </FormGroup>
          <FormGroup tag="fieldset" className="mb-3">
            <div className="d-flex align-items-left">
              <h5>Płeć</h5>
            </div>
            <div style={{ display: "inline-flex" }} >
              <Col lg="auto">
                <FormGroup>
                  <Label check>
                    <Input type="radio"
                      id={constant.FORM_SEX}
                      name={constant.FORM_SEX + "_F"}
                      value={constant.FEMALE_VALUE}
                      onChange={this.validateInputForm}
                      checked={formData.sex === constant.FEMALE_VALUE} />{' '}
                    Kobieta
                  </Label>
                </FormGroup>
              </Col>
              <Col lg="auto">
                <FormGroup>
                  <Label check>
                    <Input type="radio"
                      id={constant.FORM_SEX}
                      name={constant.FORM_SEX + "_M"}
                      value={constant.MALE_VALUE}
                      onChange={this.validateInputForm}
                      checked={formData.sex === constant.MALE_VALUE} />{' '}
                    Mężczyzna
                    </Label>
                </FormGroup>
              </Col>
            </div>
          </FormGroup>
        </Form>
      </Container>
    );
  }
}

export default UserForm;
