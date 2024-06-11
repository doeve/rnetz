import React from "react";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity, View } from "react-native";
import styles from "../assets/styles/styles";
import Text from "./CText";
import Icon from "react-native-vector-icons/Ionicons"

export default DeviceRow = (props) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity style={{ ...styles.btn, ...{flexDirection: "row", justifyContent: "space-between", height: 40, paddingHorizontal: 10, backgroundColor: "#eeeeee", alignItems: "center", border: 1, borderColor: "#050505"}}} onPress={() => navigation.navigate("Device", props.ip)}>
      <View style={{ flexDirection: "column"}}>
        <Text style={{ fontWeight: 700 }}>{props.ip}</Text>
        <Text style={{ fontSize: 10}}>{props.name}</Text>
      </View>
      <Icon name="arrow-forward-outline" size={20} color="black" />
    </TouchableOpacity>
  );
};

//#a9cd9e