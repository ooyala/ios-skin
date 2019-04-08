// @flow

import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  fullscreenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 0,
    flexDirection: 'column',
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  adContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  placeholder: {
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: 'transparent',
  },
});
