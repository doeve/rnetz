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
  ScrollView,
  NativeModules,
  NativeEventEmitter,
  LogBox
} from "react-native";
import Text from "./CText";
import DeviceRow from "./DeviceRow";
import { useNavigation } from "@react-navigation/native";
import styles from "../assets/styles/styles";
import Icon from "react-native-vector-icons/Ionicons"
import { NetworkInfo } from "react-native-network-info";
import { Client } from "react-native-ssdp"

LogBox.ignoreLogs(['new NativeEventEmitter']);

export default Dashboard = () => {
  const navigation = useNavigation();
  const [isLocal, setIsLocal] = useState(true);
  const [ip, setIp] = useState("");
  const [mask, setMask] = useState("");
  const [devices, setDevices] = useState([]);
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(0);
  const { ParallelPing } = NativeModules;
  const eventEmitter = new NativeEventEmitter(ParallelPing);

  const [ownIp, setOwnIp] = useState("");

  NetworkInfo.getIPV4Address().then(ipv4Address => 
    setOwnIp(ipv4Address)
  );

  const subnetToCIDR = (subnet) => {
    const octets = subnet.split('.').map(Number);
    const binaryString = octets.map(octet => octet.toString(2).padStart(8, '0')).join('');
    const cidr = binaryString.split('1').length - 1;
    return '/' + cidr;
  }

  const generateHostIPs = (ip, mask) => {
    const chunks = ip.split('.');
    const maskBits = 32 - parseInt(mask.slice(1), 10);
    const totalHosts = Math.pow(2, maskBits) - 2;
    const hostIPs = [];

    const networkInt = chunks.reduce((acc, val) => (acc << 8) + parseInt(val, 10), 0);

    for (let i = 1; i <= totalHosts; i++) {
      const hostInt = networkInt + i;
      const hostIP = [
        (hostInt >> 24) & 255,
        (hostInt >> 16) & 255,
        (hostInt >> 8) & 255,
        hostInt & 255
      ].join('.');
      hostIPs.push(hostIP);
    }

    return hostIPs;
  }


  const generateNetworkAddress = (ip, mask) => {
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

  const scanAllIPs = async () => {
    setScanned(0);
    setDevices([]);
    ParallelPing.pingHosts(generateHostIPs(generateNetworkAddress(ip, mask), mask), 3);
  }

  useEffect(() => {
    const pingSuccessListener = eventEmitter.addListener('pinged', (event) => {
      setScanned(prevScanned => prevScanned + 1);
      if (event.exitValue === 0) {
        setDevices(prevDevices => ({...prevDevices, [event.ip]: event.name}));
        // const client = new Client();-+

        // client.on('response', (headers, statusCode, rinfo) => {
        //   if (rinfo.address === event.ip) {
        //     console.log(`Got a response from the targeted IP (${targetIPAddress}):`, headers);
        //     let device = devices[event.ip];
        //     setDevices({...devices, [event.ip]: "hey there"});
        //   }
        // });

        // Search for all devices
        // client.search('ssdp:all');
      }
    });

    return () => {
      pingSuccessListener.remove();
    };
  }, []);

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
    setDevices([]);
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

  const calculateNumberOfHosts = (mask) => {
    const subnet = parseInt(mask.slice(1), 10);
    if (mask.match(/\/\d+/) && subnet >= 0 && subnet < 32) {
      return Math.pow(2, 32 - subnet) - 2;
    } else {
      return 0;
    }
  }

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
    <View style={{ flexDirection: "column", gap: 10, height: "100%" }}>
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
            style={{ ...styles.input, ...styles.ipInput }}
            value={!ip ? '' : generateNetworkAddress(ip, mask)}
            onChangeText={setIp}
            editable={!isLocal}
            placeholder="enter network ip"
            placeholderTextColor="#606060"
          />
          <TextInput
            style={{ ...styles.input, ...styles.maskInput }}
            value={mask}
            onChangeText={setMask}
            editable={!isLocal}
            placeholder="mask"
            placeholderTextColor="#606060"
          />
          <TouchableOpacity style={{ ...styles.smBtn, aspectRatio: 1 }} onPress={scanAllIPs}>
            <Icon name="caret-forward-outline" size={20} color="black" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ ...styles.content, flex: 1, flexDirection: "column" }}>
        <View style={{ ...styles.titleContainer,  marginBottom: 7 }}>
          <Text style={styles.h2}>devices{Object.keys(devices).length ? ` (${Object.keys(devices).length})` : ''}</Text>
          <Text style={styles.h3}>{scanned} / {calculateNumberOfHosts(mask)}</Text>
        </View>
        <ScrollView contentContainerStyle={{ rowGap: 5, flexGrow: 1 }}>
          {Object.keys(devices).length ? Object.entries(devices).map(([deviceIp, deviceName]) => {
            return (
              <DeviceRow ip={deviceIp} key={deviceIp} name={deviceName + (deviceIp == ownIp? " (You)" : "")}/>
            );
          }) : <View style={{height: 100, width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "center"}}><Text>scan the network</Text></View>}
        </ScrollView>
      </View>
    </View>
  );
};
