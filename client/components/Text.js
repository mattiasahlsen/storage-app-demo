import React from 'react'
import { Text } from 'react-native'

import style, { colors } from '../styles'

const CustomText = props => {
  let fontFamily
  if (props.fontWeight === 'bold') fontFamily = 'montserrat-bold'
  else if (props.fontWeight === 'medium') fontFamily = 'montserrat-medium'
  else if (props.fontStyle === 'italic') fontFamily = 'montserrat-italic'
  else if (props.fontStyle === 'lightItalic') fontFamily = 'montserrat-light-italic'
  else fontFamily = 'montserrat'

  return (
    <Text {...props} style={[
      {
        fontFamily,
        fontSize: 16,
        color: colors.text,
      },
      props.style,
    ]} />
  )
}
export { CustomText as Text }
export default CustomText

export function BoldText(props) {
  return (
    <CustomText {...props} style={props.style} fontWeight={'bold'}/>
  )
}
export function MediumText(props) {
  return (
    <CustomText {...props} style={props.style} fontWeight={'medium'}/>
  )
}
export function ItalicText(props) {
  return (
    <CustomText {...props} style={props.style} fontStyle={'italic'}/>
  )
}
export function LightItalicText(props) {
  return (
    <CustomText {...props} style={props.style} fontStyle={'lightItalic'}/>
  )
}
