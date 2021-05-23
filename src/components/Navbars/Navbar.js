import React from "react";
import { Link } from "react-router-dom";

// reactstrap components
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavbarText
} from 'reactstrap';

class NavbarCustom extends React.Component {

  state = {
    isOpen: false
  };

  toogle = () => {
    this.setState(({ isOpen }) => ({
      isOpen: !isOpen
    }));
  };

  render() {
    return (<div>
      <Navbar color="light" light expand="md">
        <NavbarBrand href="/">Memory task</NavbarBrand>
        <NavbarToggler onClick={this.toggle} />
        <Collapse isOpen={this.isOpen} navbar>
          <Nav className="mr-auto" navbar>
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                Versions
              </DropdownToggle>
              <DropdownMenu right>
                {getDropdownMenuItems(this.props.version)}
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
          <NavbarText>v1.0</NavbarText>
        </Collapse>
      </Navbar>
    </div>
    );
  }
}

function getDropdownMenuItems(items) {
  var children = items.map(function (item) {
    return <DropdownItem to={{
      pathname: '/version/' + item.version,
      state: {
        url: item.url
      }
    }} tag={Link} key={item.version}>
      {item.version}
    </DropdownItem>
  });

  return (children);
}

export default NavbarCustom;
