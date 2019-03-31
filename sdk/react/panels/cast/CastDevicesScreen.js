import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Animated,
  ListView,
  Text,
  View,
  TouchableHighlight,
} from 'react-native';

import {
  BUTTON_NAMES,
} from '../../constants';
import Utils from '../../utils';
import castDevicesStyles from '../style/CastDevicesStyles.json';

const styles = Utils.getStyles(castDevicesStyles);

const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 === r2 });

const dismissButtonSize = 20;
const castButtonSize = 35;

export default class CastDevicesScreen extends Component {
  static propTypes = {
    height: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    onDismiss: PropTypes.func.isRequired,
    onDeviceSelected: PropTypes.func.isRequired,
    config: PropTypes.shape({
      castControls: PropTypes.shape({
        iconStyle: PropTypes.shape({
          active: PropTypes.shape({
            color: PropTypes.string,
          }),
          inactive: PropTypes.shape({
            color: PropTypes.string,
          }),
        }),
      }),
      icons: PropTypes.shape({
        'chromecast-disconnected': PropTypes.shape({
          fontString: PropTypes.string,
          fontFamilyName: PropTypes.string,
        }),
        dismiss: PropTypes.shape({
          fontString: PropTypes.string,
          fontFamilyName: PropTypes.string,
        }),
      }),
    }).isRequired,
    deviceIds: PropTypes.arrayOf(PropTypes.string).isRequired,
    deviceNames: PropTypes.arrayOf(PropTypes.string).isRequired,
    selectedItem: PropTypes.string,
  };

  static defaultProps = {
    selectedItem: null,
  };

  constructor(props) {
    super(props);
    const { deviceNames } = props;

    this.state = {
      opacity: new Animated.Value(0),
      dataSource: ds.cloneWithRows(deviceNames),
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

  onPressButton(rowID) {
    const { opacity } = this.state;
    const { deviceNames, onDeviceSelected, deviceIds } = this.props;

    this.setState({
      selectedID: rowID,
      opacity,
    });
    onDeviceSelected(deviceNames[rowID], deviceIds[rowID]);
  }

  static getDerivedStateFromProps(nextProps) {
    const { deviceNames } = nextProps;
    return {
      dataSource: ds.cloneWithRows(deviceNames),
    };
  }

  renderCastDevicesScreen(animationStyle, castButton, castButtonActive, dismissButtonRow) {
    const { height, width } = this.props;
    const { dataSource } = this.state;

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
          <ListView
            style={styles.listViewContainer}
            dataSource={dataSource}
            renderRow={(rowData, sectionID, rowID) => this.renderItem(rowData, rowID, castButton, castButtonActive)}
          />
        </Animated.View>
        <Text style={styles.title}>
          {'Remote playback'}
        </Text>
        {dismissButtonRow}
      </Animated.View>
    );
  }

  renderItem(rowData, rowID, castButton, castButtonActive) {
    const { selectedItem } = this.props;
    const { config } = this.props;
    const { iconStyle } = config.castControls;
    const { selectedID } = this.state;

    const isSelected = selectedID === rowID || rowData === selectedItem;
    const itemContainerStyle = isSelected ? styles.itemContainerSelected : styles.itemContainer;

    const textColor = isSelected ? iconStyle.active.color : iconStyle.inactive.color;
    const textStyle = isSelected ? styles.textSelected : styles.text;
    return (
      <TouchableHighlight
        style={{ flex: 1 }}
        onPress={() => this.onPressButton(rowID)}
        underlayColor="transparent"
      >
        <View style={itemContainerStyle}>
          <View style={styles.icon}>
            {isSelected ? castButtonActive : castButton}
          </View>
          <Text style={[textStyle, { color: textColor }]}>
            {rowData}
          </Text>
        </View>
      </TouchableHighlight>
    );
  }

  renderCastButton(color) {
    const { config } = this.props;

    return Utils.renderRectButton(BUTTON_NAMES.CAST,
      null,
      config.icons['chromecast-disconnected'].fontString,
      null, castButtonSize, color,
      config.icons['chromecast-disconnected'].fontFamilyName);
  }

  render() {
    const { config } = this.props;
    const { opacity } = this.state;

    const dismissButton = Utils.renderRectButton(BUTTON_NAMES.DISMISS,
      styles.iconDismiss,
      config.icons.dismiss.fontString,
      this.onDismissPress, dismissButtonSize,
      config.castControls.iconStyle.inactive.color,
      config.icons.dismiss.fontFamilyName);

    const castButton = this.renderCastButton(config.castControls.iconStyle.inactive.color);
    const castButtonActive = this.renderCastButton(config.castControls.iconStyle.active.color);

    const dismissButtonRow = (
      <View style={styles.dismissButtonTopRight}>
        {dismissButton}
      </View>
    );
    const animationStyle = { opacity };
    return (this.renderCastDevicesScreen(animationStyle, castButton, castButtonActive, dismissButtonRow));
  }
}
