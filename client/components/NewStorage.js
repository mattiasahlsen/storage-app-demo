import React, {useState} from 'react';
import {
  View,
  Platform,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Entypo } from '@expo/vector-icons';

import Button, { ShadowButton } from './Button';
import Text, { MediumText } from './Text';

import style, { colors } from '../styles'
import { toTimeString } from '../lib'

const nextHour = new Date(Date.now() + 3600 * 1000)
nextHour.setMinutes(0, 0, 0)

export default function NewStorage(props) {
  const [time, setTime] = useState(null);
  const [location, setLocation] = useState(null)

  const [pickingTime, setPickingTime] = useState(false)

  const onTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || time
    setPickingTime(Platform.OS === 'ios');
    setTime(currentTime)
  };

  function pickTime() {
    if (pickingTime && !time) setTime(nextHour)
    setPickingTime(!pickingTime)
  }

  async function getLocation() {
    try {
      const newLocation = await props.getLocation()
      if (newLocation) setLocation(newLocation)
    } catch (err) {
      console.log('err in getLocation', err)
    }
  }

  function createStorage() {
    const storage = { time, location, }
    props.onComplete(storage)
  }

  return (
    <View style={styles.container}>
      <View style={[style.row, { marginBottom: 5}]}>
        <MediumText style={style.header}>Ny förvaring</MediumText>
        <Button
          style={{backgroundColor: colors.lighter}}
          onPress={props.cancel}
        >
          <Text>Avbryt</Text>
        </Button>
      </View>

      <MediumText>Upphämtning</MediumText>
      <View style={style.row}>
        <Text>
          {time ?
            toTimeString(time) :
            'Ingen tid vald'}
        </Text>
        <Button
          onPress={pickTime}
          style={styles.settingsButton}
        >
          <Text>{pickingTime ? 'Ok' : (time ? 'Byt tid' : 'Välj tid')}</Text>
        </Button>
      </View>

      <View style={{flex: 1}}>
        {pickingTime && (
          <DateTimePicker
            value={time || nextHour}
            mode={'time'}
            is24Hour={true}
            display="default"
            onChange={onTimeChange}
            style={[styles.picker, style.boxShadow]}
          />
        )}

        <View style={style.row}>
          {
            location ?
            <TouchableOpacity onPress={location.navigateTo}>
              <Entypo
                name={'location-pin'}
                size={30}
                color={colors.darkGray}
              />
            </TouchableOpacity> :
            <Text>Ingen plats vald</Text>
          }
          <Button onPress={getLocation} style={styles.settingsButton}>
            <Text>
              {pickingTime ? 'Ok' : (location ? 'Byt plats' : 'Välj plats')}
            </Text>
          </Button>
        </View>

        <ShadowButton
          onPress={createStorage}
          style={{padding: 10, marginTop: 10, marginHorizontal: 5}}
          disabled={!time}
        >
          <MediumText style={{textAlign: 'center'}}>Boka förvaring</MediumText>
        </ShadowButton>

      </View>


    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'stretch',
    flex: 1,
  },
  picker: {
    zIndex: 20,
    position: 'absolute',
    width: '100%',
    height: 130,
    backgroundColor: colors.white,
  },
  pickerBar: {
    marginHorizontal: 10,
    alignItems: 'flex-end',
  },
  settingsButton: {
    width: 100,
    alignItems: 'center',
    backgroundColor: colors.white,
  },
})
