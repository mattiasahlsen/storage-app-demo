import React, { useState, useEffect, useRef } from 'react'
import {
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native'


export function SlideY(props) {
  const isOpen = props.isOpen

  // events
  const opened = props.opened
  const closed = props.closed

  const startY = props.startY

  const yAnim = useRef(new Animated.Value(startY)).current

  useEffect(() => {
    if (isOpen) {
      Animated.spring(yAnim, { toValue: 0, speed: 8 })
        .start(() => opened && opened())
    } else {
      Animated.timing(yAnim, { toValue: startY, duration: 200 })
        .start(() => closed && closed())
    }
  }, [isOpen])

  return (
      <Animated.View
        style={[
          { transform: [ { translateY: yAnim } ]},
          props.style,
        ]}
      >
      { props.children }
    </Animated.View>
  )
}

export function Fade(props) {
  const isOpen = props.isOpen

  // events
  const opened = props.opened
  const closed = props.closed

  const fadeAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (isOpen) {
      Animated.timing(fadeAnim, { toValue: 1, duration: 200 })
        .start(() => opened && opened())
    } else {
      Animated.timing(fadeAnim, { toValue: 0, duration: 200 })
        .start(() => closed && closed())
    }
  }, [isOpen])

  return (
      <Animated.View
        style={[
          { opacity: fadeAnim },
          props.style,
        ]}
      >
      { props.children }
    </Animated.View>
  )
}

const styles = StyleSheet.create({
})
