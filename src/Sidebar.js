import React from 'react';
import { Nav, NavItem } from 'reactstrap';
import { Link } from 'react-router-dom';


export default class Sidebar extends React.Component {
  render() {
    return (

        <Nav vertical>
          <NavItem>
            <Link to='/'>View all recipes</Link>
          </NavItem>
          <NavItem>
            <Link to='/add'>Add recipe</Link>
          </NavItem>
        </Nav>

    );
  }
}
