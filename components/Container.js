import React from "react";
import { View } from "react-native";
import styles from "../assets/styles/styles";

const Container = (Component) => (props) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Component {...props} />
      </View>
    </View>
  );
};

export default Container;
