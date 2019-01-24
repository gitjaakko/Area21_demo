import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { Input } from './common';
import { Container, Content, Header, Left, Right, Body, Title, Text, Button, Card, CardItem, Spinner } from 'native-base';
import { loginUser } from '../actions';
import { Actions } from 'react-native-router-flux';

import ThingsboardAPI from '../thingsboard';

class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            error: false,
            loading: false
        };
    }

  onEmailChange(text){
    this.setState({email: text})
  }

  onPasswordChange(text) {
    this.setState({password: text});
  }

  onButtonPress() {
    this.setState({loading: true});

    const { email, password } = this.state;

    const api = new ThingsboardAPI('tb.tamk.cloud');
    api.auth(email.trim(), password).then(() => {
        this.setState({loading: false});
        this.props.onSuccessfulLogin(api.accessToken, api.refreshToken, api);
        Actions.etusivu();
    }).catch(err => {
        this.setState({error: true, loading: false});
        console.log(err);
    });
  }

  render() {
    return (
      <Container>
        <Header>
          <Body style={{flex: 1, alignItems: 'center'}}>
            <Title>Kirjaudu sisään</Title>
          </Body>
        </Header>
        <Content>
          <CardItem>
            <Input
              label="Email"
              placeholder="email@gmail.com"
              onChangeText={this.onEmailChange.bind(this)}
              />
          </CardItem>

          <CardItem>
            <Input
              secureTextEntry
              label="Password"
              placeholder="password"
              onChangeText={this.onPasswordChange.bind(this)}
              />
          </CardItem>

          <Text style={ this.state.error ? styles.errorTextStyle : styles.hidden }>
            Kirjautuminen epäonnistui
          </Text>

          <CardItem>
            <Spinner style={ this.state.loading ? {} : styles.hidden } />
            <Button style={ this.state.loading ? styles.hidden : {flex: 1}} onPress={this.onButtonPress.bind(this)}>
              <Text>Kirjaudu</Text>
            </Button>
          </CardItem>
          <CardItem>
            <Button style={{flex: 1}} onPress={() => Actions.etusivu()}>
              <Text> Etusivu </Text>
            </Button>
          </CardItem>

        </Content>
      </Container>
    );
  }
}

// Style sheet
const styles = {
  errorTextStyle: {
    fontSize: 20,
    alignSelf: 'center',
    color: 'red'
  },
  hidden: {
    display: 'none'
  }
}

const mapDispatchToProps = dispatch => ({
    onSuccessfulLogin: (accessToken, refreshToken, thingsboard) => {
        dispatch(loginUser(accessToken, refreshToken, thingsboard))
    }
});

export default connect(null, mapDispatchToProps)(LoginForm);
