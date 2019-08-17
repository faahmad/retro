import * as React from "react";
import { Firebase } from "../lib/Firebase";
import { Link } from "react-router-dom";

export class NavBar extends React.Component {
  render() {
    return (
      <nav className="navbar navbar-light bg-primary justify-content-between">
        <Link
          className="navbar-brand text-white font-weight-bold"
          to={Firebase.currentUser ? "/dashboard" : "/"}
        >
          retro.app
        </Link>
        <Link
          to="/login"
          className="btn btn-primary border-white bg-white text-primary font-weight-bold"
        >
          Login
        </Link>
      </nav>
    );
  }
}
