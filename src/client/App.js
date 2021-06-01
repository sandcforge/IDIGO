import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import {HomePage} from './pages/HomePage';
import {AdminPage} from './pages/AdminPage';
import { useDispatch } from 'react-redux';
import { actionSetAccessRole } from "./redux/actions";
import { APP_CONST } from "./constants";

export const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actionSetAccessRole(APP_CONST.ACCESS_ROLE_ADMIN));
  }, []);

  return (
    <Router>
        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
        <Route exact path="/">
            <HomePage />
          </Route>
          <Route path="/admin">
            <AdminPage />
          </Route>
          <Route path="*">
            <div>找不到页面！</div>
          </Route>
        </Switch>
    </Router>
  );
}