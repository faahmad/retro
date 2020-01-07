import React from "react";
import { Switch, BrowserRouter, Route, Redirect } from "react-router-dom";
import { LandingPage } from "./pages/LandingPage";
import {
  OptimizelyProvider,
  createInstance,
  setLogger
} from "@optimizely/react-sdk";
import { useAuthContext } from "./contexts/AuthContext";
// TODO: Remove these before merging.
import { gql } from "apollo-boost";
import { Button } from "./components/Button";
import { AuthService } from "./services/auth-service";
import { useQuery } from "@apollo/react-hooks";
import { CreateWorkspacePage } from "./pages/CreateWorkspacePage";
import { LoadingPage } from "./pages/LoadingPage";

const USER_QUERY = gql`
  query UserQuery {
    user {
      id
      email
      createdAt
      updatedAt
      workspace {
        id
        name
        url
      }
    }
  }
`;
const _DevelopmentOnlyLoggedInPage = () => {
  const userQueryResponse = useQuery(USER_QUERY);
  if (userQueryResponse.loading) {
    return <LoadingPage />;
  }

  const { user } = userQueryResponse.data;
  if (!user.workspace) {
    return <Redirect to="/workspace/create" />;
  }

  return (
    <div className="flex flex-col flex-1 h-screen items-center justify-center">
      <h1>You're logged in!</h1>
      <div className="bg-white p-4 border border-blue shadow text-blue text-sm my-4">
        <code>
          <pre>{JSON.stringify(user, null, 2)}</pre>
        </code>
      </div>
      <Button className="text-red" onClick={() => AuthService.logOut()}>
        Log Out
      </Button>
    </div>
  );
};
//==================================

const optimizely = createInstance({
  sdkKey: process.env.REACT_APP_OPTIMIZELY_SDK_KEY
});
if (process.env.NODE_ENV === "production") {
  setLogger(null);
}

export const AppRoutes: React.FC = () => {
  const authAccount = useAuthContext();

  return (
    <BrowserRouter>
      <Switch>
        {authAccount ? (
          <OptimizelyProvider
            optimizely={optimizely}
            user={{ id: authAccount.uid }}
          >
            <AuthenticatedAppRoutes />
          </OptimizelyProvider>
        ) : (
          <UnauthenticatedAppRoutes />
        )}
      </Switch>
    </BrowserRouter>
  );
};

const UnauthenticatedAppRoutes: React.FC = () => {
  return (
    <React.Fragment>
      <Route exact path="/" component={LandingPage} />
    </React.Fragment>
  );
};

const AuthenticatedAppRoutes: React.FC = () => {
  return (
    <React.Fragment>
      <Route exact path="/" component={_DevelopmentOnlyLoggedInPage} />
      <Route exact path="/workspace/create" component={CreateWorkspacePage} />
    </React.Fragment>
  );
};
