'use strict';

import PropTypes from 'prop-types';

import React from 'react';
import {Animated, ScrollView, Text, View,} from 'react-native';

import {BUTTON_NAMES, ERROR_MESSAGE, SAS_ERROR_CODES,} from '../constants';

const Utils = require('../utils');
const styles = Utils.getStyles(require('./style/moreDetailsScreenStyles.json'));

var Log = require('../log');

const dismissButtonSize = 20;

class MoreDetailsScreen extends React.Component {
  static propTypes = {
    height: PropTypes.number,
    width: PropTypes.number,
    onDismiss: PropTypes.func,
    config: PropTypes.object,
    error: PropTypes.object
  };

  state = {
    translateY: new Animated.Value(this.props.height),
    opacity: new Animated.Value(0),
    buttonOpacity: new Animated.Value(1),
    button: '',
  };

  componentDidMount() {
    this.state.translateY.setValue(this.props.height);
    this.state.opacity.setValue(0);
    Animated.parallel([
      Animated.timing(
        this.state.translateY,
        {
          toValue: 0,
          duration: 700,
          delay: 0
        }),
      Animated.timing(
        this.state.opacity,
        {
          toValue: 1,
          duration: 500,
          delay: 0
        }),
    ]).start();
  }

  onDismissBtnPress = () => {
    this.props.onDismiss();
  };

  onDismissPress = () => {
    Animated.timing(
      this.state.opacity,
      {
        toValue: 0,
        duration: 500,
        delay: 0
      }
    ).start(this.onDismissBtnPress);
  };

  render() {
    const dismissButton = Utils.renderRectButton(BUTTON_NAMES.DISMISS,
      styles.iconDismiss,
      this.props.config.icons.dismiss.fontString,
      this.onDismissPress, dismissButtonSize,
      this.props.config.moreDetailsScreen.color,
      this.props.config.icons.dismiss.fontFamilyName);
    const dismissButtonRow = (
      <View style={styles.dismissButtonTopRight}>
        {dismissButton}
      </View>
    );
    const animationStyle = {opacity: this.state.opacity};
    return (
      <Animated.View
        style={[styles.fullscreenContainer, animationStyle, {height: this.props.height, width: this.props.width}]}>
        <Animated.View
          style={[animationStyle, {height: this.props.height, width: this.props.width}]}>
          <ScrollView
            style={[styles.column, styles.scrollContainer]}
            indicatorStyle={"white"}>
            {this._renderText()}
          </ScrollView>
        </Animated.View>
        {dismissButtonRow}
      </Animated.View>
    );
  }

  _renderText = () => {
    var errorCode = -1;
    if (this.props.error) {
      if (this.props.error.code) {
        errorCode = this.props.error.code;
      }
      var title = Utils.stringForErrorCode(errorCode);
      var localizedTitle =
        Utils.localizedString(this.props.locale, title, this.props.localizableStrings).toUpperCase();

      if (this.props.error.description) {
        var userInfo = this.props.error.userInfo || {};
        var errorUserCode = SAS_ERROR_CODES[userInfo['code']] || '';
        var description = ERROR_MESSAGE[errorUserCode] || this.props.error.description;

        var localizedDescription =
          Utils.localizedString(this.props.locale, description, this.props.localizableStrings);
        Log.warn("ERROR: localized description:" + localizedDescription);

        return (
          <Text style={styles.text}>
            {localizedTitle}
            {errorUserCode}
            {localizedDescription}
          </Text>);
      }
    }
  }
}

module.exports = MoreDetailsScreen;
