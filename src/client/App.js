import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { QueryParamProvider } from 'use-query-params';

import { HomePage } from './pages/HomePage';
import { AdminPage } from './pages/AdminPage';

export const App = () => {

  return (
    <Router>
      {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
      <Switch>
        <Route exact path="/">
          <QueryParamProvider ReactRouterRoute={Route}>
            <HomePage />
          </QueryParamProvider>
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