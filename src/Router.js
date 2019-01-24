import React from 'react';
import { View } from 'react-native';
import { Scene, Router, Actions } from 'react-native-router-flux';
import LoginForm from './components/LoginForm';
import Etusivu from './components/Etusivu';
import EntryPage from './components/EntryPage';

// React native router flux router component, handles page transfers & some page styling + logic
const RouterComponent = () => {
  const { navBar, navTitle } = styles;
  return (
    <Router navigationBarStyle={navBar}>
      <Scene key="root" hideNavBar>
        <Scene key="entry" component={EntryPage} title="EntryPage" initial={true} />
        <Scene key ="auth" hideNavBar>
          <Scene titleStyle={navTitle} key="login" component={LoginForm} title="Kirjaudu sisään" />
        </Scene>

          <Scene
          key="etusivu" hideNavBar
          component={Etusivu}
          title="Etusivu"
          />
      </Scene>
    </Router>
  );
};

// Style sheet
const styles = {
  navBar: {
    backgroundColor: '#8080ff'
  },
  navTitle: {
    fontSize: 25,
    color: '#F0FFFF'
  }
};


export default RouterComponent;
