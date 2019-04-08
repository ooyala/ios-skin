// @flow

export default {
  fullscreenContainer: {
    flexDirection: 'column',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  listViewContainer: {
    marginTop: 50,
    marginBottom: 25,
    flex: 0,
  },
  itemContainer: {
    flex: 1,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemContainerSelected: {
    flex: 1,
    backgroundColor: 'rgba(114, 114, 114, 0.6)',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  scrollContainer: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'transparent',
    marginTop: 30,
  },
  dismissButtonTopRight: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  iconDismiss: {
    padding: 25,
  },
  icon: {
    paddingLeft: 30,
  },
  text: {
    paddingLeft: 36,
    paddingRight: 100,
    color: '#FFFFFF',
    fontFamily: 'AvenirNext-DemiBold',
    fontSize: 16,
  },
  textSelected: {
    paddingLeft: 36,
    paddingRight: 100,
    fontFamily: 'AvenirNext-DemiBold',
    fontSize: 16,
  },
  title: {
    position: 'absolute',
    padding: 25,
    fontSize: 20,
    top: 0,
    left: 0,
    color: '#FFFFFF',
    fontFamily: 'AvenirNext-DemiBold',
  },
};
