import ApolloClient from "apollo-boost";

export const apolloClient = new ApolloClient({
  uri: process.env.REACT_APP_GRAPHQL_URI,
  request: operation => {
    const idToken = localStorage.getItem("idToken");
    const context = operation.getContext();
    operation.setContext({
      headers: {
        "x-retro-auth": idToken || context.idToken || ""
      }
    });
  }
});
