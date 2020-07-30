import React, {Component} from 'react';
import {
  Card,
  CardItem,
  Body,
  Text,
  Icon,
  Button,
  Left,
  Right,
  Thumbnail,
} from 'native-base';

export default function WalletComponent(props) {
  const wallet = props.wallet;

  return (
    <Card>
      <CardItem>
        <Left>
          <Thumbnail
            small
            source={{
              uri:
                'https://s2.coinmarketcap.com/static/img/coins/32x32/1027.png',
            }}></Thumbnail>
          <Body>
            <Text>ETH</Text>
            <Text>{wallet.name}</Text>
          </Body>
        </Left>
        <Right>
          <Icon name='dots-vertical' type='MaterialCommunityIcons' />
        </Right>
      </CardItem>
    </Card>
  );
}
