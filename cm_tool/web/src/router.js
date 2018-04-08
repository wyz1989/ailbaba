import React, { PropTypes } from 'react';
import { Router, Route, IndexRoute } from 'dva/router';
import DataList from './components/Data/DataList';
import ClusterList from './components/Data/ClusterList'

import NotFound from './components/NotFound';

export default function({ history }) {
  return (
    <Router history={history}>
      <Route path='/' component={ClusterList} />
      <Route path='*' component={NotFound} />
    </Router>
  );
};
