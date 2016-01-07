package com.ooyala.android.ooyalaskinsdk;

import android.content.Intent;
import android.util.DisplayMetrics;
import android.util.Log;
import android.view.KeyEvent;
import android.view.MotionEvent;
import android.view.View;
import android.widget.FrameLayout;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.ooyala.android.OoyalaPlayer;
import com.ooyala.android.OoyalaPlayerLayout;
import com.ooyala.android.item.Video;
import com.ooyala.android.player.FCCTVRatingUI;
import com.ooyala.android.ui.LayoutController;
import com.ooyala.android.util.DebugMode;
import com.ooyala.android.OoyalaException;
import java.util.Iterator;
import java.util.Observable;
import java.util.Observer;
import java.util.Set;

/**
 * Created by zchen on 9/21/15.
 */

public class OoyalaSkinLayoutController extends ReactContextBaseJavaModule implements LayoutController, Observer {
  final String TAG = this.getClass().toString();
  private OoyalaSkinLayout _layout;
  private OoyalaPlayer _player;
  private FCCTVRatingUI _tvRatingUI;
  private boolean _isFullscreen = false;
  private static final String BUTTON_PLAYPAUSE = "PlayPause";
  private static final String BUTTON_PLAY = "Play";
  private static final String BUTTON_SHARE = "Share";
  private static final String BUTTON_SOCIALSHARE = "SocialShare";
  private static final String BUTTON_FULLSCREEN = "Fullscreen";
  private static final String BUTTON_LEARNMORE = "LearnMore";
  private static final String BUTTON_MORE_OPTION = "More";
  private static final String BUTTON_UPNEXT_DISMISS = "upNextDismiss";
  private static final String BUTTON_UPNEXT_CLICK = "upNextClick";

  private static final String KEY_NAME = "name";
  private static final String KEY_EMBEDCODE = "embedCode";
  private static final String KEY_PERCENTAG = "percentage";
  private static final String KEY_LANGUAGE = "language";
  private static final String KEY_BUCKETINFO = "bucketInfo";
  private static final String KEY_ACTION = "action";
  private static final String KEY_STATE = "state";
  private int width,height;
  private String shareTitle;

  @Override
  public String getName() {
    return "OoyalaSkinLayoutController";
  }

  public OoyalaSkinLayoutController(
    ReactApplicationContext c, OoyalaSkinLayout l, OoyalaPlayer p) {
    super(c);
    _layout = l;
    _player = p;
    _player.setLayoutController(this);
    _player.addObserver(this);
    DisplayMetrics metrics = c.getResources().getDisplayMetrics();
    float dpi = metrics.densityDpi;
    float cal = 160/dpi;
    height = Math.round(_layout.getResources().getDisplayMetrics().heightPixels * cal);
    width = Math.round(_layout.getResources().getDisplayMetrics().widthPixels * cal);
  }

  public FrameLayout getLayout() {
    return _layout.getPlayerLayout();
  }

  public void setFullscreen(boolean fullscreen) {
    if(fullscreen) {
      _layout.setSystemUiVisibility(
              View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                      | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                      | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                      | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION // hide nav bar
                      | View.SYSTEM_UI_FLAG_FULLSCREEN // hide status bar
                      | View.SYSTEM_UI_FLAG_IMMERSIVE);

    }
    else
    {
      _layout.setSystemUiVisibility(
              View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                      | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                      | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN);
    }

  }

  public boolean isFullscreen() {

    return _isFullscreen;

  }

  public void showClosedCaptionsMenu() {

  }

  public boolean onTouchEvent(MotionEvent event, OoyalaPlayerLayout source) {
    return false;
  }


  public boolean onKeyUp(int keyCode, KeyEvent event) {
    return false;
  }

  public void addVideoView(View videoView) {
    removeVideoView();
    if (videoView != null) {
      _tvRatingUI = new FCCTVRatingUI(_player, videoView, getLayout(), _player.getOptions().getTVRatingConfiguration());
    }
  }

  public void removeVideoView() {
    if (_tvRatingUI != null) {
      _tvRatingUI.destroy();
      _tvRatingUI = null;
    }
  }

  public void reshowTVRating() {
    if (_tvRatingUI != null) {
      _tvRatingUI.reshow();
    }
  }

  public void setFullscreenButtonShowing(boolean showing) {

  }

  @ReactMethod
  public void onPress(ReadableMap parameters) {
    final String buttonName;
    if (parameters.hasKey("name")) {

      buttonName = parameters.getString("name");
    }
    else
    {
      buttonName = null;
    }
    if (buttonName != null) {
      DebugMode.logD(TAG, "onPress with buttonName:" + buttonName);
      this.getReactApplicationContext().runOnUiQueueThread(new Runnable() {
        @Override
        public void run() {
          if (buttonName.equals(BUTTON_PLAY)) {
            handlePlay();
          } else if (buttonName.equals(BUTTON_PLAYPAUSE)) {
            handlePlayPause();
          } else if (buttonName.equals(BUTTON_FULLSCREEN)) {
            _isFullscreen = !isFullscreen();
              setFullscreen(_isFullscreen);
          } else if (buttonName.equals(BUTTON_SHARE)) {
            handleShare();
          }
        }
      });
    }
  }
    @ReactMethod
    public void shareTitle(ReadableMap parameters) {
        shareTitle = parameters.getString("shareTitle");
    }

    private void handleShare() {
        Intent shareIntent = new Intent(Intent.ACTION_SEND);
        shareIntent.setType("text/plain");
        shareIntent.putExtra(Intent.EXTRA_SUBJECT, shareTitle);
        shareIntent.putExtra(Intent.EXTRA_TEXT,     "http://www.ooyala.com");
        Intent chooserIntent = Intent.createChooser(shareIntent, "share to");
        chooserIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        getReactApplicationContext().startActivity(chooserIntent);
    }

  @Override
  public void update(Observable arg0, Object arg1) {
    if (arg1 == OoyalaPlayer.STATE_CHANGED_NOTIFICATION) {
      bridgeStateChangedNotification();
    } else if (arg1 == OoyalaPlayer.CURRENT_ITEM_CHANGED_NOTIFICATION) {
      bridgeCurrentItemChangedNotification();
    } else if (arg1 == OoyalaPlayer.TIME_CHANGED_NOTIFICATION) {
      bridgeTimeChangedNotification();
    } else if (arg1 == OoyalaPlayer.PLAY_COMPLETED_NOTIFICATION) {
      bridgePlayCompletedNotification();
    } else if (arg1 == OoyalaPlayer.AD_STARTED_NOTIFICATION) {
      bridgeAdStartNotification();
    } else if (arg1 == OoyalaPlayer.AD_COMPLETED_NOTIFICATION) {
      bridgeAdPodCompleteNotification();
    } else if (arg1 == OoyalaPlayer.PLAY_STARTED_NOTIFICATION) {
      bridgePlayStartedNotification();
    } else if (arg1 == OoyalaPlayer.ERROR_NOTIFICATION) {
      bridgeErrorNotification();
    }
  }

  // private methods
  private void handlePlay() {
    _player.play();
  }

  private void handlePlayPause() {
    //System.out.println("in handle playPause in java class");
    if (_player.isPlaying()) {
      //System.out.println("in handle playPause java, paused");
      _player.pause();

    } else {
      _player.play();
    }
  }

  @ReactMethod
  public void onScrub(ReadableMap percentage) {
    double percentValue = percentage.getDouble("percentage");
    percentValue = percentValue * 100;
    int percent = ((int) percentValue);
    _player.seekToPercent(percent);
  }
  @ReactMethod
  public void onDiscoveryRow(ReadableMap parameters) {
  }

  private WritableMap getDiscovery() {
      WritableMap discoveryresults = Arguments.createMap();
      WritableArray results = Arguments.createArray();
      WritableMap argumn1 = Arguments.createMap();
      WritableMap argumn2 = Arguments.createMap();
      argumn1.putString(" \"bucketInfo\"", "1{\\\"encoded\\\":\\\"eNpNkN0KgzAMRt8l1zKa2lrny0jR4gr+lDYTxPnui5uKdzlfTtKSFYKNbqR6\\\\\\\\nDrVvoQLx0apEBRm4ec9pCQ4qzCC42HBgux0fIgPbd1P09Brq0Q4cAvGiNsG9\\\\\\\\nw8vtkKBaoYt2fPeW44XVnC3yvymuUjNFd7wENAWOeJA8+WlMu7JlEF1T9z4R\\\\\\\\nI2pdoMTy/9NKilJqVYgLjdEGi3u3kKeca9xtcyBqoYzIxYVKPrE8b7B9ASdO\\\\\\\\nU+k=\\\",\\\"position\\\":0}\"");
      argumn1.putString("embedCode", "k4MXhjYTrxnFXdBMq95IMeNZVGs-a1kt");
      argumn1.putString("name", "RTMP movie-only ");
      argumn1.putString("imageUrl", "http://ak.c.ooyala.com/k4MXhjYTrxnFXdBMq95IMeNZVGs-a1kt/Ut_HKthATH4eww8X4yMDoxOjBhO4VMwE");
      argumn1.putDouble("duration", 124.708);
      results.pushMap(argumn1);

      argumn2.putString("\"bucketInfo\"", "\"1{\\\"encoded\\\":\\\"eNpNkN0KgzAMRt8l1zKa2lrny0jR4gr+lDYTxPnui5uKdzlfTtKSFYKNbqR6\\\\\\\\nDrVvoQLx0apEBRm4ec9pCQ4qzCC42HBgux0fIgPbd1P09Brq0Q4cAvGiNsG9\\\\\\\\nw8vtkKBaoYt2fPeW44XVnC3yvymuUjNFd7wENAWOeJA8+WlMu7JlEF1T9z4R\\\\\\\\nI2pdoMTy/9NKilJqVYgLjdEGi3u3kKeca9xtcyBqoYzIxYVKPrE8b7B9ASdO\\\\\\\\nU+k=\\\",\\\"position\\\":2}\"");
      argumn2.putString("embedCode", "92cWp0ZDpDm4Q8rzHfVK6q9m6OtFP-ww");
      argumn2.putString("name", "VOD with Closed Captions");
      argumn2.putString("imageUrl", "http://ak.c.ooyala.com/92cWp0ZDpDm4Q8rzHfVK6q9m6OtFP-ww/promo260039831");
      argumn2.putDouble("duration", 40.133);
      results.pushMap(argumn2);

      discoveryresults.putArray("results", results);
      return discoveryresults;
  }

  // notification bridges
  private void bridgeCurrentItemChangedNotification() {
    WritableMap params = Arguments.createMap();
    Video currentItem = _player.getCurrentItem();
    if (currentItem != null) {
      String title = currentItem.getTitle();
      params.putString("title", title != null ? title : "");
      String description = currentItem.getDescription();
      params.putString("description", description != null ? description : "");

      String promoUrl = currentItem.getPromoImageURL(2000, 2000);
      params.putString("promoUrl", promoUrl != null ? promoUrl : "");

//      String hostedAtUrl = _player.currentItem.hostedAtURL ? _player.currentItem.hostedAtURL : @"";
      Double duration = currentItem.getDuration() / 1000.0;
      params.putDouble("duration", duration);
      params.putBoolean("live", currentItem.isLive());
      params.putInt("width", width);
      params.putInt("height", height);
      if (currentItem.hasClosedCaptions()) {
        WritableArray languages = Arguments.createArray();
        for (String s : currentItem.getClosedCaptions().getLanguages()) {
          languages.pushString(s);
        }
        params.putArray("languages", languages);
      }
    }
    this.getReactApplicationContext()
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit("discoveryResultsReceived", getDiscovery());
    this.getReactApplicationContext()
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit(OoyalaPlayer.CURRENT_ITEM_CHANGED_NOTIFICATION, params);

//    if (_player.currentItem.embedCode && self.skinOptions.discoveryOptions) {
//      [self loadDiscovery:_player.currentItem.embedCode];
//    }
  }

  private void bridgeStateChangedNotification() {
    WritableMap params = Arguments.createMap();
    params.putString(KEY_STATE, _player.getState().toString().toLowerCase());
    DebugMode.logD(TAG, "state change event params are" + params.toString());
    this.getReactApplicationContext()
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit(OoyalaPlayer.STATE_CHANGED_NOTIFICATION, params);
  }

  private void bridgeTimeChangedNotification() {
    Double duration = _player.getDuration() / 1000.0;
    Double playhead = _player.getPlayheadTime() / 1000.0;
    WritableArray cuePoints = Arguments.createArray();
    Set<Integer> cuePointsPercentValues = _player.getCuePointsInPercentage();
    for (Iterator<Integer> i = cuePointsPercentValues.iterator(); i.hasNext(); ) {
      int cuePointLocation =(int) Math.round ((i.next()/100.0)*duration);
      cuePoints.pushInt(cuePointLocation);
    }

    WritableArray languages = Arguments.createArray();
    Set<String> cclanguage = _player.getAvailableClosedCaptionsLanguages();
    for (Iterator<String> j = cclanguage.iterator(); j.hasNext(); ) {
      String languageItem=j.next();
      languages.pushString(languageItem);
    }
    WritableMap params = Arguments.createMap();
    params.putDouble("duration", duration);
    params.putDouble("playhead", playhead);
    params.putArray("availableClosedCaptionsLanguages", languages);
    params.putArray("cuePoints", cuePoints);
    
    this.getReactApplicationContext()
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit(OoyalaPlayer.TIME_CHANGED_NOTIFICATION, params);
  }

  private void bridgePlayCompletedNotification() {
    WritableMap params = Arguments.createMap();
    Video currentItem = _player.getCurrentItem();
    if (currentItem != null) {
      String title = currentItem.getTitle();
      params.putString("title", title != null ? title : "");

      String description = currentItem.getDescription();
      params.putString("description", description != null ? description : "");

      String promoUrl = currentItem.getPromoImageURL(2000, 2000);
      params.putString("promoUrl", promoUrl != null ? promoUrl : "");
      //String hostedAtUrl = _player.currentItem.hostedAtURL ? _player.currentItem.hostedAtURL : "";
      Double duration = currentItem.getDuration() / 1000.0;
      params.putDouble("duration", duration);
    }
    this.getReactApplicationContext()
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit(OoyalaPlayer.PLAY_COMPLETED_NOTIFICATION, params);
  }

  private void bridgePlayStartedNotification() {
    this.getReactApplicationContext()
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit(OoyalaPlayer.PLAY_STARTED_NOTIFICATION, null);
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

    this.getReactApplicationContext()
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit(OoyalaPlayer.ERROR_NOTIFICATION, params);

  }

  private void bridgeAdStartNotification() {
    WritableMap params = Arguments.createMap();
    this.getReactApplicationContext()
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit(OoyalaPlayer.AD_STARTED_NOTIFICATION, params);
  }

  private void bridgeAdPodCompleteNotification() {
    WritableMap params = Arguments.createMap();
    this.getReactApplicationContext()
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit(OoyalaPlayer.AD_COMPLETED_NOTIFICATION, params);
  }
}
