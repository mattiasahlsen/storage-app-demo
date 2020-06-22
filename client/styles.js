import { StyleSheet } from 'react-native'

export const colors = {
  lightGray: '#cccccc',
  gray: '#666666',
  darkGray: '#4d4d4d',

  light: '#f2f2f2',
  lighter: '#f6f6f6',
  white: '#fff',

  dark: '#333333',

  primary: '#66D48B',
  primary1: '#66D48B',
  primary2: '#38c768',
  primary3: '#32b35d',

  secondary: '#4d4d4d',

  background: '#fff',

  danger: '#ff4d4d',
}
colors.icon = colors.gray
colors.iconSelected = colors.dark
colors.text = colors.dark


export default StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
  },
  h1: {
    fontSize: 32,
  },
  label: {
    fontSize: 16,
    padding: 2,
    marginBottom: 2,
    color: colors.darkGray,
  },
  input: {
    fontSize: 24,
    borderRadius: 5,
    padding: 5,
    backgroundColor: colors.light,
    color: colors.darkGray,
  },

  spacingTop: {
    marginTop: 10,
  },
  spacingBottom: {
    marginBottom: 10,
  },
  spacingY: {
    marginVertical: 10,
  },
  spacingX: {
    marginHorizontal: 10,
  },
  spacing: {
    margin: 10,
  },
  center: {
    textAlign: 'center',
  },
  left: {
    alignItems: 'flex-start',
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 2,
  },
  section: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.2)',
    paddingVertical: 5,
  },
  subtitle: {
    fontSize: 20,
    marginBottom: 5,
  },

  textShadow: {
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 1,
  },
  boxShadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 5,
  },
})
