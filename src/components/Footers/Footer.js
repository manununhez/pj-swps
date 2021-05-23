import React from "react";

// reactstrap components
import {
  Alert,
  Container
} from "reactstrap";

import './Footer.css'

class SimpleFooter extends React.Component {
  render() {
    return (
      <Container>
        <Alert className="footer" color="success">
          {this.props.text}
        </Alert>
      </Container>
    );
  }
}

export default SimpleFooter;
