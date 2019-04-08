// @flow

import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  fullscreenContainer: {
    flexDirection: 'column',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  dismissButtonTopRight: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  rowCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    flexWrap: 'wrap',
  },
  rowsContainer: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    flexWrap: 'wrap',
  },
  rowBottom: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'flex-end',
    backgroundColor: 'transparent',
  },
  icon: {
    margin: 15,
  },
  iconDismiss: {
    padding: 25,
  },
});
