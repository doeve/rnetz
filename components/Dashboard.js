import React, { useState, useEffect } from "react";
import {
  View,
  Button,
  TextInput,
  Image,
  Switch,
  TouchableOpacity,
  Pressable,
  ToastAndroid,
  ScrollView
} from "react-native";
import Text from "./CText";
import DeviceRow from "./DeviceRow";
import { useNavigation } from "@react-navigation/native";
import styles from "../assets/styles/styles";
import Icon from "react-native-vector-icons/Ionicons"
import Ping from "react-native-ping";


import {NetworkInfo} from "react-native-network-info";

export default Dashboard = () => {
  const navigation = useNavigation();
  const [isLocal, setIsLocal] = useState(true);
  const [ip, setIp] = useState("");
  const [mask, setMask] = useState("");
  const [devices, setDevices] = useState([]);
  const [scanning, setScanning] = useState(false);

  const subnetToCIDR = (subnet) => {
    const octets = subnet.split('.').map(Number);
    const binaryString = octets.map(octet => octet.toString(2).padStart(8, '0')).join('');
    const cidr = binaryString.split('1').length - 1;
    return '/' + cidr;
  }

  const generateNetworkAddress  = (ip, mask) => {
    const ipParts = ip.split('.').map(Number);
    const maskBits = 32 - parseInt(mask.slice(1), 10);
    const maskValue = (1 << maskBits) - 1;
    const networkValue = (ipParts[0] << 24) | (ipParts[1] << 16) | (ipParts[2] << 8) | ipParts[3];
    const networkAddressValue = networkValue & ~maskValue;

    const networkAddressParts = [
      (networkAddressValue >> 24) & 255,
      (networkAddressValue >> 16) & 255,
      (networkAddressValue >> 8) & 255,
      networkAddressValue & 255
    ];

    return networkAddressParts.join('.');
  }

  const scanAllIPs = async () =>  {
    setScanning(!scanning);
    console.log(scanning);
    if (scanning) {
      console.log('scanning');
      const maskBits = 32 - parseInt(mask.slice(1), 10);
      const maskValue = (1 << maskBits) - 1;
      const networkIp = generateNetworkAddress(ip, mask);
      const networkValue = networkIp.split('.').reduce((acc, val) => (acc << 8) | Number(val), 0);

      for (let i = 1; i < (1 << maskBits) - 1; i++) {
        const ipValue = networkValue + i;
        const ipParts = [
          (ipValue >> 24) & 255,
          (ipValue >> 16) & 255,
          (ipValue >> 8) & 255,
          ipValue & 255
        ];
        const ipAddress = ipParts.join('.');
        if (scanning) {
          try {
            const ms = await Ping.start(ipAddress, { timeout: 1000 });
            console.log([...devices, ipAddress]);
            setDevices([...devices, ipAddress]);
            // console.log(devices);
          } catch (error) {
            console.log(i, ipAddress,' special code',error.code, error.message);
          }
        } else {
          break;
        }
      }
    }
  }

  useEffect(() => {
    if (isLocal) {
      NetworkInfo.getSubnet().then(subnet => {
        setMask(subnetToCIDR(subnet))
      });
      NetworkInfo.getIPV4Address().then(ip => {
        setIp(ip);
      });
    } else {
      setIp("");
      setMask("");
    }
  }, [isLocal]);
  
  const handleSwitchToggle = () => {
    setIsLocal(!isLocal);
    console.log(isLocal);
    const message = isLocal ? "outer network" : "local network";
    ToastAndroid.showWithGravityAndOffset(
      message,
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
      25,
      50,
    );
  };

  const ShowIp = async () => {
    NetworkInfo.getIPV4Address().then(ipv4Address => {
      console.log(ipv4Address);
      ToastAndroid.showWithGravityAndOffset(
        ipv4Address,
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        25,
        50,
      );
    });
  }

  return (
    <View style={{flexDirection: "column", gap: 10, height: "100%"}}>
      <View style={styles.content}>
        <View style={styles.titleContainer}>
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
            value={!ip? '' : generateNetworkAddress(ip, mask)}
            onChangeText={setIp}
            editable={!isLocal}
            placeholder="enter network ip"
            placeholderTextColor="#606060"
          />
          <TextInput
            style={{...styles.input, ...styles.maskInput}}
            value={mask}
            onChangeText={setMask}
            editable={!isLocal}
            placeholder="mask"
            placeholderTextColor="#606060" 
          />
          <TouchableOpacity style={{...styles.btn, ...{aspectRatio: 1}}} onPress={scanAllIPs}>
            <Icon name={scanning? "stop" : "caret-forward-outline"} size={20} color="black" />
          </TouchableOpacity>
        </View>
      </View>
      <Button
        title="ip"
        onPress={ShowIp}
      />
      <Button
        title="Go to Device"
        onPress={() => navigation.navigate("Device")}
      />
      <View style={{...styles.content, ...{flexGrow: 1, flexDirection: "column"}}}>
        <View style={{...styles.titleContainer, ...{marginBottom: 7}}}>
          <Text style={styles.h2}>devices{devices.length? ` (${devices.length})` : ''}</Text>
        </View>
        <ScrollView style={{flexGrow: 1}}>
          {devices.length? devices.map((ip, i) => {
            return (
              <DeviceRow ip={ip} key={i}/>
            );
          }) : <Text>scan the network</Text>}
        </ScrollView>
      </View>
    </View>
  );
};
