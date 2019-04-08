// @flow

export default {
  container: {
    backgroundColor: 'rgba(22,22,22,0.9)',
    flexDirection: 'row',
    height: 80,
  },
  thumbnailContainer: {
    marginRight: 15,
  },
  thumbnail: {
    height: 80,
    flex: 2,
  },
  thumbnailImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnailPlayButton: {
    fontFamily: 'ooyala-slick-type',
    fontSize: 23,
    alignSelf: 'center',
    textAlign: 'center',
    color: 'white',
  },
  countdownText: {
    fontFamily: 'ooyala-slick-type',
    fontSize: 23,
    textAlign: 'center',
    color: 'white',
  },
  countdownView: {
    width: 18,
    height: 18,
    marginLeft: 10,
  },
  textContainer: {
    flex: 5,
    flexDirection: 'row',
    paddingTop: 15,
    marginRight: 15,
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  title: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 10,
    fontSize: 14,
    fontFamily: 'Roboto',
  },
  description: {
    color: 'white',
    marginTop: 15,
    fontFamily: 'GillSans',
    fontSize: 11,
  },
  dismissButtonContainer: {
    marginTop: 20,
    marginRight: 15,
  },
  dismissButton: {
    fontSize: 10,
    color: 'white',
  },
};
