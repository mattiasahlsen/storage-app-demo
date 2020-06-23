import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

import Text, { MediumText, LightItalicText } from '../components/Text'
import Button, { ShadowButton } from '../components/Button'

import style, { colors } from '../styles'

export default function Info(props) {
  return (
    <View style={[styles.modal, style.boxShadow]}>
      <Text>{props.text}</Text>
      <View style={{alignItems: 'flex-end', marginTop: 10, marginRight: 5}}>
        <Button onPress={props.cancel}>
          <Text>Avbryt</Text>
        </Button>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  modal: {
    position: 'absolute',
    top: 30,
    left: 10,
    right: 10,
    borderRadius: 10,
    backgroundColor: colors.lighter,
    zIndex: 3,
    padding: 20,
  },
});
