import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  TextInput,
} from 'react-native';
import Modal from 'react-native-modal';

import Text, { MediumText, LightItalicText } from '../components/Text'
import Button, { ShadowButton } from '../components/Button'


import style, { colors } from '../styles'

export default function Login(props) {
  const [username, setUsername] = useState('')

  return (
    <Modal
      isVisible={props.isVisible}
      onModalShow={props.onModalShow}

      style={styles.login}
      animationOut={'slideOutLeft'}
    >
      <View style={{marginVertical: 10, alignItems: 'center'}}>
        <View style={{
          borderBottomWidth: 1,
          borderBottomColor: 'rgba(0, 0, 0, 0.4)',
        }}>
          <MediumText style={styles.title}>
            Vinden
          </MediumText>
        </View>
        <LightItalicText style={{fontSize: 24, textAlign: 'center'}}>
          On the fly
        </LightItalicText>
      </View>

      <TextInput
        style={styles.textInput}
        onChangeText={text => setUsername(text)}
        value={username}
        placeholder={'Användarnamn'}
      />
      <ShadowButton
        style={{marginTop: 10}}
        onPress={() => props.login(username)}
      >
        <MediumText
          style={{textAlign: 'center'}}
        >LOGGA IN</MediumText>
      </ShadowButton>

    </Modal>
  )
}

const styles = StyleSheet.create({
  login: {
    margin: 0,
    position: 'absolute',
    backgroundColor: colors.white,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  textInput: {
    backgroundColor: colors.light,
    borderRadius: 5,
    padding: 10,
    fontSize: 18,
    color: colors.dark,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: 40,
    textAlign: 'center',
  },
})
