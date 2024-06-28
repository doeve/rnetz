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
import java.io.OutputStream;
import java.io.PrintWriter;
import android.util.Log;

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

                    Channel channel = session.openChannel("shell");

                    OutputStream outStream = channel.getOutputStream();
                    PrintWriter shellWriter = new PrintWriter(outStream, true);

                    InputStream inStream = channel.getInputStream();

                    channel.connect();

                    // Send the command followed by a newline to execute it
                    shellWriter.println(command);
                    shellWriter.flush();

                    // Optionally, send the password the same way if needed
                    // shellWriter.println("yourPassword");
                    // shellWriter.flush();

                    byte[] tmp = new byte[1024];
                    byte[] output = new byte[1024];
                    StringBuilder outputBuffer = new StringBuilder();
                    
//                     byte[] tmp = new byte[1024];
// StringBuilder outputBuffer = new StringBuilder();
long lastOutputTime = System.currentTimeMillis();
int lastOutputLength = 0;

while (true) {
    if (inStream.available() > 0) {
        int i = inStream.read(tmp, 0, 1024);
        if (i < 0) break;
        outputBuffer.append(new String(tmp, 0, i));
        Log.d("SSH", new String(tmp, 0, i));
        lastOutputTime = System.currentTimeMillis(); // Update last output time
    } else if (System.currentTimeMillis() - lastOutputTime > 1000) {
        // If more than 1000 ms have passed without new output
        if (outputBuffer.length() == lastOutputLength) {
            // And the output length hasn't changed
            System.out.println("No new output. Closing channel.");
            channel.disconnect(); // Close the channel
            promise.resolve(outputBuffer.toString()); // Resolve the promise
            break;
        } else {
            // Update last output length for the next check
            lastOutputLength = outputBuffer.length();
            lastOutputTime = System.currentTimeMillis(); // Reset the timer
        }
    }
    if (channel.isClosed()) {
        if (inStream.available() > 0) continue; // Ensure all data is read
        System.out.println("exit-status: " + channel.getExitStatus());
        promise.resolve(outputBuffer.toString()); // Resolve the promise
        break;
    }
    try {
        Thread.sleep(100); // Reduce CPU usage
    } catch (InterruptedException e) {
        Thread.currentThread().interrupt();
        promise.reject(e); // Handle thread interruption
        break;
    }
}
                    channel.disconnect();
                    session.disconnect();
                    Log.d("SSH", outputBuffer.toString());
                    promise.resolve(outputBuffer.toString());
                } catch (Exception e) {
                    promise.reject("SSH Error", e.getMessage());
                }
            }
        }).start();
    }
}