package com.rnetz;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.jcraft.jsch.JSch;
import com.jcraft.jsch.Session;
import com.jcraft.jsch.Channel;
import com.jcraft.jsch.ChannelExec;
import java.io.InputStream;

public class SSHConnector extends ReactContextBaseJavaModule {
    public SSHConnector(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "SSHConnector";
    }

    @ReactMethod
    public void executeCommand(String host, int port, String user, String password, String command, Promise promise) {
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    JSch jsch = new JSch();
                    Session session = jsch.getSession(user, host, port);
                    session.setPassword(password);

                    java.util.Properties config = new java.util.Properties();
                    config.put("StrictHostKeyChecking", "no");
                    config.put("kex", "diffie-hellman-group-exchange-sha1,diffie-hellman-group14-sha1,diffie-hellman-group1-sha1");
                    config.put("server_host_key", "ssh-rsa");
                    config.put("cipher.s2c", "aes128-cbc,3des-cbc,aes192-cbc,aes256-cbc");
                    config.put("cipher.c2s", "aes128-cbc,3des-cbc,aes192-cbc,aes256-cbc");
                    session.setConfig(config);

                    session.connect();

                    Channel channel = session.openChannel("exec");
                    ((ChannelExec) channel).setCommand(command);
                    channel.setInputStream(null);

                    InputStream in = channel.getInputStream();
                    channel.connect();

                    byte[] tmp = new byte[1024];
                    StringBuilder outputBuffer = new StringBuilder();
                    while (true) {
                        while (in.available() > 0) {
                            int i = in.read(tmp, 0, 1024);
                            if (i < 0) break;
                            outputBuffer.append(new String(tmp, 0, i));
                        }
                        if (channel.isClosed()) {
                            if (in.available() > 0) continue;
                            System.out.println("exit-status: " + channel.getExitStatus());
                            break;
                        }
                        try {
                            Thread.sleep(1000);
                        } catch (Exception ee) {
                        }
                    }
                    channel.disconnect();
                    session.disconnect();
                    promise.resolve(outputBuffer.toString());
                } catch (Exception e) {
                    promise.reject("SSH Error", e.getMessage());
                }
            }
        }).start();
    }
}