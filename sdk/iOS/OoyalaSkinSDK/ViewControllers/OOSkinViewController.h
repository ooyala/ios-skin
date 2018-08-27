//
//  OOSkinViewController.h
//  OoyalaSkin
//
//

#import <UIKit/UIKit.h>

@class OOOoyalaPlayer;
@class OOSkinOptions;
@class OOClosedCaptionsStyle;
@class OOReactBridge;

/**
 * The primary class for the Skin UI
 * Use it to display the Ooyala Skin UI alongside the OOOoyalaPlayer
 */
@interface OOSkinViewController : UIViewController

// Notifications
extern NSString *const OOSkinViewControllerFullscreenChangedNotification; /* Fires when player goes FullScreen  */

@property(nonatomic, readonly) OOOoyalaPlayer *player;
@property(nonatomic, readonly) OOSkinOptions *skinOptions;
@property(nonatomic, readonly) NSString *version;
@property(nonatomic, readonly) OOClosedCaptionsStyle *closedCaptionsDeviceStyle;

/**
 Programatically change the fullscreen mode of the player.
 */
@property (nonatomic, getter=isFullscreen) BOOL fullscreen DEPRECATED_MSG_ATTRIBUTE("Setter is deprecated and will be removed in a future version. Use autoFullscreenWithRotatedEnabled instead for enable/disable auto full screen mode after device rotation changes.");

/**
 Auto enter/exit full screen mode when device orientation changed. Default NO.
 @warning Doesn't work in VR mode.
 */
@property (nonatomic, getter=isAutoFullscreenWithRotatedEnabled) BOOL autoFullscreenWithRotatedEnabled __TVOS_PROHIBITED;

- (instancetype)init __attribute__((unavailable("init not available")));
- (instancetype)initWithPlayer:(OOOoyalaPlayer *)player
                   skinOptions:(OOSkinOptions *)jsCodeLocation
                        parent:(UIView *)parentView
                 launchOptions:(NSDictionary *)options;

- (void)ccStyleChanged:(NSNotification *)notification;
- (void)sendBridgeEventWithName:(NSString *)eventName body:(id)body;

@end
