import React from "react";
import { View, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import styles from "../assets/styles/styles";
import Ping from 'react-native-ping';
import Text from "./CText";
import { useState, useEffect } from "react";
import Icon from "react-native-vector-icons/Ionicons"


const Device = (props) => {
  const navigation = useNavigation();
  let { name, ip } = props.route.params;
  const [rtt, setRtt] = useState(0);

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
        {ip !== name && <Text style={styles.h3}>{ip}</Text>}
      </View>
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity  style={{...styles.lgBtn, borderBottomRightRadius: 0, borderTopRightRadius: 0}}>
          <Text>interfaces</Text>
        </TouchableOpacity>
        <TouchableOpacity  style={{...styles.lgBtn, borderRadius: 0}}>
          <Text>map</Text>
        </TouchableOpacity>
        <TouchableOpacity  style={{...styles.lgBtn, borderBottomLeftRadius: 0, borderTopLeftRadius: 0}}>
          <Text>config</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Device;
