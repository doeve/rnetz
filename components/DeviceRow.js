import React from "react";
import { useNavigation } from "@react-navigation/native";
import {TouchableOpacity} from "react-native";
import styles from "../assets/styles/styles";
import Text from "./CText";
import Icon from "react-native-vector-icons/Ionicons"

export default DeviceRow = (props) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity style={{...styles.btn, ...{flexDirection: "row", justifyContent: "space-between", height: 40, paddingHorizontal: 10, backgroundColor: "#c0c0c0"}}} onPress={() => navigation.navigate("Device", props.ip)}>
      <Text style={{fontWeight: 700, color: "#ffffff"}}>{props.ip}</Text>
      <Icon name="arrow-forward-outline" size={20} color="black" />
    </TouchableOpacity>
  );
};

//#a9cd9e