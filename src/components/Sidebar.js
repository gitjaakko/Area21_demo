import React, { Component } from 'react';
import { Content, Text, List, ListItem, Button, Separator } from 'native-base';
import { Actions } from 'react-native-router-flux';
import { AsyncStorage } from 'react-native';
import { connect } from 'react-redux';

import RequiresLogin from './RequiresLogin';

class SideBar extends Component {

  async logoutPress(){
    try {
    await AsyncStorage.clear()
    } catch (error) {console.log(error)}
    Actions.login();
  }

render() {
  return(
    <Content style={{backgroundColor:'#ffffff'}}>
      <List>
      <RequiresLogin>
          <Separator bordered>
            <Text>User</Text>
          </Separator>
          <ListItem>
            <Text>User info</Text>
          </ListItem>
            <Separator bordered>
              <Text>Sensors</Text>
            </Separator>
            <ListItem>
              <Text>Electricity</Text>
            </ListItem>
            <ListItem>
              <Text>Water</Text>
            </ListItem>
            <ListItem>
              <Text>Temperature</Text>
            </ListItem>
            <ListItem>
              <Text>Humidity</Text>
            </ListItem>
        </RequiresLogin>
        <Separator bordered>
          <Text>About</Text>
        </Separator>
        <ListItem>
          <Text>About Area21</Text>
        </ListItem>
        <Separator bordered style={this.props.isAuthenticated ? {} : {display: 'none'}}>
          <Text>Logout</Text>
        </Separator>
        <ListItem style={this.props.isAuthenticated ? {} : {display: 'none'}}>
          <Text onPress={() => this.logoutPress()}>Logout</Text>
        </ListItem>
      </List>
    </Content>
    )
  };
}


export default connect(state => ({isAuthenticated: state.user.isAuthenticated}))(SideBar);
