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
// import Zeroconf from 'react-native-zeroconf'
// import PortScanner from 'react-native-find-local-devices';
import Icon from 'react-native-vector-icons/Ionicons'
import Ping from 'react-native-ping';

// import CustomToast from "@fredabila/customtoast";
// import Ping from "@charles-johnson/react-native-ping";
// import find from 'local-devices'
// import WTF from "wtf";
// import find from 'local-devices'


// import NetInfo from "@react-native-community/netinfo";
import {NetworkInfo} from 'react-native-network-info';

const Dashboard = () => {
  const navigation = useNavigation();
  const [isLocal, setIsLocal] = useState(true);
  const [ip, setIp] = useState("");
  const [mask, setMask] = useState("");
  const [devices, setDevices] = useState([1]);
  // const zeroconf = new Zeroconf()

  // zeroconf.on('stop', () => {
  //   console.log('[Stop]')
  // })

  // zeroconf.on('resolved', service => {
  //   console.log('[Resolve]', JSON.stringify(service, null, 2))
  // })


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
    console.log('scanning');
    const maskBits = 32 - parseInt(mask.slice(1), 10);
    const maskValue = (1 << maskBits) - 1;
    const networkValue = ip.split('.').reduce((acc, val) => (acc << 8) | Number(val), 0);

    for (let i = 1; i < (1 << maskBits) - 1; i++) {
      const ipValue = networkValue + i;
      const ipParts = [
        (ipValue >> 24) & 255,
        (ipValue >> 16) & 255,
        (ipValue >> 8) & 255,
        ipValue & 255
      ];
      const ipAddress = ipParts.join('.');
      // console.log('IP:', ipAddress);
      try {
        const ms = await Ping.start(ipAddress,{ timeout: 1000 });
        console.log(ipAddress);
      } catch (error) {
        console.log('special code',error.code, error.message);
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

  const scan = async () => {
    console.log('scan');
    // const scanner = new PortScanner({
    //   timeout: 40,
    //   ports: [8000],
    //   onDeviceFound: (device) => {
    //     console.log('Found device!', device);
    //   },
    //   onFinish: (devices) => {
    //     console.log('Finished , devices:', devices);
    //   },
    //   onCheck: (device) => {
    //     console.log('Checking IP: ', device.ipAddress);
    //   },
    //   onNoDevices: () => {
    //     console.log('Finished scanning, no results have been found!');
    //   },
    //   onError: (error) => {
    //     // Called when no service found
    //     console.log('Error', error);
    //   },
    // });
    // scanner.start();
    // zeroconf.scan(type = 'http', protocol = 'tcp', domain = 'local');
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
            <Icon name="caret-forward-outline" size={20} color="black" />
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
        <View style={styles.titleContainer}>
          <Text style={styles.h2}>devices</Text>
        </View>
        <ScrollView style={{flexGrow: 1}}>
          {devices.map((ip) => {
            return (
              <DeviceRow ip={ip}/>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
};

export default Dashboard;
