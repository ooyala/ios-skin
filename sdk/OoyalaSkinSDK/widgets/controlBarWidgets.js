/**
 * Created by dkao on 7/7/15.
 */
'use strict';

var React = require('react-native');
var {
  Text,
  View,
  Image,
  StyleSheet,
  SliderIOS,
  TouchableHighlight
} = React;
var VolumeView = require('./VolumeView');

var Constants = require('./../constants');
var {
  BUTTON_NAMES,
  IMG_URLS,
  } = Constants;

var controlBarWidget = React.createClass({

  propTypes: {
    widgetType: React.PropTypes.string,
    options: React.PropTypes.object
  },

  playPauseWidget: function (options) {
    var iconMap = {
      "play": options.playIcon,
      "pause": options.pauseIcon,
      "replay": options.replayIcon
    };
    var fontFamilyStyle = {fontFamily: iconMap[options.primaryActionButton].fontFamilyName};
    return (
      <TouchableHighlight onPress={options.onPress}>
        <Text style={[options.style, fontFamilyStyle]}>{iconMap[options.primaryActionButton].fontString}</Text>
      </TouchableHighlight>
    );
  },

  volumeWidget: function (options) {
    var volumeScrubber = null;
    if (options.showVolume) {
      volumeScrubber = <VolumeView style={options.scrubberStyle} />;
    }
    var fontFamilyStyle = {fontFamily: options.icon.fontFamilyName};
    return (
      <View style={{flexDirection: 'row'}}>
        <TouchableHighlight onPress={options.onPress}>
          <Text style={[options.style, fontFamilyStyle]}>{options.icon.fontString}</Text>
        </TouchableHighlight>
        {volumeScrubber}
      </View>
    );
  },

  timeDurationWidget: function (options) {
    return (<Text style={options.style}>{options.durationString}</Text>);
  },

  flexibleSpaceWidget: function (options) {
    return (<View style={{flex: 1}} />);
  },

  discoveryWidget: function (options) {
    // TODO implement
    return null;
  },

  fullscreenWidget: function(options) {
    var fontFamilyStyle = {fontFamily: options.icon.fontFamilyName};
    return (<TouchableHighlight onPress={options.onPress}>
      <Text style={[options.style, fontFamilyStyle]}>{options.icon.fontString}</Text>
    </TouchableHighlight>);
  },

  moreOptionsWidget: function (options) {
    var fontFamilyStyle = {fontFamily: options.icon.fontFamilyName};
    return (<TouchableHighlight onPress={options.onPress}>
      <Text style={[options.style, fontFamilyStyle]}>{options.icon.fontString}</Text>
    </TouchableHighlight>);
  },

  watermarkWidget: function (options) {
    if(options.shouldShow) {
      return (<Image style={options.style}
        source={{uri: IMG_URLS.OOYALA_LOGO}}
        resizeMode={options.resizeMode}>
      </Image>);
    }
    else {
      return null;
    }
  },

  shareWidget: function(options) {
    // TODO implement
    return null;
  },

  closedCaptionWidget: function(options) {
    // TODO implement
    return null;
  },

  bitrateSelectorWidget: function(options) {
    // TODO implement
    return null;
  },

  render: function() {

    var widgetsMap = {
      "playPause": this.playPauseWidget,
      "volume": this.volumeWidget,
      "timeDuration": this.timeDurationWidget,
      "flexibleSpace": this.flexibleSpaceWidget,
      "discovery": this.discoveryWidget,
      "fullscreen": this.fullscreenWidget,
      "moreOptions": this.moreOptionsWidget,
      "watermark": this.watermarkWidget,
      "share": this.shareWidget,
      "closedCaption": this.closedCaptionWidget,
      "bitrateSelector": this.bitrateSelectorWidget
    };
    var widgetOptions = this.props.options[this.props.widgetType.name];

    return widgetsMap[this.props.widgetType.name](widgetOptions);
  }

});

module.exports = controlBarWidget;