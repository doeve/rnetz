
import Icon from "react-native-vector-icons/Ionicons"
import React, { useState } from "react";
import { View, TouchableOpacity, NativeModules } from "react-native";
import { useNavigation } from "@react-navigation/native";
import styles from "../assets/styles/styles";
import Ping from 'react-native-ping';
import Text from "./CText";
import { useEffect } from "react";

const { SSHConnector } = NativeModules;

const Device = (props) => {
  const navigation = useNavigation();
  let { name, ip } = props.route.params;
  const [rtt, setRtt] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [commandOutput, setCommandOutput] = useState('');


  const getRtt = async () => {
    try {
      const ms = await Ping.start(ip,{ timeout: 1000 });
      setRtt(ms);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getRtt();
  }, []);

  const handleOptionPress = async (option) => {
    setSelectedOption(option);
    let command = '';
    switch (option) {
      case 'interfaces':
        command = 'show ip interface brief';
        break;
      case 'map':
        command = 'show ip route';
        break;
      case 'config':
        command = 'show startup-config';
        break;
      default:
        setCommandOutput('');
        return;
    }

    try {
      const output = await SSHConnector.executeCommand(ip, 22, 'username', 'password', command);
      setCommandOutput(output);
    } catch (error) {
      console.error('SSH Command Error:', error);
      setCommandOutput('Error executing command');
    }
  };

  const renderOptionContent = () => {
    return commandOutput ? <Text>{commandOutput}</Text> : null;
  };

  return (
    <View style={{ flexDirection: "column", gap: 10, height: "100%" }}>
      <View style={{ ...styles.content, flex: 1, flexDirection: "column" }}>
        <View style={{ ...styles.titleContainer,  marginBottom: 7 }}>
          <Text style={ip === name? styles.h1 : styles.h2}>{name}</Text>
          <TouchableOpacity onPress={() => getRtt()} style={{ flexDirection: "row", gap: 5}}>
            <Icon name="refresh" size={20} color="black" />
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={{ ...styles, color: "#888888" }}>RTT: {rtt > 0 ? `${rtt}ms` : "-"}</Text>
            </View>
          </TouchableOpacity>
        </View>
        {ip !== name && <Text style={{...styles.h3, marginBottom: 6}}>{ip}</Text>}
        <View style={{ flexDirection: "row"}}>
          <TouchableOpacity onPress={() => handleOptionPress("interfaces")} style={{...styles.lgBtn, borderBottomRightRadius: 0, borderTopRightRadius: 0, flex: 1, justifyContent: "center"}}>
            <Text>interfaces</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleOptionPress("map")} style={{...styles.lgBtn, borderRadius: 0, flex: 1, justifyContent: "center"}}>
            <Text>map</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleOptionPress("config")} style={{...styles.lgBtn, borderBottomLeftRadius: 0, borderTopLeftRadius: 0, flex: 1, justifyContent: "center"}}>
            <Text>config</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1 }}>
          <View style={{ flex: 0.6 }}>
            <View>
              {renderOptionContent()}
            </View>
          </View>
          <View style={{ flex: 0.4 }}>
            <Text style={styles.h3}>Console</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Device;