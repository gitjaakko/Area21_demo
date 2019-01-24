import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';
import { Container, Content, Card, CardItem } from 'native-base';
import { Actions } from 'react-native-router-flux';


// Entry page to check login status and route accordingly
class EntryPage extends Component {

  tokenCheck(){
    try {
       AsyncStorage.getItem('refreshToken', (error, result) => {
        if(result !== null) {
          console.log('token found')
          return(
            Actions.etusivu()
          );
        }
        else {
          console.log('token not found, going to loginform')
          return (
            Actions.login()
          );
        }
      })
    } catch (error) {console.log('AsyncStorage getItem unsuccessful', error)}
  }


componentDidMount(){
  this.tokenCheck();
}

  render() {
    return (
      <Container>
        <Content style={{flex: 1, backgroundColor: '#8080ff'}} />
      </Container>
    )
  }
}

export default EntryPage;
