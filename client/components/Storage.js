import React, { useState, useEffect, useRef } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { gql } from 'apollo-boost';
import { useQuery, useMutation } from '@apollo/react-hooks';
import Button, { ShadowButton } from './Button';
import Text, { MediumText } from './Text';
import { Entypo } from '@expo/vector-icons';

import style, { colors } from '../styles'
import { toTimeString } from '../lib'

const DELETE_STORAGE = gql`
  mutation deleteStorage($username: String!) {
    deleteStorage(username: $username)
  }
`

export default function Storage(props) {
  const [deleteStorageServer, { loading, error, data: deleteResponse }] =
    useMutation(DELETE_STORAGE, { variables: { username: props.username } })

  async function deleteStorage() {
    await deleteStorageServer()
    props.onDeleteStorage()
  }

  return (
    <View style={[style.row, styles.storage]}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Text style={{marginHorizontal: 5}}>
          {toTimeString(props.storage.time)}
        </Text>
        <TouchableOpacity onPress={() => props.navigateTo(props.storage.location)}>
          <Entypo
            name={'location-pin'}
            size={30}
            color={colors.darkGray}
          />
        </TouchableOpacity>
      </View>
      <Button
        onPress={deleteStorage}
        style={{backgroundColor: colors.lighter}}
      >
        <Text>Ta bort</Text>
      </Button>
    </View>
  )
}

const styles = StyleSheet.create({
  storage: {
    padding: 8,
    borderRadius: 5,
    backgroundColor: colors.white,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
})

