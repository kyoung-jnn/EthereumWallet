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
  console.log('지갑목록에 표현될 지갑')
  console.log(wallet);
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
      <CardItem>
        <Text note ellipsizeMode="middle" numberOfLines={1} selectable={true}>{wallet.address}</Text>
      </CardItem>
      <CardItem>
        <Body style={{alignItems:'flex-end'}}>
          <Text>
            {wallet.balance || '0.00'}
          </Text>
          <Text note style={{ marginRight:0 }}>
            ≈ ￦ {wallet.convertPrice || '0.00'}
          </Text>
        </Body>
      </CardItem>
    </Card>
  );
}
