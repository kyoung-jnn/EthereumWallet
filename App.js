import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

import React, {Component} from 'react';
import { Root } from 'native-base';
import WalletsScreen from './components/WalletsScreen';
import CreateWalletScreen from './components/CreateWalletScreen';
import WalletInfoComponent from './components/WalletInfoComponent';
import ReceiveScreen from './components/ReceiveScreen';

const AppStackNavigator = createStackNavigator(
  {
    Wallets: {screen: WalletsScreen}, // WalletsScreen 등록
    CreateWallet: {screen: CreateWalletScreen},
    WalletInfo: {screen: WalletInfoComponent},
    ReceiveScreen: {screen: ReceiveScreen}
  },
  {
    defaultNavigationOptions: {
      headerBackTitle: null, // 뒤로가기 버튼 타이틀 제거.
    },
  },
);

const AppContainer = createAppContainer(AppStackNavigator);

export default () =>(
  <Root>
    <AppContainer></AppContainer>
  </Root>
)
