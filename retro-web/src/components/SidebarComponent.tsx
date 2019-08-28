import * as React from "react";
import { Nav, NavItem } from "reactstrap";
import { Link } from "react-router-dom";
import Octicon, {
  Home,
  RequestChanges,
  Organization
} from "@primer/octicons-react";

interface SidebarProps {
  workspaceId: RetroWorkspace["uid"];
}
export class Sidebar extends React.Component<SidebarProps, {}> {
  render() {
    const { workspaceId } = this.props;

    return (
      <Nav vertical>
        <NavItem className="mb-3">
          <Link
            to="/dashboard"
            className="d-flex align-items-center text-muted"
          >
            <Octicon size="small" icon={Home} />
            <span className="ml-2">Home</span>
          </Link>
        </NavItem>
        <NavItem className="mb-3">
          <Link
            to={`/dashboard/${workspaceId}/members`}
            className="d-flex align-items-center text-muted"
          >
            <Octicon size="small" icon={Organization} />
            <span className="ml-2">Members</span>
          </Link>
        </NavItem>
        <NavItem className="mb-3">
          <a className="text-muted" href="mailto:faraz@retro.app">
            <Octicon size="small" icon={RequestChanges} />
            <span className="ml-2">Contact Us</span>
          </a>
        </NavItem>
      </Nav>
    );
  }
}