import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
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

export default class WalletsScreen extends Component {
  static navigationOptions = {
    title: '이더리움 지갑',
  };

  render() {
    const {navigate} = this.props.navigation;
    
    return (
      <Container style={styles.container}>
        <Content padder>
          <Card>
            <CardItem>
              <Body>
                <Button
                  transparent
                  iconLeft
                  large
                  block
                  onPress={() =>
                    navigate('CreateWallet')
                  }>
                  <Icon name="ios-add-circle-outline"></Icon>
                  <Text>지갑 생성하기</Text>
                </Button>
              </Body>
            </CardItem>
          </Card>
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
});
