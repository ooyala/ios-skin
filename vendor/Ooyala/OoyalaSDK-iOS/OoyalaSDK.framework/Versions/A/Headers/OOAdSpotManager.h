/**
 * @class     OOAdSpotManager OOAdSpotManager.h "OOAdSpotManager.h"
 * @brief     OOAdSpotManager
 * @details   OOAdSpotManager.h in OoyalaSDK
 * @copyright Copyright © 2015 Ooyala, Inc. All rights reserved.
 */

@import Foundation;

@class OOAdSpot;

/**
 * A class that manages a list of ad spots for a content
 */
@interface OOAdSpotManager : NSObject

/**
* @return non-nil (possibly empty) NSNumber (int in seconds) set of cue point times for ads.
*/
- (NSSet *)getCuePointsAtSeconds;

/**
 * Mark all adspots as unplayed
 */
- (void)resetAds;

/**
 * Clear all adspots
 */
- (void)clear;

/**
 * Insert an adSpot
 *
 * @param ad
 *          the adSpot to insert
 */
- (void)insertAd:(OOAdSpot *)ad;

/**
 * Insert an adSpot
 *
 * @param adSpots
 *          the adSpot to insert
 */
- (void)insertAds:(NSArray *)adSpots;

/**
 * get the adspot before a certain time,
 *
 * @param time
 *          in CMTime
 * @return the unplayed adspot before the specified time which, null if no
 *          such adspot
 */
- (OOAdSpot *)adBeforeTime:(Float64)time;

/**
 * mark an adspot as played
 *
 * @param ad
 *          the adspot to be marked
 */
- (void)markAsPlayed:(OOAdSpot *)ad;

/**
 * get the adspot list size
 *
 * @return size
 */
- (NSUInteger)count;

/**
 * Get first ad in ad array
 *
 * @return OOAdSpot
 */
- (OOAdSpot *)firstAd;

/**
 * Get next ad to be played
 *
 * @return OOAdSpot
 */
- (OOAdSpot *)nextAd;

/**
 * Get last ad in ad array
 *
 * @return OOAdSpot
 */
- (OOAdSpot *)lastAd;

/**
 * Returns YES if all ads were already played
 *
 * @return YES or NO
 */
- (BOOL)allAdsPlayed;

/**
 * Returns YES if ad was already played
 *
 * @return YES or NO
 */
- (BOOL)adPlayed:(OOAdSpot *)ad;

@end
