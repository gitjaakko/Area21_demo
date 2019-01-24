import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';
import { loginUserSuccess } from '../actions';
import { Actions } from 'react-native-router-flux';
import {
  Container, Content, Icon, Header, Left, Right, Body,
  Title, Text, Button, Card, CardItem, CardHeader, Drawer
} from 'native-base';
import { connect } from 'react-redux';

import Sidebar from './Sidebar';
import ThingsboardAPI from '../thingsboard'

import { LineChart } from './charts'


class Etusivu extends Component {
  constructor(props){
    super(props);
    this.state = {temperatureData: [{time: new Date(), value:1}, {time: new Date(), value:2}]};
    this.thingsboardApi = this.props.user.thingsboard;
    this.deviceId = null;
  }

  closeDrawer() {
     this._drawer._root.close()
   }
   openDrawer() {
     this._drawer._root.open()
   }

  componentDidMount(){
    this.thingsboardApi.getCustomerId().then(customerId => {
        this.thingsboardApi.getDevices(customerId).then(devices => {
            for (const device of devices) {
                if (device.name === 'AREA21_demo') {
                    this.deviceId = device.id.id;
                    this.thingsboardApi.getTelemetry(this.deviceId, ['temperature'], new Date(2018, 5, 19)).then(data => {
                        let tempData = data.temperature.reverse().map(x => {
                            return {time: new Date(x.time), value: parseFloat(x.value)};
                        });
                        tempData.forEach(i => {i.time.setMilliseconds(0)});

                        this.setState({temperatureData: tempData.filter((e, i, a) => {
                            return !i || e.time.getTime() != a[i-1].time.getTime();
                        })});
                    });
                    break;
                }
            }
        })
    }).catch(error => {console.log(error)});
  }

  render () {
    return (
      <Drawer
        ref={(ref) => { this._drawer = ref; }}
        content={<Sidebar navigator={this._navigator} />}
        onClose={() => this.closeDrawer()} >

        <Container>

          <Header>
            <Left style={{flex: 1}}/>
            <Body style={{flex: 1}}>
              <Title>Area 21</Title>
            </Body>
            <Right style={{flex: 1}}>
              <Button transparent onPress={()=> this.openDrawer()} >
                <Icon name='menu' />
              </Button>
            </Right>
          </Header>

          <Content>
            <Card style={styles.container}>
                <CardItem header>
                  <Text>Temperature</Text>
                </CardItem>
                <CardItem>
                  <LineChart data={this.state.temperatureData} />
                </CardItem>
            </Card>
          </Content>
        </Container>
      </Drawer>
    )
  }
}

const styles = {
  headerStyle: {
    flexDirection: 'row',
    fontSize: 20,
    color: '#F0FFFF',
    justifyContent: 'center'
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
}

const mapStateToProps = state => ({
    user: state.user
});

export default connect(mapStateToProps)(Etusivu);
