// @flow

import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  placeholder: {
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: 'transparent',
  },
  imagePreview: {
    flex: 1,
    alignItems: 'stretch',
    resizeMode: 'contain',
  },
  deviceNamesView: {
    flex: 1,
    height: 50,
    justifyContent: 'center',
  },
  connectedToText: {
    color: 'white',
  },
  deviceNameText: {
    color: 'white',
    fontWeight: 'bold',
  },
  topPanel: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    paddingTop: 20,
    height: 90,
  },
  disconnectText: {
    borderWidth: 1,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 4,
    color: 'white',
    fontWeight: 'bold',
    borderColor: 'black',
  },
  disconnectView: {
    flexDirection: 'column',
    width: 150,
    height: 50,
    flex: 1,
    marginEnd: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  castIcon: {
    top: 5,
    marginLeft: 40,
    marginRight: 10,
    fontSize: 40,
    color: 'white',
  },
  border: {
    borderBottomColor: '#5c5c5c',
    borderBottomWidth: 0.5,
  },
  castConnectedScreen: {
    flex: 0,
    flexDirection: 'column',
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
});
