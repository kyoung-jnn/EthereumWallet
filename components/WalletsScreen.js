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
import WalletComponent from './WalletComponent';
import {ethers} from 'ethers';

export default class WalletsScreen extends Component {
  static navigationOptions = {
    title: '이더리움 지갑',
    headerStyle: {
      backgroundColor: 'black',
    },
    headerTitleStyle: {
      fontWeight: 'bold',
      color: 'white',
      textAlign: 'center'
    }
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

  componentDidMount() {
    // 1. provider 생성
    let provider = ethers.getDefaultProvider('ropsten');

    const pollingInterval = 30 * 1000; // 22초
    this.poller = setInterval(() => {
      const wallets = [...this.state.wallets];

      // 2. 지갑 잔액 조회 시작
      wallets.forEach(wallet => {
        provider.getBalance(wallet.address).then((balance) => {
          // 이더리움 잔액 wei 를 ether 로 변환하기
          const etherString = ethers.utils.formatEther(balance);
          wallet.balance = etherString;
        });
      });

      // 3. 지갑 목록 화면 갱신 및 Storage 업데이트
      this.setState({wallets}, () => {
        AsyncStorage.setItem('WALLETS', JSON.stringify(wallets));
      });

    }, pollingInterval); // 20초 마다 수행하기
  }

  render() {
    return (
      <View style={styles.container}>
        <NavigationEvents onWillFocus={this._onWillFocus}> </NavigationEvents>
        <Container>
          <Content padder>
            {
              // state에 wallet 정보를 하나씩 생성
              this.state.wallets.map((wallet) => {
                return (
                  <WalletComponent
                    wallet={wallet}
                    key={wallet.address}
                    onPress={() => {
                      this.props.navigation.navigate('WalletInfo', wallet);
                    }}></WalletComponent>
                );
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
                    onPress={() =>
                      this.props.navigation.navigate('CreateWallet')
                    }>
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
