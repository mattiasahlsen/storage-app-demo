import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Text as NormalText,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import ApolloClient, { gql } from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';
import Modal from 'react-native-modal';
import * as Font from 'expo-font';

import Text, { MediumText, LightItalicText } from './components/Text'
import Menu from './components/Menu'
import Map from './components/Map'
import Button, { ShadowButton } from './components/Button'

import style, { colors } from './styles'

// NOT YET USED
const client = new ApolloClient({
  uri: 'http://192.168.72.37:4000/graphql',
});

const USERNAME_KEY = 'username'

// graphql queries


export default function App() {
  const [username, setUsername] = useState(null)
  const [tempUsername, setTempUsername] = useState('')
  function login() {
    setUsername(tempUsername)
    AsyncStorage.setItem(USERNAME_KEY, tempUsername)
  }
  function logout() {
    setUsername(null)
    setTempUsername('')
    AsyncStorage.removeItem(USERNAME_KEY)
  }

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null);
  const [menuOpen, setMenuOpen] = useState(true)

  const [storage, setStorage] = useState(null)

  // get a location on the map from the user through a promise
  // that resolves when the user clicks on the map
  const [pickedLocation, setPickedLocation] = useState(null)
  const [locationPromise, setLocationPromise] = useState(null)
  const createLocationPromise = () => {
    if (locationPromise) locationPromise.reject()

    let res
    let rej
    const promise = new Promise((resolve, reject) => {
      res = resolve
      rej = reject
    })
    promise.resolve = res
    promise.reject = rej
    setLocationPromise(promise)
    return promise
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
    } finally {
      setLoading(false)
    }
  }

  // check if the user is logged in already
  async function getUsername() {
    try {
      const myUsername = await AsyncStorage.getItem(USERNAME_KEY)
      if (myUsername) setUsername(myUsername)
    } catch (err) {
      setError(err)
    }
  }

  useEffect(() => {
    loadResources()
    getUsername()
  }, []);

  // create "map-press" promise that resolves when
  // the user presses the map
  async function getMapLocation() {
    const location = await createLocationPromise()
    setLocationPromise(null)
    setPickedLocation(location)
    return location
  }
  // press handler for map press, resolves the promise
  function mapPress(location) {
    if (locationPromise) {
      locationPromise.resolve(location)
    }
  }

  function createStorage(newStorage) {
    setStorage(newStorage)
    setPickedLocation(null)
    setMenuOpen(false)
  }
  function cancelNewStorage() {
    setPickedLocation(null)
  }

  if (loading) return (
    <View style={styles.container}>
      <NormalText>Laddar...</NormalText>
    </View>
  )

  const menuIsOpen = !locationPromise && menuOpen

  return (
    <ApolloProvider client={client}>
      <View style={styles.container}>
        { username &&
          <View style={[styles.username, style.boxShadow]}>
            <Text>Inloggad som</Text>
            <MediumText>{username}</MediumText>
          </View>
        }

        <Modal
          isVisible={!username}
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

        {
          locationPromise &&
          <View style={[styles.modal, style.boxShadow]}>
            <Text>Tryck på kartan där du vill att dina saker blir upphämtade.</Text>
            <View style={{alignItems: 'flex-end', marginTop: 10, marginRight: 5}}>
              <Button onPress={() => locationPromise.resolve(undefined)}>
                <Text>Avbryt</Text>
              </Button>
            </View>
          </View>
        }

        <Map
          closeMenu={() => setMenuOpen(false)}
          onPress={locationPromise ? mapPress : () => setMenuOpen(false)}
          disabled={menuIsOpen}
          storage={storage}
          marker={pickedLocation}
        />

        <Menu
          getLocation={getMapLocation}
          createStorage={createStorage}
          open={menuIsOpen}
          toggle={() => setMenuOpen(!menuOpen)}
          cancelNewStorage={cancelNewStorage}
          storage={storage}
          removeStorage={() => setStorage(null)}
          username={username}
          logout={logout}
        />
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

  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },

  menu: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
  },

  error: {
    backgroundColor: colors.lighter,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  info: {
    marginTop: 40,
    backgroundColor: colors.lighter,
    padding: 20,
    borderRadius: 10,
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
  marker: {
    backgroundColor: colors.white,
    paddingHorizontal: 5,
    borderRadius: 10,
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
  username: {
    position: 'absolute',
    right: 10,
    top: 30,
    backgroundColor: colors.white,
    zIndex: 2,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  title: {
    fontSize: 40,
    textAlign: 'center',
  }
});
