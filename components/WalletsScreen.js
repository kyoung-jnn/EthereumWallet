import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {
  Container,
  Content,
  Card,
  CardItem,
  Body,
  Text,
  Icon,
  Button,
} from 'native-base';
import {NavigationEvents} from 'react-navigation';
import { NativeViewGestureHandler } from 'react-native-gesture-handler';

export default class WalletsScreen extends Component {
  static navigationOptions = {
    title: '이더리움 지갑',
  };

  constructor(props) {
    super(props);    

    this.state = {
      navigate: null,
      wallets: [],
    };

  }

  // 컴포넌트 활성화시 지갑 정보 불러오기
  // state에 저장
  _onWillFocus = (payload) => {
    AsyncStorage.getItem('WALLETS').then((wallets) => {
      this.setState({
        wallets: JSON.parse(wallets) || [],
      });
    });
  };

  
  render() {
    if("navigation" in this.props){
      this.setState({
        navigate: this.props.navigation.navigate
      })
    }

    console.log('props')
    console.log(this.props);
    console.log('state')
    console.log(this.state);
    return (
      <View style={styles.container}>
        <NavigationEvents onWillFocus={this._onWillFocus}> </NavigationEvents>
        <Container>
          <Content padder>
            {
              // state에 wallet 정보를 하나씩 생성
              this.state.wallets.map((wallet,index) => {
                return <WalletsScreen wallet={wallet} key={index}></WalletsScreen>;
              })
            }
            <Card>
              <CardItem>
                <Body>
                  <Button
                    transparent
                    iconLeft
                    large
                    block
                    onPress={() => this.state.navigate('CreateWallet')}>
                    <Icon name="ios-add-circle-outline"></Icon>
                    <Text>지갑 생성하기</Text>
                  </Button>
                </Body>
              </CardItem>
            </Card>
          </Content>
        </Container>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});
