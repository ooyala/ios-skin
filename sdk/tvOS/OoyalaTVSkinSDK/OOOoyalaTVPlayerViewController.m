//
//  OOOoyalaTVPlayerViewController.m
//  OoyalaTVSkinSDK
//
//  Copyright © 2016 Ooyala, Inc. All rights reserved.
//

#import <OOOoyalaTVPlayerViewController.h>
#import <OOOoyalaTVConstants.h>
#import <OOOoyalaTVGradientView.h>
#import <OOOoyalaTVButton.h>
#import <OOOoyalaTVLabel.h>
#import <OOOoyalaTVBottomBars.h>
#import <OOOoyalaTVTopBar.h>
#import <OOTVGestureManager.h>
#import <OOTVOptionsCollectionViewController.h>
#import <OOOoyalaTVClosedCaptionsView.h>
#import <OoyalaSDK/OOOoyalaPlayer.h>
#import <OoyalaSDK/OOCaption.h>
#import <OoyalaSDK/OOClosedCaptions.h>
#import "Pair.h"


@interface OOOoyalaTVPlayerViewController ()

@property (nonatomic) UIActivityIndicatorView *activityView;
@property (nonatomic) OOTVGestureManager *gestureManager;
@property (nonatomic) OOOoyalaTVLabel *durationLabel;
@property (nonatomic) OOOoyalaTVLabel *playheadLabel;
@property (nonatomic) OOOoyalaTVButton *playPauseButton;
@property (nonatomic) OOOoyalaTVBottomBars *bottomBars;
@property (nonatomic) OOOoyalaTVTopBar *closedCaptionsMenuBar;
@property (nonatomic) OOOoyalaTVGradientView *progressBarBackground;
@property (nonatomic) CGFloat lastTriggerTime;
@property (nonatomic) NSDictionary *currentLocale;
@property (nonatomic) OOTVOptionsCollectionViewController *optionsViewController;
@property (nonatomic) NSMutableArray *tableList;
@property (nonatomic) OOOoyalaTVClosedCaptionsView *closedCaptionsView;

@end


@implementation OOOoyalaTVPlayerViewController

static NSDictionary *OOOoyalaPlayerViewControllerAvailableLocalizations;
static NSDictionary *currentLocale = nil;
static OOClosedCaptionsStyle *_closedCaptionsStyle;

#pragma mark - Initializaiton

- (instancetype)initWithPlayer:(OOOoyalaPlayer *)player {
  if (self = [super init]) {
    [self setPlayer:player];
  }
  return self;
}

- (void)dealloc {
  [self removeObservers];
}

#pragma mark - Lifecyle

- (void)viewDidLoad {
  [super viewDidLoad];
  self.playbackControlsEnabled = YES;
    
    // Set Closed Caption style
    _closedCaptionsStyle = [OOClosedCaptionsStyle new];
    _closedCaptionsStyle.textSize = 20;
    _closedCaptionsStyle.textFontName = @"Helvetica";
    _closedCaptionsStyle.backgroundOpacity = 0.4;
    self.optionsViewController = [[OOTVOptionsCollectionViewController alloc] initWithViewController:self];
}

- (void)viewWillAppear:(BOOL)animated {
  [super viewWillAppear: animated];

  [self setupViewController];
  if (!self.gestureManager) {
    self.gestureManager = [[OOTVGestureManager alloc] initWithController:self];
  }
  [self.gestureManager addGestures];
}

- (void)viewDidDisappear:(BOOL)animated {
  [super viewDidDisappear:animated];
  [self.gestureManager removeGestures];
}

#pragma mark - Private functions

- (void)setupUI {
  [self setupProgessBackground];
  [self setupPlayPauseButton];
  [self setupBars];
  [self setupLabels];
  self.progressBarBackground.hidden = !self.playbackControlsEnabled;
}

- (void)setupProgessBackground {
  self.progressBarBackground = [[OOOoyalaTVGradientView alloc] initWithFrame:CGRectMake(0, self.view.bounds.size.height - bottomDistance * 2, self.view.bounds.size.width, bottomDistance * 2)];
  
  [self.view addSubview:self.progressBarBackground];
}

- (void)setupPlayPauseButton {
  // frame
  self.playPauseButton = [[OOOoyalaTVButton alloc] initWithFrame:CGRectMake(headDistance, self.progressBarBackground.bounds.size.height - playPauseButtonHeight - 38, headDistance, playPauseButtonHeight)];
  [self.playPauseButton addTarget:self action:@selector(togglePlay:) forControlEvents:UIControlEventTouchUpInside];
  
  // icon
  [self.playPauseButton changePlayingState:[self.player isPlaying]];
  
  // add to view
  [self.progressBarBackground addSubview:self.playPauseButton];
}

- (void)setupBars {
  self.bottomBars = [[OOOoyalaTVBottomBars alloc] initWithBackground:self.progressBarBackground];
  //Adding button to indicate that CCs are available
  self.closedCaptionsMenuBar = [[OOOoyalaTVTopBar alloc] initMiniView:self.view];
  self.closedCaptionsMenuBar.alpha = 0.0;
    
  [self.progressBarBackground addSubview:self.bottomBars];
  [self.view addSubview:self.closedCaptionsMenuBar];
}

- (void)setupBar:(UIView *)bar color:(UIColor *)color {
  bar.backgroundColor = color;
  bar.layer.cornerRadius = barCornerRadius;
  
  [self.progressBarBackground addSubview:bar];
}

- (void)setupLabels {
  self.playheadLabel = [[OOOoyalaTVLabel alloc] initWithFrame:CGRectMake(playheadLabelX, self.progressBarBackground.bounds.size.height - bottomDistance - labelHeight, labelWidth, labelHeight)
                                                         time:self.player.playheadTime];
  self.durationLabel = [[OOOoyalaTVLabel alloc] initWithFrame:CGRectMake(self.progressBarBackground.bounds.size.width - headDistance - labelWidth, self.progressBarBackground.bounds.size.height - bottomDistance - labelHeight, labelWidth, labelHeight)
                                                         time:self.player.duration];

  [self.progressBarBackground addSubview:self.playheadLabel];
  [self.progressBarBackground addSubview:self.durationLabel];
}

#pragma mark - Setters/getters

- (void)setPlayer:(OOOoyalaPlayer *)player {
  [self removeObservers];
  _player = player;
  if (_player) {
    [self setupViewController];
  }
  [self addObservers];
}

- (void)setPlaybackControlsEnabled:(BOOL)playbackControlsEnabled {
  _playbackControlsEnabled = playbackControlsEnabled;
  self.progressBarBackground.hidden = !playbackControlsEnabled;
}

- (UIActivityIndicatorView *)activityView {
  if (!_activityView) {
    _activityView = [[UIActivityIndicatorView alloc] initWithActivityIndicatorStyle:UIActivityIndicatorViewStyleWhiteLarge];
    _activityView.hidesWhenStopped = YES;
  }
  return _activityView;
}

- (void)setupViewController {
  self.player.view.frame = self.view.bounds;
  [self.view addSubview:self.player.view];
  
  self.activityView.center = self.view.center;
  [self.view addSubview:self.activityView];
  
  self.lastTriggerTime = 0;
  [self setupUI];
}

- (void)addObservers {
  [NSNotificationCenter.defaultCenter addObserver:self
                                         selector:@selector(stateChangedNotification)
                                             name:OOOoyalaPlayerStateChangedNotification
                                           object:self.player];
  
  [NSNotificationCenter.defaultCenter addObserver:self
                                         selector:@selector(timeChangedNotification)
                                             name:OOOoyalaPlayerTimeChangedNotification
                                           object:self.player];
}

- (void)removeObservers {
  [NSNotificationCenter.defaultCenter removeObserver:self];
}

#pragma mark - Notifications

- (void)stateChangedNotification {
  switch (self.player.state) {
    case OOOoyalaPlayerStateLoading:
      [self.activityView startAnimating];
      break;
    case OOOoyalaPlayerStateReady:
    case OOOoyalaPlayerStatePlaying:
    case OOOoyalaPlayerStatePaused:
    case OOOoyalaPlayerStateError:
    default:
      [self.activityView stopAnimating];
  }
    
  [self showClosedCaptionsButton];
}

- (void)timeChangedNotification {
  [self updateTimeWithDuration:self.player.duration
                      playhead:self.player.playheadTime];
  
  [self updateBottomBarsWithPlayheadTime:self.player.playheadTime];
  
  // We refresh CC view everytime player change state
  [self refreshClosedCaptionsView];
}

#pragma mark - Private functions

- (void)updateTimeWithDuration:(CGFloat)duration playhead:(CGFloat)playhead {
  NSDateFormatter *dateformat = [[NSDateFormatter alloc] init];
  [dateformat setDateFormat:duration < 3600 ? @"mm:ss" : @"H:mm:ss"];
  self.playheadLabel.text = [NSString stringWithFormat:@"%@", [dateformat stringFromDate:[NSDate dateWithTimeIntervalSince1970:playhead]]];
  self.durationLabel.text = [NSString stringWithFormat:@"%@", [dateformat stringFromDate:[NSDate dateWithTimeIntervalSince1970:duration]]];
  
  [self.playPauseButton changePlayingState:[self.player isPlaying]];
  
  if (playhead - self.lastTriggerTime > hideBarInterval && playhead - self.lastTriggerTime < hideBarInterval + 2) {
    [self hideProgressBar];
  }
}

- (void)showProgressBar {
  self.lastTriggerTime = self.player.playheadTime;
  if (self.progressBarBackground.frame.origin.y == self.view.bounds.size.height) {
    [UIView animateWithDuration:0.5 delay:0.0 options:UIViewAnimationOptionCurveEaseIn animations:^{
      self.progressBarBackground.alpha = 1.0;
      
      CGRect frame = self.progressBarBackground.frame;
      frame.origin.y -= frame.size.height;
      self.progressBarBackground.frame = frame;
      [self showClosedCaptionsButton];
    } completion:nil];
  }
}

- (void)hideProgressBar {
  if (self.progressBarBackground.frame.origin.y < self.view.bounds.size.height) {
    [UIView animateWithDuration:0.5 delay:0.0 options:UIViewAnimationOptionCurveEaseOut animations:^{
      self.progressBarBackground.alpha = 0.0;
      
      CGRect frame = self.progressBarBackground.frame;
      frame.origin.y += frame.size.height;
      self.progressBarBackground.frame = frame;
      //Hiding CC button
      self.closedCaptionsMenuBar.alpha = 0.0;
    } completion: nil];
  }
}

- (void)showClosedCaptionsButton {
  if (self.player.currentItem.hasClosedCaptions && !self.closedCaptionMenuDisplayed) {
    self.closedCaptionsMenuBar.alpha = self.progressBarBackground.alpha;
  }
  [self.player disablePlaylistClosedCaptions];
}

- (UIView *)preferredFocusedView {
  return self.optionsViewController.view;
}

+ (NSDictionary *)currentLanguageSettings {
  if (!OOOoyalaPlayerViewControllerAvailableLocalizations) {
    [self loadDefaultLocale];
  }
  if (!currentLocale) {
    [self loadDeviceLanguage];
  }
  return currentLocale;
}

+ (NSDictionary *)availableLocalizations {
  if (!OOOoyalaPlayerViewControllerAvailableLocalizations) {
    [OOOoyalaTVPlayerViewController loadDefaultLocale];
  }
  return OOOoyalaPlayerViewControllerAvailableLocalizations;
}

+ (void)setAvailableLocalizations:(NSDictionary *)translations {
  //LOG(@"Available Localizations manually set");
  OOOoyalaPlayerViewControllerAvailableLocalizations = translations;
}

- (void)changeLanguage:(NSString *)language {
  if (!OOOoyalaPlayerViewControllerAvailableLocalizations) {
    [OOOoyalaTVPlayerViewController loadDefaultLocale];
  }

  if (!language) {
    [OOOoyalaTVPlayerViewController loadDeviceLanguage];
  } else if (OOOoyalaPlayerViewControllerAvailableLocalizations[language]) {
    [OOOoyalaTVPlayerViewController useLanguageStrings:[OOOoyalaTVPlayerViewController getLanguageSettings:language]];
  } else {
    [OOOoyalaTVPlayerViewController chooseBackupLanguage:language];
  }

  [self refreshClosedCaptionsView];
}

+ (void)loadDefaultLocale {
  //LOG(@"Default Localizations Loaded");
  NSArray *keys = @[@"LIVE", @"Done", @"Languages", @"Learn More", @"Ready to cast videos from this app", @"Disconnect", @"Connect To Device",@"Subtitles",@"Off",@"Use Closed Captions"];
  NSDictionary *en = [NSDictionary dictionaryWithObjects:@[@"LIVE", @"Done", @"Languages", @"Learn More", @"Ready to cast videos from this app", @"Disconnect", @"Connect To Device",@"Subtitles",@"Off",@"Use Closed Captions"] forKeys:keys];
  NSDictionary *ja = [NSDictionary dictionaryWithObjects:@[@"ライブ", @"完了", @"言語", @"さらに詳しく", @"このアプリからビデオをキャストできます", @"切断", @"デバイスに接続",@"Subtitles",@"Off",@"Use Closed Captions"] forKeys:keys];
  NSDictionary *es = [NSDictionary dictionaryWithObjects:@[@"En vivo", @"Hecho", @"Idioma", @"Más información", @"Listo para trasmitir videos desde esta aplicación", @"Desconectar", @"Conectar al dispositivo",@"Subtítulos",@"Off",@"Usar Subtítulos"] forKeys:keys];
  
  OOOoyalaPlayerViewControllerAvailableLocalizations = @{@"en": en, @"ja": ja, @"es": es};
}

+ (void)loadDeviceLanguage {
  if (!OOOoyalaPlayerViewControllerAvailableLocalizations) {
    [self loadDefaultLocale];
  }
  NSString *language = [NSLocale preferredLanguages].firstObject;
  if (OOOoyalaPlayerViewControllerAvailableLocalizations[language]) {
    [self useLanguageStrings:OOOoyalaPlayerViewControllerAvailableLocalizations[language]];
  } else {
    [self chooseBackupLanguage:language];
  }
}

+ (NSDictionary *)getLanguageSettings:(NSString *)language {
  if (!OOOoyalaPlayerViewControllerAvailableLocalizations) {
    [self loadDefaultLocale];
  }
  return OOOoyalaPlayerViewControllerAvailableLocalizations[language];
}

+ (void)useLanguageStrings:(NSDictionary *)strings {
  if (!OOOoyalaPlayerViewControllerAvailableLocalizations) {
    [self loadDefaultLocale];
  }
  currentLocale = strings;
}

// Choose a default language when there is not specific dialect for that language
// If there is not default language for a language then we choose English
// For example: choose “ja" as language when there is no ”ja_A“, however if there is
// even no "ja" we should always choose "en"
+ (void)chooseBackupLanguage:(NSString *) language {
  BOOL matched = NO;
  NSArray *array = [language componentsSeparatedByCharactersInSet:[NSCharacterSet characterSetWithCharactersInString:@"-_"]];
  NSString *basicLanguage = array.firstObject;
  for (NSString *key in OOOoyalaPlayerViewControllerAvailableLocalizations) {
    if ([key isEqualToString:basicLanguage]) {
      [OOOoyalaTVPlayerViewController useLanguageStrings:[OOOoyalaTVPlayerViewController getLanguageSettings:key]];
      matched = YES;
      break;
    }
  }
  if (!matched) {
    [OOOoyalaTVPlayerViewController useLanguageStrings:[OOOoyalaTVPlayerViewController getLanguageSettings:@"en"]];
  }
}

- (void)refreshClosedCaptionsView {
  if (self.player.isShowingAd) {
    [self removeClosedCaptionsView];
  } else {
    [self addClosedCaptionsView];
  }
}

// This should be called by the UI when the closed captions button is clicked
- (void)setupClosedCaptionsMenu {
  // Remove CC menu button
  self.closedCaptionsMenuBar.alpha = 0.0;
  // We check if CC are available in this video asset
  if (self.player.isClosedCaptionsTrackAvailable) {
    // Displaying CC menu
    [self addChildViewController:self.optionsViewController];
    [self.player.view addSubview:self.optionsViewController.view];
    [self setNeedsFocusUpdate];
  }
}

- (void)removeClosedCaptionsMenu {
  if (self.optionsViewController.view.window) {
    [self.optionsViewController.view removeFromSuperview];
  }
}

- (void)updateBottomBarsWithPlayheadTime:(double)playhead {
  Float64 bufferedTime = self.player.bufferedTime;
  if (isnan(bufferedTime)) {
    bufferedTime = 0;
  }
  
  [self.bottomBars updateBarBuffer:bufferedTime
                          playhead:playhead
                          duration:self.player.duration
                       totalLength:(self.progressBarBackground.bounds.size.width - barX - headDistance - labelWidth - componentSpace)];
  
  self.gestureManager.playheadTime = playhead;
  self.gestureManager.durationTime = self.player.duration;
}

#pragma mark - Public functions

- (void)updatePlayheadWithSeekTime:(double)seekTime {
  [self updateBottomBarsWithPlayheadTime:seekTime];
}

- (BOOL)closedCaptionMenuDisplayed {
  if (self.optionsViewController.isViewLoaded &&
      self.optionsViewController.view.window && !self.optionsViewController.view.isHidden) {
    return YES;
  }
  return NO;
}

- (void)removeClosedCaptionsView {
  if (self.closedCaptionsView) {
    [self.closedCaptionsView removeFromSuperview];
    self.closedCaptionsView = nil;
  }
}

- (void)addClosedCaptionsView {
  [self removeClosedCaptionsView];
  if (self.player.currentItem.hasClosedCaptions && self.player.closedCaptionsLanguage) {
    self.closedCaptionsView = [[OOOoyalaTVClosedCaptionsView alloc] initWithFrame:self.player.videoRect];
    [self.closedCaptionsView setCaptionStyle:_closedCaptionsStyle];
    [self updateClosedCaptionsViewPosition:self.progressBarBackground.bounds withControlsHide:self.progressBarBackground.hidden];
    [self displayCurrentClosedCaption];
    [self.player.view addSubview:self.closedCaptionsView];
  }
}

- (BOOL)shouldShowClosedCaptions {
  return self.player.closedCaptionsLanguage &&
    self.player.currentItem.hasClosedCaptions &&
    ![self.player.closedCaptionsLanguage isEqualToString: OOLiveClosedCaptionsLanguage] &&
    ![self.player isInCastMode];
}
 
- (NSArray *)availableOptions {
  NSArray *providedList = self.player.availableClosedCaptionsLanguages;
  self.tableList = [NSMutableArray array];
  NSMutableArray *subtitleArray = [NSMutableArray array];
  NSArray *closedCaptionsArray;

  // For each language in the list, add it to the necessary array
  for (NSString *language in providedList) {

    // If this was the closed captions language, put 'None' and 'CC' langauges in the array
    if ([language compare: @"cc"] == NSOrderedSame) {
      closedCaptionsArray = @[OOOoyalaTVPlayerViewController.currentLanguageSettings[@"Off"],
                              OOOoyalaTVPlayerViewController.currentLanguageSettings[@"Use Closed Captions"]];
    } else {
      if (subtitleArray.count == 0) {
        [subtitleArray addObject:OOOoyalaTVPlayerViewController.currentLanguageSettings[@"Off"]];
      }
      [subtitleArray addObject:language];
    }
  }

  // Make the pairs <section name, language/presentation list> to save in the langauge array
  if (closedCaptionsArray) {
    Pair *closedCaptionsPair = [Pair alloc];
    closedCaptionsPair.name = @"Closed Captions";
    closedCaptionsPair.value = closedCaptionsArray;
    [self.tableList addObject:closedCaptionsPair];
  }
  if (subtitleArray.count > 0) {
    Pair *subtitlePair = [Pair alloc];
    subtitlePair.name = OOOoyalaTVPlayerViewController.currentLanguageSettings[@"Languages"];
    subtitlePair.value = subtitleArray;

    [self.tableList addObject:subtitlePair];
  }
  return [self.tableList copy];
}

- (void)displayCurrentClosedCaption {
  if ([self shouldShowClosedCaptions]) {
    if (!self.closedCaptionsView.caption ||
        self.player.playheadTime < self.closedCaptionsView.caption.begin ||
        self.player.playheadTime > self.closedCaptionsView.caption.end) {
        OOCaption *caption = [self.player.currentItem.closedCaptions captionForLanguage:self.player.closedCaptionsLanguage
                                                                                   time:self.player.playheadTime];
        [self.closedCaptionsView setClosedCaption:caption];
    }
  } else {
    self.closedCaptionsView.caption = nil;
  }
}

- (void)updateClosedCaptionsViewPosition:(CGRect)bottomControlsRect withControlsHide:(BOOL)hidden {
  CGRect videoRect = [self.player videoRect];
  if (!hidden) {
    if (bottomControlsRect.origin.y < videoRect.origin.y + videoRect.size.height) {
      videoRect.size.height = videoRect.origin.y + videoRect.size.height - bottomControlsRect.size.height;
    }
  }
  self.closedCaptionsView.frame = videoRect;
}

@end
