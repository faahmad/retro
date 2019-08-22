import * as React from "react";
import firebase from "firebase/app";
import "firebase/auth";
import { Button, Spinner } from "reactstrap";
import { Link } from "react-router-dom";
import { UserContext } from "./UserContext";

export class NavBar extends React.Component {
  static contextType = UserContext;
  render() {
    const { userAuthAccount, isFetchingUser } = this.context;
    return (
      <nav className="navbar navbar-light bg-primary justify-content-between">
        <Link
          className="navbar-brand text-white font-weight-bold"
          to={userAuthAccount ? "/dashboard" : "/"}
        >
          retro.app
        </Link>
        {isFetchingUser && (
          <Button outline disabled color="light">
            <Spinner size="sm" color="light" />
          </Button>
        )}
        {!isFetchingUser && !userAuthAccount && (
          <Link
            to="/login"
            className="btn btn-primary border-white bg-white text-primary font-weight-bold"
          >
            Login
          </Link>
        )}
        {!isFetchingUser && userAuthAccount && (
          <div className="d-flex align-items-end">
            <Button
              outline
              color="light"
              onClick={() => firebase.auth().signOut()}
            >
              Sign Out
            </Button>
          </div>
        )}
      </nav>
    );
  }
}
