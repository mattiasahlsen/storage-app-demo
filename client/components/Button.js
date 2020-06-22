//import { AppLoading } from 'expo'
import React, { useState, useEffect, useRef } from 'react'
import {
  View,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native'

import style, { colors } from '../styles'

export function ShadowButton(props) {
  const shadowOpacityAnim = useRef(new Animated.Value(0.3)).current
  const shadowHeightAnim = useRef(new Animated.Value(2)).current
  const shadowWidthAnim = useRef(new Animated.Value(2)).current

  return (
    <Animated.View
      style={[
        styles.shadowButton,
        !props.disabled ? [
          styles.buttonShadow,
          {
            shadowOpacity: shadowOpacityAnim,
            shadowOffset: {
              height: shadowHeightAnim,
              width: shadowWidthAnim,
            },
            elevation: 3,
          }
        ] :
        { opacity : 0.5 },
        props.style,
      ]}
    >
      <TouchableWithoutFeedback
        activeOpacity={0.5}
        onPressIn={() => {
          Animated.timing(shadowOpacityAnim, { toValue: 0.2, duration: 200 })
            .start()
          Animated.timing(shadowHeightAnim, { toValue: 1, duration: 200 })
            .start()
          Animated.timing(shadowWidthAnim, { toValue: 1, duration: 200 })
            .start()
        }}
        onPressOut={() => {
          Animated.timing(shadowOpacityAnim, { toValue: 0.6, duration: 200 })
            .start()
          Animated.timing(shadowHeightAnim, { toValue: 2, duration: 200 })
            .start()
          Animated.timing(shadowWidthAnim, { toValue: 2, duration: 200 })
            .start()
        }}
        {...props}
      >
        <View style={{padding: 10}}>{props.children}</View>
      </TouchableWithoutFeedback>
    </Animated.View>
  )
}

export default function Button(props) {
  return (
    <TouchableOpacity
      {...props}
      style={[
        styles.button,
        props.style,
      ]}
    >
      {props.children}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 5,
    backgroundColor: colors.white,
    padding: 10,
    shadowColor: '#000',
    shadowRadius: 3,
    shadowOpacity: 0.2,
    shadowOffset: {
      height: 1,
      width: 1,
    },
    elevation: 1,
  },
  buttonShadow: {
    shadowColor: '#000',
    shadowRadius: 3,
  },
  shadowButton: {
    backgroundColor: colors.white,
    borderRadius: 5,
  }
})
