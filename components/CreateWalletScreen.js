import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import {
  Container,
  Content,
  Segment,
  Text,
  Icon,
  Button,
  Header,
  Left,
  Body,
  Title,
  Right,
  Form,
  Textarea,
  Input,
  Item,
} from 'native-base';
import bip39 from 'react-native-bip39';
import bip32 from 'bip32';
import ethUtil from 'ethereumjs-util';
import RNSecureKeyStore, {ACCESSIBLE} from 'react-native-secure-key-store';

export default class CreateWalletScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mnemonic: null,
    };
  }

  static navigationOptions = {
    title: '지갑 생성하기',
  };

  componentDidMount = () => {
    // 12개의 영단어로 구성된 니모닉 생성
    bip39.generateMnemonic().then((mnemonic) => {
      this.setState({mnemonic}); // 니모닉 생성하기
    });
  };

  // 지갑 저장
  _storeData = async (wallet, privateKey) => {
    try {
      // 지갑 목록 정보 가져오기
      const wallets = JSON.parse(await AsyncStorage.getItem('WALLETS')) || [];

      // 지갑 목록에 추가하기
      wallets.push(wallet);

      // 지갑 목록 정보 저장하기 (새로운 정보로)
      await AsyncStorage.setItem('WALLETS', JSON.stringify(wallets));

      // priavte key를 안전한 영역에 저장
      await RNSecureKeyStore.set(wallet.address, privateKey, {
        accessible: ACCESSIBLE.ALWAYS_THIS_DEVICE_ONLY,
      });
    } catch (e) {
      console.log(e);
    }
  };

  _createWallet = async () => {
    var ethereumjsutil = require('ethereumjs-util');

    // state에 저장된 mnemonic(니모닉) 가져오기
    const seed = bip39.mnemonicToSeed(this.state.mnemonic);

    // 시드에서 마스터 키 생성 HDPrivateKey(확장개인키)
    // BIP-32 이용
    const root = bip32.fromSeed(seed);

    // 이더리움 차일드 개인키 생성
    // BIP-44 이용
    // derivePath 형태 => m/purpose'/coin_type'/account'/change/address_index
    const xPrivKey = root.derivePath("m/44'/60'/0'/0/0");
    const privateKey = xPrivKey.privateKey.toString('hex');

    // public key에서 이더리움 주소 생성
    // 0x + 해시
    let address =
      '0x' +
      ethereumjsutil.pubToAddress(xPrivKey.publicKey, true).toString('hex');

    console.log('이더리움 주소: ');
    console.log(address);

    // 이더리움 EIP-55 체크섬 주소로 변환
    // 소문자를 대문자로 변환
    address = ethereumjsutil.toChecksumAddress(address).toString('hex');

    console.log('체크섬 주소: ');
    console.log(address);
    alert(address);

    // 저장할 지갑 정보
    const wallet = {
      name: '이더리움',
      coinType:'ETH',
      symbol: 'ETH',
      address
    }

    await this._storeData(wallet,privateKey);

    // 지갑목록으로 돌아가기
    this.props.navigation.goBack();
  };

  render() {
    return (
      <Container>
        <View style={{flex: 1, padding: 10}}>
          <View style={{flex: 1}}>
            <Text note>
              아래 니모닉을 복사하여 백업하세요. 지갑을 복구하는데 중요한
              데이터입니다.
            </Text>
            <Form>
              <Textarea
                rowSpan={5}
                bordered
                value={this.state.mnemonic}></Textarea>
            </Form>
          </View>
          <View style={{flex: 1}}>
            <Button block primary onPress={() => this._createWallet()}>
              <Text>생성하기</Text>
            </Button>
          </View>
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {},
});
