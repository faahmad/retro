import React from "react";
import { Route, Redirect } from "react-router-dom";
import { UserContext } from "./UserContext";

interface PrivateRouteProps {
  component: React.ReactType<any>;
}

export const PrivateRoute: React.FC<PrivateRouteProps & any> = ({
  component: Component,
  ...rest
}) => {
  const { userAuthAccount } = React.useContext(UserContext);

  return (
    <Route
      {...rest}
      render={props =>
        !!userAuthAccount ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{ pathname: "/login", state: { from: props.location } }}
          />
        )
      }
    />
  );
};
