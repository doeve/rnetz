import React from "react";
import { useNavigation } from "@react-navigation/native";
import styles from "../assets/styles/styles";
import Text from "./CText";


const DeviceRow = (props) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity style={{...styles.btn, ...{flexDirection: "row", justifyContent: "space-between"}}} onPress={() => navigation.navigate("Device", props.ip)}>
      <Text>{props.ip}</Text>
      <Icon name="caret-forward-outline" size={20} color="black" />
    </TouchableOpacity>
  );
};

export default DeviceRow;