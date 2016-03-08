/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  ActivityIndicatorIOS,
  SliderIOS,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
} = React;
var Dimensions = require('Dimensions');
var ActivityView = require('NativeModules').OOActivityView;
var StartScreen = require('./StartScreen');
var EndScreen = require('./EndScreen');
var ErrorScreen = require('./ErrorScreen');
var DiscoveryPanel = require('./discoveryPanel');
var MoreOptionScreen = require('./MoreOptionScreen');
var Log = require('./log');
var Constants = require('./constants');
var {
  BUTTON_NAMES,
  SCREEN_TYPES,
  OOSTATES,
  PLATFORMS
} = Constants;
var VideoView = require('./videoView');
var LanguageSelectionPanel = require('./languageSelectionPanel.js');
var previousScreenType;

var OoyalaSkinCore = function(ooyalaSkin, eventBridge) {
  this.skin = ooyalaSkin;
  this.bridge = eventBridge;
};

OoyalaSkinCore.prototype.mount = function(eventEmitter) {
  this.listeners = [];
  var listenerDefinitions = [
    [ 'timeChanged',              (event) => this.onTimeChange(event) ],
    [ 'currentItemChanged',       (event) => this.onCurrentItemChange(event) ],
    [ 'frameChanged',             (event) => this.onFrameChange(event) ],
    [ 'volumeChanged',            (event) => this.onVolumeChanged(event) ],
    [ 'playCompleted',            (event) => this.onPlayComplete(event) ],
    [ 'stateChanged',             (event) => this.onStateChange(event) ],
    [ 'discoveryResultsReceived', (event) => this.onDiscoveryResult(event) ],
    [ 'onClosedCaptionUpdate',    (event) => this.onClosedCaptionUpdate(event) ],
    [ 'adStarted',                (event) => this.onAdStarted(event) ],
    [ 'adSwitched',               (event) => this.onAdSwitched(event) ],
    [ 'adPodCompleted',           (event) => this.onAdPodCompleted(event) ],
    [ 'setNextVideo',             (event) => this.onSetNextVideo(event) ],
    [ 'upNextDismissed',          (event) => this.onUpNextDismissed(event) ],
    [ 'playStarted',              (event) => this.onPlayStarted(event) ],
    [ 'postShareAlert',           (event) => this.onPostShareAlert(event) ],
    [ 'error',                    (event) => this.onError(event) ],
    [ 'embedCodeSet',             (event) => this.onEmbedCodeSet(event) ]
  ];

  for (var i = 0; i < listenerDefinitions.length; i++) {
    var d = listenerDefinitions[i];
    this.listeners.push(eventEmitter.addListener( d[0], d[1] ) );
  }
};

OoyalaSkinCore.prototype.unmount = function() {
  for (var i = 0; i < this.listeners.length; i++) {
    this.listeners[i].remove;
  }
  this.listeners = [];
};

// event handlers.
OoyalaSkinCore.prototype.onOptionButtonPress = function(buttonName) {
  // Share button does not modify state of what screen is showing.
  if (buttonName == BUTTON_NAMES.SHARE) {
      this.renderSocialOptions();
  } else {
    this.skin.setState({buttonSelected:buttonName, screenType:SCREEN_TYPES.MOREOPTION_SCREEN});
  }
};

OoyalaSkinCore.prototype.pauseOnOptions = function() {
  if (this.skin.state.screenType != SCREEN_TYPES.MOREOPTION_SCREEN) {
    this.previousScreenType = this.skin.state.screenType;
  }

  if (this.skin.state.playing) {
    this.skin.setState({pausedByOverlay:true});
    this.bridge.onPress({name:BUTTON_NAMES.PLAY_PAUSE});
  }
};

OoyalaSkinCore.prototype.onOptionDismissed = function() {
  if (this.skin.state.screenType == SCREEN_TYPES.MOREOPTION_SCREEN) {
    this.skin.setState({screenType: this.previousScreenType});
  }
  this.skin.setState({buttonSelected: "None"});
  if (this.skin.state.pausedByOverlay) {
    this.skin.setState({pausedByOverlay:false});
    this.bridge.onPress({name:BUTTON_NAMES.PLAY_PAUSE});
  }
};

/**
 *  When a button is pressed on the control bar
 *  If it's a "fast-access" options button, open options menu and perform the options action
 */
OoyalaSkinCore.prototype.handlePress = function(n) {
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
    default:
      this.bridge.onPress({name:n});
      break;
  }
};

OoyalaSkinCore.prototype.handleScrub = function(value) {
  this.bridge.onScrub({percentage:value});
};

OoyalaSkinCore.prototype.handleIconPress = function(index) {
  this.bridge.onPress({name:BUTTON_NAMES.ICON, index:index})
};

OoyalaSkinCore.prototype.updateClosedCaptions = function() {
  if (this.skin.state.selectedLanguage) {
    this.bridge.onClosedCaptionUpdateRequested( {language:this.skin.state.selectedLanguage} );
  }
};

OoyalaSkinCore.prototype.onClosedCaptionUpdate = function(e) {
  this.skin.setState( {captionJSON: e} );
};

OoyalaSkinCore.prototype.onDiscoveryRow = function(info) {
  this.bridge.onDiscoveryRow(info);
};

OoyalaSkinCore.prototype.onTimeChange = function(e) { // todo: naming consistency? playheadUpdate vs. onTimeChange vs. ...
  this.skin.setState({
    playhead: e.playhead,
    duration: e.duration,
    initialPlay: false,
    availableClosedCaptionsLanguages: e.availableClosedCaptionsLanguages,
    cuePoints: e.cuePoints,
  });

  if(this.skin.state.screenType == SCREEN_TYPES.VIDEO_SCREEN ||
     this.skin.state.screenType == SCREEN_TYPES.END_SCREEN) {
    this.previousScreenType = this.skin.state.screenType;
  }
  this.updateClosedCaptions();
};

OoyalaSkinCore.prototype.onAdStarted = function(e) {
  Log.log( "onAdStarted");
  Log.log(e);
  this.skin.setState({ad:e, screenType:SCREEN_TYPES.VIDEO_SCREEN});
};

OoyalaSkinCore.prototype.onAdSwitched = function(e) {
  Log.log( "onAdSwitched");
  this.skin.setState({ad:e});
};

OoyalaSkinCore.prototype.onAdPodCompleted = function(e) {
  Log.log( "onAdPodCompleted ");
  this.skin.setState({ad: null});
};

OoyalaSkinCore.prototype.onCurrentItemChange = function(e) {
  Log.log("currentItemChangeReceived, promoUrl is " + e.promoUrl);
  this.skin.setState({
    title:e.title,
    description:e.description,
    duration:e.duration,
    live:e.live,
    promoUrl:e.promoUrl,
    hostedAtUrl: e.hostedAtUrl,
    playhead:e.playhead,
    width:e.width,
    height:e.height,
    captionJSON:null});
  if (!this.skin.state.autoPlay) {
    this.skin.setState({screenType: SCREEN_TYPES.START_SCREEN});
  };
};

OoyalaSkinCore.prototype.onFrameChange = function(e) {
  Log.log("receive frameChange, frame width is" + e.width + " height is" + e.height);
  this.skin.setState({width:e.width, height:e.height, fullscreen:e.fullscreen});
};

OoyalaSkinCore.prototype.onPlayStarted = function(e) {
  Log.log("Play Started received")
  this.skin.setState({screenType: SCREEN_TYPES.VIDEO_SCREEN, autoPlay: false});
};

OoyalaSkinCore.prototype.onPlayComplete = function(e) {
  Log.log("Play Complete received")
  this.skin.setState({screenType: SCREEN_TYPES.END_SCREEN});
};

OoyalaSkinCore.prototype.onDiscoveryResult = function(e) {
  Log.log("onDiscoveryResult results are:", e.results);
  this.skin.setState({discoveryResults:e.results});
  if(e.results) {
    this.onSetNextVideo({nextVideo:e.results[0]})
  }
};

OoyalaSkinCore.prototype.onStateChange = function(e) {
  Log.log("state changed to:" + e.state)
  switch (e.state) {
    case "completed":
    case "error":
    case "init":
    case "paused":
    case "ready":
      this.skin.setState({
        playing: false,
        loading: false
      });
      break;
    case "playing":
      this.skin.setState({
        playing: true,
        loading: false,
        initialPlay: (this.skin.state.screenType == SCREEN_TYPES.START_SCREEN) ? true : false,
        screenType: SCREEN_TYPES.VIDEO_SCREEN});
      break;
    case "loading":
      this.skin.setState({
        loading: true
      })
      break;
    default:
      break;
  }
};

OoyalaSkinCore.prototype.onError = function(e) {
  Log.log("Error received");
  this.skin.setState({screenType:SCREEN_TYPES.ERROR_SCREEN, error:e});
};

OoyalaSkinCore.prototype.onEmbedCodeSet = function(e) {
  Log.log("EmbedCodeSet received");
  this.skin.setState({screenType:SCREEN_TYPES.LOADING_SCREEN});
};

OoyalaSkinCore.prototype.onUpNextDismissed = function(e) {
  Log.log("SetNextVideo received");
  this.skin.setState({upNextDismissed:e.upNextDismissed});
};

OoyalaSkinCore.prototype.onSetNextVideo = function(e) {
  Log.log("SetNextVideo received");
  this.skin.setState({nextVideo:e.nextVideo});
};

OoyalaSkinCore.prototype.onLanguageSelected = function(e) {
  Log.log('onLanguageSelected:'+e);
  this.skin.setState({selectedLanguage:e});
};

OoyalaSkinCore.prototype.shouldShowLandscape = function() {
  return this.skin.state.width > this.skin.state.height;
};

OoyalaSkinCore.prototype.onPostShareAlert = function(e) {
  this.skin.setState({alertTitle: e.title});
  this.skin.setState({alertMessage: e.message});
};

OoyalaSkinCore.prototype.onVolumeChanged = function(e) {
  this.skin.setState({volume: e.volume});
};

OoyalaSkinCore.prototype.renderStartScreen = function() {
  return (
    <StartScreen
      config={{
        startScreen: this.skin.props.startScreen,
        icons: this.skin.props.icons
      }}
      title={this.skin.state.title}
      description={this.skin.state.description}
      promoUrl={this.skin.state.promoUrl}
      width={this.skin.state.width}
      height={this.skin.state.height}
      platform={this.skin.state.platform}
      playhead={this.skin.state.playhead}
      onPress={(name) => this.handlePress(name)}/>
  );
};

OoyalaSkinCore.prototype.renderEndScreen = function() {
  return (
    <EndScreen
      config={{
        endScreen: this.skin.props.endScreen,
        controlBar: this.skin.props.controlBar,
        buttons: this.skin.props.buttons.mobileContent,
        icons: this.skin.props.icons
      }}
      title={this.skin.state.title}
      width={this.skin.state.width}
      height={this.skin.state.height}
      upNextDismissed={this.skin.state.upNextDismissed}
      discoveryPanel={this.renderDiscoveryPanel()}
      description={this.skin.state.description}
      promoUrl={this.skin.state.promoUrl}
      duration={this.skin.state.duration}
      onPress={(name) => this.handlePress(name)}/>
  );
};

OoyalaSkinCore.prototype.renderErrorScreen = function() {
  return (
    <ErrorScreen
      error={this.skin.state.error}
      localizableStrings={this.skin.props.localization}
      locale={this.skin.props.locale} />);
};

OoyalaSkinCore.prototype.renderVideoView = function() {
  return (
    <VideoView
      rate={this.skin.state.rate}
      playhead={this.skin.state.playhead}
      duration={this.skin.state.duration}
      ad ={this.skin.state.ad}
      live ={this.skin.state.live}
      platform={this.skin.state.platform}
      width={this.skin.state.width}
      height={this.skin.state.height}
      volume={this.skin.state.volume}
      fullscreen={this.skin.state.fullscreen}
      cuePoints={this.skin.state.cuePoints}
      onPress={(value) => this.handlePress(value)}
      onIcon={(value)=>this.handleIconPress(value)}
      onScrub={(value) => this.handleScrub(value)}
      closedCaptionsLanguage={this.skin.state.selectedLanguage}
      // todo: change to boolean showCCButton.
      availableClosedCaptionsLanguages={this.skin.state.availableClosedCaptionsLanguages}
      captionJSON={this.skin.state.captionJSON}
      config={{
        controlBar: this.skin.props.controlBar,
        general: this.skin.props.general,
        buttons: this.skin.props.buttons.mobileContent,
        upNext: this.skin.props.upNext,
        icons: this.skin.props.icons,
        adScreen: this.skin.props.adScreen,
        live: this.skin.props.live
      }}
      nextVideo={this.skin.state.nextVideo}
      upNextDismissed={this.skin.state.upNextDismissed}
      localizableStrings={this.skin.props.localization}
      locale={this.skin.props.locale}
      playing={this.skin.state.playing}
      loading={this.skin.state.loading}
      initialPlay={this.skin.state.initialPlay}>
    </VideoView>
  );
};
OoyalaSkinCore.prototype.renderCCOptions = function() {
  return (
    <LanguageSelectionPanel
      languages={this.skin.state.availableClosedCaptionsLanguages}
      selectedLanguage={this.skin.state.selectedLanguage}
      onSelect={(value)=>this.onLanguageSelected(value)}
      onDismiss={this.onOverlayDismissed}
      width={this.skin.state.width}
      height={this.skin.state.height}
      config={{localizableStrings:this.skin.props.localization,
               locale:this.skin.props.locale,
               icons:this.skin.props.icons}}>
    </LanguageSelectionPanel>);
};

OoyalaSkinCore.prototype.renderSocialOptions = function() {
  if(this.skin.state.platform == Constants.PLATFORMS.ANDROID) {
    this.bridge.shareTitle({shareTitle:this.skin.state.title});
    this.bridge.shareUrl({shareUrl:this.skin.state.hostedAtUrl});
    this.bridge.onPress({name:"Share"});
  }
  else if(this.skin.state.platform == Constants.PLATFORMS.IOS) {
    ActivityView.show({
      'text':this.skin.state.title,
      'link':this.skin.state.hostedAtUrl,
    });
  }
},
OoyalaSkinCore.prototype.renderDiscoveryPanel = function() {
  if (!this.skin.state.discoveryResults) {
    return null;
  }
  return (
    <DiscoveryPanel
      config={{
        discoveryScreen: this.skin.props.discoveryScreen,
        icons: this.skin.props.icons,
      }}
      platform={this.skin.state.platform}
      localizableStrings={this.skin.props.localization}
      locale={this.skin.props.locale}
      dataSource={this.skin.state.discoveryResults}
      onRowAction={(info) => this.onDiscoveryRow(info)}
      width={this.skin.state.width}
      height={this.skin.state.height}
      screenType={this.skin.state.screenType}>
    </DiscoveryPanel>);
};

OoyalaSkinCore.prototype.renderMoreOptionPanel = function() {
  switch (this.skin.state.buttonSelected) {
    case BUTTON_NAMES.DISCOVERY:
      return this.renderDiscoveryPanel();
      break;
    case BUTTON_NAMES.QUALITY:
      break;
    case BUTTON_NAMES.CLOSED_CAPTIONS:
      return this.renderCCOptions();
      break;
    case BUTTON_NAMES.SHARE:
      // There is no panel to render
      break;
    case BUTTON_NAMES.SETTING:
      break;
    default:
      break;
  }
  return null;
};

OoyalaSkinCore.prototype.renderMoreOptionScreen = function() {
  var panel = this.renderMoreOptionPanel();
  return (
    <MoreOptionScreen
      height={this.skin.state.height}
      onDismiss={() => this.onOptionDismissed()}
      panel={panel}
      buttonSelected={this.skin.state.buttonSelected}
      onOptionButtonPress={(buttonName) => this.onOptionButtonPress(buttonName)}
      config={{
        moreOptionsScreen: this.skin.props.moreOptionsScreen,
        buttons: this.skin.props.buttons.mobileContent,
        icons: this.skin.props.icons,
        // TODO: assumes this is how control bar width is calculated everywhere.
        controlBarWidth: this.skin.state.width
      }} >
    </MoreOptionScreen>
  );
};

module.exports = OoyalaSkinCore;
