import * as React from "react";
import { Route, Redirect } from "react-router-dom";
import { UserContext } from "./UserContext";

interface PublicOnlyRouteProps {
  component: React.ReactType<any>;
}

export const PublicOnlyRoute: React.FC<PublicOnlyRouteProps & any> = ({
  component: Component,
  ...rest
}) => {
  const { user } = React.useContext(UserContext);
  return (
    <Route
      {...rest}
      render={props =>
        !user ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: `/dashboard` }} />
        )
      }
    />
  );
};
