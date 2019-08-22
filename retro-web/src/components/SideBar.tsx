import * as React from "react";
import { Nav, NavItem } from "reactstrap";
import { Link } from "react-router-dom";
import Octicon, { Home } from "@primer/octicons-react";

export class Sidebar extends React.Component {
  render() {
    return (
      <Nav vertical>
        <NavItem>
          <Link
            to="/dashboard"
            className="d-flex align-items-center text-muted"
          >
            <Octicon size="small" icon={Home} />
            <span className="ml-2">Home</span>
          </Link>
        </NavItem>
      </Nav>
    );
  }
}
