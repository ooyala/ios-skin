var React = require('react-native');

var {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight
} = React;

var Utils = require('./utils');

var styles = Utils.getStyles(require('./style/endScreenStyles.json'));
var ProgressBar = require('./progressBar');
var ControlBar = require('./controlBar');
var WaterMark = require('./waterMark');
var InfoPanel = require('./infoPanel');
var Constants = require('./constants');

var {
  BUTTON_NAMES,
  IMG_URLS
} = Constants;

var leftMargin = 20;
var dismissButtonSize = 20;

var EndScreen = React.createClass({
	getInitialState: function() {
    return {
      showControls:true,
      showDiscoveryPanel:true,
    };
  },

  propTypes: {
    config: React.PropTypes.object,
    title: React.PropTypes.string,
    duration: React.PropTypes.number,
    description: React.PropTypes.string,
    promoUrl: React.PropTypes.string,
    onPress: React.PropTypes.func,
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    upNextDismissed: React.PropTypes.bool,
    discoveryPanel: React.PropTypes.object,
  },

  handleClick: function(name) {
    this.props.onPress(name);
  },

  handleTouchEnd: function(event) {
    this.toggleControlBar();
  },



  _renderDefaultScreen: function(progressBar, controlBar) {
    var fullscreenPromoImage = (this.props.config.endScreen.mode == 'default');
    var replaybuttonLocation = styles.replaybuttonCenter;
    var replaybutton;
    if(this.props.config.endScreen.showReplayButton) {
      var fontFamilyStyle = {fontFamily: this.props.config.icons.replay.fontFamilyName};
      replaybutton = (
        <TouchableHighlight
          onPress={(name) => this.handleClick('PlayPause')}
          underlayColor="transparent"
          activeOpacity={0.5}>
          <Text style={[styles.replaybutton, fontFamilyStyle]}>{this.props.config.icons.replay.fontString}</Text>
        </TouchableHighlight>
      );
    }

    var title = this.props.config.endScreen.showTitle ? this.props.title : null;
    var description = this.props.config.endScreen.showDescription ? this.props.description : null;
    var infoPanel =
      (<InfoPanel title={title} description={description} />);

    return (
      <Image
      source={{uri: this.props.promoUrl}}
      style={styles.fullscreenContainer}
      resizeMode={Image.resizeMode.contain}>
      <View
        style={styles.fullscreenContainer}>
        {infoPanel}
        <View style={replaybuttonLocation}>
          {replaybutton}
        </View>
        <View style={styles.controlBarPosition}>
          {progressBar}
          {controlBar}
        </View>
      </View>
      </Image>
    );
  },

  onDismissPress: function() {
    this.setState({showDiscoveryPanel: false});
  },

  render: function() {
    var progressBar = (<ProgressBar
      ref='progressBar'
      playhead={this.props.duration}
      duration={this.props.duration}
      isShow={this.state.showControls} />);

    var controlBar = (<ControlBar
      ref='controlBar'
      primaryButton="replay"
      height={this.props.height}
      width={this.props.width - leftMargin * 2}
      isShow='true'
      playhead={this.props.duration}
      duration={this.props.duration}
      onPress={(name) => this.handleClick(name)}
      config={{
        controlBar: this.props.config.controlBar,
        buttons: this.props.config.buttons,
        icons: this.props.config.icons
      }}/>);
      return this._renderDefaultScreen(progressBar, controlBar);
  }
});

module.exports = EndScreen;