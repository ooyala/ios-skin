// @flow

import React from 'react';
import {
  ActivityIndicator, Image, Platform, Text, TouchableHighlight, View,
} from 'react-native';

import { BUTTON_NAMES, UI_SIZES } from '../../constants';
import InfoPanel from './InfoPanel';
import * as Log from '../../lib/log';
import responsiveMultiplier from '../../lib/responsiveMultiplier';
import BottomOverlay from '../../shared/BottomOverlay';
import type { Config } from '../../types/Config';
import type { Marker } from '../../types/Markers';

import styles from './EndScreen.styles';

type Props = {
  config: Config,
  title: string,
  duration: number,
  description: string,
  promoUrl: string,
  onPress: () => void,
  width: number,
  height: number,
  volume: number,
  fullscreen: boolean,
  handleControlsTouch: () => void,
  loading: boolean,
  onScrub: () => void,
  showAudioAndCCButton: boolean,
  markers: Array<Marker>,
  showWatermark: boolean,
};

type State = {
  showControls: boolean,
};

export default class EndScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      showControls: true,
    };
  }

  handleClick = (name) => {
    const { onPress } = this.props;

    onPress(name);
  };

  handlePress = (name) => {
    const { onPress, onScrub } = this.props;
    const { showControls } = this.state;

    Log.verbose(`VideoView Handle Press: ${name}`);

    if (showControls) {
      if (name === 'LIVE') {
        onScrub(1);
      } else {
        onPress(name);
      }
    } else {
      onPress(name);
    }
  };

  renderDefaultScreen = () => {
    const {
      config, description: propsDescription, height, promoUrl, title: propsTitle, width,
    } = this.props;

    const endScreenConfig = config.endScreen || {};

    const replayMarginBottom = !config.controlBar.enabled
      ? responsiveMultiplier(width, UI_SIZES.CONTROLBAR_HEIGHT) : 1;

    const replayButtonLocation = styles.replayButtonCenter;
    let replayButton;

    if (endScreenConfig.showReplayButton) {
      const fontFamilyStyle = { fontFamily: config.icons.replay.fontFamilyName };
      replayButton = (
        <TouchableHighlight
          accessible
          accessibilityLabel={BUTTON_NAMES.REPLAY}
          accessibilityComponentType="button"
          onPress={() => this.handleClick(BUTTON_NAMES.REPLAY)}
          underlayColor="transparent"
          activeOpacity={0.5}
        >
          <Text style={[styles.replayButton, fontFamilyStyle]}>{config.icons.replay.fontString}</Text>
        </TouchableHighlight>
      );
    }

    const title = endScreenConfig.showTitle ? propsTitle : null;
    const description = endScreenConfig.showDescription ? propsDescription : null;
    const infoPanel = (<InfoPanel title={title} description={description} />);

    return (
      <View style={[styles.fullscreenContainer, { height, width }]}>
        <Image
          source={{ uri: promoUrl }}
          style={
            [styles.fullscreenContainer, {
              position: 'absolute',
              top: 0,
              left: 0,
              width,
              height,
            }]}
          resizeMode="contain"
        />
        {infoPanel}
        <View style={[replayButtonLocation, { marginBottom: replayMarginBottom }]}>
          {replayButton}
        </View>
        <View style={styles.controlBarPosition}>
          {this.renderBottomOverlay(true)}
        </View>
      </View>
    );
  };

  handleScrub = (value) => {
    const { onScrub } = this.props;

    onScrub(value);
    this.handleClick(BUTTON_NAMES.PLAY_PAUSE);
  };

  renderBottomOverlay(show) {
    const {
      config, duration, fullscreen, handleControlsTouch, height, loading, markers, showAudioAndCCButton, showWatermark,
      volume, width,
    } = this.props;

    return (
      <BottomOverlay
        width={width}
        height={height}
        primaryButton="replay"
        playhead={duration}
        duration={duration}
        volume={volume}
        onPress={name => this.handlePress(name)}
        shouldShowProgressBar
        showWatermark={showWatermark}
        handleControlsTouch={() => handleControlsTouch()}
        onScrub={value => this.handleScrub(value)}
        fullscreen={fullscreen}
        isShow={show}
        loading={loading}
        showAudioAndCCButton={showAudioAndCCButton}
        config={{
          controlBar: config.controlBar,
          castControls: config.castControls,
          buttons: config.buttons,
          icons: config.icons,
          live: config.live,
          general: config.general,
        }}
        markers={markers}
      />
    );
  }

  renderLoading() {
    const { height, loading, width } = this.props;

    const loadingSize = responsiveMultiplier(width, UI_SIZES.LOADING_ICON);
    const scaleMultiplier = Platform.OS === 'android' ? 2 : 1;
    const topOffset = Math.round((height - loadingSize * scaleMultiplier) * 0.5);
    const leftOffset = Math.round((width - loadingSize * scaleMultiplier) * 0.5);
    const loadingStyle = {
      position: 'absolute',
      top: topOffset,
      left: leftOffset,
      width: loadingSize,
      height: loadingSize,
    };

    if (loading) {
      return (
        <ActivityIndicator
          style={loadingStyle}
          size="large"
        />
      );
    }

    return null;
  }

  render() {
    return (
      <View accessible={false} style={styles.container}>
        {this.renderDefaultScreen()}
        {this.renderLoading()}
      </View>
    );
  }
}
