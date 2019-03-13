import PropTypes from 'prop-types';
import React from 'react';
import { Animated, TouchableHighlight } from 'react-native';
import { STRING_CONSTANTS } from '../constants';
import AccessibilityUtils from '../accessibilityUtils';
import rectButtonStyles from './style/RectButtonStyles.json';
import Utils from '../utils';

const styles = Utils.getStyles(rectButtonStyles);

class SwitchButton extends React.Component {

  static propTypes = {
    visible: PropTypes.bool.isRequired,
    disabled: PropTypes.bool.isRequired,
    isForward: PropTypes.bool.isRequired,
    onSwitch: PropTypes.func.isRequired,
    icon: PropTypes.string.isRequired,
    fontStyle: PropTypes.object,
    sizeStyle: PropTypes.object,
    opacity: PropTypes.object,
    animate: PropTypes.object,
    buttonColor: PropTypes.object,
  };

  onPress = () => {
    const { props } = this;
    const { onSwitch, isForward } = props;
    onSwitch(isForward);
  };

  render() {
    const { props } = this;
    const {
      visible, isForward, timeValue, sizeStyle, disabled, icon, fontStyle, buttonColor, animate, opacity,
    } = props;
    if (!visible) {
      return null;
    }
    const accessibilityLabel = AccessibilityUtils
      .createAccessibilityForForwardButton(isForward, timeValue, STRING_CONSTANTS.SECONDS);
    const position = {
      position: 'absolute',
    };

    const accessible = true;
    return (
      <TouchableHighlight
        accessible={accessible}
        accessibilityLabel={accessibilityLabel}
        disabled={disabled}
        onPress={() => this.onPress()}
        underlayColor="transparent"
        importantForAccessibility="yes"
        style={[sizeStyle]}
      >

        <Animated.View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        >
          <Animated.Text
            accessible={false}
            style={[position, styles.buttonTextStyle, fontStyle, buttonColor, animate, opacity]}
          >
            {icon}
          </Animated.Text>
        </Animated.View>
      </TouchableHighlight>
    );
  }
}

module.exports = SwitchButton;
