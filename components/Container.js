import React from "react";
import { View } from "react-native";
import styles from "../assets/styles/styles";

const Container = (Component) => (props) => {
  return (
    <View style={styles.container}>
      <Component {...props} />
    </View>
  );
};

export default Container;
