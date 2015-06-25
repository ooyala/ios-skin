/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  ListView,
  StyleSheet,
  SwitchIOS,
  Text,
  TouchableHighlight,
  View,
} = React;

var Constants = require('./constants');
var {
  ICONS,
  UI_TEXT,
} = Constants;

var ToggleSwitch = require('./toggleSwitch');

var LanguageSelectionPanel = React.createClass({
  propTypes: {
    languages: React.PropTypes.array,
    selectedLanguage: React.PropTypes.string,
    onSelect: React.PropTypes.func,
    onDismiss: React.PropTypes.func,
  },

  isSelected: function(name) {
    return name && name !== '' && name == this.props.selectedLanguage;
  },

  generateRows() {
    console.log('generateRows:'+this.props.selectedLanguage);
    var rows = [];
    for (var i = 0; i < this.props.languages.length;) {
      var left = this.props.languages[i++];
      var right = "";
      if (i < this.props.languages.length) {
        right = this.props.languages[i++];
      }
      rows.push({left:left, right:right, selected:this.props.selectedLanguage});
      i = i + 2;
    }
    return rows;
  },

  onSelected: function(name) {
    if (this.props.selectedLanguage !== name) {
      this.props.onSelect(name);
    }
  },

  onSwitchToggled: function(switchOn) {
    if (switchOn) {
      this.onSelected(this.props.languages[0]);
    } else {
      this.onSelected('');
    }
  },

  getCloseButton: function() {
    return (
      <TouchableHighlight
        onPress={this.props.onDismiss}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>{ICONS.CLOSE}</Text>
        </View>
      </TouchableHighlight>);
  },

  render: function() {
    console.log("languageselectionpanel render");
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    var hasCC = false;
    if (this.props.selectedLanguage && this.props.selectedLanguage !== '') {
      hasCC = true;
    }
    return (
      <View style={styles.fullscreenContainer}>
        <View style={styles.panelTitleRow}>
          <Text style={styles.panelTitle}>{UI_TEXT.CC_OPTIONS}</Text>
          <View style={styles.placeHolder}></View>
          {this.getCloseButton()}
        </View>
        <ToggleSwitch
          switchOn={hasCC}
          onValueChanged={(value)=>this.onSwitchToggled(value)}>
        </ToggleSwitch>
        <ListView
          dataSource={ds.cloneWithRows(this.generateRows())}
          renderRow={this.renderRow}
          style={styles.listView}>
        </ListView>
      </View>
    );
  },

  renderRow: function(row: object, sectionID: number, rowID: number) {
    var leftStyle = this.isSelected(row.left) ? styles.selectedButton : styles.button;
    var rightStyle = this.isSelected(row.right) ? styles.selectedButton : styles.button;
    return (
      <View style= {styles.row}>
        <TouchableHighlight 
          style={styles.placeHolder}
          onPress={() => this.onSelected(row.left)}>
          <View style={leftStyle}>
            <Text style={styles.buttonText}>{row.left}</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight
          style={styles.placeHolder}
          onPress={() => this.onSelected(row.right)}>
          <View style={rightStyle}>
            <Text style={styles.buttonText}>{row.right}</Text>
          </View>
        </TouchableHighlight>
      </View>
    );
  },
});

var styles = StyleSheet.create({
  fullscreenContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  placeHolder: {
    flex: 1,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: 'transparent',
  },
  panelTitleRow: {
    height: 30,
    flexDirection: 'row',
    alignItems: 'center',
  },
  panelTitle: {
  	flex: 1,
  	fontSize: 20,
  	textAlign: 'left',
  	color: 'white',
  	padding: 20
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    marginBottom: 6,
    marginTop: 6,
    marginLeft: 12,
  },
  listView: {
    backgroundColor: '#333333',
  },
  button: {
    backgroundColor: '#333333',
    padding: 6,
    margin: 10,
    borderRadius: 5,
  },
  selectedButton: {
    backgroundColor: '#498DFC',
    padding: 6,
    margin: 10,
    borderRadius: 5,
  },
  buttonText: {
    textAlign: 'center',
    color: '#030303',
    fontSize: 16,
    fontFamily: 'fontawesome',
  },
});

module.exports = LanguageSelectionPanel;