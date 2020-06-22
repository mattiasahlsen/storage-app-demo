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
import * as Font from 'expo-font';

import Text, { MediumText, LightItalicText } from './components/Text'
import Button, { ShadowButton } from './components/Button'
import Error from './components/Error'

import Home from './screens/Home'
import Login from './screens/Login'

import style, { colors } from './styles'

// NOT YET USED
const client = new ApolloClient({
  uri: 'http://192.168.72.37:4000/graphql',
});

const USERNAME_KEY = 'username'

export default function App() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState();

  const [username, setUsername] = useState(null)
  const [loggedIn, setLoggedIn] = useState(false)

  function login(myUsername) {
    setUsername(myUsername)
    AsyncStorage.setItem(USERNAME_KEY, myUsername)
    setLoggedIn(true)
  }
  function logout() {
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
  async function loadUsername() {
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
      loadUsername(),
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
  if (error) return <Error error={error}/>

  return (
    <ApolloProvider client={client}>
      <View style={styles.container}>

        <Login
          isVisible={!loggedIn}
          onModalShow={() => setUsername(null)}
          login={login}
        />

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
});
