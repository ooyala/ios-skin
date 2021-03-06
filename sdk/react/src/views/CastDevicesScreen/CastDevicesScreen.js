// @flow

import React from 'react';
import {
  Animated, FlatList, Text, View,
} from 'react-native';
import type AnimatedValue from 'react-native/Libraries/Animated/src/nodes/AnimatedValue';

import CastDeviceListItem from './CastDeviceListItem';
import { BUTTON_NAMES } from '../../constants';
import RectangularButton from '../../shared/RectangularButton';
import type { Config } from '../../types/Config';

import styles from './CastDevicesScreen.styles';

const dismissButtonSize = 20;

type Props = {
  height: number,
  width: number,
  onDismiss: () => void,
  onDeviceSelected: () => void,
  config: Config,
  devices: Array<{
    id: string,
    title: string,
  }>,
  selectedDeviceId?: string,
};

type State = {
  opacity: AnimatedValue,
  selectedID: number,
};

export default class CastDevicesScreen extends React.Component<Props, State> {
  static defaultProps = {
    selectedDeviceId: null,
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      opacity: new Animated.Value(0),
      selectedID: -1,
    };
  }

  componentDidMount() {
    const { opacity } = this.state;

    opacity.setValue(0);

    Animated.parallel([
      Animated.timing(
        opacity,
        {
          toValue: 1,
          duration: 500,
          delay: 0,
        },
      ),
    ])
      .start();
  }

  onDismissBtnPress = () => {
    const { onDismiss } = this.props;
    onDismiss();
  };

  onDismissPress = () => {
    const { opacity } = this.state;
    Animated.timing(
      opacity,
      {
        toValue: 0,
        duration: 500,
        delay: 0,
      },
    )
      .start(this.onDismissBtnPress);
  };

  onPressButton = (deviceId) => {
    const { onDeviceSelected } = this.props;

    this.setState({
      selectedID: deviceId,
    });
    onDeviceSelected(deviceId);
  };

  renderCastDevicesScreen(animationStyle, dismissButtonRow) {
    const { height, width, devices } = this.props;
    const { selectedID } = this.state;

    return (
      <Animated.View
        style={[styles.fullscreenContainer, animationStyle, {
          height,
          width,
        }]}
      >
        <Animated.View
          style={[animationStyle, {
            height,
            width,
            marginTop: 20,
          }]}
        >
          <FlatList
            style={styles.listViewContainer}
            data={devices}
            extraData={selectedID}
            keyExtractor={item => item.id}
            renderItem={this.renderItem}
          />
        </Animated.View>
        <Text style={styles.title}>
          {'Remote playback'}
        </Text>
        {dismissButtonRow}
      </Animated.View>
    );
  }

  renderItem = ({ item }) => {
    const { selectedID } = this.state;
    const { config, selectedDeviceId } = this.props;
    const { iconStyle } = config.castControls;

    return (
      <CastDeviceListItem
        id={item.id}
        title={item.title}
        onPressItem={this.onPressButton}
        selected={item.id === selectedID || item.id === selectedDeviceId}
        activeColor={iconStyle.active.color}
        inactiveColor={iconStyle.inactive.color}
        castIcon={config.icons['chromecast-disconnected']}
      />
    );
  };

  render() {
    const { config } = this.props;
    const { opacity } = this.state;

    const dismissButtonRow = (
      <View style={styles.dismissButtonTopRight}>
        <RectangularButton
          name={BUTTON_NAMES.DISMISS}
          style={styles.iconDismiss}
          icon={config.icons.dismiss.fontString}
          onPress={this.onDismissPress}
          fontSize={dismissButtonSize}
          buttonColor={config.castControls.iconStyle.inactive.color}
          fontFamily={config.icons.dismiss.fontFamilyName}
        />
      </View>
    );

    const animationStyle = { opacity };

    return this.renderCastDevicesScreen(animationStyle, dismissButtonRow);
  }
}
