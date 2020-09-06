import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Slider,
  TouchableOpacity,
  Alert,
  AsyncStorage,
  BackHandler,
} from 'react-native';
import {
  Container,
  Spinner,
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
  Form,
  Item,
  Input,
  Label,
  Row,
} from 'native-base';
import {ethers} from 'ethers';
import Loader from './Loader';

import RNSecureKeyStore, {ACCESSIBLE} from 'react-native-secure-key-store';

export default class ConfimTxScreen extends Component {
  static navigationOptions = {
    title: '출금',
  };

  constructor(props) {
    super(props);

    const {
      fromAddress,
      toAddress,
      gasPrice,
      gasLimit,
      value,
    } = props.navigation.state.params; // 이전 화면에서 전달받은 state 가져오기
    console.log('params', props.navigation.state.params);
    // 수수료(가스비) 계산(가스가격 * 가스사용량)
    let estimateFee = ethers.utils.bigNumberify(gasPrice).mul(gasLimit);

    // 가스가격(gwei)를 ether 단위로 변환하기
    let fee = ethers.utils.formatUnits(estimateFee, 'gwei').toString();

    // 필요한 총 금액 계산(출금금액 + 수수료)
    let totalAmount = ethers.utils
      .parseEther(value)
      .add(ethers.utils.parseEther(fee));
    totalAmount = ethers.utils.formatEther(totalAmount).toString();

    this.state = {
      loading: false, // 로딩 화면 출력 여부
      fromAddress, // 보내는 주소
      toAddress, // 받는 주소
      gasPrice, // 가스 가격
      gasLimit, // 가스 최대 사용량
      value, // 출금 금액
      fee, // 수수료
      totalAmount, // 총 금액
    };
  }

  // 서명 수행 함수
  signFunc = async () => {
    // 로딩 이미지 출력
    this.setState({
      loading: true,
    });

    let {fromAddress, toAddress, gasPrice, gasLimit, value} = this.state;

    // 1. ropsten 테스트넷 provider 생성하기
    let provider = ethers.getDefaultProvider('ropsten');

    // 2. nonce 값 조회(거래 시퀀스 번호, 0부터 시작하여 거래할때 마다 증가)
    let nonce = await provider.getTransactionCount(fromAddress);
    console.log({ nonce });

    // 3. Transaction 데이터 생성
    let transaction = {
      to: toAddress,
      value: ethers.utils.parseEther(value), // ether 를 wei 로
      gasPrice: ethers.utils.parseUnits(gasPrice, 'gwei'), // gwei 를 wei 로
      gasLimit: ethers.utils.bigNumberify(gasLimit),
      nonce: nonce,
      data: '',
    };

    console.log(transaction);
    
    // 4. 개인키(서명키) 조회 (가져오기)
    let privateKey = await RNSecureKeyStore.get(fromAddress);
    console.log(`개인키: ${privateKey}`);

    // 5. 서명을 수행할 지갑 생성
    let wallet = new ethers.Wallet(privateKey);

    // 6. 이더리움 transaction 서명하기
    let sign = await wallet.sign(transaction);

    // 7. 서명된 이더리움 transaction 배포하기
    try {
      const tx = await provider.sendTransaction(sign);
      console.log('sendTransaction', tx.hash);

      // 8. 완료 화면으로 이동
      this.props.navigation.navigate('CompleteScreen', tx.hash);
    } catch (e) {
      console.log(e);
      Alert.alert('Error', `${e.code}\n${e.message}`);
    }

    this.setState({
      loading: false,
    });
  };

  render() {
    let state = this.state;
    return (
      <Container style={styles.container}>
        <View>
          <View
            style={{
              padding: 20,
              alignItems: 'center',
              borderBottomColor: '#D2D8DD',
              borderBottomWidth: 1,
            }}>
            <Text note>출금 금액</Text>
            <Text style={{fontSize: 30, fontWeight: '500', marginBottom: 20}}>
              {state.value} ETH
            </Text>
            <Text note>받는 주소</Text>
            <Text numberOfLines={1} ellipsizeMode="middle">
              {state.toAddress}
            </Text>
          </View>
          <View style={{marginHorizontal: 25, marginVertical: 20}}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingVertical: 20,
                borderBottomColor: '#D2D8DD',
                borderBottomWidth: 1,
              }}>
              <Text note>수수료 (가스비)</Text>
              <View style={{alignItems: 'flex-end'}}>
                <Text style={{fontSize:25}}>{state.fee}</Text>
                <Text note>가스 가격 {state.gasPrice} Gwei</Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingVertical: 20,
                borderBottomColor: '#D2D8DD',
                borderBottomWidth: 1,
              }}>
              <Text note>총 비용 (출금 금액 + 수수료)</Text>
              <Text style={{fontSize:25}}>{state.totalAmount} ETH</Text>
            </View>
          </View>
          <View style={styles.hintBox}>
            <Text style={styles.hintText}>위 거래내용을 확인하시기 바랍니다.</Text>
            <Text style={styles.hintText}>아래 승인버튼을 선택하시면 계속해서 거래를 진행합니다.</Text>
          </View>
        </View>
        <View style={{marginHorizontal:10,marginBottom:30}}>
          <Button block disabled={false} onPress={this.signFunc}>
            <Text>승인</Text>
          </Button>
        </View>
        {/* <Loader loading={this.state.loading}></Loader> */}
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'space-between',
  },
  hintBox: {
    borderWidth: 1,
    borderColor: 'rgb(220,220,220)',
    padding: 10,
    marginHorizontal: 20,
  },
  hintText: {
    fontSize: 13,
    color: '#4d4d4d',
  },
});
