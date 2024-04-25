import React, {useState} from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

const OrderPage = ({ navigation }) => {

  return (
    <View style={styles.container}>
      <Text>Dance!!!!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default OrderPage;