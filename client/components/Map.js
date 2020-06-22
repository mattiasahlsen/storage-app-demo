import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Entypo } from '@expo/vector-icons';

import Text, { MediumText } from './Text'

import style, { colors } from '../styles'
import { toTimeString } from '../lib'

const latLng = location => ({
  latitude: location.coords.latitude,
  longitude: location.coords.longitude,
});

export default function Map(props) {
  const [map, setMap] = useState(null)

  function navigateTo(coord) {
    if (map) {
      props.onAnimate && props.onAnimate()
      map.animateCamera({ center: coord }, 100)
    }
  }
  function mapPress(e) {
    const coord = e.nativeEvent.coordinate
    const location = {
      coord,
      navigateTo: () => navigateTo(coord),
    }
    props.onPress && props.onPress(location)
  }
  useEffect(() => {
    if (props.storage) {
      props.storage.navigateTo = () => navigateTo(props.storage.location)
    }
  }, [props.storage])

  if (props.marker) console.log(props.marker)

  return (
    <View>
      <MapView
        ref={mapRef => setMap(mapRef)}
        style={styles.mapStyle}
        showsUserLocation={true}
        followsUserLocation={false}
        showsMyLocationButton={false}
        initialRegion={{
          ...latLng(props.myLocation),
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
        onPress={mapPress}
      >
        {
          props.storage && props.storage.location &&
          <Marker
            coordinate={props.storage.location.coord}
            title={'Upphämtas här'}
            description={'Vi hämtar dina saker här kl ' +
              toTimeString(props.storage.time) + '.'}
            style={{alignItems: 'center'}}
          >
            <TouchableOpacity onPress={props.storage.location.navigateTo}>
              <Entypo
                name={'suitcase'}
                size={30}
                color={colors.darkGray}
                style={style.boxShadow}
              />
            </TouchableOpacity>
            <View style={[style.boxShadow, styles.markerBox]}>
              <Text style={[style.spacingY, { fontSize: 12} ]}>
                {toTimeString(props.storage.time)}
              </Text>
            </View>
          </Marker>
        }
        {
          props.marker &&
          <Marker
            coordinate={props.marker.coord}
            title={'Vald plats'}
          >
            <Entypo
              name={'location-pin'}
              size={30}
              color={colors.dark}
              style={style.boxShadow}
            />
          </Marker>
        }
      </MapView>

      { props.disabled &&
        <TouchableWithoutFeedback
          onPress={props.onPress}
        >
          <View style={styles.overlay}/>
        </TouchableWithoutFeedback>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  markerBox: {
    backgroundColor: colors.white,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  overlay: {
    zIndex: 2,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  }
});
