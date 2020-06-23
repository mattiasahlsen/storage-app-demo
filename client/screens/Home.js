import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
} from 'react-native';
import { gql } from 'apollo-boost';
import { useQuery, useMutation } from '@apollo/react-hooks';
import * as Font from 'expo-font';

import Text, { MediumText, LightItalicText } from '../components/Text'
import Menu from '../components/Menu'
import Map from '../components/Map'
import Button, { ShadowButton } from '../components/Button'
import Info from '../components/Info'

import style, { colors } from '../styles'

// graphql queries
const GET_STORAGE = gql`
  query getStorage($username: String!) {
    storage(username: $username) {
      id
      username
      pickup {
        longitude
        latitude
        time
      }
    }
  }
`

let navigateTo

export default function Home(props) {
  const [menuOpen, setMenuOpen] = useState(true)
  const [storage, setStorage] = useState(null)

  // fetch storage from database
  const { loadingGet, errorGet, data: queryResponse, refetch: reloadStorage }
    = useQuery(GET_STORAGE, {
      variables: { username: props.username},
    });

  useEffect(() => {
    if (queryResponse && queryResponse.storage) {
      const newStorage = {
        location: {
          coord: {
            longitude: queryResponse.storage.pickup.longitude,
            latitude: queryResponse.storage.pickup.latitude,
          },
        },
        time: new Date(queryResponse.storage.pickup.time),
      }
      setStorage(newStorage)
    } else if (queryResponse) {
      setStorage(null)
    }
  }, [queryResponse])

  function onDeleteStorage() {
    reloadStorage()
  }

  function onCreateStorage(newStorage) {
    reloadStorage()
    setPickedLocation(null)
    setMenuOpen(false)
  }

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
        <Info
          cancel={cancelGetMapLocation} 
          text={'Tryck på kartan där du vill att dina saker blir upphämtade.'}
        />
      }

      <Map
        loadingEnabled={true}
        onAnimate={() => setMenuOpen(false)}
        onPress={locationPromise ? mapPress : () => setMenuOpen(false)}
        disabled={menuIsOpen}
        storage={storage}
        marker={pickedLocation}
        myLocation={props.myLocation}
        setNavigateTo={newNavigateTo => navigateTo = newNavigateTo}
      />

      <Menu
        getLocation={getMapLocation}
        onCreateStorage={onCreateStorage}
        open={menuIsOpen}
        toggle={() => setMenuOpen(!menuOpen)}
        cancelNewStorage={cancelNewStorage}
        storage={storage}
        logout={props.logout}
        username={props.username}
        onDeleteStorage={onDeleteStorage}
        navigateTo={navigateTo}
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
