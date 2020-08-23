import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import App from './App';

import 'bootstrap/dist/css/bootstrap.min.css';

function MyRouter() {
  return (
    <BrowserRouter>
      <Route exact path="/" component={App} />
    </BrowserRouter>
  );
}

export default MyRouter;
