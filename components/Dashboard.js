import React, { useState, useEffect } from "react";
import {
  View,
  Button,
  TextInput,
  Image,
  Switch,
  TouchableOpacity,
  Pressable,
  ToastAndroid
} from "react-native";
import Text from "./CText";
import { useNavigation } from "@react-navigation/native";
import styles from "../assets/styles/styles";
// import Zeroconf from 'react-native-zeroconf'
import PortScanner from 'react-native-find-local-devices';
import Icon from 'react-native-vector-icons/Ionicons'


// import CustomToast from "@fredabila/customtoast";
// import Ping from "@charles-johnson/react-native-ping";
// import find from 'local-devices'
// import WTF from "wtf";
// import find from 'local-devices'


import NetInfo from "@react-native-community/netinfo";

const Dashboard = () => {
  const navigation = useNavigation();
  const [isLocal, setIsLocal] = useState(true);
  const [ip, setIp] = useState("");
  const [mask, setMask] = useState("");

  useEffect(() => {
    if (isLocal) {
      // Fetch and set local network IP and mask
      NetInfo.fetch().then((state) => {
        if (state.isConnected) {
          // For demonstration, use placeholder values
          setIp("192.168.1.1");
          setMask("/24");
        }
      });
    } else {
      setIp("");
      setMask("");
    }
  }, [isLocal]);

  const handleSwitchToggle = () => {
    setIsLocal(!isLocal);
    console.log(isLocal);
    const message = isLocal ? "Outer network" : "Local network";
    ToastAndroid.showWithGravityAndOffset(
      message,
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
      25,
      50,
    );
  };

  const handlePing = async () => {
    const scanner = new PortScanner({
      timeout: 40,
      ports: [8000],
      onDeviceFound: (device) => {
        console.log('Found device!', device);
      },
      onFinish: (devices) => {
        console.log('Finished , devices:', devices);
      },
      onCheck: (device) => {
        console.log('Checking IP: ', device.ipAddress);
      },
      onNoDevices: () => {
        console.log('Finished scanning, no results have been found!');
      },
      onError: (error) => {
        // Called when no service found
        console.log('Error', error);
      },
    });
    scanner.start();
  };

  return (
    <View>
      <View style={styles.networkContainer}>
        <Text style={styles.h2}>network</Text>
        <View style={styles.networkSwitch}>
          <Pressable onPress={handleSwitchToggle}>
            <Image
              source={require("../assets/images/local-network.png")}
              style={styles.smallIcon}
              onPress={handleSwitchToggle}
            />
          </Pressable>
          <Switch value={!isLocal} onValueChange={handleSwitchToggle} />
          <Pressable onPress={handleSwitchToggle}>
            <Image
              source={require("../assets/images/outer-network.png")}
              style={styles.smallIcon}
              onPress={handleSwitchToggle}
            />
          </Pressable>
        </View>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={{...styles.input, ...styles.ipInput}}
          value={ip}
          onChangeText={setIp}
          editable={!isLocal}
          placeholder="IP Address"
        />
        <TextInput
          style={{...styles.input, ...styles.maskInput}}
          value={mask}
          onChangeText={setMask}
          editable={!isLocal}
          placeholder="Mask"
        />
        <TouchableOpacity style={styles.btn} onPress={handlePing}>
          <Icon name="caret-forward-outline" size={20} color="black" />
        </TouchableOpacity>
      </View>
      <Button
        title="Go to Device"
        onPress={() => navigation.navigate("Device")}
      />
    </View>
  );
};

export default Dashboard;
