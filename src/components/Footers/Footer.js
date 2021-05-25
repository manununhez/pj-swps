import React from "react";

// reactstrap components
import {
  Button,
  Container
} from "reactstrap";

import './Footer.css'

class SimpleFooter extends React.Component {
  render() {
    return (
      <Container>
        <Button className="footer" color="success" size="lg" block onClick={this.props.action.bind(this)}>{this.props.text}</Button>
      </Container>
    );
  }
}

export default SimpleFooter;
