import React, {Component} from 'react';
import {StyleSheet, View, Clipboard, Share, Alert} from 'react-native';
import {
  Container,
  Content,
  Header,
  Card,
  CardItem,
  Body,
  Text,
  Icon,
  Button,
  Left,
  Right,
  Thumbnail,
  Title,
  Toast,
} from 'native-base';
import {ethers} from 'ethers';

export default class SendScreen extends Component {
  static navigationOptions = {
    header: null,
  };
  constructor(props) {
    super(props);

    const wallet = props.navigation.state.params;

    this.state = {
      fromAddress: '',
      toAddress: '',
      gasPrice: '2', // 가스 비용
      gasLimit: '21000',
      value: '',
      isReady: false,
      wallet,
    };
  }

  // 이더리움 주소 체크
  checkAddress = (address) => {
    if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
      return false;
    } else if (
      /^(0x|0X)?[0-9a-f]{40}$/.test(address) ||
      /^(0x|0X)?[0-9A-F]{40}$/.test(address)
    ) {
      return true;
    }
    return true;
  };

  // 다음 버튼
  next = () => {
    let ether = 0;
    try {
      ether = ethers.utils.parseEther(String(this.state.value || 0));
      if (ether.lte(0)) { // 0 보다 작으면
        return Alert.alert('이제 금액을 확인해주세요.');
      }

      // 가스비(수수료) 계산
      let estimateFee = ethers.utils
        .parseUnits(this.state.gasPrice, 'gwei')
        .mul(String(this.state.gasLimit));

      // 이제하는데 필요한 총 금액 계산 (이체 금액 + 가스비)
      let totalRequiredAmount = ether.add(estimateFee);

      let balance = ethers.utils.parseEther(wallet.balance);
      if (balance.lt(totalRequiredAmount)) {
        let totalRequiredEther = ethers.utils.formatEther(totalRequiredAmount);
        return Alert.alert(
          '잔액이 부족합니다.',
          `수수료 포함하여 필요한 금액\n${totalRequiredEther} ETH`,
        );
      }
    } catch (e) {
      return Alert.alert('이체 금액을 확인해주세요.');
    }

    try {
    } catch (e) {}

    Alert.alert('ok');
  };

  render() {}
}
