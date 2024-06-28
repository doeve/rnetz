
import Icon from "react-native-vector-icons/Ionicons"
import React, { useState } from "react";
import { View, TouchableOpacity, NativeModules, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import styles from "../assets/styles/styles";
import Ping from 'react-native-ping';
import Text from "./CText";
import { useEffect } from "react";

const { SSHConnector } = NativeModules;

const Device = (props) => {
  console.log(props.route.params);
  const navigation = useNavigation();
  let { name, ip, username, password } = props.route.params;
  const [rtt, setRtt] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [commandOutput, setCommandOutput] = useState('');
  const [firmwareModel, setFirmwareModel] = useState('');
  const [firmwareVersion, setFirmwareVersion] = useState('');
  const [uptime, setUptime] = useState('');
  const [consoleText, setConsoleText] = useState('');


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
    (async () => {
      try {
        const commandOutput = await SSHConnector.executeCommand(ip, 22, username, password, 'show version');
        const firmwareMatch = commandOutput.match(/Cisco IOS Software, ([\S\s]*?), Version ([\S\s]*?),/);
        const modelMatch = firmwareMatch && firmwareMatch[1].trim();
        const versionMatch = firmwareMatch && firmwareMatch[2].trim();
        const uptimeMatch = commandOutput.match(/uptime is ([\S\s]*?)\n/);
        const uptimeValue = uptimeMatch && uptimeMatch[1].trim();
        setFirmwareModel(modelMatch);
        setFirmwareVersion(versionMatch);
        setUptime(uptimeValue);
      } catch (error) {
        console.error('SSH Command Error:', error);
        setFirmwareModel('Error');
        setFirmwareVersion('Error');
        setUptime('Error');
      }
    })();
  }, []);

  const handleOptionPress = async (option) => {
    setSelectedOption(option);
    let command = '';
    switch (option) {
      case 'interfaces':
        command = 'show ip interface brief';
        try {
          const output = await SSHConnector.executeCommand(ip, 22, username, password, command);
          setConsoleText(prev => prev + `\n${output}`);
          const interfaces = output.split('\n').slice(2).map(line => line.trim().split(/\s+/));
          const interfaceContent = interfaces.map(([name, ip, ok, protocol, status]) => (
        <View key={name} style={styles.detailRow}>
          <Text style={{flex: 0.5}}>{name}</Text>
          <Text style={{flex: 0.4}}>{ip}</Text>
          {status === 'up' ? <Icon name="arrow-up-outline" size={20} color="green" /> : <Icon name="arrow-down-outline" size={20} color="red" />}
        </View>
          ));
          setCommandOutput(interfaceContent);
        } catch (error) {
          console.error('SSH Command Error:', error);
          setCommandOutput(<Text>Error executing command</Text>);
        }
        break;
      case 'map':
        command = 'show ip route';
        try {
          const output = await SSHConnector.executeCommand(ip, 22, username, password, command);
          setConsoleText(prev => prev + `\n${output}`);
          const routes = output.split('\n').slice(13).map(line => line.trim().split(/\s+/));
          const routeContent = routes.map((route, i) => (
          <View key={i} style={styles.detailRow}>
<           Text style={{flex: 0.1}}>{route[0]}</Text>
<           Text style={{flex: 0.5}}>{route[1]}</Text>
<           Text style={{flex: 0.4}}>{route[route.length - 1]}</Text>
          </View>
        ));
        setCommandOutput(routeContent);
      } catch (error) {
        console.error('SSH Command Error:', error);
        setCommandOutput(<Text>Error executing command</Text>);
      }
        break;
      case 'config':
        command = 'show startup-config';
        break;
      default:
        setCommandOutput('');
        return;
    }

    // try {
    //   const output = await SSHConnector.executeCommand(ip, 22, username, password, command);
    //   setCommandOutput(output);
    // } catch (error) {
    //   console.error('SSH Command Error:', error);
    //   setCommandOutput('Error executing command');
    // }
  };

  const renderOptionContent = () => {
    return {commandOutput};
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
        <View style={{marginBottom: 5}}>
          <View style={{flexDirection: "row"}}><Text style={{fontWeight: "bold"}}>model:</Text><Text> {firmwareModel}</Text></View>
          <View style={{flexDirection: "row"}}><Text style={{fontWeight: "bold"}}>version:</Text><Text> {firmwareVersion}</Text></View>
          <View style={{flexDirection: "row"}}><Text style={{fontWeight: "bold"}}>uptime:</Text><Text> {uptime}</Text></View>
        </View>
        <View style={{ flexDirection: "row"}}>
          <TouchableOpacity onPress={() => handleOptionPress("interfaces")} style={{...styles.lgBtn, borderBottomRightRadius: 0, borderTopRightRadius: 0, flex: 1, justifyContent: "center", backgroundColor: selectedOption === "interfaces" ? "#e4e4e4" : "#f4f4f4"}}>
            <Text>interfaces</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleOptionPress("map")} style={{...styles.lgBtn, borderRadius: 0, flex: 1, justifyContent: "center", backgroundColor: selectedOption === "map" ? "#e4e4e4" : "#f4f4f4"}}>
            <Text>map</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleOptionPress("config")} style={{...styles.lgBtn, borderBottomLeftRadius: 0, borderTopLeftRadius: 0, flex: 1, justifyContent: "center", backgroundColor: selectedOption === "config" ? "#e4e4e4" : "#f4f4f4"}}>
            <Text>config</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1 }}>
          <View style={{ flex: 0.6, padding: 10, marginVertical: 10, backgroundColor: "#fafafa", borderWidth: 1, borderRadius: 4, elevation: 3, borderColor: "#a0a0a0", flexDirection: "column", gap: 5 }}>
            {commandOutput}
          </View>
          <View style={{ flex: 0.4, padding: 10, borderRadius: 5, backgroundColor: "#1f1f1f", fontWeight: "bold", color: "#ffffff", elevation: 3}}>
            <Text style={{ color: "#f1f1f1", marginTop: -5, fontWeight: "bold" }}>console</Text>
            <ScrollView ref={ref => {this.scrollView = ref}}
    onContentSizeChange={() => this.scrollView.scrollToEnd({animated: true})}>
              <Text style={{color: "white", fontSize: 10}}>
                {consoleText}
              </Text>
            </ScrollView>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Device;