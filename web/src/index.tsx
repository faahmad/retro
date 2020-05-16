import './styles/index.css';
import { apolloClient } from './lib';
import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from '@apollo/react-hooks';
import { AppRoutes } from './AppRoutes';
import { AuthProvider } from './contexts/AuthContext';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <AuthProvider>
    <ApolloProvider client={apolloClient}>
      <AppRoutes />
    </ApolloProvider>
  </AuthProvider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
