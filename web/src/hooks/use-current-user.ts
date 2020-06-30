import * as React from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

// import analytics from "analytics.js";
// import {
//   authenticateWithGoogle,
//   getIdTokenFromUserCredential,
//   isNewUser,
//   logOut
// } from "../services/auth-service";
// import { gql } from "apollo-boost";
// import { useMutation } from "@apollo/react-hooks";
// import { useHistory } from "react-router-dom";

export function useCurrentUser() {
  return React.useContext(CurrentUserContext);
}

// export function useCurrentUser() {
//   const currentUser = React.useContext(CurrentUserContext);
//   const [createUser] = useMutation(CREATE_USER_MUTATION);
//   const history = useHistory();

//   const onClickLogin = async () => {
//     const userCredential = await authenticateWithGoogle();
//     const idToken = await getIdTokenFromUserCredential(userCredential);
//     return isNewUser(userCredential)
//       ? handleNewUser(userCredential, idToken)
//       : handleReturningUser(idToken);
//   };

//   return {
//     ...currentUser
//   };
// }

// This effect will only be run if the authenticated user is not a new user.
// React.useEffect(() => {
//   if (getUserResponse.called && !getUserResponse.loading) {
//     // dispatch({ type: "logged_in", payload: { data: getUserResponse.data } });
//     const workspace = getUserResponse.data?.user?.workspace;
//     const redirectUrl = workspace ? `/workspaces/${workspace.id}` : "/onboarding";
//   }
//   //eslint-disable-next-line
// }, [getUserResponse.called, getUserResponse.loading]);

// const onClickLogout = async () => {
//   await logOut();
//   return history.push("/");
// };
