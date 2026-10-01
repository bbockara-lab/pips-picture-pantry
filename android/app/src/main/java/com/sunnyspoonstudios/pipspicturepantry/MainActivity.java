package com.sunnyspoonstudios.pipspicturepantry;

import com.getcapacitor.BridgeActivity;
import android.os.Bundle;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    registerPlugin(InstallReferrerPlugin.class);
    super.onCreate(savedInstanceState);
  }
}
