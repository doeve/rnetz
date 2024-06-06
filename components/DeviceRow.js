import React from "react";
import { useNavigation } from "@react-navigation/native";
import {TouchableOpacity} from "react-native";
import styles from "../assets/styles/styles";
import Text from "./CText";
import Icon from "react-native-vector-icons/Ionicons"

export default DeviceRow = (props) => {
  const navigation = useNavigation();

  console.log(props);

  return (
    <TouchableOpacity style={{...styles.btn, ...{flexDirection: "row", justifyContent: "space-between", height: 40, paddingHorizontal: 10}}} onPress={() => navigation.navigate("Device", props.ip)}>
      <Text>{props.ip}</Text>
      <Icon name="caret-forward-outline" size={20} color="black" />
    </TouchableOpacity>
  );
};