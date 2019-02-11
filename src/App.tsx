import * as React from 'react';
import { Provider } from "react-redux";
import { HashRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import './App.scss';
import AsyncComponent from '@src/components/AsyncComponent';
import store from '@src/store';

export default class App extends React.Component<{}, {}> {
    render() {
        return (
            <Provider store={store}>
                <Router>
                    <Switch>
                        <Redirect from='/' exact to='/index/record'/>
                        <Route path='/index' component={AsyncComponent(() => import(/* webpackChunkName: 'asyncIndex' */ './components/Index'))}/>
                        <Route path='/login' component={AsyncComponent(() => import(/* webpackChunkName: 'asyncLogin' */ './components/Login'))}/>
                    </Switch>
                </Router>
            </Provider>
        )
    }
}