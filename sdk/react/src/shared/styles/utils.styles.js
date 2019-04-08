// @flow

export default {
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  waterMarkContainer: {
    flexDirection: 'row',
    height: 8,
  },
  waterMarkImageSW: {
    position: 'absolute',
    bottom: 20,
    left: 20,
  },
  waterMarkImageNE: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  waterMarkImageSE: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  waterMarkImage: {
    width: 160,
    height: 24,
    alignItems: 'center',
    backgroundColor: 'transparent',
    margin: 10,
  },
  infoPanelNW: {
    flexDirection: 'column',
    backgroundColor: 'transparent',
  },
  infoPanelSW: {
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  infoPanelTitle: {
    textAlign: 'left',
    marginTop: 20,
    marginLeft: 10,
  },
  infoPanelDescription: {
    textAlign: 'left',
    margin: 10,
  },
};
