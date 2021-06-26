import React from 'react';
import Snackbar from "@material-ui/core/Snackbar";
import { useSelector, useDispatch } from 'react-redux';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { QueryParamProvider } from 'use-query-params';

import { HomePage } from './pages/HomePage';
import { ProductPage } from './pages/ProductPage';
import { actionSetSnackbar } from './redux/actions';

export const App = () => {
  const dispatch = useDispatch();
  const snackbarConfig = useSelector(state => state.ui.snackbar);
  const snackbarOnClose = ()=> {
    dispatch(actionSetSnackbar({
      visible: false,
    }));
  };
  return (<>
    <Router>
      {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
      <Switch>
        <Route exact path="/">
          <QueryParamProvider ReactRouterRoute={Route}>
            <HomePage />
          </QueryParamProvider>
        </Route>
        <Route exact path="/p/:id">
          <ProductPage />
        </Route>
        <Route path="*">
          <div>找不到页面！</div>
        </Route>
      </Switch>
    </Router>
    <Snackbar
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left"
      }}
      open={snackbarConfig.visible}
      autoHideDuration={snackbarConfig.autoHideDuration}
      onClose={snackbarOnClose}
      message={snackbarConfig.message}
    />
  </>
  );
}