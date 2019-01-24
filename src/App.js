import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { connect } from 'react-redux'

import reducers from './reducers';
import ReduxThunk from 'redux-thunk';
import LoginForm from './components/LoginForm';
import Router from './Router';

class App extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Router />
        );
    }
}

const ConnectedApp = connect(state => ({state}))(App);

class Root extends Component {
  render () {
    const store = createStore(reducers, {}, applyMiddleware(ReduxThunk));

    return (
      <Provider store={store}>
        <ConnectedApp />
      </Provider>
    );
  }
}

export default Root;
