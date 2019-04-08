// @flow

import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  panelTitleView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  panelIcon: {
    textAlign: 'left',
    fontFamily: 'ooyala-slick-type',
    fontSize: 16,
    color: 'white',
    paddingTop: 10,
    paddingBottom: 10,
  },
  headerFlexibleSpace: {
    flex: 1,
  },
  dismissButton: {
    padding: 20,
  },
  dismissOverlay: {
    position: 'absolute',
    left: 10,
    top: 10,
  },
  dismissIcon: {
    flex: 1,
    fontFamily: 'ooyala-slick-type',
    fontSize: 20,
    color: 'white',
  },
  panelTitleText: {
    padding: 10,
    margin: 10,
    fontWeight: 'bold',
    fontSize: 20,
    fontFamily: 'Helvetica',
    color: 'white',
  },
  closedCaptionsContainer: {
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closedCaptions: {
    alignSelf: 'center',
    textAlign: 'center',
    padding: 4,
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'Helvetica',
    color: 'white',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  closedCaptionsFlexibleSpace: {
    flex: 1,
  },
  panel: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
});
