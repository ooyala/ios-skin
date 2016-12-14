package com.ooyala.android.skin.view;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

public class ClosedCaptionsViewManager extends SimpleViewManager<ClosedCaptionsView> {
  public static final String REACT_CLASS = "RCTClosedCaptionsView";
//  private ClosedCaptionsStyle style;

  @Override
  public String getName() {
    return REACT_CLASS;
  }

  @Override
  public ClosedCaptionsView createViewInstance(ThemedReactContext context) {
    ClosedCaptionsView v = new ClosedCaptionsView(context);
    return v;
  }

  @ReactProp(name = "caption")
  public void setCaption(ClosedCaptionsView view, ReadableMap caption) {
    Double begin = caption.getDouble("begin");
    Double end = caption.getDouble("end");
    Double width = caption.getDouble("width");
    String text = caption.getString("text");
    view.setCaption(begin, end, text, width);
  }
}
