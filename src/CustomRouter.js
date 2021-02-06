import * as React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

import HomePage from "./pages/HomePage";
import Todos from "./pages/Todos";
import Signin from "./pages/Signin";

import useUser from "./_hooks/useUser";

export default function CustomRouter() {

  const { isLoggedIn, loaded } = useUser();

  return (
    <Router >
       {!loaded ? null : isLoggedIn() ? (
        <Switch>
         
        
          <Route path="/signin">
            <Redirect to="/home"></Redirect>
          </Route>
         
          <Route path="/home">
            <HomePage />
          </Route>
          <Route path="/todos/:id">
            <Todos/>
          </Route>
           <Route path="/">
            <Redirect to="/home"></Redirect>
          </Route>
        </Switch>
      ) : (
        <Switch>
          <Route path="/signin">
            <Signin />
          </Route>
          <Route path="/">
            <Redirect to="/signin" />
          </Route>
        </Switch>
      )}
    </Router>
  );
}
