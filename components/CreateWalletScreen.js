import React, {Component} from 'react';
import {StyleSheet, View, Alert} from 'react-native';
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

  _createWallet = async () => {
      var ethereumjsutil = require('ethereumjs-util');

      // state에 저장된 mnemonic 가져오기
      const seed = bip39.mnemonicToSeed(this.state.mnemonic);

      // 마스터 키 생성 HDPrivateKey(확장개인키)
      // BIP-32 이용
      const root = bip32.fromSeed(seed);

      // // 이더리움 차일드 개인키 생성
      // BIP-44 이용
      // derivePath 형태 => m/purpose'/coin_type'/account'/change/address_index
      const xPrivKey = root.derivePath("m/44'/60'/0'/0/0");
      const privKey = xPrivKey.privateKey.toString('hex');

      // 이더리움 주소 생성
      // 0x + 해시
      let address = '0x' + ethereumjsutil.pubToAddress(xPrivKey.publicKey, true).toString('hex');

      console.log('이더리움 주소: ');
      console.log(address);

       // 이더리움 EIP-55 체크섬 주소로 변환
       // 소문자를 대문자로 변환
       address = ethereumjsutil.toChecksumAddress(address).toString('hex');

       console.log('체크섬 주소: ');
      console.log(address);
       alert(address);
   
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
