import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Slider,
  TouchableOpacity,
  Alert,
  AsyncStorage,
  Image,
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
} from 'native-base';

export default function (props) {
  const hash = props.navigation.state.params;
  return (
    <Container style={StyleSheet.container}>
      <View style={{flex: 1, marginTop: 50}}>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'space-evenly',
            marginHorizontal: 25,
            height: 300,
          }}>
          <Icon
            name="checkcircle"
            type="AntDesign"
            style={{color: '#2c952c', fontSize: 150}}
          />
          <Text>거래가 완료되었습니다.</Text>
          <TouchableOpacity>
            <Text note style={{color: '#07C', textDecorationLine: 'underline'}}>
              {hash}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{marginHorizontal: 10, marginBottom: 30}}>
        <Button
          block
          onPress={() => {
            props.navigation.popToTop();
          }}>
          <Text>확인</Text>
        </Button>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'space-between',
  },
});
