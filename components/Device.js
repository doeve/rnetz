import React from "react";
import { View, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import styles from "../assets/styles/styles";

const Device = (props) => {
  const navigation = useNavigation();
  console.log(props);

  return (
    <View>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate("Details")}
      />
    </View>
  );
};

export default Device;
