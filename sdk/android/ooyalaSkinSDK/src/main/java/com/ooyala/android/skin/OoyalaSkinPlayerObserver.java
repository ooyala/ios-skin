package com.ooyala.android.skin;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.ooyala.android.AdOverlayInfo;
import com.ooyala.android.OoyalaException;
import com.ooyala.android.OoyalaNotification;
import com.ooyala.android.OoyalaPlayer;
import com.ooyala.android.util.DebugMode;

import java.util.Map;
import java.util.Observable;
import java.util.Observer;

/**
 * The class that solely listens to the OoyalaPlayer, and responds based on the events
 */
class OoyalaSkinPlayerObserver implements Observer {
  private static String TAG = OoyalaSkinPlayerObserver.class.getSimpleName();
  private static final String KEY_STATE = "state";
  private static final String DESIRED_STATE = "desiredState";

  private OoyalaSkinLayoutController _layoutController;
  private OoyalaPlayer _player;

  public OoyalaSkinPlayerObserver(OoyalaSkinLayoutController layoutController, OoyalaPlayer player) {
    _layoutController = layoutController;
    _player = player;
    _player.addObserver(this);
  }
  @Override
  public void update(Observable arg0, Object argN) {
    final String notificationName = OoyalaNotification.getNameOrUnknown(argN);
    if (OoyalaPlayer.EMBED_CODE_SET_NOTIFICATION_NAME.equals(notificationName)) {
      bridgeStateEmbedCodeNotification();
    } else if (OoyalaPlayer.STATE_CHANGED_NOTIFICATION_NAME.equals(notificationName)) {
      bridgeStateChangedNotification();
    } else if (OoyalaPlayer.DESIRED_STATE_CHANGED_NOTIFICATION_NAME.equals(notificationName)) {
      bridgeDesiredStateChangedNotification();
    } else if (OoyalaPlayer.CURRENT_ITEM_CHANGED_NOTIFICATION_NAME.equals(notificationName)) {
      bridgeCurrentItemChangedNotification();
    } else if (OoyalaPlayer.TIME_CHANGED_NOTIFICATION_NAME.equals(notificationName)) {
      bridgeTimeChangedNotification();
    } else if (OoyalaPlayer.PLAY_COMPLETED_NOTIFICATION_NAME.equals(notificationName)) {
      bridgePlayCompletedNotification();
      _layoutController.maybeStartUpNext();
    } else if (OoyalaPlayer.AD_COMPLETED_NOTIFICATION_NAME.equals(notificationName)) {
      bridgeAdPodCompleteNotification();
    } else if (OoyalaPlayer.PLAY_STARTED_NOTIFICATION_NAME.equals(notificationName)) {
      bridgePlayStartedNotification();
      _layoutController.requestDiscovery();
    } else if (OoyalaPlayer.ERROR_NOTIFICATION_NAME.equals(notificationName)) {
      bridgeErrorNotification();
    } else if (OoyalaPlayer.CLOSED_CAPTIONS_LANGUAGE_CHANGED_NAME.equals(notificationName)) {
      bridgeOnClosedCaptionChangeNotification();
    } else if (OoyalaPlayer.AD_STARTED_NOTIFICATION_NAME.equals(notificationName)) {
      bridgeAdStartNotification(((OoyalaNotification) argN).getData());
    } else if (OoyalaPlayer.LIVE_CC_CHANGED_NOTIFICATION_NAME.equals(notificationName)) {
      bridgeLiveCCChangedNotification(((OoyalaNotification) argN).getData());
    } else if (OoyalaPlayer.AD_OVERLAY_NOTIFICATION_NAME.equals(notificationName)) {
      bridgeAdOverlayNotification(((OoyalaNotification) argN).getData());;
    }
  }
  private void bridgeOnClosedCaptionChangeNotification() {
    // clear previous cc, if any
    WritableMap params = Arguments.createMap();
    params.putString("text", "");
    _layoutController.sendEvent("onClosedCaptionUpdate", params);
  }

  private void bridgeStateChangedNotification() {
    WritableMap params = Arguments.createMap();
    params.putString(KEY_STATE, _player.getState().toString().toLowerCase());
    DebugMode.logD(TAG, "state change event params are" + params.toString());
    _layoutController.sendEvent(OoyalaPlayer.STATE_CHANGED_NOTIFICATION_NAME, params);
  }

  private void bridgeDesiredStateChangedNotification() {
    WritableMap params = Arguments.createMap();
    params.putString(DESIRED_STATE, _player.getDesiredState().toString().toLowerCase());
    DebugMode.logD(TAG, "desired  state change event params are" + params.toString());
    _layoutController.sendEvent(OoyalaPlayer.DESIRED_STATE_CHANGED_NOTIFICATION_NAME, params);
  }

  private void bridgeStateEmbedCodeNotification() {
    WritableMap nothing = Arguments.createMap();
    _layoutController.sendEvent(OoyalaPlayer.EMBED_CODE_SET_NOTIFICATION_NAME, nothing);
  }

  private void bridgeCurrentItemChangedNotification() {
    WritableMap params = BridgeMessageBuilder.buildCurrentItemChangedParams(_player, _layoutController.width, _layoutController.height, _layoutController.getCurrentVolume());
    _layoutController.sendEvent(OoyalaPlayer.CURRENT_ITEM_CHANGED_NOTIFICATION_NAME, params);

//    if (_player.currentItem.embedCode && self.skinOptions.discoveryOptions) {
//      [self loadDiscovery:_player.currentItem.embedCode];
//    }
  }

  private void bridgeTimeChangedNotification() {
    WritableMap params = BridgeMessageBuilder.buildTimeChangedEvent(_player);
    _layoutController.sendEvent(OoyalaPlayer.TIME_CHANGED_NOTIFICATION_NAME, params);
  }

  private void bridgePlayCompletedNotification() {
    WritableMap params = BridgeMessageBuilder.buildPlayCompletedParams(_player);
    _layoutController.sendEvent(OoyalaPlayer.PLAY_COMPLETED_NOTIFICATION_NAME, params);
  }

  private void bridgePlayStartedNotification() {
    _layoutController.sendEvent(OoyalaPlayer.PLAY_STARTED_NOTIFICATION_NAME, null);
  }

  private void bridgeErrorNotification() {
    OoyalaException ex = _player.getError();
    WritableMap params = Arguments.createMap();
    if (ex != null) {
      int errorCode = ex.getCode().ordinal();
      params.putInt("code", errorCode);

      String descrptions = ex.getLocalizedMessage();
      params.putString("description", descrptions != null ? descrptions : "");
    }

    _layoutController.sendEvent(OoyalaPlayer.ERROR_NOTIFICATION_NAME, params);
  }

  private void bridgeAdStartNotification(Object data) {
    WritableMap params = BridgeMessageBuilder.buildAdsParams(data);
    _layoutController.sendEvent(OoyalaPlayer.AD_STARTED_NOTIFICATION_NAME, params);
  }

  private void bridgeAdOverlayNotification(Object data) {
    if (data instanceof AdOverlayInfo) {
      WritableMap params = BridgeMessageBuilder.buildAdOverylayParams((AdOverlayInfo) data);
      _layoutController.sendEvent(OoyalaPlayer.AD_OVERLAY_NOTIFICATION_NAME, params);
    }
  }

  private void bridgeAdPodCompleteNotification() {
    WritableMap params = Arguments.createMap();
    _layoutController.sendEvent(OoyalaPlayer.AD_POD_COMPLETED_NOTIFICATION_NAME, params); //TODO: We are listening to Player's AdCompleted, passing AdPodCompleted.  Need to fix when we fix SDK's AdPodCompleted
  }

  private void bridgeLiveCCChangedNotification(Object data) {
      Map<String, String> map = (Map<String, String>) data;
      String ccText = map.containsKey(OoyalaPlayer.CLOSED_CAPTION_TEXT) ? map.get(OoyalaPlayer.CLOSED_CAPTION_TEXT) : "";
      WritableMap params = Arguments.createMap();
      params.putString("text", ccText);
      _layoutController.sendEvent("onClosedCaptionUpdate", params);
  }
}
