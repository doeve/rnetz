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

                    // Avoid asking for key confirmation
                    java.util.Properties config = new java.util.Properties();
                    config.put("StrictHostKeyChecking", "no");
                    config.put("kex", "diffie-hellman-group-exchange-sha1,diffie-hellman-group14-sha1,diffie-hellman-group1-sha1");
                    config.put("server_host_key", "ssh-rsa");
                    // Add server-supported cipher algorithms for client to server direction
                    // config.put("cipher.c2s", "aes128-cbc,3des-cbc,aes192-cbc,aes256-cbc,aes128-ctr,aes192-ctr,aes256-ctr");
                    // Also add for server to client direction for consistency

                    // Set the cipher algorithms for server-to-client direction
                    config.put("cipher.s2c", "aes128-cbc,3des-cbc,aes192-cbc,aes256-cbc");
                    // Set the cipher algorithms for client-to-server direction to match the server's supported algorithms
                    config.put("cipher.c2s", "aes128-cbc,3des-cbc,aes192-cbc,aes256-cbc");
                    session.setConfig(config);

                    session.connect();

                    // SSH Channel
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