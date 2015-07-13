//
//  OOSkinViewController.h
//  OoyalaSkin
//
//  Created by Zhihui Chen on 4/16/15.
//  Copyright (c) 2015 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>

@class OOOoyalaPlayer;
@class OODiscoveryOptions;
@class OOUpNextManager;

@interface OOSkinViewController : UIViewController

@property (nonatomic, readonly) OODiscoveryOptions *discoveryOptions;
@property (nonatomic, readonly) OOOoyalaPlayer *player;
@property (nonatomic) OOUpNextManager *upNextManager;
@property (nonatomic, readonly) BOOL isFullscreen;

- (instancetype)initWithPlayer:(OOOoyalaPlayer *)player
                        parent:(UIView *)parentView
              discoveryOptions:(OODiscoveryOptions *)discoveryOptions
                 launchOptions:(NSDictionary *)options
                jsCodeLocation:(NSURL *)jsCodeLocation;

- (void)toggleFullscreen;

@end
