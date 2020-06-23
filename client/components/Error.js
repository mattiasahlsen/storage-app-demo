import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

import Text, { MediumText } from '../components/Text'

import style, { colors } from '../styles'

export default function Error(props) {
  const error = props.error

  return (
    <View style={styles.container}>
      <MediumText style={{fontSize: 24}}>Oj, det blev ett fel</MediumText>
      <Text>{(error && error.message) || error}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    backgroundColor: colors.lighter,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
});
