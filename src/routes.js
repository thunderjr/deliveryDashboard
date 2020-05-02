import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Main from './pages/Main';
import NewLog from './pages/NewLog';

export default function Routes() {
    return (
        <Switch>
            <Route path="/" exact component={Main} />
            <Route path="/logs/new" component={NewLog} />
        </Switch>
    );
}