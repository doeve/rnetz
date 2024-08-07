import { React, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity, View, Modal, TextInput } from "react-native";
import styles from "../assets/styles/styles";
import Text from "./CText";
import Icon from "react-native-vector-icons/Ionicons"

export default DeviceRow = (props) => {
  const navigation = useNavigation();

  const handlePress = () => {
    props.setModalVisible(true);
    props.setSelectedDevice({ deviceName: props.name, deviceIp: props.ip });
  };

  return (
    <TouchableOpacity style={{ ...styles.lgBtn, justifyContent: "space-between"}} onPress={handlePress}>
      <View style={{ flexDirection: "column"}}>
        <Text style={{ fontWeight: 700, fontSize: 15 }}>{props.name}</Text>
        {props.name !== props.ip && <Text style={{ fontSize: 10, marginBottom: 2 }}>{props.ip}</Text>}
      </View>
      <Icon name="arrow-forward-outline" size={20} color="black" />
    </TouchableOpacity>
  );
};

//#a9cd9e