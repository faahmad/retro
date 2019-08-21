import * as React from "react";
import firebase from "firebase/app";
import "firebase/auth";
import { Button, Spinner } from "reactstrap";
import { Link } from "react-router-dom";
import { UserContext } from "./UserContext";

export class NavBar extends React.Component {
  static contextType = UserContext;
  render() {
    const { user, isFetchingUser } = this.context;
    return (
      <nav className="navbar navbar-light bg-primary justify-content-between">
        <Link
          className="navbar-brand text-white font-weight-bold"
          to={this.context.user ? "/dashboard" : "/"}
        >
          retro.app
        </Link>
        {isFetchingUser && (
          <Button outline disabled color="light">
            <Spinner size="sm" color="light" />
          </Button>
        )}
        {!isFetchingUser && !user && (
          <Link
            to="/login"
            className="btn btn-primary border-white bg-white text-primary font-weight-bold"
          >
            Login
          </Link>
        )}
        {!isFetchingUser && user && (
          <Button
            outline
            color="light"
            onClick={() => firebase.auth().signOut()}
          >
            Sign Out
          </Button>
        )}
      </nav>
    );
  }
}
