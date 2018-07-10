import React, { Component } from 'react';
import {
  StyleSheet,
  SliderIOS,
  Image,
  TouchableHighlight,
  View
} from 'react-native';

var Utils = require('./utils');
var styles = Utils.getStyles();

class WaterMark extends React.Component {
    render() {
		var waterMarkImageLocation = styles.waterMarkImageSE;
  	var waterMarkImage = (
    		<Image style={[styles.waterMarkImage, waterMarkImageLocation]}
	        source={{uri: this.props.general.watermark.url}}
	        resizeMode={Image.resizeMode.contain}>
	    </Image>
  	);

  	return (
    	<View style={styles.waterMarkContainer}>
    		{waterMarkImage}
    	</View>
  	);
	}
}

module.exports = WaterMark;