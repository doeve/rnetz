package com.rnetz;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import androidx.annotation.Nullable;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.BaseJavaModule;
import java.net.UnknownHostException;

import java.io.IOException;
import java.net.InetAddress;
import java.util.ArrayList;

public class ParallelPingModule extends ReactContextBaseJavaModule {
    private static ReactApplicationContext reactContext;

    ParallelPingModule(ReactApplicationContext context) {
        super(context);
        reactContext = context;
    }

    @Override
    public String getName() {
        return "ParallelPing";
    }

    private void sendEvent(ReactContext reactContext, String eventName, @Nullable WritableMap params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }

    @ReactMethod
    public void pingHosts(ReadableArray hosts, int count) {
        ArrayList<String> hostList = new ArrayList<>();
        for (int i = 0; i < hosts.size(); i++) {
            hostList.add(hosts.getString(i));
        }

        for (String host : hostList) {
            new Thread(() -> {
                try {
                    Process process = Runtime.getRuntime().exec(String.format("ping -c %d %s", count, host));
                    int exitValue = process.waitFor();
                    WritableMap params = Arguments.createMap();
                    params.putString("ip", host);
                    params.putInt("exitValue", exitValue);
                    try {
                        InetAddress inetAddress = InetAddress.getByName(host);
                        String hostName = inetAddress.getHostName();
                        params.putString("name", hostName);
                    } catch (UnknownHostException e) {
                        params.putString("name", "Unknown");
                    }
                    sendEvent(getReactApplicationContext(), "pinged", params);
                } catch (IOException | InterruptedException e) {
                    e.printStackTrace();
                }
            }).start();
        }
    }
}