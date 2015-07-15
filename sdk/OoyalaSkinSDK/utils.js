/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  StyleSheet
} = React;


var Utils = {

  shouldShowLandscape: function(width, height) {
    return width > height;
  },

  // Returns a React stylesheet based on the json object passed in. This method takes the json object,
  // adds in any global styles that are specifed in styles.json, and returns the React Stylesheet.
  getStyles: function(specificStyles) {
    var globalStyles = require('./style/styles.json');

    if(specificStyles == undefined) {
      specificStyles = {};
    }

    var styles = {};
    for (var attrname in globalStyles) { styles[attrname] = globalStyles[attrname]; }
    for (var attrname in specificStyles) { styles[attrname] = specificStyles[attrname]; }

    return React.StyleSheet.create(styles);
  },

  isPlaying: function( rate ) {
    return rate > 0;
  },

  isPaused: function( rate ) {
    return rate == 0;
  },

  secondsToString: function(seconds) {
    var  minus = '';
    if (seconds < 0) {
      minus = "-";
      seconds = -seconds;
    }
    var date = new Date(seconds * 1000);
    var hh = date.getUTCHours();
    var mm = date.getUTCMinutes();
    var ss = date.getSeconds();
    if (ss < 10) {
      ss = "0" + ss;
    }
    if (mm == 0) {
      mm = "00";
    } else if (mm < 10) {
      mm = "0" + mm;
    }
    var t = mm + ":" + ss;
    if (hh > 0) {
      t = hh + ":" + t;
    }
    return minus + t;
  },

  localizedString: function(preferredLocale, stringId, localizableStrings) {
    console.log("preferredLocale" + preferredLocale + "stringId" + stringId + "localizableStrings" + localizableStrings);
    var defaultLocale = localizableStrings["default"] ? localizableStrings["defaultLanguage"] : "en";
    
    if (localizableStrings[preferredLocale] && localizableStrings[preferredLocale][stringId]) {
      return localizableStrings[preferredLocale][stringId];
    }
    
    if (localizableStrings[defaultLocale] && localizableStrings[defaultLocale][stringId]) {
      return localizableStrings[defaultLocale][stringId];
    }

    return stringId;
  },

};

module.exports = Utils;
