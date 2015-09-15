/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';
var React = require('react-native');
var {
  ActivityIndicatorIOS,
  AppRegistry,
  DeviceEventEmitter,
  SliderIOS,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
} = React;

var eventBridge = require('NativeModules').OOReactBridge;
var OOSocialShare = require('NativeModules').OOReactSocialShare;
var StartScreen = require('./StartScreen');
var EndScreen = require('./EndScreen');
var DiscoveryPanel = require('./discoveryPanel');
var MoreOptionScreen = require('./MoreOptionScreen');
var SharePanel = require('./sharePanel');
var Constants = require('./constants');
var {
  BUTTON_NAMES,
  SCREEN_TYPES,
  OOSTATES,
} = Constants;
var VideoView = require('./videoView');
var LanguageSelectionPanel = require('./languageSelectionPanel.js');
var previousScreenType;
var OoyalaSkin = React.createClass({

  // note/todo: some of these are more like props, expected to be over-ridden/updated
  // by the native bridge, and others are used purely on the non-native side.
  // consider using a leading underscore, or something?
  getInitialState: function() {
    return {
      // states from react
      screenType: SCREEN_TYPES.LOADING_SCREEN,
      // states from native
      title: '',
      description: '',
      promoUrl: '', 
      hostedAtUrl: '',
      playhead: 0,
      duration: 1,
      rate: 0,
      fullscreen: false,
      lastPressedTime: (new Date).getTime(),
      upNextDismissed: false,
      showPlayButton: true,
      // things which default to null and thus don't have to be stated:
      // selectedLanguage: null,
      // availableClosedCaptionsLanguages: null,
      // captionJSON: null,
      buttonSelected: "None"
    };
  },

  onOptionButtonPress: function(buttonName) { 
    this.setState({buttonSelected:buttonName, screenType:SCREEN_TYPES.MOREOPTION_SCREEN});
  },

  onSocialButtonPress: function(socialType) {
    OOSocialShare.onSocialButtonPress({
        'socialType': socialType,
        'text':this.state.title,
        'link':this.state.hostedAtUrl,
      },
      (results) => {
        console.log(results);
      }
    );
  },

  pauseOnOptions: function() {
    if (this.state.screenType != SCREEN_TYPES.MOREOPTION_SCREEN) {
      this.previousScreenType = this.state.screenType; 
    }
    
    if (this.state.rate > 0) {
      this.setState({pausedByOverlay:true});
      eventBridge.onPress({name:BUTTON_NAMES.PLAY_PAUSE});
    }
  },

  onOptionDismissed: function() {
    if (this.state.screenType == SCREEN_TYPES.MOREOPTION_SCREEN) {
      this.setState({screenType: this.previousScreenType});
    }
    this.setState({buttonSelected: "None"});
    if (this.state.pausedByOverlay) {
      this.setState({pausedByOverlay:false});
      eventBridge.onPress({name:BUTTON_NAMES.PLAY_PAUSE});
    }
  },

  handlePress: function(n) {
    this.setState({lastPressedTime: (new Date).getTime()});
    switch(n) {
      case BUTTON_NAMES.MORE:
        n="None";
      // fall through intentionally
      case BUTTON_NAMES.DISCOVERY:
      case BUTTON_NAMES.QUALITY:
      case BUTTON_NAMES.CLOSED_CAPTIONS:
      case BUTTON_NAMES.SHARE:
      case BUTTON_NAMES.SETTING:
        this.pauseOnOptions();
        this.onOptionButtonPress(n);
        break;
      case BUTTON_NAMES.RESET_AUTOHIDE:
        break;
      case BUTTON_NAMES.PLAY_PAUSE:
        this.setState({showPlayButton: !this.state.showPlayButton});
      default:
        eventBridge.onPress({name:n});
        break;
    }
  },

  handleScrub: function(value) {
    eventBridge.onScrub({percentage:value});
  },

  updateClosedCaptions: function() {
    if (this.state.selectedLanguage) {
      eventBridge.onClosedCaptionUpdateRequested( {language:this.state.selectedLanguage} );
    }
  },

  onClosedCaptionUpdate: function(e) {
    this.setState( {captionJSON: e} );
  },

  onDiscoveryRow: function(info) {
    if (info.action && info.action === "click") {
      this.setState({screenType: SCREEN_TYPES.LOADING_SCREEN, autoPlay: true})
    }
    eventBridge.onDiscoveryRow(info);
  },

  onTimeChange: function(e) { // todo: naming consistency? playheadUpdate vs. onTimeChange vs. ...
    this.setState({
      playhead: e.playhead,
      duration: e.duration,
      availableClosedCaptionsLanguages: e.availableClosedCaptionsLanguages,
    });

    if(this.state.screenType == SCREEN_TYPES.VIDEO_SCREEN || this.state.screenType == SCREEN_TYPES.END_SCREEN){
      this.previousScreenType = this.state.screenType;
    }
    this.updateClosedCaptions();
  },

  onAdStarted: function(e) {
    console.log( "onAdStarted");
    this.setState({ad:e, screenType:SCREEN_TYPES.VIDEO_SCREEN});
  },

  onAdSwitched: function(e) {
    console.log( "onAdSwitched");
    this.setState({ad:e});
  },

  onAdPodCompleted: function(e) {
    console.log( "onAdPodCompleted ");
    this.setState({ad: null});
  },

  onCurrentItemChange: function(e) {
    console.log("currentItemChangeReceived, promoUrl is " + e.promoUrl);
    this.setState({
      title:e.title, 
      description:e.description, 
      duration:e.duration, 
      live:e.live,
      promoUrl:e.promoUrl, 
      hostedAtUrl: e.hostedAtUrl,
      width:e.width, 
      height:e.height});
    if (!this.state.autoPlay) {
      this.setState({screenType: SCREEN_TYPES.START_SCREEN});
    };
  },

  onFrameChange: function(e) {
    console.log("receive frameChange, frame width is" + e.width + " height is" + e.height);
    this.setState({width:e.width, height:e.height, fullscreen:e.fullscreen});
  },

  onPlayStarted: function(e) {
    this.setState({screenType: SCREEN_TYPES.VIDEO_SCREEN, autoPlay: false});
  },

  onPlayComplete: function(e) {
    this.setState({screenType: SCREEN_TYPES.END_SCREEN});
  },

  onDiscoveryResult: function(e) {
    console.log("onDiscoveryResult results are:", e.results);
    this.setState({discoveryResults:e.results});
  },

  onStateChange: function(e) {
    console.log("state changed")
    switch (e.state) {
      case "paused": this.setState({rate:0}); break;
      case "playing": 
        this.setState({rate:1}); 
        this.setState({screenType: SCREEN_TYPES.VIDEO_SCREEN});
        break;
      default: break;
    }
  },

  onUpNextDismissed: function(e) {
    this.setState({upNextDismissed:e.upNextDismissed});
  },

  onSetNextVideo: function(e) {
    this.setState({nextVideo:e.nextVideo});
  },

  onLanguageSelected: function(e) {
    console.log('onLanguageSelected:'+e);
    this.setState({selectedLanguage:e});
  },
  
  shouldShowLandscape: function() {
    return this.state.width > this.state.height;
  },

  componentWillMount: function() {
    console.log("componentWillMount");
    this.listeners = [];
    var listenerDefinitions = [
      [ 'timeChanged',              (event) => this.onTimeChange(event) ],
      [ 'currentItemChanged',       (event) => this.onCurrentItemChange(event) ],
      [ 'frameChanged',             (event) => this.onFrameChange(event) ],
      [ 'playCompleted',            (event) => this.onPlayComplete(event) ],
      [ 'stateChanged',             (event) => this.onStateChange(event) ],
      [ 'discoveryResultsReceived', (event) => this.onDiscoveryResult(event) ],
      [ 'onClosedCaptionUpdate',    (event) => this.onClosedCaptionUpdate(event) ],
      [ 'adStarted',                (event) => this.onAdStarted(event) ],
      [ 'adSwitched',               (event) => this.onAdSwitched(event) ],
      [ 'adPodCompleted',           (event) => this.onAdPodCompleted(event) ],
      [ 'setNextVideo',             (event) => this.onSetNextVideo(event) ],
      [ 'upNextDismissed',          (event) => this.onUpNextDismissed(event) ],
      [ 'playStarted',              (event) => this.onPlayStarted(event) ]
    ];
    for( var d of listenerDefinitions ) {
      this.listeners.push( DeviceEventEmitter.addListener( d[0], d[1] ) );
    }
  },

  componentWillUnmount: function() {
    for( var l of this.listeners ) {
      l.remove;
    }
    this.listeners = [];
  },

  render: function() {
    switch (this.state.screenType) {
      case SCREEN_TYPES.START_SCREEN: return this._renderStartScreen(); break;
      case SCREEN_TYPES.END_SCREEN:   return this._renderEndScreen();   break;
      case SCREEN_TYPES.LOADING_SCREEN: return this._renderLoadingScreen(); break;
      case SCREEN_TYPES.MOREOPTION_SCREEN:  return this._renderMoreOptionScreen();  break;
      default:      return this._renderVideoView();   break;
    }
  },

  _renderStartScreen: function() {
    return (
      <StartScreen
        config={{
          startScreen: this.props.startScreen,
          icons: this.props.icons
        }}
        title={this.state.title}
        description={this.state.description}
        promoUrl={this.state.promoUrl}
        width={this.state.width}
        height={this.state.height}
        onPress={(name) => this.handlePress(name)}/>
    );
  },

  _renderEndScreen: function() {

    return (
      <EndScreen
        config={{
          endScreen: this.props.endScreen,
          controlBar: this.props.controlBar,
          buttons: this.props.buttons.mobileContent,
          icons: this.props.icons
        }}
        title={this.state.title}
        width={this.state.width}
        height={this.state.height}
        discoveryPanel={this._renderDiscoveryPanel()}
        description={this.state.description}
        promoUrl={this.state.promoUrl}
        duration={this.state.duration} 
        onPress={(name) => this.handlePress(name)}
        onSocialButtonPress={(socialType) => this.onSocialButtonPress(socialType)}/>
    );
  },

  _renderVideoView: function() {

    return (
      <VideoView
        rate={this.state.rate}
        showPlay={this.state.showPlayButton}
        playhead={this.state.playhead}
        duration={this.state.duration}
        ad ={this.state.ad}
        live ={this.state.live}
        width={this.state.width}
        height={this.state.height}
        fullscreen={this.state.fullscreen}
        onPress={(value) => this.handlePress(value)}
        onScrub={(value) => this.handleScrub(value)}
        closedCaptionsLanguage={this.state.selectedLanguage}
        // todo: change to boolean showCCButton.
        availableClosedCaptionsLanguages={this.state.availableClosedCaptionsLanguages}
        captionJSON={this.state.captionJSON}
        onSocialButtonPress={(socialType) => this.onSocialButtonPress(socialType)}
        lastPressedTime={this.state.lastPressedTime}
        config={{
          controlBar: this.props.controlBar,
          buttons: this.props.buttons.mobileContent,
          upNextScreen: this.props.upNextScreen,
          icons: this.props.icons
        }}
        nextVideo={this.state.nextVideo}
        upNextDismissed={this.state.upNextDismissed}
        localizableStrings={this.props.localizableStrings}
        locale={this.props.locale}>
      </VideoView>
    );
  },

  _renderLoadingScreen: function() {
    return (
      <View style={styles.loading}>
        <ActivityIndicatorIOS
          animating={true}
          size="large">
        </ActivityIndicatorIOS>
      </View>)
   },

  _renderCCOptions: function() {
    return (
      <LanguageSelectionPanel
        languages={this.state.availableClosedCaptionsLanguages}
        selectedLanguage={this.state.selectedLanguage}
        onSelect={(value)=>this.onLanguageSelected(value)}
        onDismiss={this.onOverlayDismissed}
        width={this.state.width}
        height={this.state.height}
        config={{localizableStrings:this.props.localizableStrings,
                 locale:this.props.locale,
                 icons:this.props.icons}}>
      </LanguageSelectionPanel>)
  },

  _renderSocialOptions: function() {
    return (
      <SharePanel
        socialButtons={this.props.sharing}
        onSocialButtonPress={(socialType) => this.onSocialButtonPress(socialType)}/>);
  },

  _renderDiscoveryPanel: function() {
    return (
      <DiscoveryPanel
        config={this.props.discoveryScreen}
        dataSource={this.state.discoveryResults}
        onRowAction={(info) => this.onDiscoveryRow(info)}
        width={this.state.width}
        height={this.state.height}>
      </DiscoveryPanel>);
  },

  _renderMoreOptionPanel: function() {
    console.log("renderMoreOptionPanel:"+ this.state.buttonSelected);
    switch (this.state.buttonSelected) {
      case BUTTON_NAMES.DISCOVERY: 
        return this._renderDiscoveryPanel();
        break;
      case BUTTON_NAMES.QUALITY:
        break;
      case BUTTON_NAMES.CLOSED_CAPTIONS:
        return this._renderCCOptions();
        break;
      case BUTTON_NAMES.SHARE:
        return this._renderSocialOptions();
        break;
      case BUTTON_NAMES.SETTING:
        break;
      default:
        break;
    }
    return null;
  },

  _renderMoreOptionScreen: function() {
    console.log("renderMoreOptions buttonSelected" + this.state.buttonSelected);
    var panel = this._renderMoreOptionPanel();

    return (
      <MoreOptionScreen
        height={this.state.height}
        onDismiss={this.onOptionDismissed}
        panel={panel}
        buttonSelected={this.state.buttonSelected}
        onOptionButtonPress={(buttonName) => this.onOptionButtonPress(buttonName)}
        config={{
          moreOptions: this.props.moreOptions,
          buttons: this.props.buttons.mobileContent,
          icons: this.props.icons,
          // TODO: assumes this is how control bar width is calculated everywhere.
          controlBarWidth: this.state.width
        }} >
      </MoreOptionScreen>
    )
   }
});

var styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 200
  },
});

AppRegistry.registerComponent('OoyalaSkin', () => OoyalaSkin);
