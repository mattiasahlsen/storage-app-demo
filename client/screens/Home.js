import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
} from 'react-native';
import ApolloClient, { gql } from 'apollo-boost';
import * as Font from 'expo-font';

import Text, { MediumText, LightItalicText } from '../components/Text'
import Menu from '../components/Menu'
import Map from '../components/Map'
import Button, { ShadowButton } from '../components/Button'

import style, { colors } from '../styles'

// graphql queries
const GET_STORAGE = gql`
  query getStorage($username: String!) {
    storage(username: $username) {
      id
      username
      pickup {
        x
        y
        time
      }
    }
  }
`
const SET_STORAGE = gql`
  query setStorage($username: String!, $pickup: PointInput!) {
    createStorage(username: $username, pickup: $pickup) {
      id
      username
      pickup {
        x
        y
        time
      }
    }
  }
`


export default function Home(props) {
  //const { loadingQuery, errorQuery, data } = useQuery(GET_STORAGE);

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
  function cancelGetMapLocation() {
    locationPromise.resolve(undefined)
  }

  const menuIsOpen = !locationPromise && menuOpen

  return (
    <View>
      <View style={[styles.username, style.boxShadow]}>
        <Text>Inloggad som</Text>
        <MediumText>{props.username}</MediumText>
      </View>

      {
        locationPromise &&
        <View style={[styles.modal, style.boxShadow]}>
          <Text>Tryck på kartan där du vill att dina saker blir upphämtade.</Text>
          <View style={{alignItems: 'flex-end', marginTop: 10, marginRight: 5}}>
            <Button onPress={cancelGetMapLocation}>
              <Text>Avbryt</Text>
            </Button>
          </View>
        </View>
      }

      <Map
        loadingEnabled={true}
        onAnimate={() => setMenuOpen(false)}
        onPress={locationPromise ? mapPress : () => setMenuOpen(false)}
        disabled={menuIsOpen}
        storage={storage}
        marker={pickedLocation}
        myLocation={props.myLocation}
      />

      <Menu
        getLocation={getMapLocation}
        createStorage={createStorage}
        open={menuIsOpen}
        toggle={() => setMenuOpen(!menuOpen)}
        cancelNewStorage={cancelNewStorage}
        storage={storage}
        removeStorage={() => setStorage(null)}
        logout={props.logout}
      />
    </View>
  );
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
});
