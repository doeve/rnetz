import React from "react";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity, View } from "react-native";
import styles from "../assets/styles/styles";
import Text from "./CText";
import Icon from "react-native-vector-icons/Ionicons"

export default DeviceRow = (props) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity style={{ ...styles.btn, ...{flexDirection: "row", justifyContent: "space-between", height: 40, paddingHorizontal: 10, backgroundColor: "#eeeeee", alignItems: "center", border: 1, borderColor: "#a0a0a0"}}} onPress={() => navigation.navigate("Device", props.ip)}>
      <View style={{ flexDirection: "column"}}>
        <Text style={{ fontWeight: 700, fontSize: 15 }}>{props.name}</Text>
        {props.name !== props.ip && <Text style={{ fontSize: 10, marginBottom: 2 }}>{props.ip}</Text>}
      </View>
      <Icon name="arrow-forward-outline" size={20} color="black" />
    </TouchableOpacity>
  );
};

//#a9cd9e