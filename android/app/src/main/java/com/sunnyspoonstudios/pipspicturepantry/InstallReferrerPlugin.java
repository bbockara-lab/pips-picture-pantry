package com.sunnyspoonstudios.pipspicturepantry;

import com.android.installreferrer.api.InstallReferrerClient;
import com.android.installreferrer.api.InstallReferrerStateListener;
import com.android.installreferrer.api.ReferrerDetails;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "InstallReferrer")
public class InstallReferrerPlugin extends Plugin {
  @PluginMethod
  public void getInstallReferrer(PluginCall call) {
    InstallReferrerClient client = InstallReferrerClient.newBuilder(getContext()).build();
    client.startConnection(new InstallReferrerStateListener() {
      @Override
      public void onInstallReferrerSetupFinished(int responseCode) {
        try {
          if (responseCode != InstallReferrerClient.InstallReferrerResponse.OK) {
            call.reject("install-referrer-unavailable:" + responseCode);
            return;
          }
          ReferrerDetails details = client.getInstallReferrer();
          JSObject result = new JSObject();
          result.put("referrer", details.getInstallReferrer());
          call.resolve(result);
        } catch (Exception error) {
          call.reject("install-referrer-failed", error);
        } finally {
          client.endConnection();
        }
      }

      @Override
      public void onInstallReferrerServiceDisconnected() {
        call.reject("install-referrer-disconnected");
      }
    });
  }
}
