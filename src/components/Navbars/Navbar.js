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
  NavbarText,
  NavItem,
  NavLink
} from 'reactstrap';

class NavbarCustom extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  render() {
    return (<div>
      <Navbar color="light" light expand="md">
        <NavbarBrand href="/">Memory task</NavbarBrand>
        <NavbarToggler onClick={this.toggle} />
        <Collapse isOpen={this.state.isOpen} navbar>
          <Nav className="mr-auto" navbar>
            {getDropdownMenuItems(this.props.version)}
            <NavItem>
              <NavLink href="/memo-task-results">Results</NavLink>
            </NavItem>
          </Nav>
          <NavbarText>v1.0</NavbarText>
        </Collapse>
      </Navbar>
    </div>
    );
  }
}

function getDropdownMenuItems(items) {
  if (items === null || items === undefined) return <></>

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

  return (
    <UncontrolledDropdown nav inNavbar>
      <DropdownToggle nav caret>
        Versions
      </DropdownToggle>
      <DropdownMenu right>
        {children}
      </DropdownMenu>
    </UncontrolledDropdown>);
}

export default NavbarCustom;
