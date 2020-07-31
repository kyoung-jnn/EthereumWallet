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

import WalletComponent from './WalletComponent';

export default class WalletsScreen extends Component {
  static navigationOptions = {
    title: '이더리움 지갑',
  };

  constructor(props) {
    super(props);    

    this.state = {
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
    console.log(this.props);
    
    return (
      <View style={styles.container}>
        <NavigationEvents onWillFocus={this._onWillFocus}> </NavigationEvents>
        <Container>
          <Content padder>
            {
              // state에 wallet 정보를 하나씩 생성
              this.state.wallets.map((wallet,index) => {
                return <WalletComponent wallet={wallet} key={index}></WalletComponent>;
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
                    onPress={() => this.props.navigation.navigate('CreateWallet')}
                    >
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
