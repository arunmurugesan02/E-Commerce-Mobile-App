package com.ecommerce;
import android.os.Bundle; // Add this if it's missing

import com.facebook.react.ReactActivity;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(null);
  }
  @Override
  protected String getMainComponentName() {
    return "ecommerce";
  }
}
