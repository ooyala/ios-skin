var React = require('react-native');
var {
  ActivityIndicatorIOS,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Animated
  } = React;

var Constants = require('../constants');
var {
  BUTTON_NAMES
} = Constants;

// Uses the rectbutton styles
var styles = require('../utils').getStyles(require('./style/RectButtonStyles.json'));
var PLAY = "play";
var PAUSE = "pause";

var VideoViewPlayPause = React.createClass({
  propTypes: {
    icons: React.PropTypes.object,
    position: React.PropTypes.string,
    onPress: React.PropTypes.func,
    opacity: React.PropTypes.number,
    frameWidth: React.PropTypes.number,
    frameHeight: React.PropTypes.number,
    buttonWidth: React.PropTypes.number,
    buttonHeight: React.PropTypes.number,
    buttonColor: React.PropTypes.string,
    buttonStyle: React.PropTypes.object,
    fontSize: React.PropTypes.number,
    style:React.PropTypes.object,
    showButton: React.PropTypes.bool,
    playing: React.PropTypes.bool,
    isStartScreen: React.PropTypes.bool,
    rate: React.PropTypes.number,
    playhead: React.PropTypes.number
  },

  getInitialState: function() {
    return {
      play: {
        animationScale: new Animated.Value(1),
        animationOpacity: new Animated.Value(1)
      },
      pause: {
        animationScale: new Animated.Value(1),
        animationOpacity: new Animated.Value(0)
      },
      widget: {
        animationOpacity: new Animated.Value(1)
      },
      controlPlaying: true
    };
  },

  componentWillMount: function () {
    if(this.isInitialVideoPlay() || this.isVideoRemount(PLAY)) {
      this.playPauseAction(PLAY);
      this.setState({controlPlaying: false});
    }
    if(this.isVideoRemount(PAUSE)) {
      this.props.onPress(BUTTON_NAMES.RESET_AUTOHIDE);
    }
  },

  isInitialVideoPlay: function() {
    return (!this.props.isStartScreen && this.props.playhead == 0);
  },

  isVideoRemount: function(state) {
    if(!this.props.isStartScreen && this.props.playhead != 0) {
      if(state == PLAY) {
        return (!this.props.playing);
      }
      if(state == PAUSE) {
        return (this.props.playing);
      }
    }
    return false;
  },

  onPress: function() {
    if(this.props.showButton) {
      // Sets controlPlaying if video is paused by user
      this.setState({controlPlaying: !this.state.controlPlaying});
      if(this.props.rate <= 0 != this.state.controlPlaying && !this.props.isStartScreen) {
        this.playPauseAction(PAUSE);
      }
      else {
        this.props.onPress(BUTTON_NAMES.PLAY_PAUSE);
        this.playPauseAction((this.state.controlPlaying) ? PLAY : PAUSE);
      }
    }
    else {
      this.props.onPress(BUTTON_NAMES.RESET_AUTOHIDE);
    }
  },

  // Animations for play/pause transition
  playPauseAction(name) {
    if(name == PLAY) {
      this.state.play.animationScale.setValue(1);
      this.state.play.animationOpacity.setValue(1);
      Animated.parallel([
        Animated.timing(this.state.play.animationOpacity, {
          toValue: 0
        }),
        Animated.timing(this.state.play.animationScale, {
          toValue: 2
        }),
        Animated.timing(this.state.pause.animationOpacity, {
          toValue: 1,
          duration: 100,
          delay: 1200
        })
      ]).start();
    }
    if(name == PAUSE) {
      this.state.pause.animationOpacity.setValue(0);
      this.state.play.animationOpacity.setValue(1);
      this.state.play.animationScale.setValue(1);
    }
  },

  componentDidUpdate(prevProps, prevState) {
    if(prevProps.playing != this.props.playing && (this.props.rate <= 0) == this.state.controlPlaying) {
      this.playPauseAction(this.props.playing ? PAUSE : PLAY);
    }
  },

  _renderLoading: function() {
    if(this.props.isLoading) {
      return (
        <Animated.View style={[styles.buttonArea, styles.loading, sizeStyle,{position: 'absolute'}]}>
          <ActivityIndicatorIOS
            animating={true}
            size="large">
          </ActivityIndicatorIOS>
        </Animated.View>);
    }
  },

  _renderButton(name) {
    var fontStyle = {fontSize: this.props.fontSize, fontFamily: this.props.icons[name].fontFamily};

    var opacity = {opacity: this.state[name].animationOpacity};
    var animate = {transform: [{scale: this.state[name].animationScale}]};
    var buttonColor = {color: this.props.buttonColor == null? "white": this.props.buttonColor};

    var size = {position: 'absolute'};

    return (
      <Animated.Text
        style={[styles.buttonTextStyle, fontStyle, buttonColor, this.props.buttonStyle, animate, opacity, size]}>
        {this.props.icons[name].icon}
      </Animated.Text>
    );
  },

  // Gets the play button based on the current config settings
  render: function() {
    if(this.props.style != null) {
      positionStyle = this.props.style;
    }
    else if (this.props.position == "center") {
      var topOffset = Math.round((this.props.frameHeight - this.props.buttonHeight) * 0.5);
      var leftOffset = Math.round((this.props.frameWidth - this.props.buttonWidth) * 0.5);

      positionStyle = {
        position: 'absolute', top: topOffset, left: leftOffset
      };
    } else {
      positionStyle = styles[this.props.position];
    }
    var sizeStyle = {width: this.props.buttonWidth, height: this.props.buttonHeight};
    var opacity = {opacity: this.state.widget.animationOpacity};

    var playButton = this._renderButton(PLAY);
    var pauseButton = this._renderButton(PAUSE);
    var loading = this._renderLoading();

    if(this.props.showButton) {
      Animated.timing(this.state.widget.animationOpacity, {
        toValue: 1,
        duration: 400
      }).start();
    }
    else {
      Animated.timing(this.state.widget.animationOpacity, {
        toValue: 0,
        duration: 400
      }).start();
    }
    return (
      <TouchableHighlight
        onPress={() => this.onPress()}
        style={[positionStyle]}
        underlayColor="transparent"
        activeOpacity={this.props.opacity}>
        <View>
          <Animated.View style={[styles.buttonArea, sizeStyle, {position: 'absolute'}]}>
            {loading}
          </Animated.View>
          <Animated.View style={[styles.buttonArea, sizeStyle, opacity, {position: 'absolute'}]}>
            {playButton}
            {pauseButton}
          </Animated.View>
        </View>
      </TouchableHighlight>
    );
  }
});

module.exports = VideoViewPlayPause;