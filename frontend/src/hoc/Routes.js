import React from 'react';
import {Route, Redirect} from 'react-router-dom';

//User can only access this route if they are not logged in, else they are redirected to home
export const LoggedOutRoute = ({ loggedIn, path, component: Component }) => (
    <Route
      path={path}
      render={props => (
        loggedIn ?
        <Redirect to='/' /> :
        <Component {...props} />
      )}
    />
  );

  //User can only access this route if they are logged in, else they are redirected to login
  export const LoggedInRoute = ({ loggedIn, path, component: Component }) => (
    <Route
      path={path}
      render={props => (
        loggedIn ? 
        <Component {...props} /> :
        <Redirect to='/login' />
      )}
    />
  );