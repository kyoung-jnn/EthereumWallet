import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

import WalletsScreen from './components/WalletsScreen';
import CreateWalletScreen from './components/CreateWalletScreen';

const AppStackNavigator = createStackNavigator(
  {
    Wallets: {screen: WalletsScreen}, // WalletsScreen 등록
    CreateWallet: {screen: CreateWalletScreen},
  },
  {
    defaultNavigationOptions: {
      headerBackTitle: null, // 뒤로가기 버튼 타이틀 제거.
    },
  },
);

export default createAppContainer(AppStackNavigator);
