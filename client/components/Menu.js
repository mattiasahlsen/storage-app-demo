//import { AppLoading } from 'expo'
import React, { useState, useEffect, useRef } from 'react'
import {
  View,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Button, { ShadowButton } from './Button';
import Text, { MediumText } from './Text';
import { Entypo } from '@expo/vector-icons';

import NewStorage from './NewStorage';

import style, { colors } from '../styles'
import { toTimeString } from '../lib'

export function Menu(props) {
  const [gettingStorage, setGettingStorage] = useState(false)

  const menuHeight = Dimensions.get('window').height * 0.6
  const offset = menuHeight - 50

  const yAnim = useRef(new Animated.Value(offset)).current
  const snapBack = () => {
    if (props.open) {
      Animated.spring(yAnim, { toValue: 20, speed: 8 }).start()
    } else {
      Animated.spring(yAnim, { toValue: offset, speed: 8 }).start()
    }
  }

  useEffect(() => {
    snapBack()
  }, [props.open])


  function createStorage(storage) {
    props.createStorage(storage)
    setGettingStorage(false)
  }
  function getStorage() {
    setGettingStorage(true)
  }

  async function getLocation() {
    const location = await props.getLocation()
    return location
  }

  function cancelNewStorage() {
    setGettingStorage(false)
    props.cancelNewStorage()
  }

  return (
    <Animated.View
      style={[
        {
          height: menuHeight,
        },
        { transform: [ { translateY: yAnim } ] },
        styles.menu,
      ]}
    >
      <TouchableWithoutFeedback
        style={{flex: 1}}
        onPress={props.toggle}
      >
        <View style={{padding: 10, alignItems: 'center'}}>
          <View style={styles.line}/>
        </View>
      </TouchableWithoutFeedback>

      <Button
        onPress={props.logout}
        style={styles.logout}
      >
        <Text>Logga ut</Text>
      </Button>

      <View style={styles.content}>
        {
          gettingStorage ?
            <NewStorage
              onComplete={createStorage}
              getLocation={getLocation}
              cancel={cancelNewStorage}
            /> :
            (
              props.storage ?
              <View>
                <MediumText>Förvaring</MediumText>
                <View style={[style.row, styles.storage]}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{marginHorizontal: 5}}>
                      {toTimeString(props.storage.time)}
                    </Text>
                    <TouchableOpacity onPress={props.storage.location.navigateTo}>
                      <Entypo
                        name={'location-pin'}
                        size={30}
                        color={colors.darkGray}
                      />
                    </TouchableOpacity>
                  </View>
                  <Button
                    onPress={props.removeStorage}
                    style={{backgroundColor: colors.lighter}}
                  >
                    <Text>Ta bort</Text>
                  </Button>
                </View>
                <Text style={{marginTop: 10, textAlign: 'center'}}>
                  Du kan för tillfället bara förvara en sak åt gången.
                </Text>
              </View> :
              <ShadowButton
                onPress={getStorage}
                style={{padding: 10}}
              >
                <MediumText style={{fontSize: 20, textAlign: 'center'}}>
                  FÖRVARA GREJER
                </MediumText>
              </ShadowButton>
            )
        }
      </View>
    </Animated.View>
  )
}
export default Menu

const styles = StyleSheet.create({
  menu: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    ...style.boxShadow,
    padding: 10,
  },

  logout: {
    position: 'absolute',
    top: 0,
    right: 0,
    margin: 10,
    borderRadius: 15,
  },

  line: {
    height: 5,
    width: 50,
    borderRadius: 15,
    backgroundColor: colors.lightGray,
    marginTop: 10,
  },
  content: {
    flex: 1,
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 20,
    alignItems: 'stretch',
  },

  storage: {
    padding: 8,
    borderRadius: 5,
    backgroundColor: colors.white,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
})
