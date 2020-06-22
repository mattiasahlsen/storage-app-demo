import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Text as NormalText,
  TextInput,
} from 'react-native';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-community/async-storage';
import ApolloClient, { gql } from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';
import Modal from 'react-native-modal';
import * as Font from 'expo-font';

import Text, { MediumText, LightItalicText } from './components/Text'
import Button, { ShadowButton } from './components/Button'

import Home from './screens/Home'

import style, { colors } from './styles'

// NOT YET USED
const client = new ApolloClient({
  uri: 'http://192.168.72.37:4000/graphql',
});

const USERNAME_KEY = 'username'

export default function App() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null);

  const [username, setUsername] = useState(null)
  const [tempUsername, setTempUsername] = useState('')
  const [loggedIn, setLoggedIn] = useState(false)

  function login() {
    setUsername(tempUsername)
    AsyncStorage.setItem(USERNAME_KEY, tempUsername)
    setLoggedIn(true)
  }
  function logout() {
    setTempUsername('')
    AsyncStorage.removeItem(USERNAME_KEY)
    setLoggedIn(false)
  }

  const [myLocation, setMyLocation] = useState(null);
  async function getMyLocation() {
    let { status } = await Location.requestPermissionsAsync();
    if (status !== 'granted') {
      setError('Appen måste ha tillgång till din plats, gå till inställningar.');
    } else {
      let location = await Location.getCurrentPositionAsync({});
      setMyLocation(location);
    }
  }

  async function loadResources() {
    try {
      await Promise.all([
        Font.loadAsync({
          // This is the font that we are using for our tab bar
          // We include SpaceMono because we use it in HomeScreen.js. Feel free to
          // remove this if you are not using it in your app
          'montserrat': require('./assets/fonts/Montserrat-Regular.ttf'),
          'montserrat-bold': require('./assets/fonts/Montserrat-Bold.ttf'),
          'montserrat-medium': require('./assets/fonts/Montserrat-Medium.ttf'),
          'montserrat-italic': require('./assets/fonts/Montserrat-Italic.ttf'),
          'montserrat-light-italic': require('./assets/fonts/Montserrat-LightItalic.ttf'),
        }),
      ])
    } catch (err) {
      setError(err)
    }
  }
  // check if the user is logged in already
  async function getUsername() {
    try {
      const myUsername = await AsyncStorage.getItem(USERNAME_KEY)
      if (myUsername) {
        setUsername(myUsername)
        setLoggedIn(true)
      }
    } catch (err) {
      setError(err)
    }
  }

  useEffect(() => {
    Promise.all([
      loadResources(),
      getUsername(),
      getMyLocation(),
    ]).finally(() => {
      setLoading(false)
    })
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <NormalText>Laddar...</NormalText>
      </View>
    )
  }

  return (
    <ApolloProvider client={client}>
      <View style={styles.container}>
        <Modal
          isVisible={!loggedIn}
          style={styles.login}
          animationOut={'slideOutLeft'}
          onModalShow={() => setUsername(null)}
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
            onChangeText={text => setTempUsername(text)}
            value={tempUsername}
            placeholder={'Användarnamn'}
          />
          <ShadowButton
            style={{marginTop: 10}}
            onPress={login}
          >
            <MediumText
              style={{textAlign: 'center'}}
            >LOGGA IN</MediumText>
          </ShadowButton>

        </Modal>

        <Modal
          isVisible={!!error}
          style={{
            ...style.boxShadow,
            zIndex: 5,
          }}
          swipeDirection={['up', 'down']}
          swipeThreshold={30}
          onSwipeComplete={() => setError(null)}
          hasBackdrop={true}
        >
          <View style={styles.error}>
            <MediumText style={{fontSize: 24}}>Oj, det blev ett fel</MediumText>
            <Text>{(error && error.message) || error}</Text>
          </View>
        </Modal>

        {username ?
          <Home
            logout={logout}
            username={username}
            myLocation={myLocation}
          /> :
          <NormalText>Logga in...</NormalText>
        }

      </View>
    </ApolloProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    width: '100%',
  },

  error: {
    backgroundColor: colors.lighter,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
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
});
