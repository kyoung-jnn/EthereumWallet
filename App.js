import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import React, {Component} from 'react';
import { Root } from 'native-base';
import WalletsScreen from './components/WalletsScreen';
import CreateWalletScreen from './components/CreateWalletScreen';
import WalletInfoComponent from './components/WalletInfoComponent';
import ReceiveScreen from './components/ReceiveScreen';
import SendScreen from './components/SendScreen';
import CompleteScreen from './components/CompleteScreen';
import ComfimTxScreen from './components/ComfimTxScreen';

const AppStackNavigator = createStackNavigator(
  {
    Wallets: {screen: WalletsScreen}, // WalletsScreen 등록
    CreateWallet: {screen: CreateWalletScreen},
    WalletInfo: {screen: WalletInfoComponent},
    ReceiveScreen: {screen: ReceiveScreen},
    SendScreen: {screen: SendScreen},
    ComfimTxScreen: {screen: ComfimTxScreen},
    CompleteScreen: {screen: CompleteScreen},
  },
  {
    defaultNavigationOptions: {
      headerTitleAlign: 'center'
    },
  },
);

const AppContainer = createAppContainer(AppStackNavigator);

export default () =>(
  <Root>
    <AppContainer></AppContainer>
  </Root>
)
