//
//  CountdownViewManager.m
//  ReactNativeCountdownTimer
//
//  Copyright © 2015 Ooyala. All rights reserved.
//

#import "CountdownViewManager.h"
#import "CountdownView.h"

#import <UIKit/UIKit.h>
#import <React/UIView+React.h>


@implementation CountdownViewManager

RCT_EXPORT_MODULE()

- (UIView *)view {
  return [CountdownView new];
}

RCT_EXPORT_VIEW_PROPERTY(time, float)
RCT_EXPORT_VIEW_PROPERTY(timeLeft, float)
RCT_EXPORT_VIEW_PROPERTY(radius, CGFloat)
RCT_EXPORT_VIEW_PROPERTY(fillColor, UIColor)
RCT_EXPORT_VIEW_PROPERTY(fillAlpha, float)
RCT_EXPORT_VIEW_PROPERTY(strokeColor, UIColor)
RCT_EXPORT_VIEW_PROPERTY(automatic, BOOL)
RCT_EXPORT_VIEW_PROPERTY(canceled, BOOL)
RCT_EXPORT_VIEW_PROPERTY(onTimerUpdate, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onTimerCompleted, RCTBubblingEventBlock)

@end
