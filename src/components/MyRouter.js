import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import App from './App';

import 'bootstrap/dist/css/bootstrap.min.css';

function MyRouter() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={App} />
      </Switch>
    </BrowserRouter>
  );
}

export default MyRouter;
