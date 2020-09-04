import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Clipboard,
  Share,
  Alert,
  TouchableOpacity,
  Slider,
} from 'react-native';
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
  Item,
  Input,
  Label,
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
      console.log(this.state.value);
      ether = ethers.utils.parseEther(String(this.state.value || 0));
      console.log(ether);
      if (ether.lte(0)) {
        // 0 보다 작으면
        return Alert.alert('이제 금액을 확인해주세요.');
      }

      // 가스비(수수료) 계산
      let estimateFee = ethers.utils
        .parseUnits(this.state.gasPrice, 'gwei')
        .mul(String(this.state.gasLimit));

      // 이제하는데 필요한 총 금액 계산 (이체 금액 + 가스비)
      let totalRequiredAmount = ether.add(estimateFee);
      console.log(ethers.utils.formatEther(totalRequiredAmount));
      
      if (ether.lt(totalRequiredAmount)) {
        let totalRequiredEther = ethers.utils.formatEther(totalRequiredAmount);
        return Alert.alert(
          '잔액이 부족합니다.',
          `수수료 포함하여 필요한 금액\n${totalRequiredEther} ETH`,
        );
      }
    } catch (e) {
      console.log(e);
      return Alert.alert('전송중 오류가 발생했습니다.');
    }

    // 받는 주소 검증
    try {
      if (!this.checkAddress(this.state.toAddress)) {
        return Alert.alert('받는 주소를 확인해주세요.');
      }
    } catch (e) {
      return Alert.alert('받는 주소를 확인해주세요.');
    }

    Alert.alert('ok');
    this.props.navigation.navigate('ComfimTxScreen', this.state);
  };

  render() {
    const wallet = this.state.wallet;

    return (
      <Container style={StyleSheet.container}>
        <Header
          style={{
            backgroundColor: 'black',
          }}>
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body style={{marginLeft: 70}}>
            <Title>{wallet.symbol} 출금</Title>
          </Body>
        </Header>
        <Content padder>
          <View style={styles.item}>
            <Text style={styles.label}>이체 금액</Text>
            <Item last regular style={styles.input}>
              <Input
                keyboardType="numeric"
                value={this.state.value}
                onChangeText={(value) =>
                  this.setState({value: value.replace(/[^0-9|\.]/g, '')})
                }
                placeholder="보내는 금액을 입력해주세요."
                placeholderTextColor="#BBB"></Input>
            </Item>
          </View>
          <View style={styles.item}>
            <Text style={styles.label}>받는 주소</Text>
            <Item regular style={styles.input}>
              <Input
                value={this.state.toAddress}
                onChangeText={(toAddress) => this.setState({toAddress})}
                placeholder="이더리움 주소를 입력해주세요."
                placeholderTextColor="#BBB"
              />
              <TouchableOpacity>
                <Icon name="qrcode-scan" type="MaterialCommunityIcons" />
              </TouchableOpacity>
            </Item>
          </View>
          <View style={styles.item}>
            <Text style={styles.label}>가스 수수료</Text>
            <Slider
              value={parseFloat(this.state.gasPrice) || 0}
              onValueChange={(gasPrice) =>
                this.setState({gasPrice: gasPrice.toFixed(1)})
              }
              maximumValue={7}
              minimumValue={1.1}
              step={0.1}
              minimumTrackTintColor="orangered"
              maximumTrackTintColor="royalblue"
            />
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text note>Slow</Text>
              <Text note>Fastest</Text>
            </View>
          </View>
          <Card style={styles.item}>
            <CardItem header>
              <Text note>Advanced Options</Text>
            </CardItem>
            <CardItem>
              <Body>
                <View style={{width: '100%'}}>
                  <Item inlineLabel stackedLabel>
                    <Label>가스가격(GWei)</Label>
                    <Input
                      value={this.state.gasPrice}
                      onChangeText={(gasPrice) =>
                        this.setState({gasPrice: gasPrice || '0'})
                      }
                    />
                  </Item>
                  <Item inlineLabel stackedLabel>
                    <Label>가스 한도</Label>
                    <Input
                      value={this.state.gasLimit}
                      onChangeText={(gasLimit) =>
                        this.setState({gasLimit: gasLimit || '0'})
                      }
                    />
                  </Item>
                </View>
              </Body>
            </CardItem>
          </Card>
          <View style={styles.item}>
            <Button
              
              block
              // disabled={!this.state.isReady}
              onPress={this.next}>
              <Text>확인</Text>
            </Button>
          </View>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  item: {
    marginVertical: 10,
  },
  input: {
    backgroundColor: 'rgba(245, 245, 245, 1.0)',
    paddingLeft: 10,
    borderBottomEndRadius: 5,
    borderBottomStartRadius: 5,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  label: {
    marginLeft: 5,
    marginBottom: 10,
    color: '#555',
  },
});
